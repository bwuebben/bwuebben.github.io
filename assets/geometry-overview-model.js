(function (root) {
  "use strict";
  function periods(a, b) {
    if (![a, b].every(x => Number.isFinite(x) && x > 0)) throw new RangeError("Periods must be finite and positive.");
    return { a, b, area: a + b, volumeA: a * a / 2, volumeB: b * b / 2, lengthA: Math.sqrt(a), lengthB: Math.sqrt(b) };
  }
  const presets = { balanced: [.5, .5], first: [.003, .5], second: [.5, .003], both: [.01, .01] };
  const api = { periods, presets };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.GeometryPeriods = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
