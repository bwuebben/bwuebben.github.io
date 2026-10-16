# Beyond HRP Portfolio Lab

The integrated page is available at `/beyond-hrp-lab/`, titled *Give the hierarchy
an expected return*. It is linked under Explorers → Beyond HRP and from the paper's
entry on the papers page. It is an interactive companion to
[*Beyond De Prado and Cotton: Hierarchical and Iterative Methods for General
Mean-Variance Portfolios*](https://arxiv.org/abs/2604.23833) (arXiv:2604.23833), with
[replication code](https://github.com/bwuebben/beyond_hrp_and_cotton).

## Local preview

From the repository root, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit <http://127.0.0.1:8000/beyond-hrp-lab/>. Refresh after edits.
Publishing remains a separate commit and push after local review.

## Files and editing

- `index.html`: integrated page, including the shared site markers and metadata.
- `site.css`: explorer layout and theme, scoped to `.portfolio-app`.
- `math.js`: allocation recursions, CRISP sweeps, and the noise experiment (`PortfolioMath`).
- `app.js`: controls, SVG charts, solver animation, and CSV export.
- `standalone.html` and `style.css`: the original portable page, with its own
  design. Copy them with `math.js` and `app.js` to any static host, or open
  `standalone.html` locally. It is marked `noindex`.

The integrated page also needs the parent `assets/` directory. It uses the site's
fonts and warm neutral theme in light and dark mode. Chart colors in `app.js` are
written as `var(--chart-…, #original)`: `site.css` sets the variables, and the
standalone page falls back to the original colors. HRP is the neutral grey
baseline, HRP-μ ochre, HRP-Σμ blue, and CRISP the site's burgundy accent. These
colors were checked for colorblind separation of neighbouring bars in both modes.
Charts are drawn at their on-screen width, up to 740 units, so labels keep their
size on phones; they redraw when the layout width changes. The lab ends with the
shared “From picture to paper” section; update it if the
paper's title or links change.

Edit navigation in `../site.json`. Run `python3 tools/update-site.py` from the
repository root after changes. This refreshes navigation and versions both shared
and explorer assets by content hash. `python3 tools/update-site.py --check` checks
consistency. There is no build step and no runtime dependency. Everything runs in
the browser, with no analytics, uploads, or market data feeds.

## Functionality

- Live forecasts and correlation controls
- HRP, HRP-μ, HRP-Σμ, and converged CRISP comparisons
- An inspectable fixed allocation tree
- CRISP sweep animation and measured residuals
- A small seeded synthetic estimation-noise experiment
- Download of current weights as CSV

## Interpretation and verification

The lab uses eight illustrative assets, a fixed balanced tree, and positive gross
normalization. It permits long and short positions. It is educational, not a
historical backtest. The noise experiment is separate from the paper's replication
results. The allocation routines and CRISP updates were checked against the
author's Python implementation (`study.py` in the replication repository).
