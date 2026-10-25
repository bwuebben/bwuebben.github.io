/* Experiments for "Who vouches for a machine?". Rendering helpers are pure so the static page can be generated from them. */
(function (root) {
  "use strict";
  const M = root.WhoVouchesModel || (typeof require !== "undefined" ? require("./who-vouches-model.js") : null);
  const AGENTS = 100, P_YEAR = 0.04, FIRST_SEED = 3;
  const pct = (x, places = 1) => (100 * x).toLocaleString("en-US", {minimumFractionDigits: places, maximumFractionDigits: places}) + "%";
  const fix = (x, places = 2) => x.toLocaleString("en-US", {minimumFractionDigits: places, maximumFractionDigits: places});

  function gridMarkup(failed) {
    let s = "";
    for (let i = 0; i < AGENTS; i++) {
      const x = 15 + 30 * (i % 10), y = 15 + 30 * Math.floor(i / 10);
      s += failed[i]
        ? `<circle cx="${x}" cy="${y}" r="10" class="wv-failed"/>`
        : `<circle cx="${x}" cy="${y}" r="10" class="wv-ok"/>`;
    }
    return s;
  }

  function historyMarkup(counts) {
    const recent = counts.slice(-40), worst = Math.max(12, ...counts), base = 92;
    const h = c => c / worst * 80;
    let s = `<line x1="0" y1="${base}" x2="400" y2="${base}" class="wv-axis"/>`;
    s += `<line x1="0" y1="${(base - h(AGENTS * P_YEAR)).toFixed(2)}" x2="400" y2="${(base - h(AGENTS * P_YEAR)).toFixed(2)}" class="wv-mean"/>`;
    recent.forEach((c, i) => {
      const height = Math.max(c ? 1.5 : 0, h(c));
      s += `<rect x="${i * 10 + 1.5}" y="${(base - height).toFixed(2)}" width="7" height="${height.toFixed(2)}" class="${i === recent.length - 1 ? "wv-bar-now" : "wv-bar"}"/>`;
    });
    return s;
  }

  // Capital beyond the expected loss, as a share of insuring one agent alone, against ρ.
  const X0 = 46, X1 = 424, Y0 = 212, Y1 = 18, RMAX = 0.95;
  const sx = r => X0 + (X1 - X0) * r / RMAX, sy = v => Y0 - (Y0 - Y1) * v;
  function curveMarkup(p, rho) {
    let s = "";
    for (const v of [0, 0.25, 0.5, 0.75, 1]) {
      s += `<line x1="${X0}" y1="${sy(v)}" x2="${X1}" y2="${sy(v)}" class="${v ? "wv-grid-line" : "wv-axis"}"/>`;
      s += `<text x="${X0 - 8}" y="${sy(v) + 4}" text-anchor="end">${v * 100}%</text>`;
    }
    for (const r of [0, 0.25, 0.5, 0.75]) s += `<text x="${sx(r)}" y="${Y0 + 18}" text-anchor="middle">${r.toFixed(2)}</text>`;
    s += `<text x="${X1}" y="${Y0 + 18}" text-anchor="end">ρ</text>`;
    let d = "";
    for (let i = 0; i <= 95; i++) {
      const r = i / 100;
      d += (i ? " L" : "M") + sx(r).toFixed(2) + "," + sy(M.quote(p, r).capitalShare).toFixed(2);
    }
    s += `<path d="${d}" class="wv-curve-line"/>`;
    const v = M.quote(p, rho).capitalShare;
    s += `<line x1="${sx(rho).toFixed(2)}" y1="${Y0}" x2="${sx(rho).toFixed(2)}" y2="${sy(v).toFixed(2)}" class="wv-drop"/>`;
    s += `<circle cx="${sx(rho).toFixed(2)}" cy="${sy(v).toFixed(2)}" r="6" class="wv-marker"/>`;
    return s;
  }

  function quoteText(p, rho) {
    const q = M.quote(p, rho);
    return {
      q,
      mobile: pct(q.capitalShare, 0) + " of stand-alone capital · conditional contract " + pct(q.conditional),
      conclusion: rho === 0
        ? `With independent failures and p = ${pct(p)}, a very large pool loses ${pct(q.tail)} even in its worst year in two hundred: the expected loss, and no capital beyond it.`
        : `With p = ${pct(p)} and ρ = ${fix(rho)}, the one-in-two-hundred-year loss is ${pct(q.tail)} of the pool, ${fix(q.underReserve, 1)} times the expected loss. The correlation between two agents’ failures is ${q.failureCorrelation < 0.15 ? "only " : ""}${fix(q.failureCorrelation)}.`
    };
  }

  const helpers = {gridMarkup, historyMarkup, curveMarkup, quoteText, FIRST_SEED, AGENTS, P_YEAR};
  if (typeof module !== "undefined" && module.exports) { module.exports = helpers; return; }
  if (typeof document === "undefined") return;

  const $ = id => document.getElementById(id);
  const reduced = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Experiment 01: a hundred agents, one shared factor, year by year.
  if ($("wv-year-rho")) {
    let counts = [], rng = M.mulberry32(FIRST_SEED), running = false;
    const rhoNow = () => Number($("wv-year-rho").value) / 100;
    function show(year) {
      const rho = rhoNow(), n = counts.length;
      const mean = counts.reduce((a, b) => a + b, 0) / n, worst = Math.max(...counts);
      $("wv-grid").innerHTML = gridMarkup(year.failed);
      $("wv-history").innerHTML = historyMarkup(counts);
      $("wv-year-mean").textContent = fix(mean, 1);
      $("wv-year-worst").textContent = String(worst);
      $("wv-year-mobile").textContent = `Year ${n}: ${year.count} failed · average ${fix(mean, 1)} · worst ${worst}`;
      $("wv-year-conclusion").textContent = `Year ${n} at shared exposure ${fix(rho)}: ${year.count} of ${AGENTS} agents failed. Over ${n} ${n === 1 ? "year" : "years"} the average is ${fix(mean, 1)} a year and the worst year took ${worst}.`;
      $("wv-grid").setAttribute("aria-label", `${year.count} of ${AGENTS} agents failed this year.`);
      $("wv-history").setAttribute("aria-label", `Failures per year for the last ${Math.min(n, 40)} years; the dashed line marks the long-run average of four.`);
    }
    function step() {
      const year = M.simulateYear(AGENTS, P_YEAR, rhoNow(), rng);
      counts.push(year.count);
      show(year);
    }
    function restart() {
      counts = [];
      $("wv-year-rho-out").textContent = fix(rhoNow());
      document.querySelectorAll("[data-wv-years]").forEach(b => b.setAttribute("aria-pressed", String(Number(b.dataset.wvYears) === Number($("wv-year-rho").value))));
      step();
    }
    function busy(state) {
      running = state;
      ["wv-run", "wv-run40", "wv-clear"].forEach(id => { $(id).disabled = state; });
    }
    $("wv-year-rho").addEventListener("input", () => { if (!running) restart(); });
    document.querySelectorAll("[data-wv-years]").forEach(b => b.addEventListener("click", () => {
      if (running) return;
      $("wv-year-rho").value = b.dataset.wvYears; restart();
    }));
    $("wv-run").addEventListener("click", () => { if (!running) step(); });
    $("wv-clear").addEventListener("click", () => { if (!running) restart(); });
    $("wv-run40").addEventListener("click", () => {
      if (running) return;
      if (reduced()) { for (let i = 0; i < 40; i++) step(); return; }
      busy(true);
      let left = 40;
      const tick = () => { step(); if (--left > 0) setTimeout(tick, 45); else busy(false); };
      tick();
    });
    // The first year matches the static markup; later years draw fresh randomness.
    counts = []; step();
    const seed = new Uint32Array(1);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(seed); else seed[0] = Date.now();
    rng = M.mulberry32(seed[0]);
  }

  // Experiment 02: quote capital for a large pool.
  if ($("wv-p")) {
    function update() {
      const p = Number($("wv-p").value) / 1000, rho = Number($("wv-rho").value) / 100;
      const {q, mobile, conclusion} = quoteText(p, rho);
      $("wv-p-out").textContent = pct(p);
      $("wv-rho-out").textContent = fix(rho);
      $("wv-share").textContent = pct(q.capitalShare, 0);
      $("wv-cond").textContent = pct(q.conditional);
      $("wv-quote-mobile").textContent = mobile;
      $("wv-quote-conclusion").textContent = conclusion;
      $("wv-curve").innerHTML = curveMarkup(p, rho);
      $("wv-curve").setAttribute("aria-label", `Capital beyond the expected loss, as a share of insuring one agent alone, rising with ρ; at ρ = ${fix(rho)} it is ${pct(q.capitalShare, 0)}.`);
      for (const [id, v] of [["expected", q.expected], ["tail", q.tail], ["alone", 1]]) {
        $("wv-" + id + "-bar").style.width = (100 * v).toFixed(2) + "%";
        $("wv-" + id + "-out").textContent = pct(v);
      }
      document.querySelectorAll("[data-wv-quote]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.wvQuote === $("wv-p").value + "," + $("wv-rho").value)));
    }
    ["wv-p", "wv-rho"].forEach(id => $(id).addEventListener("input", update));
    document.querySelectorAll("[data-wv-quote]").forEach(b => b.addEventListener("click", () => {
      const [p, r] = b.dataset.wvQuote.split(",");
      $("wv-p").value = p; $("wv-rho").value = r; update();
    }));
    update();
  }
})(typeof window !== "undefined" ? window : globalThis);
