# The Singularity Microscope

Three experiments: concentration and rescaling; cumulative bubble energy and
inclusion height; ideal connections and metric completion. No runtime libraries
or network requests. Shared styles live in `../assets/scale-explorers.css`.

## Sources and interpretation

The released Stability & Degeneration sources are available at
<https://github.com/bwuebben/stability-degeneration>.

- Paper 32, `sections/01_introduction.tex`, `thm:main`,
  `eq:intro-mass`, `eq:intro-local-metric`: radius proportional to T^(-1/2),
  normalized inclusion R²/(1+R²), cumulative energy R⁴(R²+3)/(1+R²)³.
  The image uses the corresponding peak-normalized density (1+R²)^(-4),
  with logarithmic colour mapping. It is a two-dimensional cross-section.
  The shell measure in real dimension four yields 12R³/(1+R²)^4.
- Paper 33, `abstract.tex` and its compactification theorem: the separate
  primitive, generically polarized Ricci-flat K3 setting. The boundary diagram
  is schematic, not a solution, distance calculation or prescribed flow path.
- Paper 10 supplies the earlier singular-graded growth obstruction.

The first clock is T/T0 for an unspecified sufficiently late reference time.
Leading laws are evaluated as exact illustrative formulas; this does not
specify actual finite-time errors. The limiting unit bubble charge is not a
claim that total flow energy is constant. Sharp reduced/distinct-factor scope
and the separate conditional ADHM metric boundary are explained on the page.

## Validation

Run `node tools/check-scale-explorers.cjs` from the site root. It independently
integrates the four-dimensional shell energy, checks half-height/half-energy
agreement and scaling. Browser coverage includes every control, linked views,
play/pause, reduced motion, keyboard ranges, phone layouts and both themes.
Site navigation, asset versioning, gallery and sitemap use the standard site
generators. These checks validate the exhibit, not the manuscript proofs.
