(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const M = window.TwoFailures;
  const fmt = (n, d = 2) => n.toLocaleString("en-US", {minimumFractionDigits: d, maximumFractionDigits: d});
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Experiment 01: Norton's dome.
  const NEVER = 17;
  const departure = () => Number($("tf-T").value) === NEVER ? null : Number($("tf-T").value) / 2;
  let frame = null;
  function domeUpdate() {
    const T = departure(), phi = Number($("tf-dir").value), t = Number($("tf-time").value), s = M.state(t, T);
    $("tf-T-out").textContent = T === null ? "never" : "T = " + fmt(T, 1);
    $("tf-dir-out").textContent = phi + "°";
    $("tf-time-out").textContent = "t = " + fmt(t, 1);
    $("tf-dome").innerHTML = M.domeSVG(T, phi, t);
    $("tf-top").innerHTML = M.topSVG(T, phi, t);
    $("tf-chart").innerHTML = M.chartSVG(T, t);
    $("tf-r").textContent = fmt(s.r);
    $("tf-a").textContent = fmt(s.a, 3);
    $("tf-a-note").textContent = s.airborne ? "acceleration along the surface at the moment of departure; √r there is " + fmt(s.sqrtR, 3)
      : "acceleration along the surface at time t; √r(t) = " + fmt(s.sqrtR, 3) + ", as Newton requires";
    $("tf-mobile").textContent = (T === null ? "Never leaves" : "Leaves at T = " + fmt(T, 1) + " toward " + phi + "°") + " · r(" + fmt(t, 1) + ") = " + fmt(s.r);
    const key = (T === null ? "never" : String(T)) + "," + phi;
    document.querySelectorAll("[data-tf]").forEach(b => b.setAttribute("aria-pressed", b.dataset.tf.split(",").slice(0, 2).join(",") === key));
    let text = "Every history starts the same way: at the apex, at rest, at t = 0. ";
    if (T === null) text += "This one never leaves. It satisfies Newton’s law as well as any other.";
    else if (t <= T) text += "This one waits until T = " + fmt(T, 1) + " and will then leave toward " + phi + "°. At t = " + fmt(t, 1) + " it has not yet moved, and nothing in the present distinguishes it from the history that never moves.";
    else if (s.airborne) text += "This one left at T = " + fmt(T, 1) + " toward " + phi + "°. By t = " + fmt(t, 1) + " it has reached r = " + fmt(M.LEAVE, 1) + ", where the dome can no longer hold it; the model stops there.";
    else text += "This one left at T = " + fmt(T, 1) + " toward " + phi + "°. At t = " + fmt(t, 1) + " it is " + fmt(s.r) + " from the apex, accelerating at exactly √r. Newton’s law holds at every instant.";
    $("tf-conclusion").textContent = text;
    $("tf-dome").setAttribute("aria-label", "Side view of the dome. The mass is " + fmt(s.r) + " units from the apex along the surface.");
    $("tf-chart").setAttribute("aria-label", "Distance from the apex against time for departures at T = 0 to 8; the selected history " + (T === null ? "stays at zero." : "leaves at T = " + fmt(T, 1) + "."));
  }
  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = null;
    $("tf-play").textContent = "Play";
    $("tf-play").setAttribute("aria-pressed", "false");
  }
  function play() {
    if (frame) return stop();
    const slider = $("tf-time"), max = Number(slider.max);
    if (reduced) { slider.value = max; return domeUpdate(); }
    if (Number(slider.value) >= max) slider.value = 0;
    const start = performance.now(), from = Number(slider.value), speed = max / 6000;
    $("tf-play").textContent = "Pause";
    $("tf-play").setAttribute("aria-pressed", "true");
    const step = now => {
      const t = Math.min(max, from + (now - start) * speed);
      slider.value = t.toFixed(1);
      domeUpdate();
      if (t < max) frame = requestAnimationFrame(step); else stop();
    };
    frame = requestAnimationFrame(step);
  }
  if ($("tf-T") && M) {
    ["tf-T", "tf-dir", "tf-time"].forEach(id => $(id).addEventListener("input", () => { if (id !== "tf-time" || frame) stop(); domeUpdate(); }));
    document.querySelectorAll("[data-tf]").forEach(b => b.addEventListener("click", () => {
      stop();
      const [T, phi, t] = b.dataset.tf.split(",");
      $("tf-T").value = T === "never" ? NEVER : Number(T) * 2;
      $("tf-dir").value = phi; $("tf-time").value = t;
      domeUpdate();
    }));
    $("tf-random").addEventListener("click", () => {
      stop();
      $("tf-T").value = Math.floor(Math.random() * (NEVER + 1));
      $("tf-dir").value = 5 * Math.floor(Math.random() * 72);
      $("tf-time").value = 12;
      domeUpdate();
    });
    $("tf-play").addEventListener("click", play);
    domeUpdate();
  }

  // Experiment 02: the grid of descriptions.
  const cells = {
    ordinary: "Smooth geometry and unitary evolution. Run the dynamics backwards and every input returns, correlations included. Most of physics lives in this cell, which is why the other three are easy to forget.",
    radiation: "Far from the hole the curvature is negligible. If evaporation is complete and the radiation is the entire final output, Hawking’s calculation takes a pure input to a mixed output, and no recovery channel exists. The failure is not a defect of the distant region; it is a property of the map from collapse to radiation. The decohering qubit belongs here only as a description: its environment keeps the information, the joint evolution is reversible, and smooth geometry does not make a subsystem channel reversible.",
    island: "Replica-wormhole calculations make the radiation’s entropy turn over as Page described, and separate calculations reconstruct interior operators on a specified code with stated errors. Neither supplies an account of the high-curvature end of the interior. This is evidence for the informational clauses, not a proof of them, and the ensemble question is open. The toy: delete everything after t = 0 from flat spacetime. Observers’ histories end in finite time, yet a spectator system evolves unitarily between any two earlier times. Incompleteness alone does not spoil every evolution problem.",
    both: "On Norton’s dome the surface’s curvature diverges at the apex, and the apex is the only place where uniqueness fails; a dome with finite curvature there keeps the mass at rest forever. The dome’s geometry is that of a surface in ordinary space, not of spacetime. Hawking’s semiclassical description of evaporation also carries both failures: the classical interior ends at a curvature singularity, and the radiation loses the map."
  };
  let mode = "hawking", chosen = "both";
  function gridUpdate() {
    const home = mode === "hawking" ? "both" : "island";
    document.querySelectorAll("[data-tf-cell]").forEach(b => {
      b.setAttribute("aria-pressed", b.dataset.tfCell === chosen);
      b.classList.toggle("tf-home", b.dataset.tfCell === home);
    });
    document.querySelectorAll("[data-tf-mode]").forEach(b => b.setAttribute("aria-pressed", b.dataset.tfMode === mode));
    $("tf-cell-text").textContent = cells[chosen];
    $("tf-grid-conclusion").textContent = mode === "hawking"
      ? "In Hawking’s calculation the evaporating black hole carries both failures: a singular interior and a lost map."
      : "With islands and replica wormholes the same process changes cells: the informational question advances, while the interior is left where it was. The black hole did not change. The calculation did.";
  }
  if ($("tf-grid")) {
    document.querySelectorAll("[data-tf-cell]").forEach(b => b.addEventListener("click", () => { chosen = b.dataset.tfCell; gridUpdate(); }));
    document.querySelectorAll("[data-tf-mode]").forEach(b => b.addEventListener("click", () => {
      mode = b.dataset.tfMode; chosen = mode === "hawking" ? "both" : "island"; gridUpdate();
    }));
    gridUpdate();
  }
})();
