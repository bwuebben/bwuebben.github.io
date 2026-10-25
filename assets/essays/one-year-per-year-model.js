/* One year per year: the knowability bound of The Validation Bottleneck.
   Illustrative closed forms, not estimates of any strategy or trial count. */
(function (root) {
  "use strict";
  const LN2 = Math.LN2;
  const HALF_LIVES = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, Infinity];
  const TRIALS = [10, 30, 100, 300, 1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6, 1e7, 1e8];
  const HORIZON = 50;            // years shown on the chart
  const CLEAN_WINDOW = 32 / 12;  // longest post-cutoff window in the paper's Experiment 2

  // g(u) = (1 - e^-u)/sqrt(u) peaks where e^u - 1 = 2u.
  const g = u => u <= 0 ? 0 : -Math.expm1(-u) / Math.sqrt(u);
  let uStar = 1.25;
  for (let i = 0; i < 50; i++) uStar -= (Math.expm1(uStar) - 2 * uStar) / (Math.exp(uStar) - 2);
  const gStar = g(uStar);

  function check(sr0, h) {
    if (!(Number.isFinite(sr0) && sr0 > 0) || !(h > 0)) throw new RangeError("Invalid strategy inputs");
  }
  // Expected t-statistic of the equal-weighted mean after T years.
  function tStat(T, sr0, h) {
    check(sr0, h);
    if (!(T >= 0)) throw new RangeError("Invalid horizon");
    return h === Infinity ? sr0 * Math.sqrt(T) : sr0 * Math.sqrt(h / LN2) * g(T * LN2 / h);
  }
  function peak(sr0, h) {
    check(sr0, h);
    return h === Infinity ? {T: Infinity, t: Infinity} : {T: uStar * h / LN2, t: sr0 * gStar * Math.sqrt(h / LN2)};
  }
  // The leading-order t-statistic of the luckiest of M null strategies, used in the paper as the hurdle.
  function hurdle(M) {
    if (!(Number.isFinite(M) && M > 1)) throw new RangeError("Invalid trial count");
    return Math.sqrt(2 * Math.log(M));
  }
  function bisect(f, lo, hi) {
    for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) > 0) hi = mid; else lo = mid; }
    return (lo + hi) / 2;
  }
  // The interval of horizons on which the expected t-statistic clears the bar, or null.
  function certification(sr0, h, bar) {
    if (h === Infinity) return {from: (bar / sr0) ** 2, until: Infinity};
    const p = peak(sr0, h);
    if (p.t < bar) return null;
    const from = bisect(T => tStat(T, sr0, h) - bar, 0, p.T);
    let hi = 2 * p.T;
    while (tStat(hi, sr0, h) >= bar) hi *= 2;
    const until = bisect(T => bar - tStat(T, sr0, h), p.T, hi);
    return {from, until};
  }
  // Smallest half-life whose peak evidence reaches the bar.
  const minHalfLife = (sr0, bar) => LN2 * (bar / (sr0 * gStar)) ** 2;

  function summary(sr0, h, M) {
    const bar = hurdle(M);
    return {bar, peak: peak(sr0, h), window: certification(sr0, h, bar), minHalfLife: minHalfLife(sr0, bar)};
  }

  const f1 = x => x.toFixed(1), f2 = x => x.toFixed(2);
  const count = M => M.toLocaleString("en-US");

  // SVG markup for the chart; class names are styled in one-year-per-year.css.
  function chart(sr0, h, M, W = 560, H = 340) {
    const s = summary(sr0, h, M), narrow = W < 460;
    const m = {l: narrow ? 34 : 44, r: 12, t: 16, b: 40};
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const top = h === Infinity ? sr0 * Math.sqrt(HORIZON) : (s.peak.T <= HORIZON ? s.peak.t : tStat(HORIZON, sr0, h));
    const raw = Math.max(s.bar * 1.25, top * 1.08, 3);
    const step = raw <= 6 ? 1 : raw <= 12 ? 2 : 5;
    const yMax = Math.ceil(raw / step) * step;
    const X = T => m.l + T / HORIZON * iw, Y = t => m.t + ih * (1 - Math.min(t, yMax) / yMax);
    const n = 240, pts = [], ref = [];
    let clipped = false;
    for (let i = 0; i <= n; i++) {
      const T = HORIZON * i / n, r = sr0 * Math.sqrt(T);
      pts.push([T, tStat(T, sr0, h)]);
      // The no-decay reference stops where it leaves the plot.
      if (!clipped) { if (r <= yMax) ref.push([T, r]); else { ref.push([(yMax / sr0) ** 2, yMax]); clipped = true; } }
    }
    const path = a => "M" + a.map(([T, t]) => X(T).toFixed(1) + " " + Y(t).toFixed(1)).join("L");
    let o = "";
    for (let t = 0; t <= yMax + 1e-9; t += step)
      o += `<line class="oyp-grid" x1="${m.l}" x2="${W - m.r}" y1="${Y(t)}" y2="${Y(t)}"/><text class="oyp-tick" x="${m.l - 6}" y="${Y(t) + 4}" text-anchor="end">${t}</text>`;
    for (let T = 0; T <= HORIZON; T += 10)
      o += `<text class="oyp-tick" x="${X(T)}" y="${H - m.b + 16}" text-anchor="middle">${T}</text>`;
    o += `<rect class="oyp-band" x="${X(0)}" y="${m.t}" width="${X(CLEAN_WINDOW) - X(0)}" height="${ih}"><title>32 months: the longest clean window in the paper's second experiment</title></rect>`;
    if (s.window && s.window.from < HORIZON) {
      const a = Math.max(0, s.window.from), b = Math.min(HORIZON, s.window.until);
      const seg = [[a, s.bar]];
      for (let i = 0; i <= 120; i++) { const T = a + (b - a) * i / 120; seg.push([T, Math.max(s.bar, tStat(T, sr0, h))]); }
      seg.push([b, s.bar]);
      o += `<path class="oyp-win" d="${path(seg)}Z"/>`;
    }
    if (h !== Infinity) o += `<path class="oyp-ref" d="${path(ref)}"/>`;
    o += `<path class="oyp-curve" d="${path(pts)}"/>`;
    o += `<line class="oyp-bar" x1="${m.l}" x2="${W - m.r}" y1="${Y(s.bar)}" y2="${Y(s.bar)}"/>`;
    // Put the bar's label below the line when the curve crowds the space above it.
    const nearRight = pts.filter(([T]) => T > HORIZON * 0.55).some(([, t]) => Y(t) < Y(s.bar) && Y(t) > Y(s.bar) - 22);
    const label = narrow ? `bar t = ${f2(s.bar)}` : `bar: best of ${count(M)} flukes, t = ${f2(s.bar)}`;
    o += `<text class="oyp-bar-label" x="${W - m.r - 2}" y="${nearRight ? Y(s.bar) + 15 : Y(s.bar) - 7}" text-anchor="end">${label}</text>`;
    if (h !== Infinity && s.peak.T <= HORIZON) {
      const px = X(s.peak.T), py = Y(s.peak.t), anchor = px > W * 0.7 ? "end" : px < W * 0.25 ? "start" : "middle";
      const below = Math.abs(py - Y(s.bar)) < 26 && py < Y(s.bar);
      o += `<circle class="oyp-peak" cx="${px}" cy="${py}" r="4.5"/><text class="oyp-peak-label" x="${px}" y="${below ? py + 18 : py - 10}" text-anchor="${anchor}">peak t = ${f2(s.peak.t)}</text>`;
    }
    if (s.window && s.window.from <= HORIZON) {
      const cx = X(s.window.from);
      o += `<line class="oyp-cert-line" x1="${cx}" x2="${cx}" y1="${Y(s.bar)}" y2="${m.t + ih}"/><circle class="oyp-cert" cx="${cx}" cy="${Y(s.bar)}" r="4.5"/>`;
    }
    o += `<line class="oyp-axis" x1="${m.l}" x2="${W - m.r}" y1="${m.t + ih}" y2="${m.t + ih}"/>`;
    o += `<text class="oyp-axis-label" x="${m.l + iw / 2}" y="${H - 6}" text-anchor="middle">years of clean, post-cutoff evidence</text>`;
    o += `<text class="oyp-axis-label" transform="translate(11 ${m.t + ih / 2}) rotate(-90)" text-anchor="middle">expected t-statistic</text>`;
    return o;
  }

  const models = {HALF_LIVES, TRIALS, HORIZON, CLEAN_WINDOW, uStar, gStar, g, tStat, peak, hurdle, certification, minHalfLife, summary, chart};
  if (typeof module !== "undefined" && module.exports) module.exports = models;
  else root.OneYearModel = models;
})(typeof window !== "undefined" ? window : globalThis);
