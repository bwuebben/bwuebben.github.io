(function (root) {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI;
  const mod = (x, n = TAU) => ((x % n) + n) % n;
  function canonical(gamma, theta) {
    let g = mod(gamma), t = mod(theta);
    if (g > PI) { g = TAU - g; t = mod(-t); }
    if (Math.abs(g) < 1e-10) g = 0;
    if (Math.abs(g - PI) < 1e-10) g = PI;
    if (Math.abs(t) < 1e-10 || Math.abs(t - TAU) < 1e-10) t = 0;
    if ((g === 0 || g === PI) && t > PI) t = TAU - t;
    if (Math.abs(t - PI) < 1e-10) t = PI;
    return { gamma: g, theta: t, face: t <= PI ? 0 : 1, y: t <= PI ? t : TAU - t };
  }
  function l0(beta, epsilon) {
    return { gamma: beta + PI / 2 + epsilon * Math.sin(beta), theta: beta + PI / 2 - epsilon * Math.sin(beta) };
  }
  function l1(t) { return { gamma: t, theta: -2 * t }; }
  function intersections(epsilon) {
    if (epsilon <= 0) return [];
    const result = [];
    for (let n = 1; n <= 3; n++) {
      let lo = 0, hi = TAU;
      for (let k = 0; k < 55; k++) {
        const mid = (lo + hi) / 2;
        if (3 * mid + 3 * PI / 2 + epsilon * Math.sin(mid) < TAU * n) lo = mid;
        else hi = mid;
      }
      const beta = (lo + hi) / 2, lift = l0(beta, epsilon), point = canonical(lift.gamma, lift.theta);
      result.push({ id: n === 3 ? 'r' : 'x' + n, label: n === 3 ? 'r' : 'x' + n,
        beta, ...point, t: point.gamma,
        residual: Math.abs(Math.sin((point.theta + 2 * point.gamma) / 2)),
        transverse: 3 + epsilon * Math.cos(beta) });
    }
    return result.sort((a, b) => a.id === 'r' ? -1 : b.id === 'r' ? 1 : a.id.localeCompare(b.id));
  }
  function quaternionMultiply(a, b) {
    const [w,x,y,z] = a, [v,r,s,t] = b;
    return [w*v-x*r-y*s-z*t, w*r+x*v+y*t-z*s, w*s-x*t+y*v+z*r, w*t+x*s-y*r+z*v];
  }
  function holonomies(gamma, theta) {
    const q = a => [0, Math.cos(a), Math.sin(a), 0];
    const a = q(0), b = q(gamma), c = q(theta), d = q(theta-gamma);
    const ba = quaternionMultiply(b,a), cd = quaternionMultiply(c,d);
    return { a,b,c,d, error: Math.max(...ba.map((v,i)=>Math.abs(v-cd[i]))) };
  }
  function segmentedPath(fn, start, end, samples, face, ox, oy, size) {
    let path = '', previous = null;
    for (let i = 0; i <= samples; i++) {
      const v = fn(start + (end-start)*i/samples), c = canonical(v.gamma,v.theta);
      if (c.face !== face) { previous = null; continue; }
      const x = ox + c.gamma/PI*size, y = oy+size-c.y/PI*size;
      const jump = previous && Math.hypot(x-previous.x,y-previous.y) > size/6;
      path += (previous && !jump ? 'L' : 'M') + x.toFixed(2) + ',' + y.toFixed(2);
      previous = {x,y};
    }
    return path;
  }
  const api = {PI,TAU,mod,canonical,l0,l1,intersections,holonomies,quaternionMultiply,segmentedPath};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PillowcaseModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
