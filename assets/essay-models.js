/* Illustrative models, not fitted to empirical data. */
(function (root) {
  "use strict";
  function evidence(n, rho) {
    if (!Number.isFinite(n) || n < 1 || !Number.isFinite(rho) || rho < 0 || rho > 1) throw new RangeError("Invalid evidence inputs");
    const inflation = 1 + (n - 1) * rho;
    return {effective: n / inflation, naiveError: 1 / Math.sqrt(n), actualError: Math.sqrt(inflation / n), precisionOverstatement: Math.sqrt(inflation)};
  }
  function deployment(chips, gridMW, coolingMW, utilization, watts = 700, pue = 1.25) {
    if (![chips, gridMW, coolingMW, watts, pue].every(x => Number.isFinite(x) && x > 0) || pue < 1 || !Number.isFinite(utilization) || utilization < 0 || utilization > 1) throw new RangeError("Invalid deployment inputs");
    const limits = {chips, power: gridMW * 1e6 / pue / watts, cooling: coolingMW * 1e6 / watts};
    const operating = Math.min(...Object.values(limits));
    const binding = Object.keys(limits).filter(k => Math.abs(limits[k] - operating) < 1e-7);
    return {limits, operating, binding, usefulHours: operating * 24 * utilization, stranded: chips - operating, facilityMW: operating * watts * pue / 1e6};
  }
  const models = {evidence, deployment};
  if (typeof module !== "undefined" && module.exports) module.exports = models;
  else root.ResearchModels = models;
})(typeof window !== "undefined" ? window : globalThis);
