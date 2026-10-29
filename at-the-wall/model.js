/* Finite models from Stability degeneration III and V. No PDE solver. */
(function (root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.WallModel = model;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const edges = [[0, 2], [0, 3], [1, 2], [1, 3]];
  // An orthonormal basis of the trace-free subspace. Projecting removes the
  // known constant null mode before diagonalization.
  const basis = [[1 / Math.sqrt(2), -1 / Math.sqrt(2), 0, 0],
    [1 / Math.sqrt(6), 1 / Math.sqrt(6), -2 / Math.sqrt(6), 0],
    [1 / Math.sqrt(12), 1 / Math.sqrt(12), 1 / Math.sqrt(12), -3 / Math.sqrt(12)]];
  function laplacian(weights) {
    const L = Array.from({length: 4}, () => Array(4).fill(0));
    edges.forEach(([a, b], i) => {
      const w = weights[i];
      L[a][a] += w; L[b][b] += w; L[a][b] -= w; L[b][a] -= w;
    });
    return L;
  }
  function spectrum(weights) {
    if (weights.length !== 4 || weights.some(x => !Number.isFinite(x) || x < 0)) throw new RangeError('Four nonnegative edge weights required');
    const scale = Math.max(...weights);
    if (scale === 0) return {values: [0, 0, 0], vectors: basis.map(v => v.slice()), L: laplacian(weights)};
    const L = laplacian(weights.map(w => w / scale));
    const A = basis.map(u => basis.map(v => u.reduce((sum, x, i) => sum + x * L[i].reduce((s, y, j) => s + y * v[j], 0), 0)));
    const V = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    for (let step = 0; step < 50; step++) {
      let p = 0, q = 1;
      for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) if (Math.abs(A[i][j]) > Math.abs(A[p][q])) {p = i; q = j;}
      if (Math.abs(A[p][q]) < 2e-16) break;
      const angle = .5 * Math.atan2(2 * A[p][q], A[q][q] - A[p][p]);
      const c = Math.cos(angle), s = Math.sin(angle), ap = A[p][p], aq = A[q][q], off = A[p][q];
      for (let k = 0; k < 3; k++) {
        if (k !== p && k !== q) {
          const a = A[k][p], b = A[k][q];
          A[k][p] = A[p][k] = c * a - s * b;
          A[k][q] = A[q][k] = s * a + c * b;
        }
        const vp = V[k][p], vq = V[k][q];
        V[k][p] = c * vp - s * vq; V[k][q] = s * vp + c * vq;
      }
      A[p][p] = c*c*ap - 2*s*c*off + s*s*aq;
      A[q][q] = s*s*ap + 2*s*c*off + c*c*aq;
      A[p][q] = A[q][p] = 0;
    }
    // Count graph components exactly, so a boundary is a boundary, not a tiny
    // positive eigenvalue produced by roundoff.
    const parent = [0, 1, 2, 3];
    const find = a => parent[a] === a ? a : (parent[a] = find(parent[a]));
    edges.forEach(([a,b],i) => {if (weights[i] > 0) parent[find(a)] = find(b);});
    const nullity = new Set(parent.map((_, i) => find(i))).size - 1;
    const order = [0, 1, 2].sort((a, b) => A[a][a] - A[b][b]);
    const values = order.map((i, j) => j < nullity ? 0 : Math.max(0, A[i][i] * scale));
    const vectors = order.map(i => {
      const v = Array.from({length: 4}, (_, j) => basis.reduce((s, b, k) => s + b[j] * V[k][i], 0));
      const pivot = v.reduce((best, x, j) => Math.abs(x) > Math.abs(v[best]) ? j : best, 0);
      return v.map(x => x * (v[pivot] < 0 ? -1 : 1));
    });
    return {values, vectors, L: laplacian(weights)};
  }
  function chamber(p, q, sigma) {
    if (![p, q, sigma].every(Number.isFinite) || p < 0 || p > 1 || q < 0 || q > 1 || sigma <= 0) throw new RangeError('Invalid chamber parameters');
    const x = [sigma * p, sigma * (1-p)], y = [sigma*q, sigma*(1-q)];
    const weights = [sigma*p*q, sigma*p*(1-q), sigma*(1-p)*q, sigma*(1-p)*(1-q)];
    return {p, q, sigma, x, y, weights, stable: p > 0 && p < 1 && q > 0 && q < 1, ...spectrum(weights)};
  }
  function threeScales(t) {
    if (!(t > 0 && t < 1)) throw new RangeError('0 < t < 1 required');
    const epsilon = t*t, sigma = epsilon + epsilon**3;
    return {...chamber(epsilon**3 / sigma, epsilon**2 / sigma, sigma), t,
      leading: [4/3*t**6, 3/2*t**4, 2*t**2]};
  }
  // Same ranks and demands rho(2,1,-1,-2) in both examples. Deleting k21
  // gives the connected path with weights rho(1,1,0,1).
  function cycle(theta, rho = .02) {
    if (!(theta > 0 && Number.isFinite(theta) && rho > 0 && Number.isFinite(rho))) throw new RangeError('Positive cycle data required');
    let lo = 0, hi = 1;
    for (let i = 0; i < 60; i++) {
      const a = (lo+hi)/2;
      if (2*Math.log(a) - Math.log(2-a) - Math.log(1-a) < Math.log(theta)) lo = a; else hi = a;
    }
    const a = (lo+hi)/2, weights = [a, 2-a, 1-a, a].map(x => rho*x);
    return {weights, a, theta, ...spectrum(weights)};
  }
  function tree(rho = .02) {
    const weights = [rho, rho, 0, rho];
    return {weights, ...spectrum(weights)};
  }
  function profile(delta, tau) {
    if (!Number.isFinite(delta) || !(tau > 0 && Number.isFinite(tau))) throw new RangeError('Finite delta and positive time required');
    if (delta === 0) return 1/(2*tau);
    const z = 2*delta*tau;
    if (z < -50) return -delta * Math.exp(z) / -Math.expm1(z);
    return delta / -Math.expm1(-z);
  }
  return {edges, laplacian, spectrum, chamber, threeScales, cycle, tree, profile};
});
