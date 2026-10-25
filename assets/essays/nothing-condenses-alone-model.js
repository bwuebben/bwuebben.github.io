/* Charge bookkeeping for "Nothing condenses alone". An illustrative toy, not a Calabi–Yau computation. */
(function (root) {
  "use strict";

  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; }

  // Exact rational arithmetic on small integers: a fraction is [numerator, denominator], denominator > 0.
  function frac(n, d = 1) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; }
  const sub = (x, y) => frac(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
  const mul = (x, y) => frac(x[0] * y[0], x[1] * y[1]);
  const div = (x, y) => frac(x[0] * y[1], x[1] * y[0]);

  function primitive(v) {
    const g = v.reduce((acc, x) => gcd(acc, x), 0);
    if (!g) return v.slice();
    let w = v.map(x => x / g);
    const lead = w.find(x => x !== 0);
    if (lead < 0) w = w.map(x => -x);
    return w.map(x => x || 0);
  }

  // Rational reduced row echelon form; returns the reduced rows and the pivot columns.
  function rref(rows) {
    const M = rows.map(r => r.map(x => frac(x)));
    const pivots = [];
    let lead = 0;
    const cols = M.length ? M[0].length : 0;
    for (let c = 0; c < cols && lead < M.length; c++) {
      let p = lead;
      while (p < M.length && M[p][c][0] === 0) p++;
      if (p === M.length) continue;
      [M[lead], M[p]] = [M[p], M[lead]];
      const pivot = M[lead][c];
      M[lead] = M[lead].map(x => div(x, pivot));
      for (let r = 0; r < M.length; r++) {
        if (r !== lead && M[r][c][0] !== 0) {
          const f = M[r][c];
          M[r] = M[r].map((x, j) => sub(x, mul(f, M[lead][j])));
        }
      }
      pivots.push(c);
      lead++;
    }
    return {M, pivots};
  }

  function rank(rows) { return rows.length && rows[0].length ? rref(rows).pivots.length : 0; }

  // Primitive integer basis of {v : rows · v = 0}, one vector per free column.
  function kernelBasis(rows, k) {
    if (!rows.length) return Array.from({length: k}, (_, i) => Array.from({length: k}, (_, j) => +(i === j)));
    const {M, pivots} = rref(rows);
    const free = [...Array(k).keys()].filter(c => !pivots.includes(c));
    return free.map(f => {
      const v = Array.from({length: k}, () => frac(0));
      v[f] = frac(1);
      pivots.forEach((c, r) => { v[c] = frac(-M[r][f][0], M[r][f][1]); });
      const l = v.reduce((acc, x) => acc * x[1] / gcd(acc, x[1]), 1);
      return primitive(v.map(x => x[0] * (l / x[1])));
    });
  }

  function det(A) {
    const n = A.length;
    if (n === 0) return 1;
    if (n === 1) return A[0][0];
    let s = 0;
    for (let j = 0; j < n; j++) {
      const minor = A.slice(1).map(row => row.filter((_, c) => c !== j));
      s += (j % 2 ? -1 : 1) * A[0][j] * det(minor);
    }
    return s;
  }

  function combinations(n, r) {
    const out = [];
    const walk = (start, acc) => {
      if (acc.length === r) { out.push(acc.slice()); return; }
      for (let i = start; i < n; i++) { acc.push(i); walk(i + 1, acc); acc.pop(); }
    };
    walk(0, []);
    return out;
  }

  // Product of the Smith invariants of a matrix: the gcd of its r×r minors, r = rank.
  // The charges span a saturated lattice exactly when this is 1.
  function determinantalDivisor(rows) {
    const r = rank(rows);
    if (!r) return 1;
    let g = 0;
    for (const rs of combinations(rows.length, r))
      for (const cs of combinations(rows[0].length, r))
        g = gcd(g, det(rs.map(i => cs.map(j => rows[i][j]))));
    return g;
  }

  // Charge matrix Q: one row per bulk vector, one column per light state.
  function chargeMatrix(charges, cols) {
    const d = charges[0].length;
    return Array.from({length: d}, (_, r) => cols.map(i => charges[i][r]));
  }

  // A relation with every entry nonzero on the support of the kernel.
  function genericRelation(basis) {
    if (basis.length === 1) return basis[0];
    const k = basis[0].length;
    const support = [...Array(k).keys()].filter(j => basis.some(v => v[j] !== 0));
    for (let bound = 1; bound < 6; bound++) {
      const weights = Array(basis.length).fill(1);
      const search = i => {
        if (i === basis.length) {
          const v = Array.from({length: k}, (_, j) => basis.reduce((s, b, t) => s + weights[t] * b[j], 0));
          return support.every(j => v[j] !== 0) ? primitive(v) : null;
        }
        for (let w = 1; w <= bound; w++) { weights[i] = w; const hit = search(i + 1); if (hit) return hit; }
        return null;
      };
      const hit = search(0);
      if (hit) return hit;
    }
    throw new Error("No generic relation found");
  }

  // Which selected sectors can condense in the compact theory, and with what Higgs branch.
  function analyse(charges, selected) {
    const S = [...new Set(selected)].sort((a, b) => a - b);
    const empty = {selected: S, condensing: [], blocked: S, relations: 0, rank: 0, relation: null, m: null, saturated: true, dh11: 0, dh21: 0, allowed: false};
    if (!S.length) return empty;
    const Q = chargeMatrix(charges, S);
    const basis = kernelBasis(Q, S.length);
    const local = basis.length ? genericRelation(basis) : null;
    const condensing = local ? S.filter((_, j) => local[j] !== 0) : [];
    const blocked = S.filter(i => !condensing.includes(i));
    if (!condensing.length) return {...empty, blocked};
    const QC = chargeMatrix(charges, condensing);
    const rho = rank(QC);
    const r = condensing.length - rho;
    const relation = Array(charges.length).fill(0);
    S.forEach((i, j) => { relation[i] = local[j]; });
    return {
      selected: S, condensing, blocked, relations: r, rank: rho, relation,
      m: r === 1 ? relation.reduce((s, x) => s + Math.abs(x), 0) : null,
      saturated: determinantalDivisor(QC) === 1,
      dh11: -rho, dh21: r, allowed: blocked.length === 0
    };
  }

  const SUB = "₀₁₂₃₄₅₆₇₈₉";
  const subscript = n => String(n).split("").map(c => SUB[+c]).join("");

  function formatRelation(a, labels) {
    let out = "";
    a.forEach((x, i) => {
      if (!x) return;
      const mag = Math.abs(x) === 1 ? "" : Math.abs(x);
      out += (out ? (x < 0 ? " − " : " + ") : (x < 0 ? "−" : "")) + mag + labels[i];
    });
    return out + " = 0";
  }

  const presets = [
    {id: "pair", name: "Two equal curves", labels: ["C₁", "C₂"], charges: [[1, 0], [1, 0]]},
    {id: "triangle", name: "Three-term relation", labels: ["C₁", "C₂", "C₃"], charges: [[1, 0], [0, 1], [1, 1]]},
    {id: "orphan", name: "A curve with no partner", labels: ["C₁", "C₂", "C₃"], charges: [[1, 0], [1, 0], [0, 1]]},
    {id: "x9", name: "The four-state face of X₉", labels: ["C₁", "C₂", "e₁", "e₂"], charges: [[1, 0, 0], [0, 1, 0], [1, 1, 1], [0, 0, 1]], hodge: [6, 122]}
  ];

  // Oblique projection for rank-three charges; exact for rank two.
  function project(v) {
    if (v.length === 2) return [v[0], v[1]];
    return [v[0] - 0.55 * v[2], v[1] - 0.45 * v[2]];
  }

  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

  // shift > 0 offsets the arrow sideways, so that an out-and-back pair stays visible.
  function arrow(p, q, cls, label, toPx, shift = 0) {
    let [x1, y1] = toPx(p), [x2, y2] = toPx(q);
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
    x1 -= uy * shift; x2 -= uy * shift; y1 += ux * shift; y2 += ux * shift;
    const hx = x2 - ux * 11, hy = y2 - uy * 11;
    const head = `${x2.toFixed(1)},${y2.toFixed(1)} ${(hx - uy * 5).toFixed(1)},${(hy + ux * 5).toFixed(1)} ${(hx + uy * 5).toFixed(1)},${(hy - ux * 5).toFixed(1)}`;
    let s = `<line class="${cls}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}"/>`;
    s += `<polygon class="${cls}-head" points="${head}"/>`;
    if (label) {
      const mx = (x1 + x2) / 2 - uy * 16, my = (y1 + y2) / 2 + ux * 16;
      s += `<text class="ncal-label" x="${mx.toFixed(1)}" y="${(my + 4).toFixed(1)}" text-anchor="middle">${esc(label)}</text>`;
    }
    return s;
  }

  // SVG markup for a 440 × 320 viewBox.
  function diagram(preset, selected, mode) {
    const res = analyse(preset.charges, selected);
    const pts = [[0, 0]], segments = [], fan = [], held = [];
    let polygon = null;
    if (mode === "decoupled") {
      preset.charges.forEach((q, i) => { const p = project(q); pts.push(p); (selected.includes(i) ? fan : held).push([i, p]); });
    } else {
      let cur = [0, 0];
      const loop = [cur];
      res.condensing.forEach(i => {
        const a = res.relation[i], p = project(preset.charges[i]);
        const next = [cur[0] + a * p[0], cur[1] + a * p[1]];
        segments.push([cur, next, i, a]);
        cur = next; loop.push(cur); pts.push(cur);
      });
      if (segments.length) polygon = loop;
      preset.charges.forEach((q, i) => {
        if (res.condensing.includes(i)) return;
        const p = project(q); pts.push(p); held.push([i, p]);
      });
    }
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const scale = Math.min(300 / Math.max(maxX - minX, 1), 200 / Math.max(maxY - minY, 1), 125);
    const cx = 220 - scale * (minX + maxX) / 2, cy = 160 + scale * (minY + maxY) / 2;
    const toPx = p => [cx + scale * p[0], cy - scale * p[1]];
    let s = "";
    if (preset.charges[0].length === 2) {
      for (let gx = Math.floor(minX) - 1; gx <= Math.ceil(maxX) + 1; gx++)
        for (let gy = Math.floor(minY) - 1; gy <= Math.ceil(maxY) + 1; gy++) {
          const [x, y] = toPx([gx, gy]);
          if (x > 8 && x < 432 && y > 8 && y < 312) s += `<circle class="ncal-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.6"/>`;
        }
    } else {
      [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(e => {
        const [x1, y1] = toPx([0, 0]), [x2, y2] = toPx(project(e.map(x => x * 1.35)));
        s += `<line class="ncal-axis" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
      });
    }
    if (polygon && polygon.length > 2) s += `<polygon class="ncal-fill" points="${polygon.map(p => toPx(p).map(v => v.toFixed(1)).join(",")).join(" ")}"/>`;
    held.forEach(([i, p]) => { s += arrow([0, 0], p, mode === "decoupled" ? "ncal-faint" : (selected.includes(i) ? "ncal-blocked" : "ncal-faint"), preset.labels[i], toPx); });
    fan.forEach(([i, p]) => { s += arrow([0, 0], p, "ncal-free", preset.labels[i], toPx); });
    // A relation among parallel charges closes along a line; draw it as a visible out-and-back.
    const area = polygon ? polygon.reduce((acc, p, j) => { const q = polygon[(j + 1) % polygon.length]; return acc + p[0] * q[1] - q[0] * p[1]; }, 0) : 0;
    const shift = Math.abs(area) < 1e-9 ? 7 : 0;
    segments.forEach(([p, q, i, a]) => {
      const label = (a < 0 ? "−" : "") + (Math.abs(a) === 1 ? "" : Math.abs(a)) + preset.labels[i];
      s += arrow(p, q, "ncal-arrow", label, toPx, shift);
    });
    const [ox, oy] = toPx([0, 0]);
    s += `<circle class="ncal-origin" cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="4"/>`;
    return s;
  }

  const model = {gcd, primitive, rank, kernelBasis, det, determinantalDivisor, chargeMatrix, genericRelation, analyse, formatRelation, subscript, presets, project, diagram};
  if (typeof module !== "undefined" && module.exports) module.exports = model;
  else root.CondenseModel = model;
})(typeof window !== "undefined" ? window : globalThis);
