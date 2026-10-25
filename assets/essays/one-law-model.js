/* Illustrative models for "The same law in a black hole and a stock market".
   Simulated noise and textbook random-matrix formulas; nothing is fitted to data. */
(function (root) {
  "use strict";

  // Small seeded generator (mulberry32) and polar Box–Muller normals.
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function normals(seed) {
    const next = rng(seed);
    let spare = null;
    return function () {
      if (spare !== null) { const s = spare; spare = null; return s; }
      let u, v, s;
      do { u = 2 * next() - 1; v = 2 * next() - 1; s = u * u + v * v; } while (s >= 1 || s === 0);
      const m = Math.sqrt(-2 * Math.log(s) / s);
      spare = v * m;
      return u * m;
    };
  }

  // Marchenko–Pastur law with ratio q = N/T (mean one). For q > 1 the continuous part
  // carries mass 1/q and the remaining 1 − 1/q sits at zero.
  function mpEdges(q) { const r = Math.sqrt(q); return [(1 - r) * (1 - r), (1 + r) * (1 + r)]; }
  function mpDensity(x, q) {
    const [a, b] = mpEdges(q);
    if (!(x > a && x < b)) return 0;
    return Math.sqrt((b - x) * (x - a)) / (2 * Math.PI * q * x);
  }
  function narayana(n, j) { return binomial(n, j) * binomial(n, j - 1) / n; }
  function binomial(n, k) {
    if (k < 0 || k > n) return 0;
    let r = 1;
    for (let i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return Math.round(r);
  }
  // k-th moment of the full law (point mass included): a Narayana polynomial in q.
  function mpMoment(k, q) {
    let s = 0;
    for (let j = 1; j <= k; j++) s += narayana(k, j) * Math.pow(q, j - 1);
    return s;
  }

  // Eigenvalues of a symmetric n×n matrix (row-major, copied): Householder reduction to
  // tridiagonal form, then the implicit QL algorithm. Returned in ascending order.
  function symmetricEigenvalues(input, n) {
    const a = Float64Array.from(input);
    const d = new Float64Array(n), e = new Float64Array(n);
    for (let i = n - 1; i > 0; i--) {
      const l = i - 1, row = i * n;
      let h = 0;
      if (l > 0) {
        let scale = 0;
        for (let k = 0; k <= l; k++) scale += Math.abs(a[row + k]);
        if (scale === 0) e[i] = a[row + l];
        else {
          for (let k = 0; k <= l; k++) { a[row + k] /= scale; h += a[row + k] * a[row + k]; }
          let f = a[row + l];
          let g = f >= 0 ? -Math.sqrt(h) : Math.sqrt(h);
          e[i] = scale * g; h -= f * g; a[row + l] = f - g; f = 0;
          for (let j = 0; j <= l; j++) {
            g = 0;
            for (let k = 0; k <= j; k++) g += a[j * n + k] * a[row + k];
            for (let k = j + 1; k <= l; k++) g += a[k * n + j] * a[row + k];
            e[j] = g / h; f += e[j] * a[row + j];
          }
          const hh = f / (h + h);
          for (let j = 0; j <= l; j++) {
            f = a[row + j]; g = e[j] - hh * f; e[j] = g;
            for (let k = 0; k <= j; k++) a[j * n + k] -= f * e[k] + g * a[row + k];
          }
        }
      } else e[i] = a[row + l];
      d[i] = h;
    }
    for (let i = 0; i < n; i++) d[i] = a[i * n + i];
    for (let i = 1; i < n; i++) e[i - 1] = e[i];
    e[n - 1] = 0;
    for (let l = 0; l < n; l++) {
      let iter = 0, m;
      do {
        for (m = l; m < n - 1; m++) {
          const dd = Math.abs(d[m]) + Math.abs(d[m + 1]);
          if (Math.abs(e[m]) <= Number.EPSILON * dd) break;
        }
        if (m !== l) {
          if (iter++ === 60) throw new Error("Eigenvalue iteration did not converge");
          let g = (d[l + 1] - d[l]) / (2 * e[l]);
          let r = Math.hypot(g, 1);
          g = d[m] - d[l] + e[l] / (g + (g >= 0 ? r : -r));
          let s = 1, c = 1, p = 0, i;
          let underflow = false;
          for (i = m - 1; i >= l; i--) {
            const f = s * e[i], b = c * e[i];
            r = Math.hypot(f, g);
            e[i + 1] = r;
            if (r === 0) { d[i + 1] -= p; e[m] = 0; underflow = true; break; }
            s = f / r; c = g / r; g = d[i + 1] - p;
            r = (d[i] - g) * s + 2 * c * b;
            p = s * r; d[i + 1] = g + p; g = c * r - b;
          }
          if (underflow) continue;
          d[l] -= p; e[l] = g; e[m] = 0;
        }
      } while (m !== l);
    }
    return Array.from(d).sort((x, y) => x - y);
  }

  // Cholesky solve of S x = 1 for a symmetric positive-definite S; null if S is not.
  function solveOnes(S, n) {
    const L = new Float64Array(n * n);
    for (let j = 0; j < n; j++) {
      let s = S[j * n + j];
      for (let k = 0; k < j; k++) s -= L[j * n + k] * L[j * n + k];
      if (!(s > 1e-12 * Math.abs(S[j * n + j]))) return null;
      const ljj = Math.sqrt(s);
      L[j * n + j] = ljj;
      for (let i = j + 1; i < n; i++) {
        let t = S[i * n + j];
        for (let k = 0; k < j; k++) t -= L[i * n + k] * L[j * n + k];
        L[i * n + j] = t / ljj;
      }
    }
    const y = new Float64Array(n), x = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let t = 1;
      for (let k = 0; k < i; k++) t -= L[i * n + k] * y[k];
      y[i] = t / L[i * n + i];
    }
    for (let i = n - 1; i >= 0; i--) {
      let t = y[i];
      for (let k = i + 1; k < n; k++) t -= L[k * n + i] * x[k];
      x[i] = t / L[i * n + i];
    }
    return x;
  }

  // N assets × T days of independent standard normal returns with known zero mean.
  // Returns the nonzero eigenvalues of the sample correlation matrix (ascending) and,
  // when N < T, the minimum-variance portfolio built from the sample covariance.
  function simulate(N, T, seed) {
    if (!(Number.isInteger(N) && Number.isInteger(T) && N >= 2 && T >= 2)) throw new RangeError("Invalid dimensions");
    const z = normals(seed);
    const X = new Float64Array(N * T);
    for (let i = 0; i < X.length; i++) X[i] = z();
    const variance = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      let s = 0;
      for (let t = 0; t < T; t++) s += X[i * T + t] * X[i * T + t];
      variance[i] = s / T;
    }
    let eigs, minVar = null;
    if (N <= T) {
      const S = new Float64Array(N * N), C = new Float64Array(N * N);
      for (let i = 0; i < N; i++) {
        for (let j = 0; j <= i; j++) {
          let s = 0;
          const ri = i * T, rj = j * T;
          for (let t = 0; t < T; t++) s += X[ri + t] * X[rj + t];
          s /= T;
          S[i * N + j] = S[j * N + i] = s;
          C[i * N + j] = C[j * N + i] = s / Math.sqrt(variance[i] * variance[j]);
        }
      }
      eigs = symmetricEigenvalues(C, N);
      if (N < T) {
        const x = solveOnes(S, N);
        if (x) {
          let sum = 0, sq = 0;
          for (let i = 0; i < N; i++) sum += x[i];
          for (let i = 0; i < N; i++) sq += (x[i] / sum) * (x[i] / sum);
          // True covariance is the identity: delivered variance is w·w, the best possible is 1/N.
          minVar = {promised: 1 / sum, delivered: sq, best: 1 / N};
        }
      }
    } else {
      // Nonzero spectrum of C = Y Yᵀ equals that of the T×T matrix Yᵀ Y.
      const H = new Float64Array(T * T), y = new Float64Array(T);
      for (let i = 0; i < N; i++) {
        const scale = 1 / Math.sqrt(T * variance[i]);
        for (let t = 0; t < T; t++) y[t] = X[i * T + t] * scale;
        for (let s = 0; s < T; s++) {
          const ys = y[s];
          for (let t = 0; t <= s; t++) H[s * T + t] += ys * y[t];
        }
      }
      for (let s = 0; s < T; s++) for (let t = 0; t < s; t++) H[t * T + s] = H[s * T + t];
      eigs = symmetricEigenvalues(H, T);
    }
    eigs = eigs.map(v => Math.max(v, 0));
    return {N, T, q: N / T, eigs, zeros: N - eigs.length, minVar};
  }

  // Entropy (nats) of the density matrix C/N, whose eigenvalues are λ/N.
  function entropy(eigs, N) {
    let s = 0;
    for (const l of eigs) if (l > 0) { const p = l / N; s -= p * Math.log(p); }
    return s;
  }

  const EULER = 0.5772156649015329;
  function harmonic(x) {
    if (x < 30) { let s = 0; for (let k = 1; k <= x; k++) s += 1 / k; return s; }
    const x2 = 1 / (x * x);
    return Math.log(x) + EULER + 1 / (2 * x) - x2 * (1 / 12 - x2 * (1 / 120 - x2 / 252));
  }
  // Page's average entanglement entropy for a Haar-random pure state of dimensions m and M.
  function pageExact(m, M) {
    if (m > M) [m, M] = [M, m];
    if (m === 1) return 0;
    return harmonic(m * M) - harmonic(M) - (m - 1) / (2 * M);
  }
  function pageLeading(m, M) {
    if (m > M) [m, M] = [M, m];
    return Math.log(m) - m / (2 * M);
  }
  // Radiation entropy after k of n qubits have left a black hole in a random pure state.
  function pageCurve(n, k) { return pageExact(Math.pow(2, k), Math.pow(2, n - k)); }

  const models = {rng, normals, mpEdges, mpDensity, mpMoment, narayana, symmetricEigenvalues, solveOnes,
    simulate, entropy, harmonic, pageExact, pageLeading, pageCurve};
  if (typeof module !== "undefined" && module.exports) module.exports = models;
  else root.OneLawModels = models;
})(typeof window !== "undefined" ? window : globalThis);
