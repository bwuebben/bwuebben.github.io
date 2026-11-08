(() => {
  "use strict";
  const lab = document.getElementById("geometry-cycle-lab");
  if (!lab || !window.GeometryPeriods) return;
  const a = document.getElementById("geometry-period-a");
  const b = document.getElementById("geometry-period-b");
  const buttons = [...lab.querySelectorAll("[data-cycle-preset]")];
  const format = n => n.toFixed(3);
  const set = (id, value) => { document.getElementById(id).textContent = value; };
  function render(preset) {
    const m = window.GeometryPeriods.periods(10 ** Number(a.value), 10 ** Number(b.value));
    set("geometry-period-a-value", format(m.a)); set("geometry-period-b-value", format(m.b));
    a.setAttribute("aria-valuetext", format(m.a)); b.setAttribute("aria-valuetext", format(m.b));
    set("geometry-area-zero", format(m.a)); set("geometry-area-two", format(m.b)); set("geometry-area-sum", format(m.area));
    document.getElementById("geometry-plane-zero").setAttribute("transform", `translate(280 190) scale(${m.lengthA})`);
    document.getElementById("geometry-plane-two").setAttribute("transform", `translate(280 190) scale(${m.lengthB})`);
    const direction = m.a < m.b / 5 ? "The first plane has the smaller period and length scale." : m.b < m.a / 5 ? "The second plane has the smaller period and length scale." : "The two periods are on comparable scales.";
    set("geometry-cycle-message", `${direction} The integral attachment remains modulo eight.`);
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.cyclePreset === preset)));
  }
  [a, b].forEach(input => input.addEventListener("input", () => render(null)));
  buttons.forEach(button => button.addEventListener("click", () => {
    const values = window.GeometryPeriods.presets[button.dataset.cyclePreset];
    a.value = Math.log10(values[0]); b.value = Math.log10(values[1]); render(button.dataset.cyclePreset);
  }));
  render("balanced");
})();
