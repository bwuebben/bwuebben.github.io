(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const M = window.OneYearModel;
  if (!M || !$("oyp-sharpe")) return;
  const svg = $("oyp-chart");
  const count = n => n.toLocaleString("en-US");
  const years = x => x < 100 ? x.toFixed(1) : Math.round(x).toLocaleString("en-US");
  const halfLabel = h => h === Infinity ? "never decays" : (h === 1 ? "1 year" : h + " years");
  const state = () => ({sr: Number($("oyp-sharpe").value), h: M.HALF_LIVES[Number($("oyp-half").value)], m: M.TRIALS[Number($("oyp-trials").value)]});

  function draw() {
    const {sr, h, m} = state();
    const W = Math.max(300, Math.round(svg.clientWidth || 560)), H = Math.round(W < 460 ? W * 0.78 : W * 0.6);
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = M.chart(sr, h, m, W, H);
  }

  function update() {
    const {sr, h, m} = state(), s = M.summary(sr, h, m), bar = s.bar.toFixed(2);
    $("oyp-sharpe-out").textContent = sr.toFixed(2);
    $("oyp-half-out").textContent = halfLabel(h);
    $("oyp-trials-out").textContent = count(m);
    document.querySelectorAll("[data-oyp]").forEach(b => {
      const [ps, ph, pm] = b.dataset.oyp.split(",").map(Number);
      b.setAttribute("aria-pressed", String(Math.abs(ps - sr) < 1e-9 && ph === Number($("oyp-half").value) && pm === Number($("oyp-trials").value)));
    });
    const when = s.window ? years(s.window.from) : "Never";
    $("oyp-years").textContent = when;
    let text, mobile;
    if (h === Infinity) {
      $("oyp-peak").textContent = "∞";
      $("oyp-peak-note").textContent = "the ceiling on its evidence: none, because without decay the t-statistic grows as SR₀√T";
      text = `With no decay the evidence grows as SR₀√T and clears the bar of t = ${bar} after ${years(s.window.from)} years. Halve the Sharpe ratio and the wait quadruples.`;
      mobile = `Certified after ${years(s.window.from)} years · bar ${bar}`;
    } else {
      $("oyp-peak").textContent = s.peak.t.toFixed(2);
      $("oyp-peak-note").textContent = `the strongest evidence it can ever show, reached after ${years(s.peak.T)} years`;
      const lead = `At an initial Sharpe ratio of ${sr.toFixed(2)} and a half-life of ${halfLabel(h)}, the evidence peaks at t = ${s.peak.t.toFixed(2)} after ${years(s.peak.T)} years. Against ${count(m)} strategies the bar is t = ${bar}.`;
      if (!s.window) {
        text = `${lead} This edge fades before it can be proven, however long anyone waits. It would need a half-life of at least ${years(s.minHalfLife)} years.`;
        mobile = `Never certified · best t ${s.peak.t.toFixed(2)} vs bar ${bar}`;
      } else {
        const exit = s.window.until > M.HORIZON ? "and stays above it beyond the chart’s fifty years" : `and falls back below it after ${years(s.window.until)} years, as the faded tail dilutes the record`;
        text = `${lead} The record clears the bar after ${years(s.window.from)} years ${exit}.`;
        mobile = `Certified after ${years(s.window.from)} years · bar ${bar}`;
      }
    }
    $("oyp-conclusion").textContent = text;
    $("oyp-mobile").textContent = mobile;
    svg.setAttribute("aria-label", `Expected t-statistic against years of evidence. ${text}`);
    draw();
  }

  ["oyp-sharpe", "oyp-half", "oyp-trials"].forEach(id => $(id).addEventListener("input", update));
  document.querySelectorAll("[data-oyp]").forEach(b => b.addEventListener("click", () => {
    const [sr, hi, mi] = b.dataset.oyp.split(",");
    $("oyp-sharpe").value = sr; $("oyp-half").value = hi; $("oyp-trials").value = mi;
    update();
  }));
  if ("ResizeObserver" in window) {
    let last = 0;
    new ResizeObserver(() => { const w = svg.clientWidth; if (w && Math.abs(w - last) > 2) { last = w; draw(); } }).observe(svg);
  }
  update();
})();
