# When Walls Collide

A static companion to the three open FJRW papers. Open `index.html` through the
site's local HTTP server. The entire computation runs in the browser.

## Four experiments

1. Follow the two controlled local paths for the quartic two-label example.
   Chronological crossings act on a sparse polynomial in
   `Q[x,y,t1,t2]/(t1^2,t2^2)`. Reverse travel applies inverse crossings starting
   at the selected path's own endpoint.
2. Vary the mixed coefficient in exact quarter-steps. The two path operators
   agree precisely at `c=-3/4`. Their images of both ring generators are
   compared, rather than only their values on one potential.
3. Follow the specified annular core-loop class `gamma_C gamma_A^-1` in the
   source's exponent frame. The matrix is `[[-1,2],[-10,19]]`. The surface and
   cut-open view are topological schematics; no affine connection is numerically
   interpolated. The frame changes only when a circuit finishes. Singular
   points retain their relative source placement, and the drawn core separates
   `{Atilde,B0}` from `{B1,Ctilde}`.
4. Compare `V(8,4)` with `V(0,12)`. Their relevant period classes coincide.
   The external normal form repairs the full potential. Its intrinsic
   boundary construction remains open; the control does not construct it.

The companion threshold grid distinguishes primary wall crossing from
descendent wall crossing. Statements use the Fermat theories and symmetric
canonical boundary conditions of the threshold paper.

## Source map and bounds

The source is the released
[open-fjrw-scattering repository](https://github.com/bwuebben/open-fjrw-scattering/tree/754425f).

- Paper 1: central-charge threshold and minimum insertion counts.
- Paper 2: finite-truncation, slope-ordered boundary factorization. Boundary
  rays have direction `(k1+1,k2+1)`; they are not automatically affine supports.
- Paper 3, Sections 2–7: annular cover and exponent holonomy, quartic wall
  placement, two-label discrepancy, period class, and external normal form.
- Paper 3's `src/check_two_label_endpoint.py`: independent symbolic oracle
  for `reference.json`. The fixture records the script's SHA-256 and pinned
  source URL. Its 30 cases cover six coefficients and five distinct inputs,
  including higher monomials and all coefficient-label sectors.

The local diagram uses support normals `(3,4)`, `(3,2)`, `(1,1)` and horizontal
levels `+/-1/10`. Endpoints are shortened to `(+/-1/4,0)`; the vertical
connectors cross no support. Axes share one scale. The model is the stated
two-label truncation, not an arbitrary or all-order scattering solver.

`model.js` uses reduced rational `BigInt` coefficients. Only visual positions
and animation timing use floating point. `period` and `normalize` operate on
the endpoint family `V(a,b)`, not arbitrary intermediate potentials.

## Verification

```sh
node tools/check-when-walls-collide.cjs
node --check when-walls-collide/app.js
```

To regenerate the fixture with Python and SymPy, pass the pinned public source:

```sh
python3 tools/export-collision-reference.py /path/to/check_two_label_endpoint.py
```

The exporter verifies the source checksum and runs its 196 symbolic checks
before generating the oracle.

The checker compares the independent source fixtures, verifies inverse paths,
multiplicativity and the Lie bracket on monomials in every label sector, checks
crossing positions and before/after states, and tests the period, normal form,
integer holonomy and threshold grid. These checks validate this implementation;
they are not a referee review of the source papers.

All controls have native keyboard alternatives. Animation respects reduced
motion; crossing steps, endpoint travel, surface views and exact results remain
available without animation. No external library, API, or runtime request is
required for the mathematics.
