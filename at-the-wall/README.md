# At the Wall

Four linked experiments in stability, small spectra, metric response, and
Hermitian Yang–Mills flow. Open `/at-the-wall/` through the local server described
in the site README. The explorer uses no runtime libraries or network requests.

## Files

- `index.html`: explanations, controls, accessible range inputs, and paper links.
- `model.js`: finite graph operators, eigensolver, chamber and path parameters,
  tree/cycle balancing, and the signed two-factor profile. Also exports CommonJS
  for the mathematical checks.
- `app.js`: SVG rendering, pointer and keyboard-equivalent controls, and optional
  mode animation. Plots use a different coordinate layout on narrow screens.
- `style.css`: styles scoped to `.wall-app`, using the shared light/dark theme.
- `../tools/check-at-the-wall.cjs`: independent identities and closed spectra.

## Mathematical source map

The source is the released [stability-degeneration trilogy](https://github.com/bwuebben/stability-degeneration).
Statement labels below refer to those LaTeX sources.

| Experiment | Source | Computation and boundary |
| --- | --- | --- |
| The chamber | V, `thm01:synthesis`, `eq01:sign`, `eq01:leading`, `eq01:familyspectrum`, and `eq01:metricweights`; IV's geometric realization | Unit masses; positive margins `x=σ(p,1−p)`, `y=σ(q,1−q)`; leading weights `kij=xi*yj/σ`. Exact finite spectrum and its reciprocals. The geometric statements have relative `O(σ)` error, with no numerical error constant supplied here. |
| Three scales | III, `eq07:threeorders` and `eq07:actualthreeorders` | Substitute `ε=t²`. Leading eigenvalues `(4/3)t⁶`, `(3/2)t⁴`, `2t²`. The solid curves are computed graph eigenvalues; dashed curves are asymptotic terms. |
| Tree and cycle | III, `eq06:tree` and `eq06:cycle` | A finite illustration of the general balancing equations with demands `ρ(2,1,−1,−2)`. The cycle has weights `ρ(a,2−a,1−a,a)` and `a²/((2−a)(1−a))=θ`; the tree has weights `ρ(1,1,0,1)`. This unequal-demand example is derived directly from those equations, not asserted to be the fixed tangent bundle. |
| Across the wall | V, `eq05:profile` and `thm05:joint` | Exact evaluations of `Pδ(τ)=δ/(1−exp(−2δτ))`, continuously extended by `1/(2τ)` at zero. Not a numerical PDE integration. |

The three stationary response values are singular values in the specified
norms, not the response to each drawn graph eigenvector. On a semistable
boundary the finite limiting graph remains visible, but the stationary
Hermitian–Einstein response is suppressed. The constant scalar graph mode is
removed throughout. At repeated eigenvalues, a displayed basis is one choice
inside the eigenspace. The graph is not the full Yang–Mills Hessian.

The reference symmetry of the tangent example fixes its leading harmonic
cycle ratio. The freely varying ratio in the third experiment belongs to a
separate general extension model. The signed profile is a two-factor result;
it is not used as a general many-factor flow law.

## Validation and integration

```sh
node tools/check-at-the-wall.cjs
node --check at-the-wall/model.js
node --check at-the-wall/app.js
python3 tools/update-site.py --check
python3 tools/update-papers.py --check
python3 tools/check-editorial.py
git diff --check
```

The model checks include graph eigenvector residuals and orthogonality, trace
and spanning-tree product identities, cut bounds, exact disconnected nullity,
closed square/path spectra, scale homogeneity, the three asymptotic powers,
fixed row and column demands, cycle ratios, and the signed profile's differential
equation and continuous wall limit. They test the finite implementation, not
the proofs of the source theorems.

Browser checks should cover all presets, direct dragging, keyboard range inputs,
all modes, path-to-chamber transfer at both extremes, fixed tree data under cycle
changes, both signs and zero for the profile, animation pause, reduced-motion
preferences, mobile overflow, and light/dark themes. Check graph labels and plot
axes visually, including at phone widths.

The shared navigation entry lives in `site.json`; the gallery and guide link
are built by `tools/build-editorial.py`. The guide's programme link lives in
`content/geometry-stability-degeneration.html`. `tools/update-site.py` versions
the three local assets. `tools/integrate-site.py` includes the new route in the
sitemap. Follow the complete rebuild sequence in the site README after editing
those integration sources.
