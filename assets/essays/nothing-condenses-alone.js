(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  if (!$("ncal-diagram") || !window.CondenseModel) return;
  const M = window.CondenseModel;
  const state = {preset: "pair", selected: [0, 1], mode: "compact"};
  const preset = () => M.presets.find(p => p.id === state.preset);
  const names = list => list.length < 2 ? list.join("") : list.slice(0, -1).join(", ") + " and " + list[list.length - 1];
  const signed = n => (n > 0 ? "+" : "−") + Math.abs(n);

  function renderSectors() {
    const p = preset(), box = $("ncal-sectors");
    box.replaceChildren();
    p.labels.forEach((label, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-pressed", state.selected.includes(i));
      b.innerHTML = label + ' <span>(' + p.charges[i].join(", ") + ")</span>";
      b.setAttribute("aria-label", "Condense " + label + ", charge (" + p.charges[i].join(", ") + ")");
      b.addEventListener("click", () => {
        state.selected = state.selected.includes(i) ? state.selected.filter(x => x !== i) : [...state.selected, i].sort();
        update();
      });
      box.append(b);
    });
  }

  function update() {
    const p = preset(), L = p.labels;
    const r = M.analyse(p.charges, state.selected);
    document.querySelectorAll("[data-ncal-preset]").forEach(b => b.setAttribute("aria-pressed", b.dataset.ncalPreset === state.preset));
    document.querySelectorAll("[data-ncal-mode]").forEach(b => b.setAttribute("aria-pressed", b.dataset.ncalMode === state.mode));
    $("ncal-sectors").querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-pressed", state.selected.includes(i)));
    $("ncal-diagram").innerHTML = M.diagram(p, state.selected, state.mode);
    const sel = r.selected.map(i => L[i]), moving = r.condensing.map(i => L[i]), held = r.blocked.map(i => L[i]);
    let type, typeNote, hodge, hodgeNote, relation, text, mobile;
    if (!sel.length) {
      type = "—"; typeNote = "select a sector to condense"; hodge = "—"; hodgeNote = "nothing has moved";
      relation = "Nothing selected."; text = "Select one or more sectors to condense."; mobile = "Nothing selected";
    } else if (state.mode === "decoupled") {
      type = "free"; typeNote = "each local model deforms on its own";
      hodge = "—"; hodgeNote = "no compact threefold, so no Hodge numbers";
      relation = "Shared vectors decoupled: no relation is required.";
      text = "With gravity decoupled the shared vectors are no longer dynamical, and each charge is a global flavour charge. " +
        names(sel) + (sel.length > 1 ? " each deform on their own." : " deforms on its own.");
      mobile = "Gravity decoupled · every sector free";
    } else if (!moving.length) {
      type = "none"; typeNote = "no relation, so no Higgs branch";
      hodge = "—"; hodgeNote = "the selected points stay singular";
      relation = "No relation among the selected charges.";
      text = (sel.length > 1 ? "None of " + names(sel) + " can condense: their charges admit no relation, " :
        sel[0] + " cannot condense alone: its charge is not zero, ") + "and the shared vectors would see an unbalanced charge.";
      mobile = "No relation · nothing condenses";
    } else {
      relation = "Relation: " + M.formatRelation(r.relation, L);
      if (r.m) { type = "ℂ²/ℤ" + M.subscript(r.m); typeNote = "transverse type of the Higgs branch, m = Σ|aᵢ| = " + r.m; }
      else { type = r.relations + " rel."; typeNote = "quaternionic dimension " + r.relations + "; the single-relation theorem does not apply"; }
      if (p.hodge && r.allowed && moving.length === L.length) {
        hodge = "(" + (p.hodge[0] + r.dh11) + ", " + (p.hodge[1] + r.dh21) + ")";
        hodgeNote = "(h¹¹, h²¹) after the transition, from (" + p.hodge.join(", ") + ")";
      } else {
        hodge = signed(r.dh11) + " / " + signed(r.dh21);
        hodgeNote = "change in (h¹¹, h²¹): vectors lost, neutral hypermultiplets gained";
      }
      text = names(moving) + " condense together along " + M.formatRelation(r.relation, L) + ". ";
      text += r.m ? "The Higgs branch is locally ℂ²/ℤ" + M.subscript(r.m) + ". " : "There are " + r.relations + " independent relations, so the Higgs branch has quaternionic dimension " + r.relations + ". ";
      if (held.length) text += names(held) + (held.length > 1 ? " stay" : " stays") + " singular: no relation among the selected charges involves " + (held.length > 1 ? "them." : "it.");
      else if (p.hodge && moving.length === L.length) text += "This is the transition (6, 122) → (3, 123).";
      if (!r.saturated) text += " The charges span an unsaturated lattice, so a discrete gauge group survives.";
      mobile = (r.m ? "ℂ²/ℤ" + M.subscript(r.m) : r.relations + " relations") + (held.length ? " · " + names(held) + " held" : " · all move");
    }
    $("ncal-type").textContent = type; $("ncal-type-note").textContent = typeNote;
    $("ncal-hodge").textContent = hodge; $("ncal-hodge-note").textContent = hodgeNote;
    $("ncal-relation").textContent = relation; $("ncal-conclusion").textContent = text; $("ncal-mobile").textContent = mobile;
    $("ncal-diagram").setAttribute("aria-label", text);
  }

  document.querySelectorAll("[data-ncal-preset]").forEach(b => b.addEventListener("click", () => {
    state.preset = b.dataset.ncalPreset;
    state.selected = preset().charges.map((_, i) => i);
    renderSectors(); update();
  }));
  document.querySelectorAll("[data-ncal-mode]").forEach(b => b.addEventListener("click", () => {
    state.mode = b.dataset.ncalMode; update();
  }));
  renderSectors(); update();
})();
