/* Interaction for "The same law in a black hole and a stock market".
   The chart builders return SVG markup so the static page can show the initial state. */
(function (root) {
  "use strict";
  const fmt = (x, places = 2) => x.toLocaleString("en-US", {minimumFractionDigits: places, maximumFractionDigits: places});
  const LN2 = Math.LN2;

  function niceTicks(max) {
    const step = max <= 2.2 ? 0.5 : max <= 5 ? 1 : 2;
    const ticks = [];
    for (let t = 0; t <= max + 1e-9; t += step) ticks.push(Math.round(t * 10) / 10);
    return ticks;
  }

  // Histogram of simulated eigenvalues against the Marchenko–Pastur density.
  function spectrumChart(models, sim, mode) {
    const W = 520, H = 300, x0 = 20, x1 = 504, top = 18, base = 250;
    const q = sim.q, [a, b] = models.mpEdges(q);
    const largest = sim.eigs[sim.eigs.length - 1];
    const xmax = Math.max(1.6, 1.1 * Math.max(b, largest));
    const X = v => x0 + (x1 - x0) * v / xmax;
    const bins = Math.max(18, Math.min(48, Math.round(3 * Math.sqrt(sim.eigs.length)))), width = xmax / bins, counts = new Array(bins).fill(0);
    for (const v of sim.eigs) counts[Math.min(bins - 1, Math.floor(v / width))]++;
    const hist = counts.map(c => c / (sim.N * width));
    const curve = [];
    for (let i = 0; i <= 400; i++) {
      const v = a + (b - a) * i / 400;
      curve.push([v, models.mpDensity(v, q)]);
    }
    const visible = curve.filter(([v]) => v > 0.04 * xmax).map(p => p[1]);
    const ymax = 1.12 * Math.max(...hist.slice(1), ...visible, 0.2);
    const Y = d => base - (base - top) * Math.min(d, ymax * 1.02) / ymax;
    let svg = `<defs><clipPath id="ol-clip"><rect x="${x0}" y="${top - 4}" width="${x1 - x0}" height="${base - top + 4}"/></clipPath></defs>`;
    svg += `<rect class="ol-band" x="${X(a).toFixed(1)}" y="${top}" width="${(X(b) - X(a)).toFixed(1)}" height="${base - top}"/>`;
    hist.forEach((h, i) => {
      if (h > 0) svg += `<rect class="ol-bar" x="${(X(i * width) + 0.6).toFixed(1)}" y="${Y(h).toFixed(1)}" width="${Math.max(0.5, X(width) - x0 - 1.2).toFixed(1)}" height="${(base - Y(h)).toFixed(1)}"/>`;
    });
    const path = curve.map(([v, d], i) => (i ? "L" : "M") + X(v).toFixed(1) + "," + Y(d).toFixed(1)).join("");
    svg += `<path class="ol-curve" clip-path="url(#ol-clip)" d="${path}"/>`;
    svg += `<line class="ol-truth" x1="${X(1).toFixed(1)}" y1="${top - 6}" x2="${X(1).toFixed(1)}" y2="${base}"/>`;
    svg += `<text class="ol-label ol-truth-label" x="${(X(1) + 6).toFixed(1)}" y="${top + 6}">${mode === "hole" ? "maximal entanglement" : "the truth"}</text>`;
    svg += `<line class="ol-axis" x1="${x0}" y1="${base}" x2="${x1}" y2="${base}"/>`;
    for (const t of niceTicks(xmax)) {
      svg += `<line class="ol-axis" x1="${X(t).toFixed(1)}" y1="${base}" x2="${X(t).toFixed(1)}" y2="${base + 5}"/><text class="ol-tick" x="${X(t).toFixed(1)}" y="${base + 22}">${t}</text>`;
    }
    if (sim.zeros > 0) {
      svg += `<path class="ol-zero" d="M${x0 + 1},${base} V${top + 34}"/><circle class="ol-zero-dot" cx="${x0 + 1}" cy="${top + 34}" r="4"/>`;
    }
    return svg;
  }

  // Page curve: maximum possible entropy, Hawking's ever-rising count, and Page's formula.
  function pageChart(models, n, k) {
    const x0 = 20, x1 = 504, top = 18, base = 236;
    const ymax = n * LN2;
    const X = f => x0 + (x1 - x0) * f, Y = s => base - (base - top) * s / ymax;
    const page = [];
    for (let j = 0; j <= n; j++) page.push([j / n, models.pageCurve(n, j)]);
    let svg = `<path class="ol-tent" d="M${X(0)},${Y(0)}L${X(0.5)},${Y(n / 2 * LN2).toFixed(1)}L${X(1)},${Y(0)}"/>`;
    svg += `<path class="ol-hawking" d="M${X(0)},${Y(0)}L${X(1)},${Y(ymax).toFixed(1)}"/>`;
    svg += `<path class="ol-page" d="${page.map(([f, s], i) => (i ? "L" : "M") + X(f).toFixed(1) + "," + Y(s).toFixed(1)).join("")}"/>`;
    svg += `<line class="ol-guide" x1="${X(k / n).toFixed(1)}" y1="${top}" x2="${X(k / n).toFixed(1)}" y2="${base}"/>`;
    svg += `<circle class="ol-now" cx="${X(k / n).toFixed(1)}" cy="${Y(models.pageCurve(n, k)).toFixed(1)}" r="6"/>`;
    svg += `<text class="ol-label ol-hawking-label" x="${(X(0.7) - 10).toFixed(1)}" y="${(Y(0.7 * ymax) - 10).toFixed(1)}">Hawking</text>`;
    svg += `<text class="ol-label ol-page-label" x="${(X(0.8) + 10).toFixed(1)}" y="${(Y(models.pageCurve(n, Math.round(0.8 * n))) - 12).toFixed(1)}">Page</text>`;
    svg += `<line class="ol-axis" x1="${x0}" y1="${base}" x2="${x1}" y2="${base}"/>`;
    for (const [f, label] of [[0, "none"], [0.5, "half: the Page time"], [1, "all"]]) {
      svg += `<line class="ol-axis" x1="${X(f)}" y1="${base}" x2="${X(f)}" y2="${base + 5}"/><text class="ol-tick" x="${X(f)}" y="${base + 22}">${label}</text>`;
    }
    return svg;
  }

  const api = {spectrumChart, pageChart};
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }

  const $ = id => document.getElementById(id);
  const models = root.OneLawModels;
  if (!models || !$("ol-spectrum")) return;

  // Experiment 01: one spectrum, two readings.
  let mode = "market", seed = 7, pending = false;
  const words = {
    market: {n: "Stocks", t: "Trading days", nNote: "Each stock is independent noise with the same volatility.", tNote: "Daily returns with a known mean of zero.",
             axis: "Eigenvalue of the sample correlation matrix", legend: "Bars: simulated eigenvalues. Line: the Marchenko–Pastur law. Shaded: the band it predicts. Dashed: the truth, where every eigenvalue equals one."},
    hole: {n: "Radiation dimension d<sub>R</sub>", t: "Black-hole dimension d<sub>B</sub>", nNote: "The part of the system we can see: the radiation.", tNote: "The part we trace out: what is left of the black hole.",
           axis: "d<sub>R</sub> × eigenvalue of the radiation’s density matrix", legend: "The same eigenvalues, divided by d<sub>R</sub>, form the radiation’s state. Dashed: a maximally entangled radiation, every eigenvalue equal."}
  };
  function spectrumUpdate() {
    pending = false;
    const N = Number($("ol-n").value), T = Number($("ol-t").value), q = N / T;
    const sim = models.simulate(N, T, seed), w = words[mode];
    $("ol-n-label").innerHTML = w.n; $("ol-t-label").innerHTML = w.t;
    $("ol-n-note").textContent = w.nNote; $("ol-t-note").textContent = w.tNote;
    $("ol-n-out").textContent = N; $("ol-t-out").textContent = T;
    $("ol-axis-title").innerHTML = w.axis;
    $("ol-legend").innerHTML = w.legend + (sim.zeros > 0 ? ` The spike at zero stands for the ${sim.zeros} eigenvalues that are exactly zero.` : "");
    document.querySelectorAll("[data-ol-mode]").forEach(b => b.setAttribute("aria-pressed", b.dataset.olMode === mode));
    document.querySelectorAll("[data-ol-preset]").forEach(b => {
      b.textContent = b.dataset[mode === "hole" ? "hole" : "market"];
      b.setAttribute("aria-pressed", b.dataset.olPreset === N + "," + T);
    });
    const svg = $("ol-spectrum");
    svg.innerHTML = spectrumChart(models, sim, mode);
    const [a, b] = models.mpEdges(q);
    const lo = sim.eigs[0], hi = sim.eigs[sim.eigs.length - 1];
    let m1, s1, m2, s2, summary, mobile;
    if (mode === "market") {
      m1 = sim.zeros > 0 ? "∞" : fmt(hi / lo, 1) + "×";
      s1 = sim.zeros > 0 ? `largest ÷ smallest eigenvalue: ${sim.zeros} independent portfolios look riskless. The truth is 1×.` : "largest ÷ smallest eigenvalue. The truth is 1×.";
      if (sim.minVar) {
        const ratio = Math.sqrt(sim.minVar.delivered / sim.minVar.promised);
        m2 = fmt(ratio, 2) + "×";
        s2 = `risk the minimum-variance portfolio delivers ÷ risk it promises. Theory: 1/(1 − q) = ${fmt(1 / (1 - q), 2)}×.`;
      } else {
        m2 = "∞";
        s2 = "the sample covariance matrix cannot be inverted: the optimizer has no answer, or infinitely many.";
      }
      summary = sim.zeros > 0
        ? `${N} independent stocks over ${T} days: ${sim.zeros} eigenvalues are exactly zero and the rest spread from ${fmt(lo)} to ${fmt(hi)}. The predicted band is ${fmt(a)} to ${fmt(b)}. Every one of these portfolios truly has the same risk.`
        : `${N} independent stocks over ${T} days (q = ${fmt(q)}): the eigenvalues spread from ${fmt(lo)} to ${fmt(hi)}; the predicted band is ${fmt(a)} to ${fmt(b)}. The truth is a single value, 1.`;
      mobile = `Band ${fmt(a)}–${fmt(b)} · spread ${m1} · optimizer off by ${m2}`;
    } else {
      const dm = Math.min(N, T), dM = Math.max(N, T), S = models.entropy(sim.eigs, N);
      m1 = fmt(S, 3);
      s1 = `entanglement entropy of the radiation, in nats. The maximum is ln ${dm} = ${fmt(Math.log(dm), 3)}.`;
      m2 = fmt(Math.log(dm) - S, 3);
      s2 = `shortfall from the maximum. Page’s formula gives ${dm} ⁄ (2 × ${dM}) = ${fmt(dm / (2 * dM), 3)}.`;
      summary = `A random pure state of ${N} × ${T} dimensions: the radiation carries ${fmt(S, 3)} nats of entanglement, ${fmt(Math.log(dm) - S, 3)} short of the maximum. Page’s formula predicts a shortfall of ${fmt(dm / (2 * dM), 3)}.`;
      mobile = `Entropy ${m1} nats · shortfall ${m2} · Page ${fmt(dm / (2 * dM), 3)}`;
    }
    $("ol-m1").textContent = m1; $("ol-s1").textContent = s1;
    $("ol-m2").textContent = m2; $("ol-s2").textContent = s2;
    $("ol-conclusion").textContent = summary; $("ol-mobile").textContent = mobile;
    svg.setAttribute("aria-label", "Histogram of " + sim.eigs.length + " nonzero eigenvalues between " + fmt(lo) + " and " + fmt(hi) + ", with the Marchenko–Pastur band from " + fmt(a) + " to " + fmt(b) + ".");
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(spectrumUpdate); } }
  ["ol-n", "ol-t"].forEach(id => $(id).addEventListener("input", schedule));
  document.querySelectorAll("[data-ol-preset]").forEach(b => b.addEventListener("click", () => {
    const [N, T] = b.dataset.olPreset.split(","); $("ol-n").value = N; $("ol-t").value = T; schedule();
  }));
  document.querySelectorAll("[data-ol-mode]").forEach(b => b.addEventListener("click", () => { mode = b.dataset.olMode; schedule(); }));
  $("ol-redraw").addEventListener("click", () => { seed = (seed * 48271 + 11) % 2147483647; schedule(); });
  spectrumUpdate();

  // Experiment 02: the Page curve as the black hole evaporates.
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let animation = null;
  function pageUpdate() {
    const n = Number($("ol-qubits").value);
    const kInput = $("ol-k");
    kInput.max = n;
    if (Number(kInput.value) > n) kInput.value = n;
    const k = Number(kInput.value);
    const S = models.pageCurve(n, k), max = Math.min(k, n - k) * LN2, hawking = k * LN2;
    $("ol-qubits-out").textContent = n + " qubits"; $("ol-k-out").textContent = k + " of " + n;
    $("ol-page").innerHTML = pageChart(models, n, k);
    $("ol-p1").textContent = fmt(S, 3); $("ol-p2").textContent = fmt(max - S, 3);
    let text;
    if (k === 0 || k === n) text = k === 0 ? "Nothing has left yet. The radiation is empty, and so is its entropy." : "The black hole is gone and the radiation is pure again: zero entropy. Hawking’s count ends at " + fmt(hawking, 1) + " nats.";
    else if (2 * k < n) text = `${k} of ${n} qubits have left. The radiation holds ${fmt(S, 3)} nats, ${fmt(max - S, 4)} short of the maximum. Hawking’s count, ${fmt(hawking, 2)}, still agrees.`;
    else if (2 * k === n) text = `The Page time: the radiation holds ${fmt(S, 3)} nats, short of the maximum by ${fmt(max - S, 3)}. Make the system larger: the entropy grows, the shortfall barely moves, and it tends to exactly one half.`;
    else text = `${k} of ${n} qubits have left. The entropy now falls with the size of what remains: ${fmt(S, 3)} nats. Hawking’s count says ${fmt(hawking, 2)} and keeps climbing, past anything a pure state allows.`;
    $("ol-page-conclusion").textContent = text;
    $("ol-page-mobile").textContent = `${k} of ${n} radiated · entropy ${fmt(S, 2)} nats · shortfall ${fmt(max - S, 3)}`;
    $("ol-page").setAttribute("aria-label", `Page curve for ${n} qubits; after ${k} have radiated the entropy is ${fmt(S, 2)} nats; Hawking's count is ${fmt(hawking, 2)}.`);
  }
  function stop() { if (animation) { cancelAnimationFrame(animation); animation = null; $("ol-play").textContent = "Evaporate"; } }
  $("ol-qubits").addEventListener("input", () => { stop(); pageUpdate(); });
  $("ol-k").addEventListener("input", () => { stop(); pageUpdate(); });
  $("ol-page-time").addEventListener("click", () => { stop(); $("ol-k").value = Number($("ol-qubits").value) / 2; pageUpdate(); });
  $("ol-play").addEventListener("click", () => {
    if (animation) return stop();
    const n = Number($("ol-qubits").value);
    if (reduce.matches) { $("ol-k").value = n; pageUpdate(); return; }
    const start = performance.now(), duration = 4000;
    $("ol-play").textContent = "Pause";
    const step = now => {
      const k = Math.min(n, Math.floor(n * (now - start) / duration));
      $("ol-k").value = k; pageUpdate();
      animation = k < n ? requestAnimationFrame(step) : null;
      if (!animation) $("ol-play").textContent = "Evaporate";
    };
    animation = requestAnimationFrame(step);
  });
  pageUpdate();
})(typeof window !== "undefined" ? window : globalThis);
