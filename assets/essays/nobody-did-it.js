/* Nobody did it: attribution under delegation and the Accountability Trilemma. */
(function (root) {
  "use strict";
  const M = typeof module !== "undefined" && module.exports ? require("./nobody-did-it-model.js") : root.AttributionModel;
  const pct = (x, places = 0) => (x * 100).toLocaleString("en-US", {maximumFractionDigits: places, minimumFractionDigits: places}) + "%";
  const share = x => x === 0 ? "0%" : x < .001 ? "under 0.1%" : x < .1 ? pct(x, 1) : pct(x);
  const num = (x, places = 2) => x.toFixed(places);
  const ns = 'xmlns="http://www.w3.org/2000/svg"';

  function state(delegation, prior, tau) {
    const a = M.attribution(delegation, prior, tau), base = M.attribution(0, prior, tau);
    // Hold deterrence fixed by retaliating more often: the false-alarm rate on today's curve at yesterday's hit rate.
    const hold = base.hit <= 0 ? 0 : base.hit >= 1 ? 1 : M.Phi(M.PhiInv(base.hit) - a.clarity);
    return {delegation, prior, tau, a, base, hold, multiplier: M.threatMultiplier(delegation, prior, tau)};
  }

  // Evidence panel: prior-weighted densities, so the height ratio at any s is the posterior odds.
  function evidenceSVG(s) {
    const L = 14, R = 426, top = 26, bottom = 182, smin = -3.5, smax = 6.5, ymax = .4;
    const X = v => L + (v - smin) / (smax - smin) * (R - L), Y = v => bottom - v / ymax * (bottom - top);
    const d = s.a.clarity, cut = s.a.cut;
    const curve = (f, from = smin) => {
      const pts = [];
      for (let i = 0; i <= 160; i++) { const v = from + (smax - from) * i / 160; pts.push(X(v).toFixed(1) + "," + Y(f(v)).toFixed(1)); }
      return pts;
    };
    const emergent = v => (1 - s.prior) * M.phi(v), intended = v => s.prior * M.phi(v - d);
    let out = `<line x1="${L}" y1="${bottom}" x2="${R}" y2="${bottom}" stroke="var(--rule)" stroke-width="1.5"/>`;
    const lo = Math.max(smin, Math.min(smax, cut));
    if (lo < smax) {
      for (const [f, colour] of [[emergent, "var(--gold)"], [intended, "var(--accent)"]]) {
        out += `<path d="M${X(lo).toFixed(1)},${bottom} L${curve(f, lo).join(" L")} L${R},${bottom} Z" fill="${colour}" fill-opacity=".22"/>`;
      }
    }
    out += `<polyline points="${curve(emergent).join(" ")}" fill="none" stroke="var(--gold)" stroke-width="2.4"/>`;
    out += `<polyline points="${curve(intended).join(" ")}" fill="none" stroke="var(--accent)" stroke-width="2.4"/>`;
    if (cut > smin && cut < smax) {
      out += `<line x1="${X(cut).toFixed(1)}" y1="${top - 10}" x2="${X(cut).toFixed(1)}" y2="${bottom}" stroke="var(--ink)" stroke-dasharray="4 4" stroke-width="1.4"/>`;
      const right = cut <= 3.2;
      out += `<text x="${(X(cut) + (right ? 6 : -6)).toFixed(1)}" y="${top - 2}" text-anchor="${right ? "start" : "end"}" class="nd-label">${right ? "retaliate →" : "retaliate beyond →"}</text>`;
    } else {
      out += `<text x="${(L + R) / 2}" y="${top - 2}" text-anchor="middle" class="nd-label">${cut <= smin ? "Threshold off the scale: always retaliate" : "Threshold off the scale: never retaliate"}</text>`;
    }
    return out;
  }

  // ROC panel: the trade-offs the evidence makes available.
  function rocSVG(s) {
    const L = 46, T = 14, S = 200, X = f => L + f * S, Y = h => T + (1 - h) * S;
    const path = d => {
      const pts = [];
      for (let i = 0; i <= 120; i++) { const z = -4 + 8 * i / 120, f = M.Phi(z); pts.push(X(f).toFixed(1) + "," + Y(M.Phi(d + z)).toFixed(1)); }
      return `${X(0)},${Y(0)} ` + pts.join(" ") + ` ${X(1)},${Y(1)}`;
    };
    let out = `<rect x="${L}" y="${T}" width="${S}" height="${S}" fill="none" stroke="var(--rule)" stroke-width="1.5"/>`;
    out += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(1)}" y2="${Y(1)}" stroke="var(--ink-faint)" stroke-dasharray="3 5"/>`;
    out += `<polyline points="${path(M.BASE_CLARITY)}" fill="none" stroke="var(--ink-faint)" stroke-width="1.4"/>`;
    out += `<polyline points="${path(s.a.clarity)}" fill="none" stroke="var(--accent)" stroke-width="2.6"/>`;
    if (s.base.hit > 0 && s.base.hit < 1) {
      out += `<line x1="${X(0)}" y1="${Y(s.base.hit).toFixed(1)}" x2="${X(s.hold).toFixed(1)}" y2="${Y(s.base.hit).toFixed(1)}" stroke="var(--green)" stroke-dasharray="2 4" stroke-width="1.4"/>`;
      out += `<circle cx="${X(s.hold).toFixed(1)}" cy="${Y(s.base.hit).toFixed(1)}" r="5" fill="var(--bg)" stroke="var(--green)" stroke-width="2"/>`;
    }
    out += `<circle cx="${X(s.a.falseAlarm).toFixed(1)}" cy="${Y(s.a.hit).toFixed(1)}" r="6.5" fill="var(--accent)"/>`;
    out += `<text x="${X(.5)}" y="${T + S + 30}" text-anchor="middle" class="nd-label">accidents punished →</text>`;
    out += `<text transform="translate(${L - 30} ${Y(.5)}) rotate(-90)" text-anchor="middle" class="nd-label">attacks punished →</text>`;
    out += `<text x="${L - 6}" y="${Y(1) + 4}" text-anchor="end" class="nd-tick">1</text><text x="${L - 6}" y="${Y(0) + 4}" text-anchor="end" class="nd-tick">0</text><text x="${X(1)}" y="${T + S + 14}" text-anchor="middle" class="nd-tick">1</text>`;
    return out;
  }

  function conclusion(s) {
    const {a} = s;
    if (a.clarity === 0) {
      return a.hit === 1
        ? `With attribution gone, the evidence says nothing. This defender retaliates against every incident: all attacks are punished, and so is every accident, ${num(a.accidentsPerAttack, 1)} of them for each attack.`
        : `With attribution gone, the evidence says nothing. This defender never reaches its threshold and never retaliates. No threat, however large, deters an attacker who knows it.`;
    }
    if (s.delegation === 0) return `With a human deciding, the defender punishes ${share(a.hit)} of real attacks and ${share(a.falseAlarm)} of accidents. This is the benchmark the other settings are measured against.`;
    if (s.multiplier <= 1.005) return `At ${pct(s.delegation)} delegation the defender punishes ${share(a.hit)} of real attacks, no fewer than with a human deciding, but it now punishes ${share(a.falseAlarm)} of accidents instead of ${share(s.base.falseAlarm)}.`;
    const mult = s.multiplier === Infinity ? "no finite threat restores the human-decides deterrent" : `the threat must be ${num(s.multiplier, 1)} times larger to deter as before`;
    return `At ${pct(s.delegation)} delegation the defender punishes ${share(a.hit)} of real attacks and ${share(a.falseAlarm)} of accidents; ${mult}. Holding deterrence by retaliating more often would mean punishing ${share(s.hold)} of accidents.`;
  }

  function trilemmaText(selected) {
    const t = M.trilemma(selected);
    if (!t) return {name: "Choose two objectives", body: "Any two of the three can be held together. The third is the price."};
    return {name: t.name, body: `Sacrifices ${t.sacrifices}. ${t.consequence}`};
  }

  function trilemmaSVG(selected) {
    const P = {effectiveness: [150, 30], flexibility: [36, 222], attribution: [264, 222]};
    const names = {effectiveness: "Effectiveness", flexibility: "Flexibility", attribution: "Attribution"};
    const keys = Object.keys(P);
    let out = "";
    for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) {
      const on = selected.includes(keys[i]) && selected.includes(keys[j]);
      out += `<line x1="${P[keys[i]][0]}" y1="${P[keys[i]][1]}" x2="${P[keys[j]][0]}" y2="${P[keys[j]][1]}" stroke="${on ? "var(--accent)" : "var(--rule)"}" stroke-width="${on ? 5 : 2}" stroke-linecap="round"/>`;
    }
    for (const k of keys) {
      const on = selected.includes(k), [x, y] = P[k], below = y > 100;
      out += `<circle cx="${x}" cy="${y}" r="13" fill="${on ? "var(--accent)" : "var(--bg)"}" stroke="${on ? "var(--accent)" : "var(--ink-faint)"}" stroke-width="2"/>`;
      out += `<text x="${x}" y="${below ? y + 34 : y - 20}" text-anchor="middle" class="nd-label${on ? "" : " nd-faint"}">${names[k]}</text>`;
    }
    return out;
  }

  const api = {state, evidenceSVG, rocSVG, conclusion, trilemmaText, trilemmaSVG, share, pct};
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }

  const $ = id => document.getElementById(id);
  function update() {
    const delegation = Number($("nd-delegation").value) / 100, prior = Number($("nd-prior").value) / 100, tau = Number($("nd-tau").value) / 100;
    const s = state(delegation, prior, tau);
    document.querySelectorAll("[data-nd]").forEach(b => b.setAttribute("aria-pressed", b.dataset.nd === [delegation * 100, prior * 100, tau * 100].map(Math.round).join(",")));
    $("nd-delegation-out").textContent = pct(delegation) + " · d′ = " + num(s.a.clarity);
    $("nd-prior-out").textContent = pct(prior);
    $("nd-tau-out").textContent = pct(tau);
    $("nd-hit").textContent = share(s.a.hit);
    $("nd-false").textContent = share(s.a.falseAlarm);
    $("nd-mult").textContent = s.multiplier === Infinity ? "∞" : s.multiplier >= 100 ? Math.round(s.multiplier) + "×" : s.multiplier <= 1.005 ? "1×" : num(s.multiplier, 1) + "×";
    $("nd-hold").textContent = share(s.hold);
    $("nd-mobile").textContent = "Attacks punished " + share(s.a.hit) + " · accidents punished " + share(s.a.falseAlarm);
    $("nd-conclusion").textContent = conclusion(s);
    $("nd-evidence").innerHTML = evidenceSVG(s);
    $("nd-roc").innerHTML = rocSVG(s);
    $("nd-evidence").setAttribute("aria-label", `Evidence distributions for accidents and attacks, separated by ${num(s.a.clarity)} noise widths; the retaliation threshold is ${Number.isFinite(s.a.cut) ? "at " + num(s.a.cut) : "off the scale"}.`);
    $("nd-roc").setAttribute("aria-label", `Trade-off curve between accidents punished and attacks punished. The defender's operating point punishes ${share(s.a.hit)} of attacks and ${share(s.a.falseAlarm)} of accidents.`);
  }
  let chosen = ["effectiveness", "flexibility"];
  function trilemmaUpdate() {
    document.querySelectorAll("[data-nd-goal]").forEach(b => b.setAttribute("aria-pressed", chosen.includes(b.dataset.ndGoal)));
    const t = trilemmaText(chosen);
    $("nd-tri-name").textContent = t.name; $("nd-tri-body").textContent = t.body;
    $("nd-triangle").innerHTML = trilemmaSVG(chosen);
    $("nd-triangle").setAttribute("aria-label", "Triangle of objectives; held: " + (chosen.length ? chosen.join(" and ") : "none") + ".");
  }
  if ($("nd-delegation")) {
    ["nd-delegation", "nd-prior", "nd-tau"].forEach(id => $(id).addEventListener("input", update));
    document.querySelectorAll("[data-nd]").forEach(b => b.addEventListener("click", () => {
      const [d, p, t] = b.dataset.nd.split(",");
      $("nd-delegation").value = d; $("nd-prior").value = p; $("nd-tau").value = t; update();
    }));
    update();
  }
  if ($("nd-triangle")) {
    document.querySelectorAll("[data-nd-goal]").forEach(b => b.addEventListener("click", () => {
      const g = b.dataset.ndGoal;
      chosen = chosen.includes(g) ? chosen.filter(x => x !== g) : [...chosen, g].slice(-2);
      trilemmaUpdate();
    }));
    trilemmaUpdate();
  }
})(typeof window !== "undefined" ? window : globalThis);
