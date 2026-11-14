/* Dimensionless leading models from the heterotic K3 enhancement example. */
(function (root) {
  'use strict';
  function masses(a, ratio) { const b = a * ratio; return [b, a, Math.hypot(a, b)]; }
  function kinematics(E, cosine) {
    const s = E * E;
    return {s, t: -s * (1 - cosine) / 2, u: -s * (1 + cosine) / 2};
  }
  // E and m are measured in M = sqrt(8/(3 V0 L^2)) a.
  function domain(ratio, E, cosine, delta = 0.15, thetaH = 0.5) {
    const {s, t, u} = kinematics(E, cosine), m2 = ratio * ratio;
    const hierarchy = ratio > 0 && ratio <= 0.4;
    const heavy = s <= thetaH + 1e-12;
    const pole = [s, t, u].every(q => Math.abs(m2 - q) >= delta * (m2 + s));
    return {valid: hierarchy && heavy && pole, hierarchy, heavy, pole};
  }
  function amplitude(ratio, E, cosine) {
    if (!domain(ratio, E, cosine).valid) return null;
    const {s, t, u} = kinematics(E, cosine), m2 = ratio * ratio;
    return (t - u) / (m2 - s) + (t - s) / (m2 - u);
  }
  function effectiveAmplitude(ratio, E, cosine) {
    const {s, t, u} = kinematics(E, cosine);
    return (2 * t - u - s) / (ratio * ratio);
  }
  // q^2/m^2 = x <= 0: a spacelike channel, with vertex product factored out.
  function cancellation(x) { return {contact: -1, exchange: 1 / (1 - x), sum: x / (1 - x)}; }
  const api = {masses, kinematics, domain, amplitude, effectiveAmplitude, cancellation};
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ParticleModel = api;
})(typeof window === 'object' ? window : globalThis);
