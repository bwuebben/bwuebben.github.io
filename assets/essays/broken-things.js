/* Interactive figures for "Why broken things make invariants". The renderers return SVG markup,
   so the same code produces the static figures in the page source. */
(function (root) {
  "use strict";
  const M = typeof module !== "undefined" && module.exports ? require("./broken-things-model.js") : root.BrokenThingsModel;
  const PI = Math.PI;
  const K = 170 / PI, X = x => 220 + x * K, Y = y => 220 - y * K;
  const pt = ([x, y]) => X(x).toFixed(1) + "," + Y(y).toFixed(1);
  const path = pts => "M" + pts.map(pt).join("L");
  const fmt = (n, p = 2) => n.toLocaleString("en-US", {maximumFractionDigits: p, minimumFractionDigits: p});
  const signText = s => (s > 0 ? "+1" : "−1");
  const FAMILY_ORDER = ["ne", "nw", "sw", "se"];
  const SADDLE = {s1: "S₁", s2: "S₂"};

  /* Level sets of cos x + cos y, drawn faintly as a landscape. */
  function contours() {
    let out = "";
    for (const c of [1.5, 1, 0.5, 0, -0.5, -1, -1.5]) {
      const intervals = c > 0 ? [[-Math.acos(c - 1), Math.acos(c - 1)]]
        : c < 0 ? [[-PI, -Math.acos(c + 1)], [Math.acos(c + 1), PI]] : [[-PI, PI]];
      for (const [a, b] of intervals) for (const s of [1, -1]) {
        const pts = [];
        for (let i = 0; i <= 40; i++) {
          const x = a + (b - a) * i / 40;
          pts.push([x, s * Math.acos(Math.max(-1, Math.min(1, c - Math.cos(x))))]);
        }
        out += `<path class="bt-contour${c === 0 ? " bt-contour-zero" : ""}" d="${path(pts)}"/>`;
      }
    }
    return out;
  }

  /* Sign labels for the eight index-one flow lines; edge lines appear twice on the square. */
  const LABELS = [
    ["max-s1+", [PI / 2, 0], 0, -9], ["max-s1-", [-PI / 2, 0], 0, -9],
    ["max-s2+", [0, PI / 2], 15, 4], ["max-s2-", [0, -PI / 2], 15, 4],
    ["s1-min+", [PI, PI / 2], 18, 4], ["s1-min+", [-PI, PI / 2], -18, 4],
    ["s1-min-", [PI, -PI / 2], 18, 4], ["s1-min-", [-PI, -PI / 2], -18, 4],
    ["s2-min+", [PI / 2, PI], 0, -9], ["s2-min+", [PI / 2, -PI], 0, 17],
    ["s2-min-", [-PI / 2, PI], 0, -9], ["s2-min-", [-PI / 2, -PI], 0, 17]
  ];
  const SEGMENTS = {
    "max-s1+": [[0, 0], [PI, 0]], "max-s1-": [[0, 0], [-PI, 0]],
    "max-s2+": [[0, 0], [0, PI]], "max-s2-": [[0, 0], [0, -PI]],
    "s1-min+": [[PI, 0], [PI, PI]], "s1-min-": [[PI, 0], [PI, -PI]],
    "s2-min+": [[0, PI], [PI, PI]], "s2-min-": [[0, PI], [-PI, PI]]
  };
  const COPIES = {"s1-min+": [[-PI, 0], [-PI, PI]], "s1-min-": [[-PI, 0], [-PI, -PI]],
    "s2-min+": [[0, -PI], [PI, -PI]], "s2-min-": [[0, -PI], [-PI, -PI]]};

  function torusState(family, v, signed) {
    const ends = M.brokenEnds(family);
    const C = v > 0 && v < 100 ? M.sliderToC(v) : null;
    return {family, v, signed, C, ends};
  }

  function renderTorus(s) {
    const f = M.families[s.family];
    let g = `<rect class="bt-quadrant" x="${f.sx > 0 ? 220 : 50}" y="${f.sy > 0 ? 50 : 220}" width="170" height="170"/>`;
    g += contours();
    g += `<rect class="bt-edge" x="50" y="50" width="340" height="340"/>`;
    // Faint members of all four families.
    for (const fam of FAMILY_ORDER) for (const k of [-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5])
      g += `<path class="bt-family" d="${path(M.flowLine(fam, Math.exp(k), 40))}"/>`;
    // The index-one flow lines, each a possible half of a broken trajectory. Edge lines appear
    // twice on the square; only the copy bordering the chosen quadrant carries the broken end.
    const used = new Set(s.ends.flatMap(e => e.edges));
    const drawn = (key, at) => used.has(key) && (key.startsWith("s1-min") ? Math.sign(at[0]) === f.sx
      : key.startsWith("s2-min") ? Math.sign(at[1]) === f.sy : true);
    for (const [key, seg] of Object.entries(SEGMENTS)) {
      for (const p of [seg, COPIES[key]].filter(Boolean))
        g += `<path class="bt-index1${drawn(key, p[1]) ? " bt-used" : ""}" d="${path(p)}"/>`;
    }
    // The two broken ends of the chosen family, brighter as the flow line approaches them.
    const t = s.v / 100;
    s.ends.forEach((e, i) => {
      const near = i === 0 ? 1 - t : t;
      g += `<path class="bt-end bt-end-${i}" style="opacity:${(0.3 + 0.7 * near).toFixed(2)}" d="${path(e.path)}"/>`;
    });
    // The current member of the family, or the broken trajectory it has become.
    const current = s.C === null ? s.ends[s.v === 0 ? 0 : 1].path : M.flowLine(s.family, s.C, 200);
    g += `<path class="bt-current${s.C === null ? " bt-current-broken" : ""}" d="${path(current)}"/>`;
    for (const [key, at, dx, dy] of LABELS) {
      const e = M.edges[key];
      g += `<text class="bt-sign${drawn(key, at) ? " bt-used" : ""}" x="${(X(at[0]) + dx).toFixed(1)}" y="${(Y(at[1]) + dy).toFixed(1)}" text-anchor="middle">${s.signed ? signText(e.sign) : "1"}</text>`;
    }
    // Critical points.
    const dot = (x, y, cls) => `<circle class="bt-crit ${cls}" cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="5"/>`;
    g += dot(0, 0, "bt-max");
    for (const [x, y] of [[PI, 0], [-PI, 0]]) g += dot(x, y, "bt-saddle");
    for (const [x, y] of [[0, PI], [0, -PI]]) g += dot(x, y, "bt-saddle");
    for (const [x, y] of [[PI, PI], [-PI, PI], [PI, -PI], [-PI, -PI]]) g += dot(x, y, "bt-min");
    const label = (x, y, text, anchor = "middle") => `<text class="bt-label" x="${x}" y="${y}" text-anchor="${anchor}">${text}</text>`;
    g += label(232, 212, "max", "start");
    g += label(402, 224, "S₁", "start") + label(38, 224, "S₁", "end");
    g += label(220, 38, "S₂") + label(220, 412, "S₂");
    g += label(402, 46, "min", "start") + label(38, 46, "min", "end") + label(402, 404, "min", "start") + label(38, 404, "min", "end");
    return g;
  }

  function torusText(s) {
    const name = M.families[s.family].name;
    const [a, b] = s.ends;
    const endsText = s.signed
      ? `through ${SADDLE[a.saddle]} with sign ${signText(a.sign)} and through ${SADDLE[b.saddle]} with sign ${signText(b.sign)}. With signs they cancel.`
      : `through ${SADDLE[a.saddle]} and through ${SADDLE[b.saddle]}. Counted mod 2, two ends make zero.`;
    let where;
    if (s.C === null) where = `You are at an added end: the broken trajectory through ${SADDLE[s.ends[s.v === 0 ? 0 : 1].saddle]}, two flow lines meeting at a saddle.`;
    else if (s.C < 0.15) where = `C = ${fmt(s.C, s.C < 0.01 ? 4 : 3)}: the line runs close to the horizontal axis and turns near ${SADDLE.s1}.`;
    else if (s.C > 1 / 0.15) where = `C = ${fmt(s.C, 1)}: the line runs close to the vertical axis and turns near ${SADDLE.s2}.`;
    else where = `C = ${fmt(s.C)}: an honest flow line, well away from both saddles.`;
    return {
      conclusion: `The ${name} family. ${where} The family’s two ends break ${endsText}`,
      mobile: `${name[0].toUpperCase() + name.slice(1)} · ${s.C === null ? "broken end" : "C = " + fmt(s.C, s.C < 0.01 ? 4 : 2)} · ends ${s.signed ? signText(a.sign) + ", " + signText(b.sign) : "1 + 1 ≡ 0"}`,
      ends: s.signed ? `${signText(a.sign)} ${signText(b.sign)}` : "1 + 1",
      endsCaption: s.signed ? "signs of this family’s two broken ends: they sum to zero" : "this family’s two broken ends, counted mod 2: zero",
      total: s.signed ? "0" : "8",
      totalCaption: s.signed ? "signed total of all eight broken trajectories: the coefficient of ∂²" : "broken trajectories in all: four families, two ends each",
      complex: s.signed
        ? "∂(max) = (1 − 1) S₁ + (1 − 1) S₂ = 0;   ∂S₁ = ∂S₂ = (1 − 1) min = 0"
        : "∂(max) = 2 S₁ + 2 S₂ ≡ 0;   ∂S₁ = ∂S₂ = 2 min ≡ 0   (mod 2)"
    };
  }

  /* Experiment 02: a charge-one instanton shrinking to a point. */
  const R_MAX = 2, Y_MAX = 3.6, BALL = 0.25;
  const BX = r => 50 + r / R_MAX * 370, BY = y => 220 - Math.min(y, Y_MAX) / Y_MAX * 180;
  const lambdaOf = v => Math.pow(10, -v / 20);

  function renderBubble(lambda) {
    let g = "";
    for (let i = 0; i <= 4; i++) {
      const r = i / 2, x = BX(r).toFixed(1);
      g += `<path class="bt-axis-tick" d="M${x} 220v5"/><text class="bt-label" x="${x}" y="240" text-anchor="middle">${fmt(r, 1)}</text>`;
    }
    g += `<rect class="bt-ball" x="${BX(0)}" y="40" width="${(BX(BALL) - BX(0)).toFixed(1)}" height="180"/>`;
    const pts = [];
    const n = 400;
    for (let i = 0; i <= n; i++) {
      // Sample densely near the peak, which moves toward the origin as λ shrinks.
      const u = i / n, r = R_MAX * Math.pow(u, 2.2);
      pts.push([r, M.instantonDensity(r, lambda)]);
    }
    const line = pts.map(([r, y]) => BX(r).toFixed(1) + "," + BY(y).toFixed(1)).join("L");
    g += `<path class="bt-energy-fill" d="M${BX(0)},220L${line}L${BX(R_MAX)},220Z"/>`;
    g += `<path class="bt-energy" d="M${line}"/>`;
    g += `<path class="bt-axis" d="M50 220H420M50 220V40"/>`;
    const peak = M.instantonDensity(M.peakRadius(lambda), lambda);
    if (peak > Y_MAX) {
      const x = BX(M.peakRadius(lambda));
      g += `<text class="bt-label bt-clip" x="${(x + 8).toFixed(1)}" y="50">peak ${fmt(peak / Y_MAX, 0)}× higher than the chart</text>`;
    }
    g += `<text class="bt-label" x="420" y="256" text-anchor="end">distance from the centre</text>`;
    g += `<text class="bt-label" x="58" y="34">energy per unit radius</text>`;
    g += `<text class="bt-label bt-ball-label" x="${(BX(BALL) + 4).toFixed(1)}" y="214">r = ${BALL}</text>`;
    return g;
  }

  function bubbleText(lambda) {
    const share = M.instantonShare(BALL, lambda);
    const pct = share > 0.9995 ? fmt(share * 100, 3) : fmt(share * 100, 1);
    const lam = fmt(lambda, lambda < 0.1 ? 3 : 2);
    return {
      lambda: lam, share: pct + "%", half: lam,
      mobile: `λ = ${lam} · ${pct}% within ${BALL} · half within ${lam}`,
      conclusion: `At scale λ = ${lam}, ${pct}% of the energy lies within ${BALL} of the centre, and half of it within ${lam}. The total is one instanton at every scale. Let λ go to zero and the energy collapses onto the point: the limit is flat everywhere else, and one quantum of energy is missing from it.`
    };
  }

  const api = {renderTorus, torusText, torusState, renderBubble, bubbleText, lambdaOf};
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }

  /* Browser wiring. */
  const $ = id => document.getElementById(id);
  const reduced = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ($("bt-torus")) {
    let family = "ne", signed = true, sweeping = 0;
    const slider = $("bt-position");
    function update() {
      const v = Number(slider.value), s = torusState(family, v, signed), t = torusText(s);
      $("bt-torus").innerHTML = renderTorus(s);
      $("bt-torus").setAttribute("aria-label", "Square torus with the " + M.families[family].name + " family of flow lines from the maximum to the minimum. " + t.conclusion);
      $("bt-position-out").textContent = s.C === null ? "broken end through " + SADDLE[s.ends[v === 0 ? 0 : 1].saddle] : "C = " + fmt(s.C, s.C < 0.01 ? 4 : 2);
      $("bt-ends").textContent = t.ends; $("bt-ends-caption").textContent = t.endsCaption;
      $("bt-total").textContent = t.total; $("bt-total-caption").textContent = t.totalCaption;
      $("bt-complex").textContent = t.complex;
      $("bt-conclusion").textContent = t.conclusion; $("bt-mobile").textContent = t.mobile;
      document.querySelectorAll("[data-bt-family]").forEach(b => b.setAttribute("aria-pressed", b.dataset.btFamily === family));
      document.querySelectorAll("[data-bt-count]").forEach(b => b.setAttribute("aria-pressed", (b.dataset.btCount === "signed") === signed));
    }
    function stopSweep() { if (sweeping) cancelAnimationFrame(sweeping); sweeping = 0; $("bt-sweep").textContent = "Sweep the family"; }
    document.querySelectorAll("[data-bt-family]").forEach(b => b.addEventListener("click", () => { family = b.dataset.btFamily; update(); }));
    document.querySelectorAll("[data-bt-count]").forEach(b => b.addEventListener("click", () => { signed = b.dataset.btCount === "signed"; update(); }));
    slider.addEventListener("input", () => { stopSweep(); update(); });
    $("bt-torus").addEventListener("click", e => {
      const r = $("bt-torus").getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 440, y = (e.clientY - r.top) / r.height * 440;
      if (x < 50 || x > 390 || y < 50 || y > 390) return;
      family = (y < 220 ? "n" : "s") + (x < 220 ? "w" : "e"); update();
    });
    $("bt-sweep").addEventListener("click", () => {
      if (sweeping) { stopSweep(); return; }
      const from = Number(slider.value) >= 50 ? 100 : 0, to = 100 - from;
      if (reduced()) { slider.value = to; update(); return; }
      const start = performance.now(), duration = 4000;
      $("bt-sweep").textContent = "Stop";
      const step = now => {
        const u = Math.min(1, (now - start) / duration), eased = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        slider.value = Math.round(from + (to - from) * eased); update();
        if (u < 1) sweeping = requestAnimationFrame(step); else stopSweep();
      };
      sweeping = requestAnimationFrame(step);
    });
    $("bt-ends-button").addEventListener("click", () => { stopSweep(); slider.value = Number(slider.value) < 50 ? 100 : 0; update(); });
    update();
  }
  if ($("bt-bubble")) {
    const slider = $("bt-scale");
    function update() {
      const v = Number(slider.value), lambda = lambdaOf(v), t = bubbleText(lambda);
      $("bt-bubble").innerHTML = renderBubble(lambda);
      $("bt-bubble").setAttribute("aria-label", "Energy profile of an instanton of scale " + t.lambda + ". " + t.conclusion);
      $("bt-scale-out").textContent = "λ = " + t.lambda;
      $("bt-share").textContent = t.share; $("bt-half").textContent = t.half;
      $("bt-bubble-conclusion").textContent = t.conclusion; $("bt-bubble-mobile").textContent = t.mobile;
      document.querySelectorAll("[data-bt-scale]").forEach(b => b.setAttribute("aria-pressed", b.dataset.btScale === String(v)));
    }
    slider.addEventListener("input", update);
    document.querySelectorAll("[data-bt-scale]").forEach(b => b.addEventListener("click", () => { slider.value = b.dataset.btScale; update(); }));
    update();
  }
})(typeof window !== "undefined" ? window : globalThis);
