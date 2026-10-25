/* Norton's dome in units where the equation of motion is r'' = √r. Exact Newtonian model, drawn as SVG strings. */
(function (root) {
  "use strict";
  // The shape constant g is free: the surface falls h = (2/3g) r^{3/2} below the apex, r measured along the surface.
  const G = 3;
  const LEAVE = 0.6 * G * G;          // the normal force vanishes here and the mass becomes airborne
  const T_MAX = 12;                   // window shown in the figures
  const TRAVEL = Math.pow(144 * LEAVE, 0.25); // time from departure to LEAVE

  function check(T) {
    if (T !== null && !Number.isFinite(T)) throw new RangeError("T must be a number or null");
  }
  // T === null is the history in which the mass never leaves the apex.
  function position(t, T) { check(T); return T === null || t <= T ? 0 : Math.pow(t - T, 4) / 144; }
  function velocity(t, T) { check(T); return T === null || t <= T ? 0 : Math.pow(t - T, 3) / 36; }
  function acceleration(t, T) { check(T); return T === null || t <= T ? 0 : Math.pow(t - T, 2) / 12; }
  function depth(r) { return 2 / (3 * G) * Math.pow(r, 1.5); }
  function sinSlope(r) { return Math.sqrt(r) / G; }
  function cosSlope(r) { return Math.sqrt(1 - r / (G * G)); }
  // Distance from the axis: dx/dr = cos θ.
  function radius(r) { return 2 * G * G / 3 * (1 - Math.pow(1 - r / (G * G), 1.5)); }
  function meridianCurvature(r) { return 1 / (2 * G * Math.sqrt(r) * cosSlope(r)); }
  function gaussianCurvature(r) { return meridianCurvature(r) * sinSlope(r) / radius(r); }
  // Normal force per unit mass for a history that leaves the apex from rest (v² = 4/3 r^{3/2}).
  function normalForce(r) { return G * cosSlope(r) - 4 / 3 * Math.pow(r, 1.5) * meridianCurvature(r); }

  function state(t, T) {
    const free = position(t, T), airborne = free > LEAVE, r = Math.min(free, LEAVE);
    const tt = airborne ? T + TRAVEL : t;
    return {r, airborne, v: velocity(tt, T), a: acceleration(tt, T), sqrtR: Math.sqrt(r)};
  }

  const f = (x, d = 1) => x.toFixed(d);

  function domeSVG(T, phi, t) {
    const s = state(t, T), sc = 36, cx = 220, top = 34, rDraw = 6.6;
    const X = x => cx + x * sc, Y = h => top + h * sc;
    let profile = "";
    for (let i = -60; i <= 60; i++) {
      const r = rDraw * Math.abs(i) / 60;
      profile += (i === -60 ? "M" : " L") + f(X(Math.sign(i) * radius(r)), 2) + "," + f(Y(depth(r)), 2);
    }
    const ground = Y(depth(rDraw)) + 14;
    let out = `<path d="${profile} L${f(X(radius(rDraw)), 2)},${f(ground, 2)} L${f(X(-radius(rDraw)), 2)},${f(ground, 2)} Z" fill="var(--accent)" fill-opacity=".06" stroke="none"/>`;
    out += `<path d="${profile}" fill="none" stroke="var(--ink-soft)" stroke-width="1.6"/>`;
    out += `<path d="M${X(-radius(rDraw)) - 20},${f(ground, 2)} H${X(radius(rDraw)) + 20}" stroke="var(--rule)" stroke-width="1.5"/>`;
    for (const side of [-1, 1]) {
      const x = X(side * radius(LEAVE)), y = Y(depth(LEAVE));
      out += `<path d="M${f(x, 2)},${f(y - 7, 2)} v14" stroke="var(--gold)" stroke-width="1.5"/>`;
    }
    const c = Math.cos(phi * Math.PI / 180);
    if (s.r > 0) {
      let trail = "";
      for (let i = 0; i <= 40; i++) {
        const r = s.r * i / 40;
        trail += (i ? " L" : "M") + f(X(radius(r) * c), 2) + "," + f(Y(depth(r)), 2);
      }
      out += `<path d="${trail}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 4"/>`;
    }
    const nx = sinSlope(s.r) * c, ny = -cosSlope(s.r), rb = 7;
    const bx = X(radius(s.r) * c) + nx * rb, by = Y(depth(s.r)) + ny * rb;
    out += `<circle cx="${f(bx, 2)}" cy="${f(by, 2)}" r="${rb}" fill="var(--accent)"/>`;
    return out;
  }

  function topSVG(T, phi, t) {
    const s = state(t, T), cx = 80, cy = 80, R = 64, sc = R / radius(LEAVE), a = phi * Math.PI / 180;
    let out = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="var(--accent)" fill-opacity=".05" stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="3 4"/>`;
    for (let k = 1; k <= 3; k++) out += `<circle cx="${cx}" cy="${cy}" r="${f(sc * radius(LEAVE * k / 4), 2)}" fill="none" stroke="var(--rule)"/>`;
    const ex = cx + R * Math.cos(a), ey = cy - R * Math.sin(a);
    out += `<path d="M${cx},${cy} L${f(ex, 2)},${f(ey, 2)}" stroke="var(--accent)" stroke-width="1.2" opacity="${T === null ? .25 : .7}"/>`;
    out += `<circle cx="${cx}" cy="${cy}" r="2.5" fill="var(--ink-soft)"/>`;
    const d = sc * radius(s.r);
    out += `<circle cx="${f(cx + d * Math.cos(a), 2)}" cy="${f(cy - d * Math.sin(a), 2)}" r="6" fill="var(--accent)"/>`;
    return out;
  }

  function chartSVG(T, t) {
    const x0 = 44, x1 = 424, y0 = 196, y1 = 18;
    const X = u => x0 + (x1 - x0) * u / T_MAX, Y = r => y0 - (y0 - y1) * r / (1.12 * LEAVE);
    const curve = Tk => {
      let d = `M${f(X(0), 2)},${f(Y(0), 2)} L${f(X(Tk), 2)},${f(Y(0), 2)}`;
      const end = Math.min(T_MAX, Tk + TRAVEL);
      for (let i = 1; i <= 48; i++) {
        const u = Tk + (end - Tk) * i / 48;
        d += ` L${f(X(u), 2)},${f(Y(position(u, Tk)), 2)}`;
      }
      return d;
    };
    let out = `<path d="M${x0},${y1} V${y0} H${x1}" fill="none" stroke="var(--rule)" stroke-width="1.2"/>`;
    out += `<path d="M${x0},${f(Y(LEAVE), 2)} H${x1}" stroke="var(--gold)" stroke-width="1" stroke-dasharray="3 4"/>`;
    for (let u = 0; u <= T_MAX; u += 2) out += `<text class="tf-axis" x="${f(X(u), 2)}" y="${y0 + 16}" text-anchor="middle">${u}</text>`;
    out += `<text class="tf-axis" x="${x1}" y="${y0 + 32}" text-anchor="end">time t</text>`;
    out += `<text class="tf-axis" x="${x0 - 8}" y="${y1 + 4}" text-anchor="end">r</text>`;
    out += `<text class="tf-axis" x="${x0 - 8}" y="${y0 + 4}" text-anchor="end">0</text>`;
    out += `<text class="tf-axis" x="${x0 - 8}" y="${f(Y(LEAVE) + 4, 2)}" text-anchor="end">${f(LEAVE)}</text>`;
    for (let k = 0; k <= 8; k++) out += `<path d="${curve(k)}" fill="none" stroke="var(--ink-faint)" stroke-width="1" opacity=".45"/>`;
    if (T === null) out += `<path d="M${x0},${y0} H${x1}" stroke="var(--green)" stroke-width="3.5"/>`;
    else out += `<path d="${curve(T)}" fill="none" stroke="var(--accent)" stroke-width="2.6"/>`;
    const s = state(t, T);
    out += `<path d="M${f(X(t), 2)},${y1} V${y0}" stroke="var(--ink-soft)" stroke-width="1" stroke-dasharray="2 3"/>`;
    out += `<circle cx="${f(X(s.airborne ? T + TRAVEL : t), 2)}" cy="${f(Y(s.r), 2)}" r="5" fill="${T === null ? "var(--green)" : "var(--accent)"}"/>`;
    return out;
  }

  const models = {G, LEAVE, T_MAX, TRAVEL, position, velocity, acceleration, depth, radius, sinSlope, cosSlope,
    meridianCurvature, gaussianCurvature, normalForce, state, domeSVG, topSVG, chartSVG};
  if (typeof module !== "undefined" && module.exports) module.exports = models;
  else root.TwoFailures = models;
})(typeof window !== "undefined" ? window : globalThis);
