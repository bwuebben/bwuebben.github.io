/* Exact normalized charge-one profiles; the time law is a late-time model. */
(function (root) {
  'use strict';
  const radius = tau => 1 / Math.sqrt(tau);
  const inclusion = R => R * R / (1 + R * R);
  const energy = R => { const x = R * R; return x * x * (x + 3) / (1 + x) ** 3; };
  const density = R => (1 + R * R) ** -4;
  const radialEnergy = R => 12 * R ** 3 / (1 + R * R) ** 4;
  const api = {radius, inclusion, energy, density, radialEnergy};
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MicroscopeModel = api;
})(typeof window === 'object' ? window : globalThis);
