// Checks for "The balance point of a hexagon" against the tables and theorems of
// "Slope stability of tangent bundles of smooth toric Fano varieties" (arXiv:2608.20411).
const assert = require("node:assert/strict");
const M = require("../../assets/essays/balance-point-model.js");
const {num, F, cmp} = M.frac;
const [a, ab, b, na, nab, nb, z] = [0, 1, 2, 3, 4, 5, 6];   // α, α+β, β, −α, −(α+β), −β, 0
const degree = r => (assert.equal(r.anticanonical.q, 1n), Number(r.anticanonical.p));

// The degree-six del Pezzo surface alone: (−K)² = 6, stable and Kähler–Einstein.
let r = M.analyse([]);
assert.equal(degree(r), 6); assert.equal(r.status, "stable"); assert.ok(r.kahlerEinstein);
assert.equal(num(M.analyse([]).I0), 3, "the moment hexagon has area 3");

// Table of Section 7: anticanonical degree, stability, Kähler–Einstein.
const table = [
  [[a, na], 268, "stable", true],
  [[a, b], 278, "stable", false],
  [[a, b, nab], 2580, "stable", true],
  [[z, z, z], 2880, "semistable", true],
  [[a, na, b, nb], 29928, "stable", true],
  [[a, b, nab, z], 30960, "semistable", true],
  [[a, b, nab, a], 30960, "semistable", false],
  [[a, b, nab, a, na], 404544, "stable", false],
  [[a, b, nab, a, b, nab], 6242544, "stable", true]
];
for (const [list, deg, status, ke] of table) {
  r = M.analyse(list);
  assert.equal(degree(r), deg, list + " degree");
  assert.equal(r.status, status, list + " status");
  assert.equal(r.kahlerEinstein, ke, list + " Kähler–Einstein");
  assert.equal(r.picard, r.n + 2);
}

// F.5D.0611 = X(α, β, −(α+β)): μ = 516, maximal subsheaf slope 506,
// facet degrees 278×6, 156×3, 148×3.
r = M.analyse([a, b, nab]);
assert.equal(cmp(r.mu, F(516)), 0); assert.equal(cmp(r.heaviest.slope, F(506)), 0);
const facets = [...r.rootDeg, ...r.liftDeg, ...r.liftDeg].map(num).sort((x, y) => x - y);
assert.deepEqual(facets, [148, 148, 148, 156, 156, 156, 278, 278, 278, 278, 278, 278]);

// Degrees of all invariant divisors add up to (−K)^n.
for (const [list] of table) {
  r = M.analyse(list);
  const total = r.rootDeg.reduce((s, x) => s + num(x), 0) + 2 * r.liftDeg.reduce((s, x) => s + num(x), 0);
  assert.ok(Math.abs(total - degree(r)) < 1e-6 * degree(r));
}

// All multisets of nonzero roots up to size `max`.
function multisets(max, alphabet = [0, 1, 2, 3, 4, 5]) {
  const out = [];
  (function go(start, cur) {
    if (cur.length) out.push(cur.slice());
    if (cur.length === max) return;
    for (let i = start; i < alphabet.length; i++) { cur.push(alphabet[i]); go(i, cur); cur.pop(); }
  })(0, []);
  return out;
}
// Theorems 7.2 and 7.3: zero sum ⇒ stable; Kähler–Einstein ⇔ negation- or rotation-invariant.
let zeroSum = 0;
for (const list of multisets(7)) {
  r = M.analyse(list);
  if (!r.zeroSum) continue;
  zeroSum++;
  assert.equal(r.status, "stable", list + " zero-sum stability");
  assert.equal(r.kahlerEinstein, r.negation || r.rotation, list + " Kähler–Einstein criterion");
}
assert.ok(zeroSum > 20);
// The smallest zero-sum multiset without Kähler–Einstein metric has five twists (n = 7).
const nonKE = multisets(5).filter(l => { const x = M.analyse(l); return x.zeroSum && !x.kahlerEinstein; });
assert.ok(nonKE.every(l => l.length === 5) && nonKE.length > 0);
r = M.analyse([a, a, b, na, nab]);
assert.ok(r.zeroSum && !r.negation && !r.rotation && !r.kahlerEinstein && r.status === "stable" && r.n === 7);

// Proposition 7.6 (reduction): stability ⇔ φ_i < 0 for all i and strict triangle inequality of shares.
for (const list of multisets(6)) {
  assert.equal(M.analyse(list).status === "stable", M.reduction(list).stable, list + " reduction");
}
// Proposition 7.5: an untwisted factor prevents stability; equal nonzero twists are unstable for k ≥ 2.
for (const list of multisets(4, [0, 1, 2, 3, 4, 5, 6]).filter(l => l.includes(z))) {
  assert.notEqual(M.analyse(list).status, "stable", list + " untwisted factor");
}
for (let i = 0; i < 6; i++) {
  assert.notEqual(M.analyse([i]).status, "stable");
  for (let k = 2; k <= 5; k++) assert.equal(M.analyse(Array(k).fill(i)).status, "unstable");
}
// Theorem 7.11: the three families.
for (let s = 0; s <= 3; s++) {
  r = M.analyse([...Array(s).fill([a, na]).flat(), a, b]);
  assert.ok(r.status === "stable" && !r.kahlerEinstein && r.n === 2 * s + 4, "Y_" + s);
}
for (let m = 1; m <= 3; m++) {
  r = M.analyse(Array(m).fill([a, b, nab]).flat());
  assert.ok(r.status === "stable" && r.kahlerEinstein && r.n === 3 * m + 2);
  r = M.analyse(Array(m).fill([a, na]).flat());
  assert.ok(r.status === "stable" && r.kahlerEinstein && r.n === 2 * m + 2);
}
// The dihedral symmetry of the hexagon acts on all twists at once and changes nothing.
const rot60 = i => i === 6 ? 6 : (i + 1) % 6, reflect = i => i === 6 ? 6 : [b, ab, a, nb, nab, na][i];
for (const list of multisets(4)) {
  const base = M.analyse(list);
  for (const g of [rot60, reflect]) {
    const image = M.analyse(list.map(g));
    assert.equal(image.status, base.status);
    assert.equal(image.anticanonical.p, base.anticanonical.p);
    assert.ok(Math.abs(image.offset - base.offset) < 1e-12);
  }
}
// Pointwise weight: box widths 2 + <x, t> lie in [1, 3] on the hexagon.
assert.equal(M.weightAt([a, b], 1, 0), 3 * 2);
assert.equal(M.weightAt([a, na], -1, 1), 1 * 3);
assert.throws(() => M.analyse([7]), RangeError);
console.log("Balance point: paper tables, F.5D.0611 slopes and degrees, zero-sum stability and Kähler–Einstein criterion (" + zeroSum + " multisets), reduction criterion, families, and dihedral invariance passed.");
