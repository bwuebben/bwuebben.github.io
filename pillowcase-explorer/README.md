# Pillowcase Explorer

The integrated page is available at `/pillowcase-explorer/`. It uses the existing
site navigation, fonts, and light/dark theme, with a wider diagram workspace.
It is linked from every site's page and beside the instanton-knot papers.

## Local preview

From the repository root, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit <http://127.0.0.1:8000/pillowcase-explorer/>. Refresh after edits.
Publishing remains a separate commit and push after local review.

## Files and editing

- `index.html`: integrated page, including the shared site markers and metadata.
- `styles.css`: explorer layout, scoped to `.pillowcase-app`.
- `site.css`: integration with the parent site's fonts and light/dark colors.
- `model.js`: quotient coordinates, quaternion holonomies, curves, and intersections.
- `app.js`: SVG diagrams, controls, definitions, and the five-step journey.
- `standalone.html`: the original portable export, with its own CSS and JavaScript.

The integrated page also needs the parent `assets/` directory. Edit navigation
in `../site.json`; run `python3 tools/update-site.py` from the repository root
after changes. This refreshes navigation and versions both shared and explorer
assets by content hash. `python3 tools/update-site.py --check` checks consistency.

There is no build step, npm dependency, backend, API key, or external runtime
JavaScript/CSS dependency. Diagrams are SVG. The Sources dialog contains external
reference links; the explorer otherwise works offline. JavaScript is required
for its diagrams and controls.

The standalone file remains a snapshot of the original export. It does not
include the site's navigation or theme, and it is not updated by the site helper.

## Mathematical model

The trefoil example uses the Hedden–Herald–Kirk coordinate convention ba = cd,
the rational-tangle arc L1(t) = (t, -2t), and the earring-marked, perturbed
trivial-tangle immersed circle L0(beta) = (beta + pi/2 + epsilon sin beta,
beta + pi/2 - epsilon sin beta). Displayed intersections are calculated by
solving the scalar matching equation, with branches retained.

The bigon demonstration is a separately labelled local schematic, not a
differential calculation for an arbitrary knot. Matching generators does not
establish a general chain-level Atiyah–Floer equivalence. Primary references
and explicit formulas are inside the Sources dialog.
