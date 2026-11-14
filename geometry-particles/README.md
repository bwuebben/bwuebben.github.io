# When Geometry Makes Particles Light

Three linked experiments in leading masses, scalar scattering and exact
contact/exchange cancellation. Buildless; no runtime dependencies or requests.

## Mathematical source map

Source: the released Stability & Degeneration Paper 21, *Light vectors and scalar
interactions near heterotic K3 gauge enhancement*, with foundations in Papers 4
and 15. Public sources: <https://github.com/bwuebben/stability-degeneration>.

- Introduction `eq:intro-masses`: masses divided by sqrt(8/(3 V0 L²)) are
  b, a, sqrt(a²+b²). Bar lengths use a fixed scale; the triangle rescales by a.
- `sections/06_scattering.tex`, `eq:modelamplitude`: divide by e² and measure
  energies/masses in M=sqrt(8/(3 V0 L²))*a. Thus μ=b/a and x=E/M. With scattering
  angle θ use s=x², t=-s(1-cos θ)/2, u=-s(1+cos θ)/2.
- `eq:amplitudedomain`, `thm:amplitude`: choose κ0=.4, θH=.5, δ=.15.
  These obey κ0²<θH<1. Enforce all three channel margins, not only s. The
  plotted amplitude is null outside this domain; curve paths break at exclusions.
  No numerical asymptotic starting threshold or error constant is supplied.
- `eq:contactcancellation`: factor out a channel's coupling/vertex product and
  plot -1 + 1/(1-x) = x/(1-x), with x=q²/m²≤0. This exact scalar-channel example
  is separate from the leading vector amplitude in the second experiment.

The comparison is with the complete leading Yang–Mills amplitude, not an exact
finite-string-scale amplitude. The K3 remains smooth and its polarization fixed.
Only bundle deformation amplitudes change. The positive-parameter controls do
not assert an extension of the theorem to a=b=0.

## Validation

`node tools/check-scale-explorers.cjs` checks the mass relation and homogeneity,
an independently calculated rational amplitude, its low-energy limit,
Mandelstam identity, invalid domains and the cancellation. Browser QA checks
all controls, invalid regions, theme/phone layouts, keyboard operation and
shared navigation. No passing finite check is a review of the source proofs.
