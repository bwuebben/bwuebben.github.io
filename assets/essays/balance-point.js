/* Interactive figure for "The balance point of a hexagon". The pure render
   functions also run under node to produce the page's static initial state. */
(function (root) {
  "use strict";
  const M = root.BalanceModel || (typeof require !== "undefined" ? require("./balance-point-model.js") : null);
  const MAX = 10, SQ3 = Math.sqrt(3);
  const euclid = (x1, x2) => [x1, (x1 + 2 * x2) / SQ3];          // lattice → regular hexagon
  const f = (x, d = 3) => +x.toFixed(d);
  const minus = s => String(s).replace(/-/g, "−");
  const pct = x => minus((100 * x).toLocaleString("en-US", {minimumFractionDigits: 1, maximumFractionDigits: 1})) + "%";
  const frac = a => {
    const s = a.q === 1n ? String(a.p) : a.p + "/" + a.q;
    return s.length <= 22 ? minus(s) : minus(M.frac.num(a).toPrecision(3));
  };
  const names = l => l.map(i => M.ROOTS[i].label);
  const wordNumber = k => ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][k] || String(k);

  // The ring: twists placed tip to tail, in angular order.
  function ringSVG(r) {
    let s = "";
    for (let j = 0; j < 6; j++) {
      const t = Math.PI * j / 3;
      s += `<line x1="0" y1="0" x2="${f(84 * Math.cos(t), 1)}" y2="${f(-84 * Math.sin(t), 1)}" class="bp-spoke"/>`;
    }
    const steps = r.list.filter(i => i < 6).sort((x, y) => x - y);
    if (!steps.length) {
      return s + `<circle cx="0" cy="0" r="4" class="bp-start"/>`;
    }
    const pts = [[0, 0]];
    for (const i of steps) {
      const t = Math.PI * M.ROOTS[i].angle / 180, [x, y] = pts[pts.length - 1];
      pts.push([x + Math.cos(t), y + Math.sin(t)]);
    }
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
    const span = Math.max(1, ...pts.map(p => Math.hypot(p[0] - cx, p[1] - cy)));
    const k = Math.min(52, 66 / span);
    const P = p => [f((p[0] - cx) * k, 1), f(-(p[1] - cy) * k, 1)];
    const closed = r.zeroSum;
    if (closed && steps.length > 2) s += `<polygon points="${pts.map(P).map(p => p.join(",")).join(" ")}" class="bp-loop"/>`;
    pts.slice(1).forEach((p, j) => {
      const [x0, y0] = P(pts[j]), [x1, y1] = P(p), a = Math.atan2(y1 - y0, x1 - x0), h = Math.min(7, k * .3);
      s += `<path d="M${x0} ${y0}L${x1} ${y1}M${f(x1 - h * Math.cos(a - .45), 1)} ${f(y1 - h * Math.sin(a - .45), 1)}L${x1} ${y1}L${f(x1 - h * Math.cos(a + .45), 1)} ${f(y1 - h * Math.sin(a + .45), 1)}" class="bp-step"/>`;
    });
    const [sx, sy] = P(pts[0]), [ex, ey] = P(pts[pts.length - 1]);
    if (!closed) s += `<line x1="${ex}" y1="${ey}" x2="${sx}" y2="${sy}" class="bp-gap"/>`;
    return s + `<circle cx="${sx}" cy="${sy}" r="3.5" class="bp-start"/>`;
  }
  function ringLabel(r) {
    const steps = r.list.filter(i => i < 6).length;
    if (!steps) return "No twists yet: the hexagon surface on its own.";
    return r.zeroSum ? `The ${wordNumber(steps)} twists, placed tip to tail, return to their starting point.`
                     : `The ${wordNumber(steps)} twists, placed tip to tail, end away from their starting point; the dashed segment is their sum.`;
  }

  // The moment hexagon shaded by the weight F, with the balance point.
  const FAN = [[[1,0],[0,1]], [[0,1],[-1,1]], [[-1,1],[-1,0]], [[-1,0],[0,-1]], [[0,-1],[1,-1]], [[1,-1],[1,0]]];
  // `shade` replaces the cell shading when the browser can paint a smooth raster.
  function hexSVG(r, m = 8, shade = null) {
    const tris = [];
    for (const [A, B] of FAN) {
      const at = (i, j) => [(i * A[0] + j * B[0]) / m, (i * A[1] + j * B[1]) / m];
      for (let i = 0; i < m; i++) for (let j = 0; j < m - i; j++) {
        tris.push([at(i, j), at(i + 1, j), at(i, j + 1)]);
        if (i + j < m - 1) tris.push([at(i + 1, j), at(i + 1, j + 1), at(i, j + 1)]);
      }
    }
    let s = shade || "";
    if (!shade) {
      const w = tris.map(t => M.weightAt(r.list, (t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][1] + t[1][1] + t[2][1]) / 3));
      const lo = Math.min(...w), hi = Math.max(...w);
      tris.forEach((t, j) => {
        const o = hi - lo < 1e-9 ? .14 : .05 + .55 * (w[j] - lo) / (hi - lo);
        s += `<polygon points="${t.map(p => { const [x, y] = euclid(p[0], p[1]); return f(x) + "," + f(-y); }).join(" ")}" fill-opacity="${f(o, 2)}" class="bp-cell"/>`;
      });
    }
    const verts = [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]].map(p => { const [x, y] = euclid(p[0], p[1]); return f(x) + "," + f(-y); });
    s += `<polygon points="${verts.join(" ")}" class="bp-outline"/>`;
    s += `<path d="M-.12 0H.12M0 -.12V.12" class="bp-cross"/>`;
    const [bx, by] = r.euclid;
    if (r.offset > .03) s += `<line x1="0" y1="0" x2="${f(bx)}" y2="${f(-by)}" class="bp-drift"/>`;
    s += `<circle cx="${f(bx)}" cy="${f(-by)}" r=".05" class="bp-dot"/>`;
    if (r.offset < .03) {
      const mag = r.offset === 0 ? 1000 : [3000, 1000, 300, 100, 30, 10].find(g => r.offset * g <= .17) || 10;
      const lx = .98, ly = -.98, R = .24;
      const dx = Math.max(-.85 * R, Math.min(.85 * R, bx * mag)), dy = Math.max(-.85 * R, Math.min(.85 * R, -by * mag));
      s += `<circle cx="${lx}" cy="${ly}" r="${R}" class="bp-lens"/><path d="M${f(lx - .09)} ${ly}H${f(lx + .09)}M${lx} ${f(ly - .09)}V${f(ly + .09)}" class="bp-cross"/>`;
      s += `<circle cx="${f(lx + dx)}" cy="${f(ly + dy)}" r=".03" class="bp-dot"/>`;
      s += `<text x="${lx}" y="${f(ly + .72 * R)}" class="bp-lens-label">×${mag.toLocaleString("en-US")}</text>`;
    }
    return s;
  }
  function hexLabel(r) {
    return r.kahlerEinstein ? "The weighted hexagon balances exactly at its centre."
      : `The weighted hexagon balances ${r.offset < .01 ? "a hair" : "visibly"} away from its centre.`;
  }

  // Family recognition for the explanatory line.
  function unbalancedFamily(c) {
    for (let a = 0; a < 6; a++) for (const b of [(a + 2) % 6, (a + 4) % 6]) {
      const s = c[(a + 3) % 6];
      if (c[a] === s + 1 && c[b] === 1 && c[6] === 0 && c.reduce((x, y) => x + y, 0) === 2 * s + 2) return true;
    }
    return false;
  }
  function texts(r) {
    const ratio = M.frac.num(r.heaviest.slope) / M.frac.num(r.mu);
    const word = {stable: "Stable", semistable: "Tied", unstable: "Unstable"}[r.status];
    const note = {stable: "every part of the tangent bundle is lighter than the whole",
                  semistable: "a part exactly as heavy as the whole: semistable, not stable",
                  unstable: "a part heavier than the whole"}[r.status];
    let why;
    if (r.k === 0) why = "The hexagon surface on its own: its moment polygon is symmetric, so it balances at the centre.";
    else if (r.hasZero) why = "An untwisted line splits off with exactly the slope of the whole, so the tangent bundle cannot be stable.";
    else if (r.zeroSum) why = "The twists sum to zero, so the zero-sum theorem gives stability. " +
      (r.negation && r.rotation ? "The multiset is symmetric under negation and under the 120° rotation." :
       r.negation ? "The multiset is symmetric under negation, which pins the balance point to the centre." :
       r.rotation ? "The multiset is symmetric under the 120° rotation, which pins the balance point to the centre." :
       "Neither symmetry holds, and the balance point misses the centre.");
    else why = (unbalancedFamily(r.counts) ? "This is the paper’s unbalanced family: stable, with no Einstein metric. " : "The twists do not sum to zero, so the zero-sum theorem is silent. ") +
      "The page evaluates the slope criterion exactly.";
    const ke = r.kahlerEinstein ? "Yes" : "No";
    const keNote = r.kahlerEinstein ? "Kähler–Einstein metric: the balance point is the centre" : "Kähler–Einstein metric: the balance point is off centre";
    const twistText = r.k === 0 ? "No twists" : (r.k === 1 ? "One twist" : wordNumber(r.k).replace(/^./, x => x.toUpperCase()) + " twists") + " (" + names(r.list).join(", ") + ")";
    const conclusion = `${twistText}: a smooth toric Fano ${r.n}-fold of Picard number ${r.picard}, with (−K)${sup(r.n)} = ${r.anticanonical.p.toLocaleString("en-US")}. ` +
      `Its heaviest part has ${pct(ratio)} of the whole’s slope, so the tangent bundle is ${r.status === "semistable" ? "semistable but not stable" : r.status}. ` +
      `The balance point is ${r.kahlerEinstein ? "exactly the centre, so the variety is Kähler–Einstein" : "(" + frac(r.barycentre[0]) + ", " + frac(r.barycentre[1]) + ") in lattice coordinates, so there is no Kähler–Einstein metric"}.`;
    const mobile = `n = ${r.n} · ${word.toLowerCase()} · ${r.kahlerEinstein ? "Einstein" : "no Einstein metric"}`;
    return {ratio, word, note, why, ke, keNote, conclusion, mobile, dims: `n = ${r.n} · Picard number ${r.picard}`};
  }
  const SUP = {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"};
  function sup(n) { return String(n).split("").map(d => SUP[d]).join(""); }
  function bars(ratio) {
    const top = Math.max(1, ratio), base = .6, w = x => Math.max(0, (x - base) / (top - base) * 100);
    return {whole: f(w(1), 2), part: f(w(ratio), 2)};
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {ringSVG, ringLabel, hexSVG, hexLabel, texts, bars};
    return;
  }
  const $ = id => document.getElementById(id);
  if (!$("bp-hex") || !M) return;
  let list = [0, 2, 4];
  const KEYS = Object.fromEntries(M.ROOTS.map((x, i) => [x.key, i]));
  // Paint the weight F pixel by pixel, in the accent colour, with the same opacity scale as the cells.
  function raster(r) {
    const hex = getComputedStyle($("bp-hex")).getPropertyValue("--accent").trim().match(/^#([0-9a-f]{6})$/i);
    const canvas = document.createElement("canvas"), N = 240, R = 2 / SQ3;
    if (!hex || !canvas.getContext) return null;
    const rgb = [0, 2, 4].map(k => parseInt(hex[1].slice(k, k + 2), 16));
    canvas.width = canvas.height = N;
    const ctx = canvas.getContext("2d"), img = ctx.createImageData(N, N), w = new Float64Array(N * N).fill(NaN);
    let lo = Infinity, hi = -Infinity;
    for (let py = 0; py < N; py++) for (let px = 0; px < N; px++) {
      const X = -R + 2 * R * (px + .5) / N, Y = R - 2 * R * (py + .5) / N, x1 = X, x2 = (SQ3 * Y - X) / 2;
      if (Math.abs(x1) > 1 || Math.abs(x2) > 1 || Math.abs(x1 + x2) > 1) continue;
      const v = M.weightAt(r.list, x1, x2); w[py * N + px] = v; lo = Math.min(lo, v); hi = Math.max(hi, v);
    }
    for (let i = 0; i < N * N; i++) {
      if (Number.isNaN(w[i])) continue;
      const o = hi - lo < 1e-9 ? .14 : .05 + .55 * (w[i] - lo) / (hi - lo);
      img.data.set([rgb[0], rgb[1], rgb[2], Math.round(255 * o)], 4 * i);
    }
    ctx.putImageData(img, 0, 0);
    return `<image href="${canvas.toDataURL()}" x="${f(-R, 4)}" y="${f(-R, 4)}" width="${f(2 * R, 4)}" height="${f(2 * R, 4)}" preserveAspectRatio="none"/>`;
  }
  function update() {
    const r = M.analyse(list), t = texts(r);
    $("bp-ring-svg").innerHTML = ringSVG(r); $("bp-ring-svg").setAttribute("aria-label", ringLabel(r));
    $("bp-hex").innerHTML = hexSVG(r, 8, raster(r)); $("bp-hex").setAttribute("aria-label", hexLabel(r));
    $("bp-stability").textContent = t.word; $("bp-stability-note").textContent = t.note;
    $("bp-ke").textContent = t.ke; $("bp-ke-note").textContent = t.keNote;
    $("bp-dims").textContent = t.dims; $("bp-why").textContent = t.why;
    $("bp-conclusion").textContent = t.conclusion; $("bp-mobile").textContent = t.mobile;
    const b = bars(t.ratio);
    $("bp-whole-bar").style.width = b.whole + "%"; $("bp-part-bar").style.width = b.part + "%";
    $("bp-part-out").textContent = pct(t.ratio);
    $("bp-part-bar").classList.toggle("gold", r.status !== "stable");
    document.querySelectorAll("[data-bp-root]").forEach(btn => {
      const i = KEYS[btn.dataset.bpRoot], c = r.counts[i];
      btn.querySelector(".bp-count").textContent = c ? "×" + c : "";
      btn.disabled = list.length >= MAX;
      btn.setAttribute("aria-label", "Add a line twisted by " + M.ROOTS[i].label + (c ? ", now " + c : ""));
    });
    const chips = $("bp-chips"); chips.replaceChildren();
    r.counts.forEach((c, i) => {
      if (!c) return;
      const chip = document.createElement("button");
      chip.type = "button"; chip.className = "bp-chip";
      chip.textContent = M.ROOTS[i].label + (c > 1 ? " ×" + c : "") + " −";
      chip.setAttribute("aria-label", "Remove one " + M.ROOTS[i].label);
      chip.addEventListener("click", () => { list.splice(list.lastIndexOf(i), 1); update(); });
      chips.append(chip);
    });
    if (!list.length) { const p = document.createElement("span"); p.className = "small"; p.textContent = "No twists: the hexagon surface alone."; chips.append(p); }
    $("bp-undo").disabled = !list.length; $("bp-clear").disabled = !list.length;
    const key = list.slice().sort((x, y) => x - y).join(",");
    document.querySelectorAll("[data-bp]").forEach(btn => {
      const preset = btn.dataset.bp ? btn.dataset.bp.split(",").map(k => KEYS[k]).sort((x, y) => x - y).join(",") : "";
      btn.setAttribute("aria-pressed", String(preset === key));
    });
  }
  document.querySelectorAll("[data-bp-root]").forEach(btn => btn.addEventListener("click", () => {
    if (list.length < MAX) { list.push(KEYS[btn.dataset.bpRoot]); update(); }
  }));
  document.querySelectorAll("[data-bp]").forEach(btn => btn.addEventListener("click", () => {
    list = btn.dataset.bp ? btn.dataset.bp.split(",").map(k => KEYS[k]) : []; update();
  }));
  $("bp-undo").addEventListener("click", () => { list.pop(); update(); });
  $("bp-clear").addEventListener("click", () => { list = []; update(); });
  if (root.matchMedia) root.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", update);
  update();
})(typeof window !== "undefined" ? window : globalThis);
