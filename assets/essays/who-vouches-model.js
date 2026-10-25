/* One-factor Gaussian model for "Who vouches for a machine?". Illustrative, not fitted to data. */
(function (root) {
  "use strict";
  const SQRT2PI = Math.sqrt(2 * Math.PI);

  // Standard normal CDF: Hart (1968) in the double-precision form given by West (2005).
  function cdf(x) {
    const z = Math.abs(x);
    let c = 0;
    if (z <= 37) {
      const e = Math.exp(-z * z / 2);
      if (z < 7.07106781186547) {
        let n = 3.52624965998911e-02 * z + 0.700383064443688;
        n = n * z + 6.37396220353165; n = n * z + 33.912866078383; n = n * z + 112.079291497871;
        n = n * z + 221.213596169931; n = n * z + 220.206867912376;
        let d = 8.83883476483184e-02 * z + 1.75566716318264;
        d = d * z + 16.064177579207; d = d * z + 86.7807322029461; d = d * z + 296.564248779674;
        d = d * z + 637.333633378831; d = d * z + 793.826512519948; d = d * z + 440.413735824752;
        c = e * n / d;
      } else {
        let b = z + 0.65;
        b = z + 4 / b; b = z + 3 / b; b = z + 2 / b; b = z + 1 / b;
        c = e / b / 2.506628274631;
      }
    }
    return x > 0 ? 1 - c : c;
  }

  // Inverse normal CDF: Acklam's rational approximation, polished by one Halley step.
  const A = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const B = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const C = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const D = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  function inv(p) {
    if (!(p > 0 && p < 1)) throw new RangeError("Probability must lie strictly between 0 and 1");
    let x;
    if (p < 0.02425) {
      const q = Math.sqrt(-2 * Math.log(p));
      x = (((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5]) / ((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q + 1);
    } else if (p > 1 - 0.02425) {
      const q = Math.sqrt(-2 * Math.log(1 - p));
      x = -(((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5]) / ((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q + 1);
    } else {
      const q = p - 0.5, r = q * q;
      x = (((((A[0] * r + A[1]) * r + A[2]) * r + A[3]) * r + A[4]) * r + A[5]) * q / (((((B[0] * r + B[1]) * r + B[2]) * r + B[3]) * r + B[4]) * r + 1);
    }
    const u = (cdf(x) - p) * SQRT2PI * Math.exp(x * x / 2);
    return x - u / (1 + x * u / 2);
  }

  function check(p, rho) {
    if (!(p > 0 && p < 1) || !(rho >= 0 && rho < 1)) throw new RangeError("Need 0 < p < 1 and 0 ≤ ρ < 1");
  }

  // Failure rate of a very large pool, given the shared factor z.
  function conditionalRate(p, rho, z) {
    check(p, rho);
    return cdf((inv(p) - Math.sqrt(rho) * z) / Math.sqrt(1 - rho));
  }

  // Vasicek: the loss fraction of a very large pool that is exceeded with probability 1 − alpha.
  function poolQuantile(p, rho, alpha) {
    check(p, rho);
    return cdf((inv(p) + Math.sqrt(rho) * inv(alpha)) / Math.sqrt(1 - rho));
  }

  // P(pool loss fraction ≤ x) in the same large-pool limit (ρ > 0).
  function poolCdf(x, p, rho) {
    check(p, rho);
    if (rho === 0) return x >= p ? 1 : 0;
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return cdf((Math.sqrt(1 - rho) * inv(x) - inv(p)) / Math.sqrt(rho));
  }

  // P(two given agents both fail): Simpson's rule over the shared factor.
  function jointFailure(p, rho) {
    check(p, rho);
    if (rho === 0) return p * p;
    const n = 1200, lo = -9, h = 18 / n;
    let sum = 0;
    for (let i = 0; i <= n; i++) {
      const z = lo + i * h, w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2;
      const q = conditionalRate(p, rho, z);
      sum += w * Math.exp(-z * z / 2) / SQRT2PI * q * q;
    }
    return sum * h / 3;
  }

  function quote(p, rho, alpha = 0.995) {
    const joint = jointFailure(p, rho), tail = poolQuantile(p, rho, alpha);
    return {
      expected: p,
      tail,
      capitalShare: (tail - p) / (1 - p),           // capital beyond expected loss, relative to insuring one agent alone
      conditional: joint / p,                       // P(B fails | A fails): what a conditional-failure contract would price
      failureCorrelation: (joint - p * p) / (p * (1 - p)),
      underReserve: tail / p
    };
  }

  // Small seeded generator so a simulated history can be reproduced.
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function normal(rng) {
    let u = 0;
    while (u === 0) u = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
  }

  // One period for n agents: agent i fails when √ρ·Z + √(1−ρ)·εᵢ falls below Φ⁻¹(p).
  function simulateYear(n, p, rho, rng) {
    check(p, rho);
    const threshold = inv(p), z = normal(rng), a = Math.sqrt(rho), b = Math.sqrt(1 - rho);
    const failed = [];
    for (let i = 0; i < n; i++) failed.push(a * z + b * normal(rng) < threshold);
    return {z, failed, count: failed.filter(Boolean).length};
  }

  const model = {cdf, inv, conditionalRate, poolQuantile, poolCdf, jointFailure, quote, mulberry32, normal, simulateYear};
  if (typeof module !== "undefined" && module.exports) module.exports = model;
  else root.WhoVouchesModel = model;
})(typeof window !== "undefined" ? window : globalThis);
