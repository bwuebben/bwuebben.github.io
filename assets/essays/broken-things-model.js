/* Exact models for "Why broken things make invariants". No fitted data. */
(function (root) {
  "use strict";
  const PI = Math.PI;

  /* Morse function on the flat torus [−π, π]², opposite edges identified. */
  function height(x, y) { return Math.cos(x) + Math.cos(y); }
  /* Negative gradient of the height: the direction water runs downhill. */
  function downhill(x, y) { return [Math.sin(x), Math.sin(y)]; }

  /* Critical points. S1 = (π, 0) and S2 = (0, π) are the two saddles. */
  const critical = {
    max: {x: 0, y: 0, index: 2},
    s1: {x: PI, y: 0, index: 1},
    s2: {x: 0, y: PI, index: 1},
    min: {x: PI, y: PI, index: 0}
  };

  /* The four families of flow lines from the maximum to the minimum, one per open quadrant. */
  const families = {
    ne: {sx: 1, sy: 1, name: "north-east"},
    nw: {sx: -1, sy: 1, name: "north-west"},
    sw: {sx: -1, sy: -1, name: "south-west"},
    se: {sx: 1, sy: -1, name: "south-east"}
  };

  /* Point at time t on the flow line tan(|y|/2) = C·tan(|x|/2) of a quadrant.
     x(t) = 2 arctan(e^t), y(t) = 2 arctan(C e^t) solve ẋ = sin x, ẏ = sin y. */
  function flowPoint(family, C, t) {
    const f = families[family];
    if (!f || !(C > 0) || !Number.isFinite(C)) throw new RangeError("Invalid flow line");
    const u = Math.exp(t);
    return [f.sx * 2 * Math.atan(u), f.sy * 2 * Math.atan(C * u)];
  }

  /* A polyline for the flow line: points spaced evenly in x and evenly in y, merged, so both
     legs of a nearly broken line are sampled. Both coordinates increase along the line. */
  function flowLine(family, C, samples = 240) {
    const f = families[family];
    if (!f || !(C > 0) || !Number.isFinite(C)) throw new RangeError("Invalid flow line");
    const n = Math.max(4, Math.round(samples / 2)), pts = [[0, 0], [PI, PI]];
    for (let i = 1; i < n; i++) {
      const a = PI * i / n;
      pts.push([a, 2 * Math.atan(C * Math.tan(a / 2))], [2 * Math.atan(Math.tan(a / 2) / C), a]);
    }
    pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    return pts.map(([x, y]) => [f.sx * x, f.sy * y]);
  }

  /* Oriented unstable manifolds: dx∧dy at the maximum, ∂y at S1, ∂x at S2, + at the minimum.
     A flow line from p to q gets the sign comparing (velocity, orientation of W^u(q))
     with the orientation of W^u(p). */
  const det = (a, b) => a[0] * b[1] - a[1] * b[0];
  const unstable = {s1: [0, 1], s2: [1, 0]};
  function flowSign(from, to, velocity) {
    if (from === "max") return Math.sign(det(velocity, unstable[to]));
    if (to === "min") {
      const o = unstable[from];
      return Math.sign(velocity[0] * o[0] + velocity[1] * o[1]);
    }
    throw new RangeError("Index difference must be one");
  }

  /* The eight index-one flow lines, with their velocity directions. */
  const edges = {
    "max-s1+": {from: "max", to: "s1", v: [1, 0]},
    "max-s1-": {from: "max", to: "s1", v: [-1, 0]},
    "max-s2+": {from: "max", to: "s2", v: [0, 1]},
    "max-s2-": {from: "max", to: "s2", v: [0, -1]},
    "s1-min+": {from: "s1", to: "min", v: [0, 1]},
    "s1-min-": {from: "s1", to: "min", v: [0, -1]},
    "s2-min+": {from: "s2", to: "min", v: [1, 0]},
    "s2-min-": {from: "s2", to: "min", v: [-1, 0]}
  };
  for (const e of Object.values(edges)) e.sign = flowSign(e.from, e.to, e.v);

  /* The two broken ends of a family. C → 0 hugs y = 0 first (through S1); C → ∞ hugs x = 0 first (through S2). */
  function brokenEnds(family) {
    const f = families[family];
    if (!f) throw new RangeError("Unknown family");
    const xs = f.sx > 0 ? "+" : "-", ys = f.sy > 0 ? "+" : "-";
    const viaS1 = ["max-s1" + xs, "s1-min" + ys], viaS2 = ["max-s2" + ys, "s2-min" + xs];
    const sign = path => path.reduce((s, k) => s * edges[k].sign, 1);
    return [
      {saddle: "s1", limit: "C → 0", edges: viaS1, sign: sign(viaS1),
       path: [[0, 0], [f.sx * PI, 0], [f.sx * PI, f.sy * PI]]},
      {saddle: "s2", limit: "C → ∞", edges: viaS2, sign: sign(viaS2),
       path: [[0, 0], [0, f.sy * PI], [f.sx * PI, f.sy * PI]]}
    ];
  }

  /* Morse differential: signed counts of flow lines, and their reductions mod 2. */
  function differential() {
    const count = (from, to, signed) => Object.values(edges)
      .filter(e => e.from === from && e.to === to)
      .reduce((s, e) => s + (signed ? e.sign : 1), 0);
    const pairs = [["max", "s1"], ["max", "s2"], ["s1", "min"], ["s2", "min"]];
    const out = {};
    for (const [a, b] of pairs) out[a + "-" + b] = {signed: count(a, b, true), unsigned: count(a, b, false)};
    out.squareSigned = out["max-s1"].signed * out["s1-min"].signed + out["max-s2"].signed * out["s2-min"].signed;
    out.squareMod2 = (out["max-s1"].unsigned * out["s1-min"].unsigned + out["max-s2"].unsigned * out["s2-min"].unsigned) % 2;
    return out;
  }

  /* Slider position 0..100: 0 and 100 are the added broken ends; 1..99 are genuine flow lines. */
  function sliderToC(v) {
    if (!(v > 0 && v < 100)) throw new RangeError("Slider endpoints are broken trajectories");
    return Math.exp((v - 50) / 50 * 7);
  }

  /* Charge-one instanton on ℝ⁴ of scale λ: energy per unit radius, normalized to total one.
     ρ(r) = 12 λ⁴ r³ / (r² + λ²)⁴. */
  function instantonDensity(r, lambda) {
    if (!(lambda > 0) || r < 0) throw new RangeError("Invalid instanton inputs");
    const s = r * r + lambda * lambda;
    return 12 * Math.pow(lambda, 4) * r * r * r / (s * s * s * s);
  }
  /* Share of the energy within radius R: 1 − 3/(1+t)² + 2/(1+t)³ with t = R²/λ². */
  function instantonShare(R, lambda) {
    if (!(lambda > 0) || R < 0) throw new RangeError("Invalid instanton inputs");
    const w = 1 / (1 + R * R / (lambda * lambda));
    return 1 - 3 * w * w + 2 * w * w * w;
  }
  const halfEnergyRadius = lambda => lambda;
  const peakRadius = lambda => lambda * Math.sqrt(3 / 5);

  const models = {height, downhill, critical, families, flowPoint, flowLine, edges, brokenEnds,
    differential, sliderToC, instantonDensity, instantonShare, halfEnergyRadius, peakRadius};
  if (typeof module !== "undefined" && module.exports) module.exports = models;
  else root.BrokenThingsModel = models;
})(typeof window !== "undefined" ? window : globalThis);
