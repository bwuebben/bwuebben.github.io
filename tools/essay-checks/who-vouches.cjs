// Checks for the one-factor model in "Who vouches for a machine?".
const assert = require("node:assert/strict");
const M = require("../../assets/essays/who-vouches-model.js");
const close = (a, b, tol, what) => assert.ok(Math.abs(a - b) <= tol, `${what}: ${a} vs ${b} (tol ${tol})`);

// Normal CDF against reference values and Simpson integration of the density.
for (const [x, v] of [[0, 0.5], [1.96, 0.9750021048517795], [-3, 0.0013498980316301], [2.5758293035489, 0.995], [-6, 9.865876450376946e-10]])
  close(M.cdf(x), v, 1e-12 + 1e-9 * v, "cdf(" + x + ")");
for (const x of [-4, -1.3, 0.2, 2.7]) {
  const n = 20000, lo = -12, h = (x - lo) / n;
  let s = 0;
  for (let i = 0; i <= n; i++) s += (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * Math.exp(-((lo + i * h) ** 2) / 2);
  close(M.cdf(x), s * h / 3 / Math.sqrt(2 * Math.PI), 1e-11, "cdf vs integral at " + x);
}
// Inverse CDF: reference values and round trips.
close(M.inv(0.995), 2.5758293035489004, 1e-12, "inv(0.995)");
close(M.inv(0.975), 1.959963984540054, 1e-12, "inv(0.975)");
for (const x of [-7, -3.2, -1, -0.01, 0.4, 2.2, 5.5]) close(M.inv(M.cdf(x)), x, 1e-9, "round trip " + x);
assert.throws(() => M.inv(0), RangeError);

// Vasicek quantile: endpoints, monotonicity, and inversion of its own CDF.
close(M.poolQuantile(0.02, 0, 0.995), 0.02, 1e-12, "independent pool loses exactly p");
let previous = 0;
for (let r = 0; r <= 0.95; r += 0.05) {
  const q = M.poolQuantile(0.02, r, 0.995);
  assert.ok(q >= previous - 1e-15, "tail loss rises with correlation");
  previous = q;
  if (r > 0) close(M.poolCdf(q, 0.02, r), 0.995, 1e-9, "poolCdf inverts poolQuantile at ρ=" + r.toFixed(2));
}
assert.ok(M.poolQuantile(0.02, 0.99, 0.995) > 0.99, "ρ → 1 approaches insuring a single agent (p < 0.5%)");
close(M.poolQuantile(0.02, 0.3, 0.995), 0.2212, 5e-4, "worked example in the essay");

// Joint failure: closed forms at the ends and Sheppard's formula at p = 1/2.
close(M.jointFailure(0.05, 0), 0.0025, 1e-15, "independent joint failure");
for (const r of [0.1, 0.5, 0.9]) close(M.jointFailure(0.5, r), 0.25 + Math.asin(r) / (2 * Math.PI), 1e-9, "Sheppard at ρ=" + r);
assert.ok(Math.abs(M.jointFailure(0.03, 0.999) - 0.03) < 0.003, "ρ → 1: both fail together");

// Monte Carlo with the latent-variable definition itself, not the closed form.
const rng = M.mulberry32(20261025);
function simulate(n, years, p, rho) {
  const losses = new Float64Array(years);
  let failures = 0, pairs = 0, aFails = 0;
  for (let y = 0; y < years; y++) {
    const {failed, count} = M.simulateYear(n, p, rho, rng);
    losses[y] = count / n;
    failures += count;
    if (failed[0]) { aFails++; if (failed[1]) pairs++; }
  }
  losses.sort();
  return {mean: failures / (n * years), quantile: losses[Math.floor(0.995 * years)], conditional: pairs / aFails};
}
{
  const p = 0.02, rho = 0.3, sim = simulate(1000, 30000, p, rho), q = M.quote(p, rho);
  close(sim.mean, p, 0.002, "mean failure rate is p at any correlation");
  close(sim.quantile, q.tail, 0.025, "1-in-200 pool loss, N = 1000 versus the large-pool formula");
  close(sim.conditional, q.conditional, 0.03, "P(B fails | A fails)");
}
{
  const p = 0.04, sim = simulate(100, 20000, p, 0);
  close(sim.mean, p, 0.001, "independent pool mean");
  // Exact binomial 99.5% quantile for 100 independent agents.
  let cum = 0, k = 0, term = Math.pow(1 - p, 100);
  for (; k <= 100; k++) { cum += term; if (cum >= 0.995) break; term *= (100 - k) / (k + 1) * p / (1 - p); }
  assert.ok(Math.abs(sim.quantile * 100 - k) <= 1, `independent: simulated quantile ${sim.quantile * 100} vs binomial ${k}`);
  const corr = simulate(100, 20000, p, 0.8);
  close(corr.mean, p, 0.004, "correlated pool keeps the same mean");
  assert.ok(corr.quantile > 0.5, "correlated: the 1-in-200 year takes most of the pool");
}
// Derived quantities stay inside their ranges.
for (const p of [0.005, 0.02, 0.1]) for (const r of [0, 0.2, 0.6, 0.95]) {
  const q = M.quote(p, r);
  assert.ok(q.capitalShare >= -1e-12 && q.capitalShare <= 1, "capital share in [0, 1]");
  assert.ok(q.conditional >= p - 1e-9 && q.conditional <= 1 + 1e-9, "conditional failure in [p, 1]");
  assert.ok(q.failureCorrelation >= -1e-9 && q.failureCorrelation <= r + 1e-9, "failure correlation in [0, ρ]");
}
console.log("Who vouches: normal CDF and inverse, Vasicek quantile, joint failure, and Monte Carlo checks passed.");
