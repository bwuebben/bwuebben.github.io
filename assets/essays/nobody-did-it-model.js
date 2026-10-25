/* Illustrative signal-detection model of attribution under delegation. Not fitted to data. */
(function (root) {
  "use strict";
  // Complementary error function, fractional error below 1.2e-7 (Numerical Recipes, erfcc).
  function erfc(x) {
    const z = Math.abs(x), t = 1 / (1 + z / 2);
    const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 +
      t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
      t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  }
  const Phi = x => x === Infinity ? 1 : x === -Infinity ? 0 : erfc(-x / Math.SQRT2) / 2;
  const phi = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  // Inverse normal distribution function (Acklam), relative error below 1.2e-9.
  function PhiInv(p) {
    if (!(p > 0 && p < 1)) return p === 0 ? -Infinity : p === 1 ? Infinity : NaN;
    const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.3577518672690, -30.66479806614716, 2.506628277459239];
    const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    const lo = 0.02425;
    let q, r;
    if (p < lo) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    if (p > 1 - lo) {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    q = p - 0.5; r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  const BASE_CLARITY = 3;
  // The illustrative mapping from delegation to attribution clarity d′.
  function clarity(delegation, base = BASE_CLARITY) {
    if (!(delegation >= 0 && delegation <= 1)) throw new RangeError("Delegation must lie in [0, 1]");
    return base * (1 - delegation);
  }
  function check(prior, tau) {
    if (!(prior > 0 && prior < 1) || !(tau > 0 && tau < 1)) throw new RangeError("Prior and threshold must lie in (0, 1)");
  }
  // Posterior probability that an incident was intended, given the evidence s.
  function posterior(s, d, prior) {
    check(prior, .5);
    const intended = prior * phi(s - d), emergent = (1 - prior) * phi(s);
    return intended / (intended + emergent);
  }
  // Retaliate when P(intended | s) ≥ τ; for d′ > 0 that is s ≥ d′/2 + ln[τ(1 − π)/((1 − τ)π)]/d′.
  function attribution(delegation, prior, tau, base = BASE_CLARITY) {
    check(prior, tau);
    const d = clarity(delegation, base);
    const k = Math.log(tau * (1 - prior) / ((1 - tau) * prior));
    let cut, hit, falseAlarm;
    if (d > 1e-9) {
      cut = d / 2 + k / d; hit = Phi(d - cut); falseAlarm = Phi(-cut);
    } else {
      // Without evidence the posterior is the prior: retaliate always or never.
      const always = prior >= tau;
      cut = always ? -Infinity : Infinity; hit = always ? 1 : 0; falseAlarm = hit;
    }
    const punished = prior * hit + (1 - prior) * falseAlarm;
    return {
      clarity: d, cut, hit, falseAlarm,
      precision: punished > 0 ? prior * hit / punished : null,
      accidentsPerAttack: hit > 0 ? (1 - prior) * falseAlarm / (prior * hit) : null,
      auc: Phi(d / Math.SQRT2)
    };
  }
  // Receiver operating characteristic: the hit rate reachable at a given false-alarm rate.
  function roc(d, falseAlarm) {
    if (falseAlarm <= 0) return 0;
    if (falseAlarm >= 1) return 1;
    return Phi(d + PhiInv(falseAlarm));
  }
  // Factor by which the threatened punishment must grow to keep an attacker's expected punishment fixed.
  function threatMultiplier(delegation, prior, tau, base = BASE_CLARITY) {
    const now = attribution(delegation, prior, tau, base).hit, then = attribution(0, prior, tau, base).hit;
    return now > 0 ? then / now : Infinity;
  }
  // The Accountability Trilemma, after Table 1 of the paper.
  const TRILEMMA = {
    "effectiveness,flexibility": {name: "Speed-optimized", sacrifices: "attribution", consequence: "Deterrence erodes: signals become noisy and punishment less credible."},
    "attribution,effectiveness": {name: "Commitment device", sacrifices: "flexibility", consequence: "Crisis instability: pre-committed rules leave no way to back down."},
    "attribution,flexibility": {name: "Human-centric", sacrifices: "effectiveness", consequence: "Operational vulnerability in domains that move at machine speed."}
  };
  function trilemma(selected) {
    const key = [...new Set(selected)].sort().join(",");
    if (selected.length > 2) throw new RangeError("At most two objectives can be held at once");
    return TRILEMMA[key] || null;
  }
  const models = {Phi, PhiInv, phi, clarity, posterior, attribution, roc, threatMultiplier, trilemma, BASE_CLARITY};
  if (typeof module !== "undefined" && module.exports) module.exports = models;
  else root.AttributionModel = models;
})(typeof window !== "undefined" ? window : globalThis);
