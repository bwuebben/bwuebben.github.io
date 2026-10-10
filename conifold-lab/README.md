# Conifold Lab

A dependency-free visual laboratory for conifold transitions, with local surgery, compact topology bookkeeping, and example relation lattices from Bernd Johannes Wuebben's September 25, 2026 manuscript.

## Visual modes

- Local surgery: orbit the Hopf-fibre S³ picture, collapse it to a node, and open an exceptional P¹ core. Compare the real equation slice and both small-resolution incidence maps.
- Topology ledger: play the global surgery movie, pause or scrub it, and jump between exceptional curves, nodes and vanishing spheres. The two endpoint Hodge pairs stay exact; the animation does not interpolate topological invariants.
- Relation lattice: trace the X₉ belt, watch a schematic chain extrusion, then follow moving T² fibre markers and the mirror boundary. X₁₉ and X₂₀ show coefficient support, including the forced-zero coordinates. Pause, scrub and select lift tabs; invalid or zero combinations disable the lift movie. Clicking or focusing a node pauses playback so it remains inspectable.

## Integration

The page at `/conifold-lab/` uses this website's shared navigation, fonts, and light/dark theme from `../assets/`. Its page title is *Calabi–Yau Geometry at the Threshold*. The explorer styles are scoped to `.conifold-app`, and the canvas and SVG palette comes from the shared theme. The diagram colors refresh when the preferred color scheme changes.

From the repository root, run `python3 -m http.server 8000 --bind 127.0.0.1` and visit <http://127.0.0.1:8000/conifold-lab/>. After editing the page or explorer assets, run `python3 tools/update-site.py` and `python3 tools/update-site.py --check`. This refreshes navigation, theme metadata, and asset versions. There are no external runtime dependencies, remote fonts, analytics, or server-side calls.

Do not copy `.openai/hosting.json` into your existing website: it is Sites deployment configuration. For an existing React or other component application, isolate the explorer in an iframe to keep its global document listeners and styles separate. The equations and lattice routines are also available independently as `ConifoldModel` from model.js.

## Mathematical scope

The S³ drawing samples Hopf fibres in the actual unit S³ and stereographically projects them to R³. The real equation slice is u²+v²−w²=μ, obtained by setting z=(u,v,iw,0). The exceptional P¹ is drawn as its real S² core. The transition slider joins two different parameters: complex smoothing μ on the left and normalized Kähler area on the right. No full compact Calabi–Yau embedding, Ricci-flat metric, or smoothing-existence solver is computed.

The topology ledger illustrates an existing compact projective conifold transition. N nodes, k independent exceptional-curve classes and c=N−k independent same-side vanishing-sphere classes give Δh¹¹=−k, Δh²¹=c, Δb₃=2c, Δχ=−2N. The sandbox displays formulas, without asserting arbitrary numerical choices are geometrically realized.

The relation tab transcribes X₉, X₁₉ and X₂₀ from §11.1, §11.2 and Table 1 in Wuebben's manuscript. X₉ is checked against its four circuit vectors. X₁₉ and X₂₀ are generated from the given bases. The manuscript's cross-mirror relation identification is distinct from the complementary relation spaces in a single conifold transition. Lifting diagrams are schematic and illustrate the stated results under their hypotheses; this application does not independently establish those results.

## Validation

Run `node tests/validate.cjs`. The validation harness uses the actual app listeners and renderer with a minimal DOM and a native offline canvas. In this environment, the native canvas and SVG rasterizer are installed in the Codex primary runtime. Mathematical assertions cover ranks, full support, forced zeros, circuit residuals, local quadric identities, Hopf fibre identities and topology formulas. Interaction assertions cover all modes, sliders, phase/ruling controls, playback, camera, node selection and dialogs.

Browser layout, native pointer capture and browser rendering were not tested in the managed Sites environment. Offline canvas and SVG frames were inspected. Reduced motion substitutes static threshold, smoothing and mirror-lift actions for the three movies; phase, stage and lift buttons remain available. Leaving a mode stops its animation.

## Primary references

- Smith–Thomas–Yau, [Symplectic conifold transitions](https://arxiv.org/abs/math/0209319).
- Rossi, [Geometric transitions](https://arxiv.org/abs/math/0412514).
- Castaño-Bernard–Matessi, [Conifold transitions via affine geometry and mirror symmetry](https://arxiv.org/abs/1301.2930).
- Lee–Lin–Wang, [Towards A+B theory in conifold transitions](https://arxiv.org/abs/1502.03277).
