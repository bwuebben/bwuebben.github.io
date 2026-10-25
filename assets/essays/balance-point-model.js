/* Root-twisted degree-six del Pezzo fibrations X(t_1,…,t_k), after
   "Slope stability of tangent bundles of smooth toric Fano varieties".
   Every quantity is an exact rational number: hexagon integrals of
   F(x) = Π (2 + <x, t_i>), the Klyachko slope criterion, and the barycentre. */
(function (root) {
  "use strict";
  // Roots of A2 in the basis alpha, beta, in angular order; index 6 is the zero twist.
  const ROOTS = [
    {key:"a",  label:"α",        vec:[1,0],   angle:0},
    {key:"ab", label:"α+β",      vec:[1,1],   angle:60},
    {key:"b",  label:"β",        vec:[0,1],   angle:120},
    {key:"na", label:"−α",       vec:[-1,0],  angle:180},
    {key:"nab",label:"−(α+β)",   vec:[-1,-1], angle:240},
    {key:"nb", label:"−β",       vec:[0,-1],  angle:300},
    {key:"z",  label:"0",        vec:[0,0],   angle:null}
  ];
  const neg = i => (i + 3) % 6, rot = i => (i + 2) % 6;   // t ↦ −t; α ↦ β ↦ −(α+β)
  const abs = x => x < 0n ? -x : x;
  const gcd = (a, b) => { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a; };
  function F(p, q = 1n) {
    p = BigInt(p); q = BigInt(q);
    if (q === 0n) throw new RangeError("zero denominator");
    if (q < 0n) { p = -p; q = -q; }
    const g = gcd(p, q) || 1n;
    return {p: p / g, q: q / g};
  }
  const add = (a, b) => F(a.p * b.q + b.p * a.q, a.q * b.q);
  const sub = (a, b) => F(a.p * b.q - b.p * a.q, a.q * b.q);
  const mul = (a, b) => F(a.p * b.p, a.q * b.q);
  const div = (a, b) => F(a.p * b.q, a.q * b.p);
  const cmp = (a, b) => { const d = a.p * b.q - b.p * a.q; return d > 0n ? 1 : d < 0n ? -1 : 0; };
  const num = a => Number(a.p) / Number(a.q);
  const ZERO = F(0), ONE = F(1);
  const fact = n => { let r = 1n; for (let i = 2n; i <= BigInt(n); i++) r *= i; return r; };

  // Bivariate integer polynomials: Map "i,j" -> BigInt coefficient of x1^i x2^j.
  function polyMul(P, Q) {
    const R = new Map();
    for (const [k1, c1] of P) {
      const [a1, b1] = k1.split(",").map(Number);
      for (const [k2, c2] of Q) {
        const [a2, b2] = k2.split(",").map(Number), k = (a1 + a2) + "," + (b1 + b2);
        R.set(k, (R.get(k) || 0n) + c1 * c2);
      }
    }
    return R;
  }
  const linear = t => new Map([["0,0", 2n], ["1,0", BigInt(t[0])], ["0,1", BigInt(t[1])]]);
  function weight(twists, skip = -1) {
    let P = new Map([["0,0", 1n]]);
    twists.forEach((t, i) => { if (i !== skip) P = polyMul(P, linear(t)); });
    return P;
  }
  // The moment hexagon Q = {|x1| ≤ 1, |x2| ≤ 1, |x1 + x2| ≤ 1}, lattice area 3.
  const monoCache = new Map();
  function hexMonomial(a, b) {
    const key = a + "," + b;
    if (monoCache.has(key)) return monoCache.get(key);
    // Slices x1 = u ≥ 0: x2 ∈ [−1, 1 − u]; x1 = −u: x2 ∈ [−1 + u, 1].
    const beta = F(fact(a) * fact(b + 1), fact(a + b + 2));        // ∫0^1 u^a (1−u)^(b+1) du
    const s = (b + 1) % 2 ? -1n : 1n;                              // (−1)^(b+1)
    const sa = a % 2 ? -1n : 1n;
    const inv = F(1, a + 1);
    const right = sub(beta, mul(F(s), inv));
    const left = mul(F(sa), sub(inv, mul(F(s), beta)));
    const value = mul(add(right, left), F(1, b + 1));
    monoCache.set(key, value);
    return value;
  }
  function hexIntegral(P, dx = 0, dy = 0) {
    let total = ZERO;
    for (const [k, c] of P) {
      if (c === 0n) continue;
      const [a, b] = k.split(",").map(Number);
      total = add(total, mul(F(c), hexMonomial(a + dx, b + dy)));
    }
    return total;
  }
  // Hexagon vertices and the edge E_ρ = Q ∩ {<x, ρ> = −1}, each of lattice length one.
  const EDGES = [
    [[-1,1],[-1,0]],   // α
    [[-1,0],[0,-1]],   // α+β
    [[0,-1],[1,-1]],   // β
    [[1,0],[1,-1]],    // −α
    [[1,0],[0,1]],     // −(α+β)
    [[0,1],[-1,1]]     // −β
  ];
  function edgeIntegral(twists, e) {
    const [v, w] = EDGES[e], d = [w[0] - v[0], w[1] - v[1]];
    let c = [1n];                                             // univariate in s ∈ [0, 1]
    for (const t of twists) {
      const c0 = BigInt(2 + t[0] * v[0] + t[1] * v[1]), c1 = BigInt(t[0] * d[0] + t[1] * d[1]);
      const next = new Array(c.length + 1).fill(0n);
      c.forEach((x, j) => { next[j] += x * c0; next[j + 1] += x * c1; });
      c = next;
    }
    return c.reduce((acc, x, j) => add(acc, F(x, j + 1)), ZERO);
  }
  // Maximize (base + Σ chosen values) / (dim + number chosen); the optimum is a prefix.
  function bestRatio(baseDeg, baseDim, values, maxCount, minCount) {
    const sorted = values.slice().sort((x, y) => cmp(y.value, x.value));
    let best = null;
    let deg = baseDeg, dim = baseDim;
    for (let m = 0; m <= Math.min(maxCount, sorted.length); m++) {
      if (m > 0) { deg = add(deg, sorted[m - 1].value); dim += 1; }
      if (m < minCount || dim === 0) continue;
      const slope = F(deg.p, deg.q * BigInt(dim));
      if (!best || cmp(slope, best.slope) > 0) best = {slope, dim, chosen: sorted.slice(0, m)};
    }
    return best;
  }
  const countsFrom = list => { const c = new Array(7).fill(0); list.forEach(i => c[i]++); return c; };
  const listFrom = counts => counts.flatMap((m, i) => Array(m).fill(i));

  // `list` holds root indices 0–6, one entry per base factor.
  function analyse(list) {
    if (!Array.isArray(list) || !list.every(i => Number.isInteger(i) && i >= 0 && i <= 6)) throw new RangeError("Invalid twist list");
    list = list.slice();
    const c = countsFrom(list);
    const twists = list.map(i => ROOTS[i].vec), k = twists.length, n = k + 2;
    const W = weight(twists), I0 = hexIntegral(W);
    const scale = F(fact(n - 1));
    const mu = mul(scale, I0);                                   // μ(T_X) = (n−1)! ∫_Q F
    const rootDeg = EDGES.map((_, e) => mul(scale, edgeIntegral(twists, e)));
    const liftDeg = twists.map((t, i) => mul(scale, hexIntegral(weight(twists, i))));
    const anticanonical = F(fact(n) * I0.p, I0.q);               // (−K)^n = n! ∫_Q F
    // Ray-spanned subspaces: V ∩ N_f is 0, a root line, or N_f; pairs ±f_i need t_i in it;
    // a single lift f_i + t_i or −f_i (degree d_i) adds a direction outside it.
    const candidates = [];
    const items = (inW, pairsOnly) => list.map((r, i) => inW(r)
      ? {value: add(liftDeg[i], liftDeg[i]), kind: "pair", i}
      : (pairsOnly ? null : {value: liftDeg[i], kind: "lift", i})).filter(Boolean);
    if (k > 0) {
      const z = bestRatio(ZERO, 0, items(r => r === 6, false), k, 1);
      if (z) candidates.push({...z, fibre: "none"});
    }
    for (let line = 0; line < 3; line++) {
      const base = add(rootDeg[line], rootDeg[line + 3]);
      const b = bestRatio(base, 1, items(r => r === 6 || r === line || r === line + 3, false), k, 0);
      if (b) candidates.push({...b, fibre: "line", line});
    }
    const fibreDeg = rootDeg.reduce(add, ZERO);
    const f = bestRatio(fibreDeg, 2, items(() => true, true), k - 1, 0);
    if (f) candidates.push({...f, fibre: "plane"});
    const heaviest = candidates.reduce((a, b) => (!a || cmp(b.slope, a.slope) > 0) ? b : a, null);
    const order = cmp(heaviest.slope, mu);
    const status = order < 0 ? "stable" : order === 0 ? "semistable" : "unstable";
    // Barycentre of the moment polytope; its fibre part is ∫ x F / ∫ F (Lemma 7.4(3)).
    const bx = [div(hexIntegral(W, 1, 0), I0), div(hexIntegral(W, 0, 1), I0)];
    const balanced = bx[0].p === 0n && bx[1].p === 0n;
    const euclid = [num(bx[0]), (num(bx[0]) + 2 * num(bx[1])) / Math.sqrt(3)];
    const sum = list.reduce((s, i) => [s[0] + ROOTS[i].vec[0], s[1] + ROOTS[i].vec[1]], [0, 0]);
    const hasZero = c[6] > 0;
    const negation = !hasZero && [0, 1, 2].every(i => c[i] === c[neg(i)]);
    const rotation = !hasZero && [0, 1].every(s => c[s] === c[rot(s)] && c[rot(s)] === c[rot(rot(s))]);
    return {list, counts: c, k, n, picard: n + 2, twists, mu, I0, rootDeg, liftDeg, anticanonical,
            heaviest, status, barycentre: bx, euclid, kahlerEinstein: balanced,
            sum, zeroSum: sum[0] === 0 && sum[1] === 0, hasZero, negation, rotation,
            margin: num(sub(mu, heaviest.slope)) / num(mu), offset: Math.hypot(euclid[0], euclid[1])};
  }
  // Pointwise weight for drawing, in lattice coordinates of the moment hexagon.
  function weightAt(list, x1, x2) {
    return list.reduce((w, i) => w * (2 + ROOTS[i].vec[0] * x1 + ROOTS[i].vec[1] * x2), 1);
  }
  // Singleton integrals φ_i and line shares S_ρ of Proposition 7.6, for cross-checks.
  function reduction(list) {
    const twists = list.map(i => ROOTS[i].vec), I0 = hexIntegral(weight(twists));
    const phi = twists.map((t, i) => hexIntegral(polyMul(weight(twists, i), new Map([["1,0", BigInt(t[0])], ["0,1", BigInt(t[1])]]))));
    const shares = [0, 1, 2].map(line => list.reduce((s, r, i) => (r === line || r === line + 3) && phi[i].p < 0n ? add(s, F(-phi[i].p, phi[i].q)) : s,
      add(edgeIntegral(twists, line), edgeIntegral(twists, line + 3))));
    return {I0, phi, shares, stable: phi.every(p => p.p < 0n) && shares.every(s => cmp(s, I0) < 0)};
  }
  const models = {ROOTS, analyse, weightAt, reduction, listFrom, countsFrom, frac: {F, add, sub, mul, div, cmp, num}, neg, rot};
  if (typeof module !== "undefined" && module.exports) module.exports = models;
  else root.BalanceModel = models;
})(typeof window !== "undefined" ? window : globalThis);
