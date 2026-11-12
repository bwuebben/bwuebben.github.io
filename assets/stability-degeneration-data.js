window.ATLAS_DATA = {
  "asOf": "12 November 2026",
  "papers": [
    {
      "id": 1,
      "title": "Uniform Hermitian–Einstein spectra for bipartite two-step extensions",
      "short": "The spectral mechanism",
      "branch": "foundations",
      "rank": 14,
      "rationale": "The original graph-cut mechanism gives relative control of every small eigenvalue even when positive scales separate arbitrarily. Its determinant formula and distinction between trees and cycles retain independent value after the generalizations.",
      "scope": "Two-step extensions with distinct stable factors on a fixed compact Kähler manifold.",
      "role": "Original foundation",
      "status": "Public preprint",
      "pdf": "/papers/uniform-hermitian-einstein-spectra/paper.pdf",
      "sha256": "5e9b2f3b806b6f72184cfaabb447f52c60dfc051dcef70baaa1b9241511bd3b4",
      "slug": "uniform-hermitian-einstein-spectra",
      "page": "/papers/uniform-hermitian-einstein-spectra/",
      "doi": "10.5281/zenodo.23717660",
      "publicationDate": "2026-10-27",
      "revisionDate": "2026-10-27",
      "explanation": {
        "question": "How can one predict every weak spectral direction as a stable bundle approaches several stability walls at once?",
        "idea": "Replace the bundle's stable factors by vertices of a weighted graph, and its nonzero extension classes by edges joining those factors. The graph Laplacian measures how easily the factors can move relative to one another, while curvature identities across every graph cut control the error at each small scale.",
        "result": "For a fixed two-step extension with pairwise nonisomorphic stable factors on a compact Kähler manifold, every small positive endomorphism eigenvalue is approximated with relative accuracy by this finite graph spectrum in the stable chamber. The estimate allows arbitrarily different rates of approach to the walls, leaves a uniform gap above the small modes, and gives a spanning-tree formula for the leading vanishing determinant factor.",
        "significance": "This supplies the series' original mechanism for controlling very different small scales without losing the weakest ones.",
        "limits": "The theorem concerns two-step extensions with connected extension graph and equal reference slopes. For a tree, ranks and slopes determine the leading spectrum; for a graph with cycles, the extension data can still matter.",
        "prerequisite": "Some familiarity with vector bundles and eigenvalues helps; the finite comparison itself can be understood through weighted graph Laplacians."
      }
    },
    {
      "id": 2,
      "title": "Nonsimplicial local stability chambers of toric tangent bundles",
      "short": "Realizing the chambers",
      "branch": "foundations",
      "rank": 20,
      "rationale": "This supplies genuine projective geometry for nonsimplicial stability chambers, together with a general toric normal form and a minimality result. It is a distinctive realization theorem, not merely an illustrative example for the analytic papers.",
      "scope": "Toric tangent bundles; the explicit higher-dimensional varieties are weak Fano, not Fano.",
      "role": "Geometric realization",
      "status": "Public preprint",
      "pdf": "/papers/nonsimplicial-toric-stability-chambers/paper.pdf",
      "sha256": "957f9e3efced4948a7fba0f00086e0bc581fe548529daacdac3b78a04079826e",
      "slug": "nonsimplicial-toric-stability-chambers",
      "page": "/papers/nonsimplicial-toric-stability-chambers/",
      "doi": "10.5281/zenodo.23774770",
      "publicationDate": "2026-10-27",
      "revisionDate": "2026-10-29",
      "explanation": {
        "question": "Can complicated stability chambers be realized by the tangent bundles of actual smooth projective varieties?",
        "idea": "For a toric variety, the symmetries turn the relevant subsheaf slope inequalities into a finite combinatorial problem. A family built from projective-line bundles realizes a complete bipartite pattern of equal-slope factors, producing chamber cones whose generating rays are not independent.",
        "result": "In every even dimension at least four, the construction gives a smooth projective weak Fano variety with a nonsimplicial local semistability cone and nearby stable polarizations. A general local normal form also describes the slope directions that polarizations actually realize and locates all nearby Harder–Narasimhan filtrations in the equal-slope subsheaf lattice.",
        "significance": "It shows that the chamber configurations motivating the analytic theory occur in genuine algebraic geometry.",
        "limits": "The explicit higher-dimensional varieties are weak Fano, not Fano. The general normal form retains only the realizable slope directions; realizing every centered direction requires an additional positive-spanning condition.",
        "prerequisite": "The main picture uses cones and slope inequalities; the construction requires basic toric geometry and the notion of bundle stability."
      }
    },
    {
      "id": 3,
      "title": "Metric response and Hermitian Yang–Mills flow for two-step extensions",
      "short": "Metric response & flow",
      "branch": "dynamics",
      "rank": 17,
      "rationale": "The first integrated bridge from wall combinatorics to metric sensitivity and actual HYM trajectories on the same bundles. Later local theory is broader, but the inverse spectral response and explicit across-wall profile remain substantial.",
      "scope": "Two-step extensions; the full response statement requires centered slopes to supply local parameters.",
      "role": "First synthesis",
      "status": "Public preprint",
      "pdf": "/papers/metric-response-hym-flow/paper.pdf",
      "sha256": "37187c86fb61ef0af2c7055b39440df8a6cdb16263c18c9ee06c59934468d010",
      "slug": "metric-response-hym-flow",
      "page": "/papers/metric-response-hym-flow/",
      "doi": "10.5281/zenodo.23717742",
      "publicationDate": "2026-10-27",
      "revisionDate": "2026-10-27",
      "explanation": {
        "question": "How sensitive is a canonical bundle metric to a change in stability, and how does its evolution change when a wall is crossed?",
        "idea": "The small graph eigenvalues describe weak restoring directions, so their reciprocals govern the largest responses of the Hermitian–Einstein metric to a change in slope. An invariant finite-dimensional family of metrics then translates the same extension data into a reduced model of Hermitian–Yang–Mills flow.",
        "result": "For the specified two-step extensions, the metric-response singular values agree relatively with inverse graph eigenvalues when centered slopes provide full local parameters. The actual flow admits a uniform late-time comparison with the finite dynamics in stable, semistable and unstable regimes, and the two-factor case has an explicit profile through the wall.",
        "significance": "It connects chamber combinatorics, spectral sensitivity and actual metric evolution on the same bundles.",
        "limits": "The response theorem requires all centered slope directions to be realized locally. The flow comparison chooses a late time for a prescribed tolerance before shrinking the parameter neighborhood; it is not an unrestricted estimate for arbitrary bundles at all initial times.",
        "prerequisite": "Read Paper 1 for the graph model; basic differential equations give the intuition for relaxation rates and sensitivity."
      }
    },
    {
      "id": 4,
      "title": "Uniform Hermitian–Einstein spectra with repeated stable factors",
      "short": "Repeated-factor spectra",
      "branch": "foundations",
      "rank": 23,
      "rationale": "It replaces the scalar graph picture with the full noncommutative multiplicity algebra, while preserving relative estimates at every small scale. This is a necessary conceptual step toward arbitrary stabilizers, although Paper 15 gives the wider framework.",
      "scope": "Fixed multiplicities in two-step extensions; distinct isomorphism types in the two layers.",
      "role": "Noncommutative extension",
      "status": "Public preprint",
      "pdf": "/papers/repeated-factor-he-spectra/paper.pdf",
      "sha256": "a54528e6aaad77be9ee7bcca8e09b55d9f0bcf444d53ffb52028851d4573a43d",
      "slug": "repeated-factor-he-spectra",
      "page": "/papers/repeated-factor-he-spectra/",
      "doi": "10.5281/zenodo.23780241",
      "publicationDate": "2026-10-29",
      "revisionDate": null,
      "explanation": {
        "question": "What replaces the scalar graph spectrum when several copies of the same stable factor occur?",
        "idea": "Repeated factors can mix by matrices, so assigning a single scalar to each factor no longer captures every weak direction. The finite model becomes a commutator Laplacian on the full matrix algebra of multiplicities, and projection-wise energy estimates control its smallest eigenvalues.",
        "result": "For simple two-step extensions with arbitrary fixed multiplicities and distinct factor types in the two layers, every small positive eigenvalue has a uniform relative approximation by the independently balanced matrix model. No lower bound on ratios of positive eigenvalues is needed, and a rank-five example displays six small modes with arbitrarily separated scales.",
        "significance": "It introduces the noncommuting matrix structure needed to study repeated factors and larger automorphism groups.",
        "limits": "The setting remains two-step, with fixed multiplicities and different isomorphism types in the two layers. Paper 15 later treats the broader local deformation problem.",
        "prerequisite": "Paper 1 explains the scalar case; matrix commutators and orthogonal projections explain the new feature."
      }
    },
    {
      "id": 5,
      "title": "Hermitian–Einstein metrics and small spectra for three-step extensions",
      "short": "Three-step extensions",
      "branch": "foundations",
      "rank": 32,
      "rationale": "This proves the method survives composable extensions and the correction needed for integrability, with a concrete spectral scale invisible to polarization parameters. Its selected three-step class makes it a focused precursor to the full-obstruction theory.",
      "scope": "Distinct line factors and constrained quadratic coexact compositions; not arbitrary filtrations.",
      "role": "Focused precursor",
      "status": "Public preprint",
      "pdf": "/papers/three-step-he-metrics/paper.pdf",
      "sha256": "a5dc0b5f6f626f5d6b80aa4695b67db3307f8142cff036e1fbc19a8ef1807d8f",
      "slug": "three-step-he-metrics",
      "page": "/papers/three-step-he-metrics/",
      "doi": "10.5281/zenodo.23850990",
      "publicationDate": "2026-10-31",
      "revisionDate": "2026-10-31",
      "explanation": {
        "question": "Does relative spectral control survive when extensions are composed through three layers?",
        "idea": "With three layers, adjacent extension classes interact through the equations expressing holomorphicity. The paper retains controlled quadratic correction terms for these compositions and uses graph-cut estimates to compare the corrected geometry with the finite balancing model.",
        "result": "For the stated class of integrable three-step extensions of distinct line bundles, a sufficiently small balanced model approximates the Hermitian–Einstein metric and every small eigenvalue with uniform relative error. An example on a product of three projective lines has a spectral scale that the polarization parameters alone cannot detect, and its metric response is compared with the differentiated balancing equation.",
        "significance": "It isolates the extra compatibility issue introduced by composable extensions and shows why stability parameters do not encode every weak scale.",
        "limits": "The adjacent classes lie in fixed cohomology subspaces, and the other terms are prescribed quadratic coexact Hodge primitives, with no independent first-to-third-layer parameter. This is not a theorem for arbitrary three-step filtrations.",
        "prerequisite": "The graph picture of Paper 1 is useful; the additional ingredient is that composing holomorphic extensions imposes compatibility equations."
      }
    },
    {
      "id": 6,
      "title": "L² metrics on Hermitian–Yang–Mills moduli spaces near a stability wall",
      "short": "Metrics at a wall",
      "branch": "geometry",
      "rank": 25,
      "rationale": "The key move is from eigenvalues to the actual harmonic metric on a quotient, without dividing by maps whose rank degenerates. It establishes a method used much more generally later, but its principal geometric family is specific.",
      "scope": "A rank-four family on a product of three projective lines, retaining the full analytic obstruction.",
      "role": "Quotient-metric foundation",
      "status": "Public preprint",
      "pdf": "/papers/wall-moduli-metrics/paper.pdf",
      "sha256": "4285aa1ba043afe94aca43e636f5877ae0201b4cf230d899afb58b6f52a31ee1",
      "slug": "wall-moduli-metrics",
      "page": "/papers/wall-moduli-metrics/",
      "doi": "10.5281/zenodo.23850992",
      "publicationDate": "2026-10-31",
      "revisionDate": "2026-10-31",
      "explanation": {
        "question": "Can a finite deformation model recover distances in the actual space of canonical bundle metrics near a wall?",
        "idea": "The harmonic L² metric measures the size of a bundle deformation by integrating its pointwise norm over the base. Instead of solving by inverting maps that become singular, the proof first compares deformation norms in the ambient space and only then takes the quotient by symmetries.",
        "result": "Near a specified split rank-four bundle on a product of three projective lines, the actual harmonic metric and the full obstructed finite quotient metric differ by a relative error quadratic in the deformation size. The estimate remains uniform when orbit and obstruction maps lose rank, extends to intrinsic lengths and their completions, and describes the transition to a rank-three-plus-line endpoint.",
        "significance": "It turns finite spectral reduction into a method for studying the geometry of moduli spaces themselves.",
        "limits": "The theorem concerns a particular local rank-four deformation problem. It retains the full analytic obstruction and does not replace it with an automatically smooth or unobstructed model.",
        "prerequisite": "Think of a moduli space as the space of bundles up to isomorphism; some knowledge of tangent spaces and quotient metrics helps with the proof."
      }
    },
    {
      "id": 7,
      "title": "Hermitian–Einstein metrics and moduli of three-step extensions with repeated factors",
      "short": "Repeated factors & moduli",
      "branch": "geometry",
      "rank": 31,
      "rationale": "This combines composable extensions, a repeated factor, all small modes and the full local quotient metric in one concrete problem. It is valuable as a stringent noncommutative test case, with much of its general role subsequently taken by Paper 15.",
      "scope": "A specified rank-five deformation problem; six small modes and a reducible rank-four-plus-line locus.",
      "role": "Concrete synthesis",
      "status": "Public preprint",
      "pdf": "/papers/repeated-factor-moduli/paper.pdf",
      "sha256": "192e67f9ed40d06f427cc5f939339946db519ddc648d503ec4470404de917ec8",
      "slug": "repeated-factor-moduli",
      "page": "/papers/repeated-factor-moduli/",
      "doi": "10.5281/zenodo.23850994",
      "publicationDate": "2026-10-31",
      "revisionDate": "2026-10-31",
      "explanation": {
        "question": "Can one control canonical metrics, weak modes and moduli distances when a three-step deformation also has a repeated factor?",
        "idea": "A repeated line factor introduces matrix-valued mixing, while composable extensions introduce nonlinear compatibility conditions. Harmonic orthogonality removes the cubic curvature terms, leaving an error that can be bounded separately in every multiplicity direction.",
        "result": "In the specified rank-five deformation problem on a product of three projective lines, small simple integrable deformations satisfying the quadratic moment-map equation have Hermitian–Einstein metrics with quadratic logarithmic error and relative control of all six small modes. On smooth pieces of the full local quotient, the same construction compares harmonic and coefficient metrics and identifies the metric on the locus where one repeated line splits off.",
        "significance": "It tests several central mechanisms together in a concrete noncommuting example with changing stabilizer.",
        "limits": "The result is tied to this rank-five family and its integrability and moment-map conditions. It does not yet supply a general theorem for all repeated-factor filtrations.",
        "prerequisite": "Papers 4–6 supply the three ingredients: multiplicity matrices, three-layer compatibility and quotient metrics."
      }
    },
    {
      "id": 8,
      "title": "Initial conditions and asymptotic phase for Hermitian–Yang–Mills flow",
      "short": "Selecting the initial phase",
      "branch": "dynamics",
      "rank": 27,
      "rationale": "It establishes that the initial spatial metric selects a differentiable asymptotic phase with an error controlled by the complementary gap. Paper 16 generalizes the reduction, while the entry theorem here remains a useful independent contribution.",
      "scope": "A specified four-line family along a polarization path, plus a two-parameter three-layer comparison.",
      "role": "Dynamical foundation",
      "status": "Public preprint",
      "pdf": "/papers/hym-initial-condition-phase/paper.pdf",
      "sha256": "c9f27d5667b6f19562826ef09277ca3e0cb8d3ce4fff31ac398eccc79c29dc60",
      "slug": "hym-initial-condition-phase",
      "page": "/papers/hym-initial-condition-phase/",
      "doi": "10.5281/zenodo.23850996",
      "publicationDate": "2026-10-31",
      "revisionDate": "2026-10-31",
      "explanation": {
        "question": "Which trajectory of a finite flow model is selected by an actual spatially varying initial metric?",
        "idea": "An exact invariant graph separates the slowly evolving harmonic coefficients from transverse directions with a fixed spectral gap. The asymptotic phase assigns the initial metric a reduced trajectory whose relative metric error decays exponentially, even when the slow relaxation rates themselves become very small.",
        "result": "For a specified stable four-line family along a fixed polarization path, this selected phase is continuously differentiable in the initial metric at fixed bundle and polarization. A prescribed smooth determinant-normalized initial metric enters the local regime after a common restart time, and a separate three-layer comparison controls all future times with a small fixed relative error.",
        "significance": "It explains how a finite dynamical description is determined by genuine initial data, rather than by a freely chosen model trajectory.",
        "limits": "The local theorem requires bounded diagonal coordinates and small transverse displacement, and the phase is defined relative to the chosen invariant graph. The entry theorem concerns the specified nearby stable family, not arbitrary unstable initial data.",
        "prerequisite": "Familiarity with attracting invariant manifolds and slow–fast dynamics is helpful; Paper 3 provides the bundle-flow context."
      }
    },
    {
      "id": 9,
      "title": "Hermitian–Yang–Mills flow at and beyond a stability wall",
      "short": "At and beyond the wall",
      "branch": "dynamics",
      "rank": 26,
      "rationale": "This proves actual coefficient confinement and identifies the transition from reciprocal wall decay to exponential unstable decay. That confinement is substantive: the general phase theorem in Paper 16 assumes it rather than supplying it automatically.",
      "scope": "Specified acyclic wall and triangular unstable families with locally free graded line quotients.",
      "role": "Unstable dynamics",
      "status": "Public preprint",
      "pdf": "/papers/hym-wall-unstable-flow/paper.pdf",
      "sha256": "7528024e3d41350758c5c27953ad622047bcda8c061756a048370903588580bc",
      "slug": "hym-wall-unstable-flow",
      "page": "/papers/hym-wall-unstable-flow/",
      "doi": "10.5281/zenodo.23850998",
      "publicationDate": "2026-10-31",
      "revisionDate": "2026-10-31",
      "explanation": {
        "question": "Can a reduced flow remain valid at a stability wall and on the unstable side, where the metric itself becomes unbounded?",
        "idea": "A moving diagonal presentation absorbs the unbounded metric growth and leaves small harmonic coefficients to describe the remaining evolution. The proof keeps these coefficients confined for all time and tracks the transition from reciprocal decay at the wall to exponential decay beyond it.",
        "result": "For the specified acyclic wall family and triangular unstable family, sufficiently small transverse perturbations of the invariant graph admit a unique reduced trajectory with exponentially decreasing relative metric error. The estimates are uniform in the ratio of wall distance to initial energy, and at a fixed nearby unstable polarization the drift-subtracted diagonal limit varies locally invertibly with the three diagonal initial coordinates.",
        "significance": "It proves the confinement needed for a dynamical model to keep working after stability is lost.",
        "limits": "The unstable theorem requires locally free Harder–Narasimhan line quotients and the stated triangular family. Singular graded quotients fall outside this description and motivate Paper 10.",
        "prerequisite": "Paper 8 explains asymptotic phase; basic knowledge of stability filtrations helps distinguish wall behavior from unstable growth."
      }
    },
    {
      "id": 10,
      "title": "Singular graded limits and metric growth under Hermitian–Yang–Mills flow",
      "short": "When graded objects are singular",
      "branch": "dynamics",
      "rank": 9,
      "rationale": "A major conceptual correction: singular graded quotients invalidate two natural bounded-remainder extensions of the weight-filtration description of HYM flow. Its importance comes from changing what a correct general theory must say, rather than from how many later papers cite it.",
      "scope": "Rank-two bundles on compact Kähler surfaces with a singular equal-slope line quotient. Paper 32 supplies a sharp replacement law for reduced defects with distinct factors, while broader sharp profiles remain open.",
      "role": "Conceptual correction",
      "status": "Public preprint",
      "pdf": "/papers/singular-hym-metric-growth/paper.pdf",
      "sha256": "ce1c491016aee7e64a9d0527682789d4bb90511ad000d5a5bd6dcde98c3de686",
      "slug": "singular-hym-metric-growth",
      "page": "/papers/singular-hym-metric-growth/",
      "doi": "10.5281/zenodo.23893608",
      "publicationDate": "2026-10-31",
      "revisionDate": "2026-11-02",
      "explanation": {
        "question": "What fails in the usual weight-based description of metric growth when a graded quotient has point singularities?",
        "idea": "The algebraic weight filtration still predicts two weights, but a residue concentrated at the singular set contributes an additional analytic obstruction. A global normalization and an exact dissipation identity show that this obstruction remains visible in the metric even on regions away from the singular points.",
        "result": "For rank-two bundles on compact Kähler surfaces with an equal-slope line subsheaf and a singular torsion-free quotient, the squared L² norm of the inclusion decays faster than the inverse square root of flow time for every smooth initial metric with fixed Hermitian–Einstein determinant. Both a bounded relative metric remainder and a bounded ordinary matrix-logarithm remainder fail to realize the predicted weight model, including for repeated line factors and nonreduced singularities.",
        "significance": "It identifies a concrete obstruction that any general theory of singular HYM asymptotics must address.",
        "limits": "The obstruction does not itself identify a leading replacement coefficient. Paper 32 subsequently proves an inverse-time law and charge-one profile for reduced defects with distinct factors. Sharp nonreduced or repeated-factor profiles remain open.",
        "prerequisite": "The key distinction is between a vector bundle and a torsion-free sheaf that fails to be a bundle at finitely many points; familiarity with filtrations and HYM flow helps beyond that picture."
      }
    },
    {
      "id": 11,
      "title": "Mass increase and acyclic cancellation for phase flows on quiver complexes",
      "short": "Mass & acyclic cancellation",
      "branch": "category",
      "rank": 16,
      "rationale": "It gives a negative answer to the proposed phase-flow mass-monotonicity question and proves quantitative acyclic cancellation in substantial generality. This is an independent contribution to the categorical programme, so its sparse position in the series graph understates its importance.",
      "scope": "Two-term parallel-arrow quiver complexes; the cancellation hypotheses vary by theorem.",
      "role": "Independent advance",
      "status": "Public preprint",
      "pdf": "/papers/mass-increase-acyclic-cancellation/paper.pdf",
      "sha256": "a885d347639bfe33581e53cd3a3aa8a923b964fec79d8d0d0e1c8a599e1a3615",
      "slug": "mass-increase-acyclic-cancellation",
      "page": "/papers/mass-increase-acyclic-cancellation/",
      "doi": "10.5281/zenodo.23921919",
      "publicationDate": "2026-11-02",
      "revisionDate": "2026-11-03",
      "explanation": {
        "question": "Does categorical phase flow always decrease mass, and can parts of a complex with zero cohomology be removed dynamically?",
        "idea": "An explicit noncommuting example shows that trace-norm mass can increase under the prescribed phase flow. A separate comparison isolates the acyclic directions—those that contribute no cohomology—and controls their cancellation by the singular values of the differential.",
        "result": "For the stated two-term parallel-arrow quiver complexes, a sufficiently large least acyclic singular value yields exponential comparison with instantaneous cohomology; if the source differential is invertible, cancellation holds from every positive metric without that large-scale assumption. Additional results prove cohomology relaxation under a finite energy-infimum condition and distinguish C¹ mass convergence from the sharper, but limited, regularity of an explicit family.",
        "significance": "It answers the proposed mass-monotonicity question negatively while establishing a quantitative form of dynamical cancellation.",
        "limits": "The cancellation results concern specified two-term quiver complexes, and the hypotheses differ between the surjective and invertible differential cases. The cohomology-relaxation theorem uses particular charges and equal surviving dimensions.",
        "prerequisite": "Basic chain complexes, cohomology and matrix singular values are enough to understand the cancellation question; categorical stability provides the broader motivation."
      }
    },
    {
      "id": 12,
      "title": "Harmonic paths and honeycombs",
      "short": "Harmonic paths & honeycombs",
      "branch": "category",
      "rank": 13,
      "rationale": "Existence for arbitrary diagonalizable boundary triples in every finite rank is a substantial result in the honeycomb specialization of the harmonic-path problem. The finite algebraic presentation is the central achievement; uniqueness uses an explicit additional matching condition.",
      "scope": "The identity A₂ representation over the real-exponent Novikov field, symmetric charges and fixed radial area form.",
      "role": "Independent advance",
      "status": "Public preprint",
      "pdf": "/papers/harmonic-paths-and-honeycombs/paper.pdf",
      "sha256": "fe53affee906d37a5d1388cbfdb2adb4cc8542caa71e708518d7732465335fa9",
      "slug": "harmonic-paths-and-honeycombs",
      "page": "/papers/harmonic-paths-and-honeycombs/",
      "doi": "10.5281/zenodo.23947189",
      "publicationDate": "2026-11-04",
      "revisionDate": null,
      "explanation": {
        "question": "Can arbitrary boundary norm data be joined by a harmonic path with a finite honeycomb description?",
        "idea": "The construction minimizes a renormalized convex action and proves that the resulting norm motion can be described using finitely many linear coordinate pieces, called apartments. These pieces form a honeycomb whose edges carry actual semistable algebraic data and whose vertices satisfy compatible filtration conditions.",
        "result": "For the identity representation of the A₂ quiver over the real-exponent Novikov field, every triple of diagonalizable boundary norms in every finite rank admits such a path, including repeated spectra and collapsed edges. With symmetric charges and a fixed radial area form, the path is unique among finite presentations whose one-sided motions agree to first order at every join.",
        "significance": "It establishes existence in a concrete honeycomb specialization of the harmonic-path conjecture and makes the finite algebraic structure part of the theorem.",
        "limits": "This is a result for the stated A₂ representation, field, charges and area form, not the entire harmonic-path conjecture. Uniqueness requires the explicit first-order matching condition in addition to the edgewise definition.",
        "prerequisite": "Convex minimization and piecewise-linear geometry give the basic picture; non-Archimedean norms and quiver representations are needed for the precise statement."
      }
    },
    {
      "id": 13,
      "title": "Metric wall crossing in rank-three K3 bundle moduli",
      "short": "A K3 metric wall crossing",
      "branch": "geometry",
      "rank": 24,
      "rationale": "This makes a nontrivial K3 wall crossing quantitatively geometric: actual harmonic metrics acquire cotangent-Grassmannian models, collapse rates and complete rescaled limits. Paper 14 broadens the mechanism, but this remains its clearest substantial first realization.",
      "scope": "A rank-three, complex twelve-dimensional moduli problem with T*Gr(2,5) and T*Gr(3,5) chamber models.",
      "role": "K3 realization",
      "status": "Public preprint",
      "pdf": "/papers/k3-metric-wall-crossing/paper.pdf",
      "sha256": "41324dcb2bbea577163eb8ac49403d69cf5cffb44872556b9f18d6da8c3944a9",
      "slug": "k3-metric-wall-crossing",
      "page": "/papers/k3-metric-wall-crossing/",
      "doi": "10.5281/zenodo.24021822",
      "publicationDate": "2026-11-06",
      "revisionDate": null,
      "explanation": {
        "question": "What does a concrete K3 bundle wall crossing look like when distances, not just algebraic spaces, are followed through the transition?",
        "idea": "Near the chosen reducible bundle, the deformation equations have finite hyperkähler quotient models built from cotangent bundles of Grassmannians. A correction within complex symmetry orbits compares these model lengths with actual harmonic lengths without losing control at reducible strata.",
        "result": "In the specified complex twelve-dimensional rank-three K3 moduli problem, the two chamber metrics are uniformly approximated by the standard metrics on T*Gr(2,5) and T*Gr(3,5), with error quadratic in deformation size. This gives the square-root collapse scale of the exceptional fibres, complete rescaled metric limits, distances to contracted loci and matching with the wall metric.",
        "significance": "It makes an algebraic wall crossing quantitatively geometric in a substantial explicit example.",
        "limits": "The central bundle has two copies of one spherical line factor and a second line factor, with five-dimensional cross-extension spaces, on a fixed Ricci-flat K3 background. The result is local near this bundle rather than a global metric comparison for arbitrary K3 moduli spaces.",
        "prerequisite": "A Grassmannian parametrizes linear subspaces; some familiarity with moduli spaces and metric rescaling makes the geometric transition easier to read."
      }
    },
    {
      "id": 14,
      "title": "Quantitative metric wall crossing for K3 bundle moduli",
      "short": "Quantitative K3 wall crossing",
      "branch": "geometry",
      "rank": 11,
      "rationale": "A central foundation for the K3 branch: it controls quiver quotient metrics through changing stabilizers and arbitrarily separated scales. Complete stratified limits and successive rescalings make its reach much greater than one explicit wall crossing.",
      "scope": "Locally free polystable K3 backgrounds; complete quotient continuity uses a simple-representation hypothesis, and iterated limits require convergence at each stage.",
      "role": "Reusable foundation",
      "status": "Public preprint",
      "pdf": "/papers/quiver-metric-wall-crossing/paper.pdf",
      "sha256": "70bca12dae324e04a62fe5c606037e01e684e96e84cc0c61671290c9465e580a",
      "slug": "quiver-metric-wall-crossing",
      "page": "/papers/quiver-metric-wall-crossing/",
      "doi": "10.5281/zenodo.24024998",
      "publicationDate": "2026-11-06",
      "revisionDate": null,
      "explanation": {
        "question": "Can the metric description of K3 wall crossing remain uniform when several walls and singular strata are approached at unrelated rates?",
        "idea": "A quiver records extension directions between the stable factors, while its matrix symmetries retain the bundle's full automorphism group. Comparing harmonic lengths before minimizing over complementary gauge directions avoids dividing by quantities that vanish when the stabilizer changes.",
        "result": "Near a locally free polystable K3 bundle satisfying the stated stability hypotheses, the actual harmonic metric is uniformly comparable to a flat quiver quotient metric even through changing stabilizers and arbitrarily separated positive scales. Under a simple-representation hypothesis for the complex zero moment fibre, complete quotient limits and finite successive rescalings exist when the required parameters and balanced base representatives converge at each stage.",
        "significance": "It provides the reusable K3 metric framework behind later compact contractions and their local models.",
        "limits": "The factors must satisfy the specified stability conditions for an ample polarization and a central Ricci-flat background, which need not have the same class. Complete quotient continuity uses the additional simple-representation hypothesis; iterated metric limits are conditional on convergence at every stage.",
        "prerequisite": "Paper 13 gives a concrete first example; quivers, symmetry quotients and pointed metric limits supply the general language."
      }
    },
    {
      "id": 15,
      "title": "Quantitative local models for Hermitian–Einstein metrics",
      "short": "The general local theory",
      "branch": "foundations",
      "rank": 1,
      "rationale": "The broadest reusable static theorem in the series simultaneously controls actual Hermitian–Einstein metrics, every small eigenvalue and harmonic moduli metrics near an arbitrary fixed locally free polystable background. Retaining the full convergent obstruction equations makes this the clearest foundational centre.",
      "scope": "A fixed compact Kähler background and nearby locally free deformations; no claim of uniformity as the base itself degenerates.",
      "role": "Foundational centre",
      "status": "Public preprint",
      "pdf": "/papers/local-hym-reduction/paper.pdf",
      "sha256": "02cb19f3e8e2c1637476bc1a49dc803972cb7924c081288b10cb680a293bc9cc",
      "slug": "local-hym-reduction",
      "page": "/papers/local-hym-reduction/",
      "doi": "10.5281/zenodo.24029090",
      "publicationDate": "2026-11-07",
      "revisionDate": null,
      "explanation": {
        "question": "Can a finite-dimensional model describe canonical bundle metrics and every direction in which they become weak near a stability wall?",
        "idea": "Separate the deformation into a finite set of harmonic directions and an elliptic complement, where a uniform estimate is available. Keep the full nonlinear equations that decide which deformations exist, then use the bundle's automorphisms to build a finite quadratic form for its small eigenvalues.",
        "result": "Near any fixed locally free polystable bundle on a compact Kähler manifold, the model reconstructs every sufficiently nearby Hermitian–Einstein solution and compares both its small spectrum and the harmonic metric on smooth moduli pieces. The estimates remain relative when positive eigenvalues have very different sizes or the symmetry group changes; canonical harmonic coordinates give quadratic error.",
        "significance": "This provides a common local foundation for the series' spectral, metric and wall-crossing results without requiring the deformation equations to be quadratic.",
        "limits": "The background compact manifold and reference bundle are fixed. Uniform control while the underlying manifold itself degenerates requires additional analysis.",
        "prerequisite": "Start with holomorphic bundles, slope stability and the interpretation of Laplacian eigenvalues as weak deformation directions."
      }
    },
    {
      "id": 16,
      "title": "Uniform asymptotic phase for Hermitian–Yang–Mills flow near a polystable bundle",
      "short": "The general dynamical theory",
      "branch": "dynamics",
      "rank": 7,
      "rationale": "The dynamical counterpart of Paper 15 constructs exact finite reduction and differentiable phase selection uniformly as finite relaxation rates collapse. It is a broadly reusable theorem, with confinement explicitly retained as a hypothesis.",
      "scope": "Small normal displacement and harmonic coefficients confined to a prescribed neighborhood; arbitrary multiplicities and full Kuranishi obstruction.",
      "role": "Reusable foundation",
      "status": "Public preprint",
      "pdf": "/papers/uniform-hym-phase/paper.pdf",
      "sha256": "274975c113249ebd625899b7955c4b7b8ea05e18fe6dfaf2e89b0cd424f66c70",
      "slug": "uniform-hym-phase",
      "page": "/papers/uniform-hym-phase/",
      "doi": "10.5281/zenodo.24038504",
      "publicationDate": "2026-11-07",
      "revisionDate": null,
      "explanation": {
        "question": "Can the full metric flow be matched to one finite-dimensional trajectory even when some relaxation rates approach zero?",
        "idea": "Construct an invariant finite-dimensional family inside the space of all metrics, so its trajectories are exact solutions after reconstruction. An asymptotic phase selects which trajectory matches a given initial metric, while the uniformly controlled elliptic directions absorb the remaining error.",
        "result": "Near a fixed locally free polystable bundle on a compact Kähler manifold, confined harmonic coefficients and small initial normal displacement yield exponential relative-metric tracking in a fixed Hölder norm. The phase is continuously differentiable in the initial metric, with estimates independent of the smallest positive finite rates, their ratios and changes of stabilizer.",
        "significance": "It gives a dynamical foundation that remains useful precisely where ordinary estimates based on a positive spectral gap become weak.",
        "limits": "The theorem assumes that the finite coefficients stay in the prescribed neighborhood. It does not prove that arbitrary initial metrics enter or remain in that neighborhood.",
        "prerequisite": "Read Paper 15 for the local reduction, then recall the distinction between slow finite modes and the uniformly decaying elliptic complement."
      }
    },
    {
      "id": 17,
      "title": "Exceptional cycles and harmonic metrics in K3 bundle moduli",
      "short": "Exceptional cycles, actual metrics",
      "branch": "geometry",
      "rank": 19,
      "rationale": "It makes integral exceptional geometry and metric degeneration describe the same cycles in compact K3 moduli spaces. The interacting planes, congruence data and complete rescaled metrics give a richer result than a local model alone.",
      "scope": "A compact fourfold family with a singular surface and deeper point; explicit attachment congruences modulo eight and three.",
      "role": "Geometry–topology bridge",
      "status": "Public preprint",
      "pdf": "/papers/exceptional-cycles/paper.pdf",
      "sha256": "84aa3b22d5d4425538df7ab278ffad54815396476d931d2babf6814790ef9a6f",
      "slug": "exceptional-cycles",
      "page": "/papers/exceptional-cycles/",
      "doi": "10.5281/zenodo.24047888",
      "publicationDate": "2026-11-07",
      "revisionDate": "2026-11-07",
      "explanation": {
        "question": "When exceptional cycles collapse in a compact moduli space, can their integral topology and their actual metric size be described together?",
        "idea": "Follow the same curve and surface classes through a compact K3 bundle-moduli contraction, including two interacting projective planes. Combine their integral intersection and boundary data with the harmonic metric, which measures bundle deformations using their least-energy representatives.",
        "result": "For the specified compact fourfold family, the paper identifies primitive classes, their intersection matrix and a modulo-eight attachment condition, together with exact cycle areas and volumes. It proves ambient diameter estimates, complete cotangent-projective-plane limits at separated scales, and convergence of the chamber metrics to the common contraction.",
        "significance": "The topological cycles and the metric objects are explicitly the same, making the connection between wall crossing and geometric collapse concrete.",
        "limits": "These are specified compact K3 constructions without bubbling, not a reconstruction theorem for every singular moduli space. Successive rescalings retain convergence conditions on normalized parameters and basepoints.",
        "prerequisite": "A picture of a collapsing exceptional curve or plane is enough to start; integral cohomology explains the attachment conditions."
      }
    },
    {
      "id": 18,
      "title": "Integral reconstruction and quantitative metric degeneration of K3 bundle moduli",
      "short": "Global integral reconstruction",
      "branch": "geometry",
      "rank": 15,
      "rationale": "Its general compact metric comparison turns the local quiver theory into completion and convergence results across chambers. The integral reconstruction and Grassmannian example extend the bridge to topology, provided the marked complement and overlap data are supplied.",
      "scope": "Compact no-bubbling K3 contractions with complete convergent quiver charts; reconstruction is not from local fibre rings alone.",
      "role": "Global synthesis",
      "status": "Public preprint",
      "pdf": "/papers/integral-reconstruction/paper.pdf",
      "sha256": "8cc8f3b7f6412fca2923fad849a52681949760a7640b93b269f805bcf016868c",
      "slug": "integral-reconstruction",
      "page": "/papers/integral-reconstruction/",
      "doi": "10.5281/zenodo.24047889",
      "publicationDate": "2026-11-07",
      "revisionDate": "2026-11-07",
      "explanation": {
        "question": "How can local models be assembled into a statement about the metric and topology of an entire compact moduli space?",
        "idea": "Compare distances in finite quotient models across overlapping neighborhoods, then control how paths cross the singular strata of the compact space. For integral topology, include the complement and all overlap maps, rather than trying to infer global information from the exceptional fibres alone.",
        "result": "For compact K3 bundle-moduli contractions without bubbling and with the required convergent quiver charts, the harmonic metric completes to the central space and the chamber spaces converge to it. A compact eightfold example realizes a Grassmannian exceptional fibre with explicit primitive classes, a modulo-six attachment, exact periods and complete rescaled metric limits.",
        "significance": "It turns the local theory into a global metric statement and identifies the additional information needed for integral reconstruction.",
        "limits": "The chart hypotheses include simple representations in the complex moment-zero fibres. Additive cohomology reconstruction needs geometric overlap and monodromy data; local fibre rings alone do not suffice, and no universal power-law convergence rate is asserted.",
        "prerequisite": "Read Paper 17 for a compact example, and think of a quiver quotient as a finite-dimensional local model for bundle deformations."
      }
    },
    {
      "id": 19,
      "title": "Integral attachments and wall correspondences for K3 bundle moduli",
      "short": "Integral wall correspondences",
      "branch": "geometry",
      "rank": 21,
      "rationale": "This supplies unusually complete integral information: complement rings, boundary maps, normalized indices and all adjacent wall actions in one compact family. It is more specialized than the general metric theorems, but materially strengthens the topological content of the programme.",
      "scope": "Six chambers in a rank-three K3 family, with four elementary Mukai flops and two divisorial isomorphisms.",
      "role": "Integral computation",
      "status": "Public preprint",
      "pdf": "/papers/integral-attachments/paper.pdf",
      "sha256": "8110ca502ad64f0eee04e9125461eb2a0ae62fc67bfa7b1d50956a0783436ba1",
      "slug": "integral-attachments",
      "page": "/papers/integral-attachments/",
      "doi": "10.5281/zenodo.24054004",
      "publicationDate": "2026-11-08",
      "revisionDate": "2026-11-08",
      "explanation": {
        "question": "What happens to integral cohomology when one crosses every wall in a concrete compact family?",
        "idea": "Use a common integral marking to describe the exceptional cycles, their complement and the maps from that complement to its boundary. Track the corrected geometric correspondences at each wall, including the signs needed to recognize a reflection.",
        "result": "In a six-chamber family of rank-three K3 bundle moduli, the paper computes complement rings, boundary restrictions and determinant-normalized universal classes. It determines the actions of four elementary Mukai flops and two divisorial isomorphisms, their compositions, and the corresponding periods and volumes of the exceptional cycles.",
        "significance": "It supplies explicit global attachment and wall-action data of the kind required by the broader reconstruction programme.",
        "limits": "The calculations concern this marked six-chamber family. Its metric estimates come from the established degeneration theorems, and the wall formulas are not presented as a classification of all K3 wall crossings.",
        "prerequisite": "Use Paper 17 for the underlying geometry; familiarity with integral cohomology and intersection pairings helps with the calculations."
      }
    },
    {
      "id": 20,
      "title": "Canonical metrics on singular moduli of K3 bundles",
      "short": "Canonical singular metrics",
      "branch": "geometry",
      "rank": 6,
      "rationale": "Identifying the canonical singular Ricci-flat metric with the gauge-theoretic harmonic metric is a major geometric conclusion. Quantitative tangent cones and metric completion on compact spaces with neither resolution nor smoothing give this paper significance beyond the local machinery it uses.",
      "scope": "A specified locally free class of twice-primitive K3 moduli spaces with a rank bound and Picard rank one.",
      "role": "Geometric flagship",
      "status": "Public preprint",
      "pdf": "/papers/canonical-metrics-singular-k3-moduli/paper.pdf",
      "sha256": "8413297cf26ba8ae69cdc1dd04589c3b7f9e5e908670a15ba47aa1a36628958c",
      "slug": "canonical-metrics-singular-k3-moduli",
      "page": "/papers/canonical-metrics-singular-k3-moduli/",
      "doi": "10.5281/zenodo.24060228",
      "publicationDate": "2026-11-08",
      "revisionDate": "2026-11-08",
      "explanation": {
        "question": "Does the natural metric obtained from gauge theory agree with the canonical Ricci-flat metric on a singular compact moduli space?",
        "idea": "Identify the harmonic metric's cohomology class and local potentials, then compare it with the canonical singular Ricci-flat metric. Near a singular point, the finite deformation model supplies a hyperkähler quotient cone that approximates the metric in holomorphic coordinates.",
        "result": "For the specified twice-primitive K3 moduli spaces of Picard rank one, with a rank bound ensuring local freeness, the two metrics agree and the regular-locus completion is the original compact space. The tangent-cone approximation has quadratic error, uniformly through stabilizer changes inside each fixed local chart, even though these spaces admit neither a symplectic resolution nor a smoothing.",
        "significance": "It identifies a canonical geometric structure on genuinely singular compact spaces and gives quantitative information about the shape of their singularities.",
        "limits": "The theorem concerns the stated locally free K3 family and fixed local backgrounds. It does not give uniform estimates across all singular moduli spaces or across changing background elliptic gaps.",
        "prerequisite": "Know what a moduli space and a tangent cone represent; Paper 15 explains the local metric comparison used here."
      }
    },
    {
      "id": 21,
      "title": "Light vectors and scalar interactions near heterotic K3 gauge enhancement",
      "short": "Heterotic gauge enhancement",
      "branch": "physics",
      "rank": 22,
      "rationale": "This takes the spectral and quotient-metric estimates into an actual compactification and a controlled scalar-scattering calculation. Its standing would rise for a physics audience; within this mathematical series, the selected amplitude and perturbative regime make it a focused application.",
      "scope": "Leading Yang–Mills tree amplitude below the heavier Higgs thresholds and away from poles; the complete next-order coefficient and finite-string-scale remainder remain open.",
      "role": "Physics bridge",
      "status": "Public preprint",
      "pdf": "/papers/heterotic-k3-enhancement/paper.pdf",
      "sha256": "00d09895425f0408b3aa679af12958a47b9eb05a3ed52228a040ff6fcc28913d",
      "slug": "heterotic-k3-enhancement",
      "page": "/papers/heterotic-k3-enhancement/",
      "doi": "10.5281/zenodo.24072269",
      "publicationDate": "2026-11-08",
      "revisionDate": "2026-11-08",
      "explanation": {
        "question": "How do very light gauge particles affect scalar interactions as a heterotic K3 compactification approaches enhanced symmetry?",
        "idea": "Translate weak bundle-Laplacian modes into light vector masses and calculate the couplings of two specified massless scalars to them. Harmonic orthogonality and a cancellation between scalar contact and exchange terms control contributions that could otherwise grow when a mass becomes small.",
        "result": "For the stated smooth SO(32) compactification and rank-six bundle family, the complete leading Yang–Mills four-scalar tree amplitude approaches an explicit light-vector exchange formula with quadratic absolute error. The estimate remains uniform as the two deformation scales separate, below the heavier Higgs thresholds and away from light poles, and also determines the leading curvature growth on a selected plane in bundle moduli.",
        "significance": "It connects the series' spectral and metric estimates to a controlled scattering calculation in a compactification.",
        "limits": "The external scalars, energy regime and perturbative order are specified. The complete next tree-order coefficient and a finite-string-scale remainder remain open.",
        "prerequisite": "A basic picture of Higgs masses and tree-level exchange diagrams is useful; the geometric input is the relation between weak bundle modes and light particles."
      }
    },
    {
      "id": 22,
      "title": "Integral topology and small eigenvalues in Calabi–Yau conifold transitions",
      "short": "Topology meets Ricci-flat spectra",
      "branch": "spectral",
      "rank": 8,
      "rationale": "The original bridge from global algebraic topology to the complete small spectrum of an actual Ricci-flat conifold smoothing. Explicit compact topology and leading coefficients retain independent value; Paper 29 now supplies the stronger ratio-unrestricted comparison on the selected eight-node family.",
      "scope": "A polarized fixed smoothing, all nodes smoothed to first order, approached along a fixed ray; not independent arbitrary node scales.",
      "role": "Fixed-ray spectral foundation",
      "status": "Public preprint",
      "pdf": "/papers/cy-conifold-hodge-spectrum/paper.pdf",
      "sha256": "ee97656ffb7f2c3748a5e78029256484019ac2cf2751c2050cd2330bc8e5ed00",
      "slug": "cy-conifold-hodge-spectrum",
      "page": "/papers/cy-conifold-hodge-spectrum/",
      "doi": "10.5281/zenodo.24096887",
      "publicationDate": "2026-11-09",
      "revisionDate": "2026-11-09",
      "explanation": {
        "question": "Can global topology predict the leading small eigenvalues of an actual degenerating Ricci-flat Calabi–Yau metric?",
        "idea": "Measure divisor classes by their periods on the exceptional curves and by their global harmonic norm after removing cohomology that survives smoothing. The relative eigenvalues of these two finite quadratic forms determine which two-form modes become small and their leading rates.",
        "result": "For a polarized conifold transition with a simply connected projective small resolution and a fixed smoothing ray that smooths every node to first order, the small positive two-form eigenvalues decay inversely with the logarithm of the smoothing parameter. Their number is the loss of divisor directions, their coefficients are computed from periods and global intersections, and explicit examples also determine integral vanishing cycles and monodromy.",
        "significance": "It links global algebraic and integral topology to the spectrum of genuine Ricci-flat smoothings with explicit leading coefficients.",
        "limits": "The smoothing is fixed and approached along a fixed ray; arbitrary independent node scales are not covered. Recovering the integral information uses geometric markings and global data, not just the list of eigenvalues.",
        "prerequisite": "Start with the picture of replacing a conifold node by an exceptional curve or a vanishing sphere, then recall Hodge theory's relation between forms and cohomology."
      }
    },
    {
      "id": 23,
      "title": "Small eigenvalues on degenerating curves and the intersection form",
      "short": "The intersection-form spectrum",
      "branch": "spectral",
      "rank": 28,
      "rationale": "A clean, independently useful theorem identifies the complete small scalar spectrum of reduced curve degenerations directly from intersections and component areas. Its broader singular-fibre scope matters, while the stated relationship to existing Kähler results tempers claims of novelty.",
      "scope": "Smooth total space and induced metrics Hermitian near the central singularities; a direct proof including arbitrary reduced singular fibres.",
      "role": "Clean spectral theorem",
      "status": "Public preprint",
      "pdf": "/papers/curve-intersection-spectrum/paper.pdf",
      "sha256": "23313f9655829dfe3108fe36f4eb7ce7cdcc339c3457a1f4948d62cd8627afb0",
      "slug": "curve-intersection-spectrum",
      "page": "/papers/curve-intersection-spectrum/",
      "doi": "10.5281/zenodo.24120959",
      "publicationDate": "2026-11-10",
      "revisionDate": "2026-11-10",
      "explanation": {
        "question": "What finite graph describes the slowest scalar modes when a smooth curve breaks into several components?",
        "idea": "Assign one variable to each component, its area as a mass, and its intersection numbers as coupling weights. Logarithms of local component equations give nearly constant test functions whose energies can be calculated from winding numbers around the singularities.",
        "result": "For a reduced compact curve degeneration with smooth total space and induced metrics that are Hermitian near the central singularities, the number of positive scalar eigenvalues tending to zero is one less than the number of components. After multiplication by the logarithmic degeneration scale, these eigenvalues converge to those of the negative intersection matrix relative to the component areas; the remaining positive spectrum stays uniformly separated from zero.",
        "significance": "It gives a direct geometric recipe for the complete small scalar spectrum, including reduced central fibres with singularities beyond ordinary nodes.",
        "limits": "The central fibre must be reduced and the total space smooth, with the stated metric condition. This is a scalar spectral theorem, not a nonlinear bundle-flow result.",
        "prerequisite": "Think of masses connected by weighted springs, or a weighted graph Laplacian; intersection numbers supply the graph weights."
      }
    },
    {
      "id": 24,
      "title": "Small Hodge eigenvalues on nodal degenerations of threefolds",
      "short": "Nodal threefold Hodge spectra",
      "branch": "spectral",
      "rank": 30,
      "rationale": "It gives a direct geometric formula for small two-form eigenvalues in nodal threefold degenerations with induced metrics. This is a useful complementary metric setting to Paper 22, rather than another general Ricci-flat or HYM theorem.",
      "scope": "Induced Kähler metrics and explicit cohomological hypotheses on a small resolution; a single smoothing parameter.",
      "role": "Complementary spectral theorem",
      "status": "Public preprint",
      "pdf": "/papers/nodal-threefold-spectrum/paper.pdf",
      "sha256": "2d59643aa6a03d026d1f0b29678372fd249acdb0aad729fb9c162e6ae5848c80",
      "slug": "nodal-threefold-spectrum",
      "page": "/papers/nodal-threefold-spectrum/",
      "doi": "10.5281/zenodo.24120961",
      "publicationDate": "2026-11-10",
      "revisionDate": "2026-11-10",
      "explanation": {
        "question": "Which two-form modes become weak when a threefold develops ordinary double points under an induced Kähler metric?",
        "idea": "Compare the squared degrees of divisor classes on exceptional curves with their minimum harmonic norm on the regular part of the singular fibre. A sharp local energy calculation near each smoothed node turns this comparison into a finite spectral problem.",
        "result": "For the stated one-parameter nodal threefold family with smooth Kähler total space, and a small resolution with vanishing first Betti number and divisor-generated second real cohomology, the small two-form eigenvalues have explicit inverse-logarithmic asymptotics. Their number is the drop in the second Betti number; the small modes are coexact and primitive of type (1,1), while the remaining positive spectra in degrees one and two retain a uniform gap.",
        "significance": "It gives a geometric spectral formula in the induced-metric setting, complementing the Ricci-flat result of Paper 22.",
        "limits": "The metrics are induced from the total space, rather than assumed Ricci-flat. The theorem retains its cohomological hypotheses and single smoothing parameter.",
        "prerequisite": "Read the geometric picture in Paper 22, then distinguish a metric induced from an ambient space from a metric selected by the Ricci-flat equation."
      }
    },
    {
      "id": 25,
      "title": "Effective Hermitian–Yang–Mills flow on nodal degenerations of curves",
      "short": "Effective flow on nodal curves",
      "branch": "degeneration",
      "rank": 29,
      "rationale": "This is the first actual nonlinear HYM tracking theorem on a degenerating base in the series, using exact neck metrics and integrated comparison. Its core construction is foundational for the last three papers, although trivial gluing and bounded rescaled time limit its final standalone scope.",
      "scope": "Trivial determinant-one bundles on compact nodal curves; bounded rescaled intervals, with a pointwise estimate away from nodes.",
      "role": "New branch foundation",
      "status": "Public preprint",
      "pdf": "/papers/effective-hym-nodal-curves/paper.pdf",
      "sha256": "dec34cd32e400b9a53e8d81e1c10504fe27ba54d22d670751d7a542b4c3b6e9d",
      "slug": "effective-hym-nodal-curves",
      "page": "/papers/effective-hym-nodal-curves/",
      "doi": "10.5281/zenodo.24120966",
      "publicationDate": "2026-11-10",
      "revisionDate": "2026-11-10",
      "explanation": {
        "question": "Can nonlinear Hermitian–Yang–Mills flow on a degenerating curve be replaced by a small system of interacting component metrics?",
        "idea": "Represent the metric on each limiting component by a positive Hermitian matrix, with component area as its mass. Exact stationary metrics along the thin necks couple these matrices through an energy built from squared distances in their symmetric space.",
        "result": "On trivial determinant-one bundles over the stated compact nodal curve families, the actual flow follows this finite gradient flow on bounded logarithmically rescaled time intervals. Uniformly bounded spatial initial metrics with the prescribed component limits yield global integrated tracking, with pointwise tracking away from nodes after an initial transient; a rank-two example has genuinely noncommuting component metrics.",
        "significance": "It establishes the basic nonlinear approximation on a degenerating base that the later gluing and all-time papers extend.",
        "limits": "The bundle is trivial, each node joins distinct smooth components, and the nonlinear comparison covers bounded rescaled intervals. General gluing and all-time control require the later results.",
        "prerequisite": "The weighted-graph picture of Paper 23 is a useful starting point, with positive matrices replacing scalar values on the components."
      }
    },
    {
      "id": 26,
      "title": "Hermitian–Yang–Mills flow and gluing on degenerating curves",
      "short": "Global gluing & inverse geometry",
      "branch": "degeneration",
      "rank": 12,
      "rationale": "A broad synthesis on a degenerating base combines genuine noncommuting gluing, actual flow, relative spectra, moduli metrics and marked inverse information. Recovering incidence and integral monodromy is especially distinctive, with eigenfunction observations and markings explicitly part of the data.",
      "scope": "Specified compact curve families; all-time tracking needs a normalized gap, and the moduli/inverse results use narrower stated subfamilies.",
      "role": "Integrated synthesis",
      "status": "Public preprint",
      "pdf": "/papers/global-gluing-hym-curves/paper.pdf",
      "sha256": "2937a59b1f99b5254824e1bbf57d9b3045c752b54a531c85c49d85fbc544623d",
      "slug": "global-gluing-hym-curves",
      "page": "/papers/global-gluing-hym-curves/",
      "doi": "10.5281/zenodo.24149197",
      "publicationDate": "2026-11-11",
      "revisionDate": "2026-11-11",
      "explanation": {
        "question": "How do noncommuting bundle identifications across shrinking necks control flow, spectra and the geometry recoverable from low modes?",
        "idea": "Transport one component metric into the frame of the next before measuring their symmetric-space distance, so the finite energy remembers the bundle's gluing. Compare this model with the actual flow, then use eigenvalues together with component averages of eigensections to recover marked transport information.",
        "result": "On the specified six-parameter quartic degeneration, the paper proves relative asymptotics for every small mode and nonlinear tracking uniform in all neck-length ratios, with entry from an open spatial initial class. Under a positive normalized gap it gives all-time tracking; narrower subfamilies also yield a leading moduli metric, marked projective-gluing recovery, and recovery of adjacency and integral monodromy in a finite class of curve degenerations.",
        "significance": "It brings actual dynamics, relative spectra, moduli geometry and marked inverse questions together on compact degenerating curves.",
        "limits": "All-time tracking retains the normalized-gap hypothesis. The inverse results use eigenfunction observations, fixed frames and specified families; an unmarked eigenvalue list does not determine arbitrary topology.",
        "prerequisite": "Read Paper 25 for the finite matrix flow and think of gluing as a unitary change of frame across each node."
      }
    },
    {
      "id": 27,
      "title": "Hermitian–Yang–Mills flow on degenerating Calabi–Yau threefolds of type K",
      "short": "A genuine threefold realization",
      "branch": "degeneration",
      "rank": 18,
      "rationale": "It realizes effective HYM dynamics on a compact Calabi–Yau threefold with a nonflat rank-four bundle and initial data beyond the tensor ansatz. This is a meaningful dimensional advance, tempered by the type-K product construction and prescribed product-induced metrics.",
      "scope": "Enriques/type-K threefolds, not simply connected full-SU(3) examples; metrics need not be Ricci-flat, and all-time tracking retains a rate bound.",
      "role": "Higher-dimensional realization",
      "status": "Public preprint",
      "pdf": "/papers/type-k-hym-dynamics/paper.pdf",
      "sha256": "64e63f53c9324d364f6f9e61ab892464dc4835be63c782bd08212da4853e9342",
      "slug": "type-k-hym-dynamics",
      "page": "/papers/type-k-hym-dynamics/",
      "doi": "10.5281/zenodo.24149210",
      "publicationDate": "2026-11-11",
      "revisionDate": "2026-11-11",
      "explanation": {
        "question": "Can effective noncommuting HYM dynamics be realized on a compact Calabi–Yau threefold with a nonflat bundle?",
        "idea": "Take a free quotient of a K3 surface times a degenerating elliptic curve, carrying a rank-four bundle whose weak modes survive the quotient constraints. The resulting finite energy has endpoint constraints whose relative angle records transport around the elliptic cycle.",
        "result": "For this type-K threefold family with prescribed product-induced Kähler metrics, the paper determines all five small eigenvalues and reconstructs a finite matrix flow that tracks actual HYM trajectories. An open class including non-tensor initial metrics enters the comparison; tracking is uniform on bounded rescaled intervals and extends to all subsequent times where the least effective eigenvalue has a positive lower bound.",
        "significance": "It supplies a compact higher-dimensional realization with nonzero bundle curvature and initial data beyond the product ansatz.",
        "limits": "These are type-K quotient threefolds, not simply connected full-SU(3) examples, and the prescribed metrics need not be Ricci-flat. The five-eigenvalue inverse recovers projective cycle transport within the known family, not arbitrary threefold or bundle topology.",
        "prerequisite": "Use the gluing model of Paper 26, together with the basic idea of forming a smooth space by a free finite-group quotient."
      }
    },
    {
      "id": 28,
      "title": "All-time approximation of Hermitian–Yang–Mills flow on degenerating curves",
      "short": "Every relaxation time",
      "branch": "degeneration",
      "rank": 10,
      "rationale": "A residual and energy argument removes the weakest-rate lower bound and controls actual curve flow through every relaxation time. Its fixed-constraint absolute approximation remains a distinct result alongside the later conifold invariant-graph theorem, which has different geometry, error control and basin hypotheses.",
      "scope": "A compact genus-three family with four node and two component-holonomy parameters; absolute all-time error, fixed constraints, small finite initial data.",
      "role": "Analytic breakthrough",
      "status": "Public preprint",
      "pdf": "/papers/all-time-hym-curves/paper.pdf",
      "sha256": "fd96113b876d2e7d105b46ee2b48d7ec3a747949ffd69135d3decd972e1043c6",
      "slug": "all-time-hym-curves",
      "page": "/papers/all-time-hym-curves/",
      "doi": "10.5281/zenodo.24149212",
      "publicationDate": "2026-11-11",
      "revisionDate": "2026-11-11",
      "explanation": {
        "question": "Can the finite matrix model follow the actual flow for every time, even when its slowest relaxation rate is much smaller than the others?",
        "idea": "Use the zero angular mean of the leading component-frame error to write it as a global divergence. Combining the resulting energy estimate with time-integrated bounds for the finite flow avoids dividing the error by the weakest decay rate.",
        "result": "On a compact genus-three family with four independent node parameters and two component-holonomy parameters, fixed holonomy generators and node identifications yield an absolute integrated error bound uniform for all time. For uniformly bounded actual initial metrics and small finite initial data, the bound is the initial integrated discrepancy plus a term vanishing as the parameters tend independently to zero; an explicit stable family has relaxation times of orders h⁻¹, h⁻² and h⁻⁴, all covered by the nonlinear theorem.",
        "significance": "It removes the weakest-rate restriction from the nonlinear comparison on this family and reaches every later relaxation scale.",
        "limits": "The nonlinear result keeps the holonomy generators and node identifications fixed and requires a small finite basin. It controls absolute integrated error, not relative error at the weakest mode, and does not establish nonlinear uniformity under varying constraints.",
        "prerequisite": "Read Paper 26 for the gluing dynamics, then distinguish an error estimate uniform in time from a bound valid only on each fixed time interval."
      }
    },
    {
      "short": "Relative conifold spectra",
      "branch": "spectral",
      "role": "Multiscale analytic foundation",
      "rationale": "The full Ricci-flat construction and relative control of an entire small spectral space survive arbitrary separation of node scales. This removes the fixed-ray restriction in the chosen family and supplies the analytic foundation for the common-family flow and reconstruction results. Its depth and reuse place it just behind the general local theorem and integral inverse construction.",
      "scope": "The explicit eight-node, six-parameter polarized family; arbitrary nonzero period ratios, with a fixed central geometry and marking.",
      "explanation": {
        "question": "How does the actual Ricci-flat Hodge spectrum behave when different conifold nodes smooth at independently separated scales?",
        "idea": "Retain the quadratic harmonic cap modes by exact complex automorphisms, solve the global Ricci-flat correction uniformly, then compare the full small two-form energy with the capacity-weighted restriction form.",
        "result": "Exactly two positive two-form eigenvalues tend to zero over the full period base. Relative energy and harmonic mass comparisons determine both eigenlines in fixed cohomological coordinates, with a complementary gap and logarithmic or iterated-logarithmic hierarchies.",
        "significance": "This is a uniform theorem for actual Ricci-flat geometry across independent scales. It supplies the analytic background used by the nonflat bundle construction and the integral reconstruction synthesis.",
        "limits": "The central eight-node family and polarization are fixed. The theorem is not uniform over arbitrary central coefficients and does not reconstruct a complete manifold or its metric from two eigenvalues.",
        "prerequisite": "Read Paper 22 for the fixed-ray Hodge problem and Paper 2 for the compact toric transition; Hodge theory, conifold geometry and weighted elliptic analysis are useful."
      },
      "id": 29,
      "title": "Relative Hodge spectra of multiscale conifold smoothings",
      "slug": "relative-hodge-conifold-smoothings",
      "status": "Public preprint",
      "page": "/papers/relative-hodge-conifold-smoothings/",
      "pdf": "/papers/relative-hodge-conifold-smoothings/paper.pdf",
      "sha256": "fb82519246a0269565ced27c93cfe03bac455f40bf3a73e4ea22aa0f95325406",
      "doi": "10.5281/zenodo.24175848",
      "publicationDate": "2026-11-12",
      "revisionDate": "2026-11-12",
      "rank": 3
    },
    {
      "short": "Conifold flow and moduli",
      "branch": "degeneration",
      "role": "Common-family geometric synthesis",
      "rationale": "Actual Ricci-flat degeneration, a nonflat bundle, changing weak kernels, all-time nonlinear phase tracking and harmonic moduli geometry are controlled on one family. The combination reaches well beyond a finite model. The rank-four family and spatial basin are specific, so the broader fixed-background foundation retains first place.",
      "scope": "Nonflat rank-four bundles on the selected conifold fibres; an open spatial C¹ basin, fixed base and bundle along each trajectory, and paths confined to the local moduli locus.",
      "explanation": {
        "question": "Can the same degenerating Ricci-flat threefold carry a nonflat bundle whose spectrum, actual metric flow and harmonic moduli geometry remain quantitatively controlled?",
        "idea": "Construct and balance the two-arrow bundle family, retain all seven weak endomorphism directions, solve on the uniform complement, and build an exact finite invariant graph with an initial-phase map.",
        "result": "Every weak eigenvalue has relative control, including changing kernels and separated positive rates. Actual HYM trajectories in an open spatial C¹ basin track exact graph trajectories exponentially for all time. The local harmonic metric has confined tangent cone (ℂ², 4|du|²)/((ℤ/2)² ⋊ S₂).",
        "significance": "This joins base degeneration, bundle stability, complete weak spectra, nonlinear flow and actual local moduli geometry. Independent base and bundle scales are allowed on the same geometric family.",
        "limits": "Each flow fixes its base and holomorphic bundle. The theorem uses a specified nonflat rank-four family, an open local basin and confined moduli distances; it is not a global theorem for arbitrary bundles or arbitrary initial metrics.",
        "prerequisite": "Paper 29 supplies the uniform Ricci-flat background. Papers 15 and 16 explain fixed-background stationary and phase reduction, whose required uniform estimates are proved anew here."
      },
      "id": 30,
      "title": "Hermitian–Yang–Mills dynamics and harmonic moduli near a conifold",
      "slug": "conifold-hym-dynamics",
      "status": "Public preprint",
      "page": "/papers/conifold-hym-dynamics/",
      "pdf": "/papers/conifold-hym-dynamics/paper.pdf",
      "sha256": "37241120331c82ab66b046a893c240bb812708fe7152ae1bf77371bbe9e9d68b",
      "doi": "10.5281/zenodo.24175924",
      "publicationDate": "2026-11-12",
      "revisionDate": "2026-11-12",
      "rank": 4
    },
    {
      "short": "Integral recovery from periods",
      "branch": "geometry",
      "role": "Global inverse construction",
      "rationale": "The closest direct advance towards recovering global topology from degeneration: a terminating observation construction recovers an unknown marked integral vanishing-cycle map, saturation and monodromy, and connects them to actual spectra and flow on the same family. The output is substantial but specific; a global marking, certified periods and a possibly ineffective analytic neighbourhood remain part of the result.",
      "scope": "A selected six-parameter conifold family, geometrically constructed marking and certified period observations; a terminating construction rather than an executed full integer matrix.",
      "explanation": {
        "question": "Can degenerating periods reveal an unknown integral vanishing-cycle lattice, rather than merely predict a spectrum from topology already supplied?",
        "idea": "Select algebraic equations, construct a symplectic marking and certified cycle transport, then increase observation precision until Picard–Lefschetz period jumps identify each integer column without a height prior.",
        "result": "The construction recovers the map ℤ⁸ → ℤ¹³⁴ with rank-six image, its saturation, quotient torsion and monodromy. Its real kernel is the divisor restriction image governing the two weak Hodge directions. The Hodge and nonflat bundle-flow results apply on a smaller neighbourhood of the same family.",
        "significance": "A genuine inverse step now accompanies the forward metric and spectral theory: specified global integral information is recovered from constructed marked observations, and its relation to the geometric analytic operators is explicit.",
        "limits": "The full matrix and Smith data are not numerically executed; no practical runtime bound is claimed. The analytic neighbourhood can be ineffective. This does not recover the full cohomology ring, diffeomorphism type or complete metric from local nodes or eigenvalues alone.",
        "prerequisite": "Conifold surgery, Picard–Lefschetz theory and certified period computation motivate the construction. Papers 29 and 30 provide the imported analytic conclusions, with hypotheses checked here."
      },
      "id": 31,
      "title": "Integral vanishing cycles from periods on conifold smoothings",
      "slug": "conifold-integral-reconstruction",
      "status": "Public preprint",
      "page": "/papers/conifold-integral-reconstruction/",
      "pdf": "/papers/conifold-integral-reconstruction/paper.pdf",
      "sha256": "f573fe0135e0a967d01eeee17314e09ae0ef389b7c29e5ab14583faf8b840c75",
      "doi": "10.5281/zenodo.24175968",
      "publicationDate": "2026-11-12",
      "revisionDate": "2026-11-12",
      "rank": 2
    },
    {
      "short": "Point-defect flow law",
      "branch": "dynamics",
      "role": "Sharp singular replacement law",
      "rationale": "A conceptually independent advance resolves the missing leading law exposed by the singular-graded obstruction: an explicit inverse-time coefficient, an actual charge-one inner metric and matching concentration radii for every smooth fixed-determinant initial metric in the reduced distinct-factor class. Its geometric scope is narrower than the general stationary theorem but its conclusion is sharp.",
      "scope": "Rank-two locally free extensions on compact Kähler surfaces; sharp profiles for nonempty reduced defects and distinct equal-degree line factors. Broader finite defects have one-sided bounds.",
      "explanation": {
        "question": "When a graded quotient has point defects, what replaces the smooth weight-model asymptotic and how does the actual metric concentrate?",
        "idea": "Use the local residue and dissipation identities, correct a compact metric family orthogonally to its small connection eigenspace, and compare the resulting trajectory with every actual fixed-determinant flow.",
        "result": "The integrated squared inclusion norm satisfies Z(T) ∼ v₀²/(4π²σT). Rescaled metrics converge smoothly to an explicit charge-one anti-self-dual profile; inclusion half-height and half-defect-energy radii have the same leading order-T⁻¹ᐟ² value. General finite defects obey O(T⁻¹), with TZ(T) → 0 for a nonreduced defect.",
        "significance": "The singular-graded branch now has a positive quantitative replacement law and concentration profile, not only an obstruction to extending a smooth model. The leading coefficient retains the local inclusion geometry.",
        "limits": "The sharp coefficient and profile require reduced defects and distinct line factors. Repeated factors and nonreduced defects retain only the stated bounds. The base surface stays smooth; this is not singular flow on the conifold threefold family.",
        "prerequisite": "Paper 10 gives the obstruction and toric example. Knowledge of HYM flow, surface bubbling and local anti-self-dual connections helps separate the established limiting charges from the new quantitative profile."
      },
      "id": 32,
      "title": "Point defects and Hermitian–Yang–Mills flow on surfaces",
      "slug": "point-defects-hym-flow",
      "status": "Public preprint",
      "page": "/papers/point-defects-hym-flow/",
      "pdf": "/papers/point-defects-hym-flow/paper.pdf",
      "sha256": "d4b742421d750f25165118eaffc0b80ce0aa1a1be7b0e1147290de48a1183c6e",
      "doi": "10.5281/zenodo.24175884",
      "publicationDate": "2026-11-12",
      "revisionDate": "2026-11-12",
      "rank": 5
    }
  ],
  "graph": {
    "generated": "2026-11-12",
    "scope": "Selected direct intra-series theorem inputs and explicitly acknowledged method extensions in the current canonical sources; Papers 1–32 only.",
    "methodology": [
      "An arrow points from a source paper to a paper that uses or extends it.",
      "Theorem means that a result or geometric construction is expressly used as an input. It may support an application rather than the entire later paper.",
      "Method means an explicitly acknowledged extension or reused proof mechanism; it does not assert that the later proof imports a theorem without reproving it.",
      "Theme links are separate, non-directional conceptual relationships and must not be counted as mathematical dependencies.",
      "This curated graph is not an exhaustive citation graph, proof dependency audit, novelty assessment, or ranking metric. Classical and external-series inputs are omitted.",
      "Selected edges are not transitively reduced: a later paper can directly invoke both an original theorem and a subsequent application."
    ],
    "edges": [
      {
        "from": 1,
        "to": 3,
        "kind": "theorem",
        "reason": "The stationary two-step Hermitian–Einstein comparison is an explicitly imported theorem.",
        "evidence": [
          {
            "path": "papers/03_metric_response_flow/paper.tex",
            "line": 546,
            "endLine": 556,
            "excerpt": "We state precisely the independent stationary input from\n\\cite[Theorem~1.1]{wuebben2026uniform}.\n\n\\begin{theorem}[Stationary two-step comparison]\\label{thm02:stationary}\nLocally \\(E\\) is stable exactly when \\(b\\in D\\RR_{>0}^{E(\\Gamma)}\\).\nFor such \\(b\\) the unique rank-centered balancing potential \\(x^0\\)\nsatisfies\n\\begin{equation}\\label{eq02:balance}\n k_e=c_e(s)e^{(D^Tx^0)_e},\\qquad Dk=b,\n \\qquad\\sigma=\\sum_ek_e=\\sum_{i\\in I}b_i.\n\\end{equation}",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/03_metric_response_flow/paper.tex#L546"
          }
        ]
      },
      {
        "from": 2,
        "to": 3,
        "kind": "theorem",
        "reason": "The toric tangent-bundle geometry supplies the family for the integrated spectral, response and flow theorem.",
        "evidence": [
          {
            "path": "papers/03_metric_response_flow/paper.tex",
            "line": 1776,
            "endLine": 1781,
            "excerpt": "\\section{The common tangent-bundle degeneration}\\label{sec09:tangent}\n\nWe now prove the synthesis theorem stated in the introduction. The\ngeometry is supplied independently by \\cite{wuebben2026realization};\nwe specify all its objects and verify each analytic hypothesis on the\nsame fixed tangent bundle.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/03_metric_response_flow/paper.tex#L1776"
          }
        ]
      },
      {
        "from": 1,
        "to": 4,
        "kind": "method",
        "reason": "Extends the distinct-factor spectral theorem to repeated factors, but explicitly proves the needed results independently.",
        "evidence": [
          {
            "path": "papers/04_repeated_factor_spectra/sections/01_introduction.tex",
            "line": 195,
            "endLine": 202,
            "excerpt": "iterated-logarithmic asymptotics are developed in\n\\cite[Theorem~5.11]{hkkp2023}. Those comparisons concern bounded metric\ndistance in a flow problem. The present result is stationary and gives\na multiplicative error tending to one. It extends the distinct-factor\nspectral theorem of~\\cite{wuebben2026uniform}; no result of that paper\nis needed as an unproved step in the argument below.\n\nThe new estimate is Proposition~\\ref{prop:projection}: the reduced",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/04_repeated_factor_spectra/sections/01_introduction.tex#L195"
          }
        ]
      },
      {
        "from": 1,
        "to": 5,
        "kind": "method",
        "reason": "Retains the two-step cut-relative correction and energy-relative spectral mechanism for composable three-step extensions.",
        "evidence": [
          {
            "path": "papers/05_three_step_metrics/paper.tex",
            "line": 264,
            "endLine": 271,
            "excerpt": "The cut-relative correction and energy-relative spectral argument have\ntwo-step predecessors in \\cite{wuebben2026bipartite,wuebben2026repeated}.\nThe intrinsic differentiation and complementary inverse were used for\ntwo-step response in \\cite{wuebben2026response}. We retain these mechanisms\nand prove the new nonlinear geometric and differentiated cut estimates\nneeded here. The scalar distinct-line theorem does not subsume the\nmatrix multiplicities in \\cite{wuebben2026repeated}. Nor does the\n$24$-coordinate diamond exhaust the full graded deformation space.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/05_three_step_metrics/paper.tex#L264"
          }
        ]
      },
      {
        "from": 4,
        "to": 5,
        "kind": "method",
        "reason": "Repeated-factor projection and spectral methods are acknowledged predecessors; the three-step paper proves new composable estimates.",
        "evidence": [
          {
            "path": "papers/05_three_step_metrics/paper.tex",
            "line": 264,
            "endLine": 271,
            "excerpt": "The cut-relative correction and energy-relative spectral argument have\ntwo-step predecessors in \\cite{wuebben2026bipartite,wuebben2026repeated}.\nThe intrinsic differentiation and complementary inverse were used for\ntwo-step response in \\cite{wuebben2026response}. We retain these mechanisms\nand prove the new nonlinear geometric and differentiated cut estimates\nneeded here. The scalar distinct-line theorem does not subsume the\nmatrix multiplicities in \\cite{wuebben2026repeated}. Nor does the\n$24$-coordinate diamond exhaust the full graded deformation space.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/05_three_step_metrics/paper.tex#L264"
          }
        ]
      },
      {
        "from": 3,
        "to": 5,
        "kind": "method",
        "reason": "Extends intrinsic differentiation and the complementary inverse from two-step response to three-step response.",
        "evidence": [
          {
            "path": "papers/05_three_step_metrics/paper.tex",
            "line": 1795,
            "endLine": 1802,
            "excerpt": "of $Z$ was required, because the derivative varies $s$ at fixed $z$.\n\nThe intrinsic differentiation and the complementary inverse are the same\nstandard mechanisms used for two-step response in \\cite{wuebben2026response}.\nThe additional estimates here are the differentiated every-cut bounds and\nthe quadratic fixed-bundle term \\eqref{eq:phi-derivative}. They make the\ncomparison uniform on this two-dimensional input even when a third graph\nmode is present and the positive scales separate without restriction.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/05_three_step_metrics/paper.tex#L1795"
          }
        ]
      },
      {
        "from": 5,
        "to": 6,
        "kind": "theorem",
        "reason": "The selected three-step stationary construction is imported before the full deformation and quotient arguments.",
        "evidence": [
          {
            "path": "papers/06_wall_moduli_metrics/paper.tex",
            "line": 296,
            "endLine": 302,
            "excerpt": "higher-order terms in the chosen coordinates, a uniform wall chart,\nits quantitative transition to actual endpoint harmonic coordinates,\nand the realization of the relative estimate on the full local HE\nquotient. The stationary construction for the selected three-step\nfamily is taken from \\cite{wuebben2026three} with its scope restated\nin Section~\\ref{sec:geometry}. Complete deformation and quotient\narguments are proved here.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/06_wall_moduli_metrics/paper.tex#L296"
          }
        ]
      },
      {
        "from": 4,
        "to": 7,
        "kind": "method",
        "reason": "The projection method and finite degree argument are retained and extended through composable quartic cancellation.",
        "evidence": [
          {
            "path": "papers/07_repeated_factor_moduli/paper.tex",
            "line": 899,
            "endLine": 906,
            "excerpt": "\\end{proof}\n\nThe projection method and the finite degree argument below come from\nthe two-step repeated-factor analysis in \\cite{WuebbenRepeated26}.\nThe new analytic point here is the quartic cancellation on the complete\ncomposable model: a two-step sign symmetry is unavailable in the presence\nof its reverse arrows. The preserving arrays in the proof were not\nrequired to satisfy the nonlinear relations.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/07_repeated_factor_moduli/paper.tex#L899"
          }
        ]
      },
      {
        "from": 6,
        "to": 7,
        "kind": "theorem",
        "reason": "Imports the general analytic quotient theorem and transverse linear lemma for the repeated-factor full quotient.",
        "evidence": [
          {
            "path": "papers/07_repeated_factor_moduli/paper.tex",
            "line": 1523,
            "endLine": 1533,
            "excerpt": "We recall precisely the analytic input from\n\\cite[Theorem 8.1]{WuebbenWallMetrics26}. For a fixed parallel complex\nalgebra and its fixed zero-form complement, suppose the split Poincar\\'e\nestimate is uniform, the harmonic space and normalized zero-form inner\nproduct are fixed, and spatial norms are uniformly equivalent. Suppose\nthe full equivariant reconstruction satisfies\n\\[\n Jv=\\iota v+B_xv,\\qquad\n \\langle\\iota w,B_xv\\rangle_p=0,\\qquad\n \\|B_xv\\|_p\\le C|x|\\|v\\|_p,\n\\]",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/07_repeated_factor_moduli/paper.tex#L1523"
          }
        ]
      },
      {
        "from": 3,
        "to": 8,
        "kind": "method",
        "reason": "Extends the two-step invariant-graph and prescribed-metric matching methods to phase selection and three-layer recovery.",
        "evidence": [
          {
            "path": "papers/08_flow_phase/paper.tex",
            "line": 294,
            "endLine": 305,
            "excerpt": "topology needed for finite-time entry \\cite{Simonett95}.\n\nFor two-step extensions, \\cite[Sections 6 and 8]{WuebbenFlow26}\nalready constructs exact invariant-graph flows and proves\nprescribed-metric matching with all-future comparison after\nrestart. The additions here are the complete composable\ndeformation family, the phase with decaying relative error and\nits differentiability, and the three-layer geometric matching\nneeded for the independent two-parameter application.\nStationary metric and spectral estimates are imported only\nin their stated scope from \\cite{WuebbenThreeStep26,WuebbenWall26}.\nThey do not supply parabolic invariance or phase selection.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/08_flow_phase/paper.tex#L294"
          }
        ]
      },
      {
        "from": 5,
        "to": 8,
        "kind": "theorem",
        "reason": "Imports stationary metric and spectral estimates for the three-step application, with their original scope.",
        "evidence": [
          {
            "path": "papers/08_flow_phase/paper.tex",
            "line": 300,
            "endLine": 305,
            "excerpt": "deformation family, the phase with decaying relative error and\nits differentiability, and the three-layer geometric matching\nneeded for the independent two-parameter application.\nStationary metric and spectral estimates are imported only\nin their stated scope from \\cite{WuebbenThreeStep26,WuebbenWall26}.\nThey do not supply parabolic invariance or phase selection.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/08_flow_phase/paper.tex#L300"
          }
        ]
      },
      {
        "from": 6,
        "to": 8,
        "kind": "theorem",
        "reason": "Imports the complete local quotient and its coverage to specify the actual geometric family.",
        "evidence": [
          {
            "path": "papers/08_flow_phase/paper.tex",
            "line": 178,
            "endLine": 185,
            "excerpt": "The nearby stable HE classes are represented by the corrected\nbalanced locus $\\mathcal B_l^{\\rm st}$ of\nSection~\\ref{sec:geometry}. The complete local quotient and its\ncoverage are imported, with their hypotheses, from\n\\cite{WuebbenWall26}; they specify the actual geometric family.\n\nTheorem~\\ref{thm:invariant-graph} constructs a chosen finitely\ndifferentiable graph $u=\\Psi(l,x)$ in complementary logarithmic",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/08_flow_phase/paper.tex#L178"
          }
        ]
      },
      {
        "from": 8,
        "to": 9,
        "kind": "theorem",
        "reason": "Imports the common local reduction, differentiable phase theorem and signed nonstationary spectral estimate.",
        "evidence": [
          {
            "path": "papers/09_wall_unstable_flow/paper.tex",
            "line": 345,
            "endLine": 353,
            "excerpt": "flows and comparison after a prescribed-metric restart.\nThe common local reduction, the abstract differentiable\nphase theorem and the signed nonstationary spectral estimate\nneeded here are established in \\cite{WuebbenPhase26}.\nSection~\\ref{sec:setup} states their hypotheses and conclusions.\nThe full geometric family and its exact all-morphism statement\ncome from \\cite[Sections 6 and 9]{WuebbenWall26}.\n\nThe new global argument begins with height coercivity on",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/09_wall_unstable_flow/paper.tex#L345"
          }
        ]
      },
      {
        "from": 6,
        "to": 9,
        "kind": "theorem",
        "reason": "Imports the full geometric family and exact all-morphism statement at and beyond the wall.",
        "evidence": [
          {
            "path": "papers/09_wall_unstable_flow/paper.tex",
            "line": 347,
            "endLine": 351,
            "excerpt": "phase theorem and the signed nonstationary spectral estimate\nneeded here are established in \\cite{WuebbenPhase26}.\nSection~\\ref{sec:setup} states their hypotheses and conclusions.\nThe full geometric family and its exact all-morphism statement\ncome from \\cite[Sections 6 and 9]{WuebbenWall26}.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/09_wall_unstable_flow/paper.tex#L347"
          }
        ]
      },
      {
        "from": 2,
        "to": 10,
        "kind": "theorem",
        "reason": "Imports the toric construction and stability wall for the singular graded example; the general surface theorem has additional scope.",
        "evidence": [
          {
            "path": "papers/10_singular_hym_asymptotics/paper.tex",
            "line": 298,
            "endLine": 303,
            "excerpt": "\\subsection{Relation to existing results and organization}\nThe toric construction and its stability wall are taken from\n\\cite{wuebben2026}, and are recalled to make the local singularity explicit.\nThe convergence of the actual flow to the reflexive graded connection,\nincluding its singular set, is the theorem of Sibley--Wentworth in its\ncorrected form. Our flow result adds a quantitative obstruction for the",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/10_singular_hym_asymptotics/paper.tex#L298"
          }
        ]
      },
      {
        "from": 4,
        "to": 13,
        "kind": "method",
        "reason": "Adapts projection-relative curvature estimates and spectral-projection balancing to the obstructed K3 deformation locus.",
        "evidence": [
          {
            "path": "papers/13_k3_metric_wall_crossing/sections/01_introduction.tex",
            "line": 268,
            "endLine": 275,
            "excerpt": "Hermitian factor of a complex gauge transformation bounds that factor\nuniformly through rank loss. Projection-relative curvature estimates and\nfinite-dimensional balancing by spectral projections were developed for\nrepeated stable factors in \\cite{Wue26a,Wue26c}. Here we adapt this method\nto the exact obstructed K3 deformation locus and compare different real\nmoment levels. Section~\\ref{sec:balancing} gives the required argument\nin full.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/13_k3_metric_wall_crossing/sections/01_introduction.tex#L268"
          }
        ]
      },
      {
        "from": 6,
        "to": 13,
        "kind": "method",
        "reason": "Uses complementary-gauge minimization as the method for identifying the actual harmonic quotient norm.",
        "evidence": [
          {
            "path": "papers/13_k3_metric_wall_crossing/sections/01_introduction.tex",
            "line": 275,
            "endLine": 281,
            "excerpt": "The harmonic norm requires a separate identification. We first minimize\nover the uniformly coercive complement of the parallel gauge algebra,\nas in the complementary-gauge method of \\cite{Wue26b}. The result is a\nsmooth positive Hermitian form on the full deformation space. A central\nautomorphism acting by minus the identity removes its linear term.\nOnly then do we minimize over the remaining complex orbit directions.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/13_k3_metric_wall_crossing/sections/01_introduction.tex#L275"
          }
        ]
      },
      {
        "from": 7,
        "to": 13,
        "kind": "method",
        "reason": "Adapts the repeated-factor balancing method to obstructed K3 deformations and different real moment levels.",
        "evidence": [
          {
            "path": "papers/13_k3_metric_wall_crossing/sections/01_introduction.tex",
            "line": 268,
            "endLine": 275,
            "excerpt": "Hermitian factor of a complex gauge transformation bounds that factor\nuniformly through rank loss. Projection-relative curvature estimates and\nfinite-dimensional balancing by spectral projections were developed for\nrepeated stable factors in \\cite{Wue26a,Wue26c}. Here we adapt this method\nto the exact obstructed K3 deformation locus and compare different real\nmoment levels. Section~\\ref{sec:balancing} gives the required argument\nin full.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/13_k3_metric_wall_crossing/sections/01_introduction.tex#L268"
          }
        ]
      },
      {
        "from": 13,
        "to": 14,
        "kind": "method",
        "reason": "Extends the two-factor K3 projection-relative moment and harmonic-coordinate argument to arbitrary quiver stabilizers.",
        "evidence": [
          {
            "path": "papers/14_quiver_metric_wall_crossing/sections/01_introduction.tex",
            "line": 81,
            "endLine": 92,
            "excerpt": "papers. The spectral-cut calibration is from\n\\cite{Wue26a}, and its repeated-factor form is developed in\n\\cite{Wue26c}. Relative moduli-metric comparison by complementary\nminimization is developed in \\cite{Wue26b,Wue26c}.\nThe projection-relative moment estimate and the harmonic\ncoordinate argument were used for the two-factor K3 example in\n\\cite{Wue26d}. Here the finite correction treats arbitrary\nquiver stabilizers, including loops, and its reverse direction\ncovers the full nearby solution space. We give the required\nproofs rather than import conclusions restricted to those earlier\nrepresentations.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/14_quiver_metric_wall_crossing/sections/01_introduction.tex#L81"
          }
        ]
      },
      {
        "from": 7,
        "to": 14,
        "kind": "method",
        "reason": "Develops the repeated-factor spectral-cut and relative quotient mechanisms in the arbitrary-quiver setting.",
        "evidence": [
          {
            "path": "papers/14_quiver_metric_wall_crossing/sections/01_introduction.tex",
            "line": 79,
            "endLine": 90,
            "excerpt": "These steps develop methods from the preceding stability-degeneration\npapers. The spectral-cut calibration is from\n\\cite{Wue26a}, and its repeated-factor form is developed in\n\\cite{Wue26c}. Relative moduli-metric comparison by complementary\nminimization is developed in \\cite{Wue26b,Wue26c}.\nThe projection-relative moment estimate and the harmonic\ncoordinate argument were used for the two-factor K3 example in\n\\cite{Wue26d}. Here the finite correction treats arbitrary\nquiver stabilizers, including loops, and its reverse direction\ncovers the full nearby solution space. We give the required\nproofs rather than import conclusions restricted to those earlier",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/14_quiver_metric_wall_crossing/sections/01_introduction.tex#L79"
          }
        ]
      },
      {
        "from": 14,
        "to": 15,
        "kind": "theorem",
        "reason": "Imports the finite balancing theorem for arbitrary quivers and invariant analytic subsets.",
        "evidence": [
          {
            "path": "papers/15_local_hym_reduction/sections/03_metrics.tex",
            "line": 5,
            "endLine": 17,
            "excerpt": "from weak orbit directions is the reason that the ambient estimate\nof Proposition~\\ref{prop:quadratic-form} suffices.\n\n\\begin{lemma}[{\\cite[Theorem~2.1]{wuebben14}}]\\label{lem:balancing}\nLet $V$ be a finite quiver representation with compact group\n$K=\\prod_i\\mathrm U(W_i)$ and flat moment map $\\mu$ as in\n\\eqref{eq:moment}. On a ball suppose $\\Omega$ is closed and invariant,\n$\\rho(0)=0$,\n\\[\n d\\langle\\rho,S\\rangle=2\\Omega(iC_xS,\\cdot),\\qquad\n \\|\\Omega-\\omega_{\\mathrm{flat}}\\|\\le\\varepsilon .\n\\]\nFor sufficiently small $\\varepsilon$, depending only on the fixed",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/15_local_hym_reduction/sections/03_metrics.tex#L5"
          }
        ]
      },
      {
        "from": 4,
        "to": 15,
        "kind": "method",
        "reason": "Extends the repeated-factor relative Schur spectral mechanism to general locally free polystable backgrounds.",
        "evidence": [
          {
            "path": "papers/15_local_hym_reduction/sections/04_spectrum.tex",
            "line": 72,
            "endLine": 78,
            "excerpt": "This is the relative Schur mechanism used for repeated-factor\nextensions in \\cite[Section~5]{wuebben4} and the full local model\nof \\cite[Section~5]{wuebben7}. Here canonical harmonic equivariance\nsupplies its hypotheses on a general background.\n\n\\subsection{Transfer to the actual HE metric}",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/15_local_hym_reduction/sections/04_spectrum.tex#L72"
          }
        ]
      },
      {
        "from": 6,
        "to": 15,
        "kind": "theorem",
        "reason": "Imports the complementary-minimization principle and verifies its hypotheses in the general moving presentation.",
        "evidence": [
          {
            "path": "papers/15_local_hym_reduction/sections/07_recovery.tex",
            "line": 49,
            "endLine": 56,
            "excerpt": "\\subsection{Full local moduli and K3 coordinates}\nThe complementary-minimization result\n\\cite[Section~8]{wuebben6} is an imported principle in a more\ngeneral compact-complex formulation. The harmonic arguments here\nverify its hypotheses in the moving presentation. The\n$83$-coordinate wall chart of that paper instead uses a fixed\nreference Hodge contraction. Its product geometry gives the\nrequired orthogonality in the current norms: each harmonic Hom",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/15_local_hym_reduction/sections/07_recovery.tex#L49"
          }
        ]
      },
      {
        "from": 7,
        "to": 15,
        "kind": "method",
        "reason": "Extends the full local-model relative Schur mechanism through canonical harmonic equivariance.",
        "evidence": [
          {
            "path": "papers/15_local_hym_reduction/sections/04_spectrum.tex",
            "line": 72,
            "endLine": 78,
            "excerpt": "This is the relative Schur mechanism used for repeated-factor\nextensions in \\cite[Section~5]{wuebben4} and the full local model\nof \\cite[Section~5]{wuebben7}. Here canonical harmonic equivariance\nsupplies its hypotheses on a general background.\n\n\\subsection{Transfer to the actual HE metric}",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/15_local_hym_reduction/sections/04_spectrum.tex#L72"
          }
        ]
      },
      {
        "from": 15,
        "to": 16,
        "kind": "theorem",
        "reason": "Imports the full Kuranishi and moving stable-factor construction; also uses its stable bicubic bundle for the application.",
        "evidence": [
          {
            "path": "papers/16_uniform_hym_phase/sections/02_coordinates.tex",
            "line": 39,
            "endLine": 47,
            "excerpt": "H\\\"older space used in the proof.\n\nThe convergent construction \\eqref{eq:kuranishi} is defined on an\nambient ball, including nonintegrable points. On its zero locus\n$d+a_p(x)$ is integrable. We use the full construction as in\n\\cite[Theorem~8.7]{lam} and \\cite[Lemma~2.1]{wuebben15}.\nOne consequence needed for large reconstructing gauges deserves\nan explicit proof.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/16_uniform_hym_phase/sections/02_coordinates.tex#L39"
          }
        ]
      },
      {
        "from": 8,
        "to": 16,
        "kind": "method",
        "reason": "Generalizes the four-line phase and invariant-graph constructions to the full polystable setting.",
        "evidence": [
          {
            "path": "papers/16_uniform_hym_phase/sections/05_geometric.tex",
            "line": 181,
            "endLine": 190,
            "excerpt": "\\subsection{Special cases and scope}\nFor diagonal multiplicity groups, the slice equations\nreduce to those used in the two-step metric response\nand four-line phase constructions\n\\cite[Section~6]{wuebben3},\n\\cite[Sections~3--5]{wuebben8}.\nIn a positive diagonal frame $g=e^Y$, right group\ndifferences become differences of $Y$.\nTheorem~\\ref{thm:main} therefore recovers their basic",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/16_uniform_hym_phase/sections/05_geometric.tex#L181"
          }
        ]
      },
      {
        "from": 14,
        "to": 17,
        "kind": "theorem",
        "reason": "Imports finite balancing, intrinsic quotient metrics and normal slices to compare actual harmonic degenerations.",
        "evidence": [
          {
            "path": "papers/17_exceptional_cycles/sections/02_harmonic_models.tex",
            "line": 185,
            "endLine": 196,
            "excerpt": "We record precisely how the coordinate change preserves this order.\nPull back the flat real K\\\"ahler form by $\\Psi$. By\n\\eqref{eq:cubic-darboux} its error is $O(r^2)$ and its moment is\n$\\mu\\circ\\Psi=\\mu+O(r^4)$, where $r=|x|$. These forms satisfy\nthe exact Hamiltonian identity. The finite balancing theorem\n\\cite[Theorem~2.1]{wuebben14}, applied on balls of radius comparable\nto $r$, changes the real orbit by $e^S$, $\\|S\\|=O(r^2)$, to put\nthe pulled-back and flat moments at the same central target.\nThe theorem includes the inverse correspondence and permits the\ninvariant analytic subset $Q^{-1}(0)$.\n\nFor every $\\xi$, equivariance gives",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/17_exceptional_cycles/sections/02_harmonic_models.tex#L185"
          }
        ]
      },
      {
        "from": 15,
        "to": 17,
        "kind": "theorem",
        "reason": "Applies the full local HYM theorem to the convergent obstruction locus and actual harmonic metric.",
        "evidence": [
          {
            "path": "papers/17_exceptional_cycles/sections/02_harmonic_models.tex",
            "line": 162,
            "endLine": 175,
            "excerpt": "\\subsection{The actual harmonic metric}\nThe full local HYM theorem \\cite[Theorem~1.1 and Sections~3,5]{wuebben15}\napplies to the convergent zero locus $F^{-1}(0)$. It gives nested\ncoefficient neighborhoods and an open classifying homeomorphism to\nthe actual fixed-determinant HYM moduli, smooth on smooth quotient\npieces and covering every sufficiently nearby solution. At a\nbalanced coefficient $x$, its comparison form is\n\\begin{equation}\\label{eq:complex-orbit-minimum}\n g_{\\rm fin}([b],[b])=\n       \\inf_{\\xi\\in\\Lie G}\\|b-C_x\\xi\\|^2,\n \\qquad C_x\\xi=[\\xi,x].\n\\end{equation}\nThe finite orbit operator is $C_x^*C_x$; its positive eigenvalues",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/17_exceptional_cycles/sections/02_harmonic_models.tex#L162"
          }
        ]
      },
      {
        "from": 17,
        "to": 18,
        "kind": "theorem",
        "reason": "Imports the convergent symplectic normal form and compact interacting-cycle examples for integral reconstruction.",
        "evidence": [
          {
            "path": "papers/18_integral_reconstruction/sections/02_geometric_data.tex",
            "line": 103,
            "endLine": 115,
            "excerpt": "The analytic ingredients in (G3) have precise hypotheses. The\ncommon-slope normal form\n\\cite[Proposition~2.1]{wuebben17} applies to locally free\n\\(H\\)-polystable bundles on a Ricci-flat K3, with arbitrary ranks and\nmultiplicities. It is a convergent equivariant holomorphic change\n\\(\\Psi(x)=x+O(\\|x\\|^3)\\), \\(D\\Psi=I+O(\\|x\\|^2)\\), identifying the\nfull obstruction ideal with the complex moment ideal.\nThe resulting harmonic comparison\n\\cite[Corollary~2.2]{wuebben17}, obtained from the local harmonic\nreduction \\cite[Theorem~1.1 and Sections~3,5]{wuebben15} and\nfinite balancing \\cite[Theorem~2.1]{wuebben14}, gives\n\\begin{equation}\\label{eq:relative}\n (1-e_p)g_{p,\\zeta_p(\\theta)}",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/18_integral_reconstruction/sections/02_geometric_data.tex#L103"
          }
        ]
      },
      {
        "from": 14,
        "to": 18,
        "kind": "theorem",
        "reason": "Imports finite balancing, complete quotient continuity and normal metric slices for the global metric comparison.",
        "evidence": [
          {
            "path": "papers/18_integral_reconstruction/sections/01_introduction.tex",
            "line": 203,
            "endLine": 212,
            "excerpt": "common-slope direct sums used here because their automorphism\ngroups are reductive. The controlled convergent symplectic\ncoordinates are imported from \\cite{wuebben17}.\nRelative finite balancing, complete quotient continuity,\nnormal slices and the harmonic comparison are imported from\n\\cite{wuebben14,wuebben15}; their hypotheses and normalizations\nare restated in Section~\\ref{sec:data}.\nThe complete cotangent model metric is classical\n\\cite{biquardgauduchon}.\nOur metric contribution is the whole-fibre and principal-path",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/18_integral_reconstruction/sections/01_introduction.tex#L203"
          }
        ]
      },
      {
        "from": 15,
        "to": 18,
        "kind": "theorem",
        "reason": "Uses the general local harmonic reduction as an explicit input to the geometric-data hypotheses.",
        "evidence": [
          {
            "path": "papers/18_integral_reconstruction/sections/02_geometric_data.tex",
            "line": 109,
            "endLine": 116,
            "excerpt": "full obstruction ideal with the complex moment ideal.\nThe resulting harmonic comparison\n\\cite[Corollary~2.2]{wuebben17}, obtained from the local harmonic\nreduction \\cite[Theorem~1.1 and Sections~3,5]{wuebben15} and\nfinite balancing \\cite[Theorem~2.1]{wuebben14}, gives\n\\begin{equation}\\label{eq:relative}\n (1-e_p)g_{p,\\zeta_p(\\theta)}\n \\ \\leq\\ f_{p,\\theta}^*g_\\theta\\",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/18_integral_reconstruction/sections/02_geometric_data.tex#L109"
          }
        ]
      },
      {
        "from": 17,
        "to": 19,
        "kind": "theorem",
        "reason": "Uses the compact family, primitive exceptional cycles and harmonic degeneration, then computes their full complement and attachments.",
        "evidence": [
          {
            "path": "papers/19_integral_attachments/sections/01_introduction.tex",
            "line": 15,
            "endLine": 23,
            "excerpt": "two planes meeting transversely at a point, or a plane and the first\nHirzebruch surface meeting along its negative section. The compact family,\nits primitive exceptional cycles, and its harmonic metric degeneration\nwere constructed in \\cite{wuebben17}. That calculation determined a\nmiddle-degree attachment with the marked complement ring as an input.\nThe general descent statement in \\cite{wuebben18} likewise retains the\ngeometric overlaps. Here we calculate the complement ring and all its\nordinary integral cohomological attachment maps, and identify the\ncorrespondences induced by the actual compact slope walls.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/19_integral_attachments/sections/01_introduction.tex#L15"
          }
        ]
      },
      {
        "from": 18,
        "to": 19,
        "kind": "theorem",
        "reason": "Imports whole-preimage coverage and global metric comparison for the same cycles whose integral attachments are computed.",
        "evidence": [
          {
            "path": "papers/19_integral_attachments/sections/07_harmonic_geometry.tex",
            "line": 115,
            "endLine": 122,
            "excerpt": "\\le(1+\\varepsilon_b)g_{b,\\zeta_b(\\eta)},\\qquad\n \\varepsilon_b=C_b(|\\eta|+\\|x\\|^2).\n\\end{equation}\nThis is \\cite[Corollary~2.2]{wuebben17}, with whole-preimage\ncoverage as in \\cite[Proposition~5.1]{wuebben18}. The\nconstant depends on the fixed background and complementary\nelliptic gap, but not on ratios of positive finite orbit\neigenvalues. A fixed deeper chart handles degeneration of",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/19_integral_attachments/sections/07_harmonic_geometry.tex#L115"
          }
        ]
      },
      {
        "from": 14,
        "to": 20,
        "kind": "theorem",
        "reason": "Imports finite-dimensional metric slices and localization for the singular K3 metric and tangent-cone theorem.",
        "evidence": [
          {
            "path": "papers/20_singular_hyperkahler_cones/sections/01_introduction.tex",
            "line": 180,
            "endLine": 188,
            "excerpt": "The quantitative local comparison for the harmonic metric is\nimported from \\cite[Theorem~1.1(iii)]{wuebben15}. Its application\nhere uses the full harmonic Kuranishi locus, including repeated\nstable factors. The finite-dimensional metric slices and\nlocalization arguments are those of \\cite[Sections~4--6]{wuebben14}.\nWe state the required versions below. The additional global step\nuses continuous Weil--Petersson potentials from\nBuchdahl--Schumacher \\cite[Theorem~11]{buchdahl21}, the curvature",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/20_singular_hyperkahler_cones/sections/01_introduction.tex#L180"
          }
        ]
      },
      {
        "from": 15,
        "to": 20,
        "kind": "theorem",
        "reason": "Imports the quantitative local harmonic-metric comparison through repeated factors and changing stabilizers.",
        "evidence": [
          {
            "path": "papers/20_singular_hyperkahler_cones/sections/01_introduction.tex",
            "line": 180,
            "endLine": 186,
            "excerpt": "The quantitative local comparison for the harmonic metric is\nimported from \\cite[Theorem~1.1(iii)]{wuebben15}. Its application\nhere uses the full harmonic Kuranishi locus, including repeated\nstable factors. The finite-dimensional metric slices and\nlocalization arguments are those of \\cite[Sections~4--6]{wuebben14}.\nWe state the required versions below. The additional global step",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/20_singular_hyperkahler_cones/sections/01_introduction.tex#L180"
          }
        ]
      },
      {
        "from": 15,
        "to": 21,
        "kind": "theorem",
        "reason": "Applies the energy-relative spectral and quotient-metric comparison to actual light modes and interactions.",
        "evidence": [
          {
            "path": "papers/21_heterotic_k3_enhancement/sections/01_introduction.tex",
            "line": 151,
            "endLine": 157,
            "excerpt": "The quantitative input is the energy-relative spectral and quotient-metric\ncomparison in \\cite{wuebben15}. We use the local harmonic quadraticity\nargument of \\cite{wuebben20} without extending that paper's global\ncompactness theorem to this family. The new comparison concerns the actual scalar representatives and the\ncomplete Yang--Mills amplitude uniformly through a separating Higgs\nhierarchy. The relative vector correction uses the same connection's\ngauge energy and a harmonic transgression identity; the fixed-ray",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/21_heterotic_k3_enhancement/sections/01_introduction.tex#L151"
          }
        ]
      },
      {
        "from": 20,
        "to": 21,
        "kind": "method",
        "reason": "Reuses and prints the local harmonic quadraticity argument; it does not import the global compactness theorem.",
        "evidence": [
          {
            "path": "papers/21_heterotic_k3_enhancement/sections/02_compactification.tex",
            "line": 149,
            "endLine": 155,
            "excerpt": "Consequently both products have zero harmonic projection.\nWriting $\\mathfrak a=x+\\beta$ with $\\beta$ coexact and\n$d^*$-closed eliminates all terms containing $\\beta$ in the\nobstruction and proves \\eqref{eq:quadratic}. This is precisely the\nlocal argument in \\cite[Lemma~3.1]{wuebben20}; it uses none of that\npaper's later global rank or no-bubbling hypotheses.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/21_heterotic_k3_enhancement/sections/02_compactification.tex#L149"
          }
        ]
      },
      {
        "from": 2,
        "to": 22,
        "kind": "theorem",
        "reason": "The eight-node application explicitly uses Paper 2’s geometric realization and exceptional-curve data as premises.",
        "evidence": [
          {
            "path": "papers/22_cy_hodge_spectrum/sections/08_eight_node.tex",
            "line": 1,
            "endLine": 9,
            "excerpt": "\\section{The eight-node transition and its two small modes}\\label{sec:eight-node}\n\nWe apply Theorem~\\ref{thm:matrix} to the compact transition constructed\nin stability--degeneration Paper~2,\n\\cite[Appendix~A, Proposition~A.1]{wuebben-chambers}. This uses its\ngeometric realization and exceptional-curve data as premises. The\nadditional deformation argument below supplies a polarized smoothing\nwith the precise first-order and canonical-bundle properties required\nby the analytic theorem.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/22_cy_hodge_spectrum/sections/08_eight_node.tex#L1"
          }
        ]
      },
      {
        "from": 22,
        "to": 24,
        "kind": "method",
        "reason": "Adapts the conifold spectral argument to induced Kähler metrics, explicitly reproving it rather than importing a theorem.",
        "evidence": [
          {
            "path": "papers/24_nodal_threefold_spectrum/sections/01_intro.tex",
            "line": 119,
            "endLine": 127,
            "excerpt": "The spectral argument of Section~\\ref{sec:spectrum} adapts that of\n\\cite[Sections~4--6]{wuebben-conifold} to the cone $\\{\\sum_j\\sigma_jw_j^2=0\\}\\subset\\CC^4$ of\nSection~\\ref{sec:node}; we\ngive it in full, so that no result of \\cite{wuebben-conifold} is used.\nNew here are the models of Section~\\ref{sec:node},\nthe construction of the harmonic representatives without a Ricci-flat\nbackground (Proposition~\\ref{prop:harmonic}), the passage to arbitrary\n$t\\to0$ (Lemma~\\ref{lem:condition-N}), and the proof of the statement",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/24_nodal_threefold_spectrum/sections/01_intro.tex#L119"
          }
        ]
      },
      {
        "from": 23,
        "to": 25,
        "kind": "theorem",
        "reason": "Imports scalar thick-region, node-mass and energy estimates to identify the low linearized HYM spectrum.",
        "evidence": [
          {
            "path": "papers/25_hym_nodal_curves/sections/06_spectrum.tex",
            "line": 25,
            "endLine": 36,
            "excerpt": "tending to zero as $t\\to0$ with $r$ fixed.\n\nWe use the following scalar facts from \\cite{wuebben-curves}. They hold\nfor the present induced K\\\"ahler metrics, and indeed under weaker\nhypotheses in that paper:\n\\begin{equation}\\label{eq:scalar-law}\n L\\lambda_j(t)\\longrightarrow2\\pi\\mu_j\\quad(0\\le j<N),\n \\qquad\\lambda_N(t)\\ge\\gamma>0.\n\\end{equation}\nWe also need the compactness and form estimates in its proof, rather\nthan eigenvalues alone. For clarity we state precisely the consequences\nused here. On every fixed thick component subset, a unit vector in $S_t$",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/25_hym_nodal_curves/sections/06_spectrum.tex#L25"
          }
        ]
      },
      {
        "from": 25,
        "to": 26,
        "kind": "method",
        "reason": "Retains the full Chern equation and intrinsic trace comparison, adding nontrivial unitary gluing and independent neck lengths.",
        "evidence": [
          {
            "path": "papers/26_global_gluing_hym_curves/sections/01_introduction.tex",
            "line": 328,
            "endLine": 339,
            "excerpt": "For trivial bundles and a common neck scale,\nthe actual noncommuting matrix-flow comparison\nwas established in \\cite{wuebben-hym}.\nWe retain its full Chern-curvature equation and\nintrinsic trace comparison, and prove the\nweighted gluing estimates needed for independent\nnode lengths and nontrivial unitary transport.\nThe regular component correction at a node\nreceives contributions from every incident\nedge, whereas the node profile has its own\nlogarithmic slope. Keeping both weights in\nthe collar estimate gives the uniform residual",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/26_global_gluing_hym_curves/sections/01_introduction.tex#L328"
          }
        ]
      },
      {
        "from": 26,
        "to": 27,
        "kind": "method",
        "reason": "Adapts the curve gluing methods to an equivariant type-K threefold construction and proves the needed nonflat estimates.",
        "evidence": [
          {
            "path": "papers/27_type_k_hym_dynamics/sections/01_introduction.tex",
            "line": 231,
            "endLine": 240,
            "excerpt": "for that metric even though curve Dirichlet energy is conformally\ninvariant. Effective HYM dynamics and bundle gluing for this type\nof curve degeneration are developed in\n\\cite{wuebben-effective,wuebben-gluing}. We give the required\nequivariant estimates here and prove their relation to the actual\nnonflat threefold operator and flow.\n\nThe fixed-base existence and order comparison are the classical\ncompact K\\\"ahler inputs recalled in \\cite[Section 4.1]{hkkp};\nthe trace comparison is used in the form of",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/27_type_k_hym_dynamics/sections/01_introduction.tex#L231"
          }
        ]
      },
      {
        "from": 26,
        "to": 28,
        "kind": "method",
        "reason": "Removes the positive normalized-rate restriction on a fixed-constraint small basin using a new global divergence estimate.",
        "evidence": [
          {
            "path": "papers/28_all_time_hym_curves/sections/01_introduction.tex",
            "line": 197,
            "endLine": 209,
            "excerpt": "Previous work on nodal curves gives actual\nnoncommuting HYM approximation on bounded slow-time\nintervals \\cite{wuebben-effective} and treats\nnontrivial gluing, spatial entry and all-time\ncomparison under a positive normalized rate\n\\cite{wuebben-gluing}. The present result removes\nthat rate requirement for fixed constraints on a\nsmall basin and couples independent node and\ncomponent-holonomy scales in one compact family.\nThe new all-time step is the global divergence\ndecomposition of the full Chern residual; the\nfinite graph operator or the scalar multiscale\nprinciple alone is not that step.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/28_all_time_hym_curves/sections/01_introduction.tex#L197"
          }
        ]
      },
      {
        "from": 25,
        "to": 28,
        "kind": "method",
        "reason": "Extends the original bounded slow-time noncommuting comparison to an all-time coupled degeneration theorem.",
        "evidence": [
          {
            "path": "papers/28_all_time_hym_curves/sections/01_introduction.tex",
            "line": 197,
            "endLine": 209,
            "excerpt": "Previous work on nodal curves gives actual\nnoncommuting HYM approximation on bounded slow-time\nintervals \\cite{wuebben-effective} and treats\nnontrivial gluing, spatial entry and all-time\ncomparison under a positive normalized rate\n\\cite{wuebben-gluing}. The present result removes\nthat rate requirement for fixed constraints on a\nsmall basin and couples independent node and\ncomponent-holonomy scales in one compact family.\nThe new all-time step is the global divergence\ndecomposition of the full Chern residual; the\nfinite graph operator or the scalar multiscale\nprinciple alone is not that step.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/28_all_time_hym_curves/sections/01_introduction.tex#L197"
          }
        ]
      },
      {
        "from": 2,
        "to": 29,
        "kind": "theorem",
        "reason": "Uses the central toric transition and its global Hodge and divisor data.",
        "evidence": [
          {
            "path": "papers/29_multiscale_conifold_hodge/sections/02_geometry.tex",
            "line": 94,
            "endLine": 99,
            "excerpt": "The global toric calculation in \\cite[Appendix~A]{wuebben-chambers}\ngives $h^{1,1}(Y)=4$, $h^{2,1}(Y)=60$ and the spanning divisor\nclasses $(f,g,\\xi_1,\\xi_2)$. Simple connectivity follows from the\ntoric lattice-quotient calculation in \\cite[Section~8]{wuebben-hodge}.\nWe use these established global data. In these coordinates the two\ncurve types have degrees",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/9fc0e68d678bae86d2d1bdf65b86e542d246b7f4/papers/29_multiscale_conifold_hodge/sections/02_geometry.tex#L94"
          }
        ]
      },
      {
        "from": 22,
        "to": 29,
        "kind": "theorem",
        "reason": "Uses the central simple-connectivity calculation and normalization; the unequal-scale analytic theorem is proved anew.",
        "evidence": [
          {
            "path": "papers/29_multiscale_conifold_hodge/sections/02_geometry.tex",
            "line": 94,
            "endLine": 99,
            "excerpt": "The global toric calculation in \\cite[Appendix~A]{wuebben-chambers}\ngives $h^{1,1}(Y)=4$, $h^{2,1}(Y)=60$ and the spanning divisor\nclasses $(f,g,\\xi_1,\\xi_2)$. Simple connectivity follows from the\ntoric lattice-quotient calculation in \\cite[Section~8]{wuebben-hodge}.\nWe use these established global data. In these coordinates the two\ncurve types have degrees",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/9fc0e68d678bae86d2d1bdf65b86e542d246b7f4/papers/29_multiscale_conifold_hodge/sections/02_geometry.tex#L94"
          }
        ]
      },
      {
        "from": 29,
        "to": 30,
        "kind": "theorem",
        "reason": "Uses the actual Ricci-flat family and its uniform analytic estimates as the background for the nonflat bundle construction.",
        "evidence": [
          {
            "path": "papers/30_conifold_hym_dynamics/sections/02_geometry.tex",
            "line": 44,
            "endLine": 63,
            "excerpt": "$\\mathcal B^\\circ=\\{p\\in\\mathcal B:\\prod_i p_i\\ne0\\}$.\nAfter shrinking the ball, all the units and their inverses are\nbounded. We permit every path $p\\to0$ in $\\mathcal B^\\circ$;\nno ratio or phase condition is imposed on the $\\tau_i$.\n\nLet $\\omega_p$ be the actual Ricci-flat Kähler form in\n$c_1(\\mathcal H_p)$ and let $g_p$ be its Riemannian metric.\nWe recall explicitly the analytic input from\n\\cite[Theorem 9.1 and Section 10]{W_Hodge}. There are conic radii\n$\\varrho_p$, equal up to fixed constants to\n$(|z|^2+|\\tau_i|)^{1/3}$ on the node charts and to one on a fixed\nexterior, and initial Kähler metrics $\\widetilde g_p^R$ which are\nnormalized Stenzel metrics on the inner charts. For fixed small\n$R>0$ and every fixed $k$, there are $\\mu>\\eta>0$ such that\n\\begin{equation}\\label{eq:ricci-flat-input}\n \\limsup_{\\substack{p\\to0\\\\p\\in\\mathcal B^\\circ}}\n \\max_{j\\le k}\\sup_{X_p}\\varrho_p^j\n |\\nabla^j(g_p-\\widetilde g_p^R)|_{\\widetilde g_p^R}\n       \\le C_k R^{\\mu-\\eta}.\n\\end{equation}",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/9fc0e68d678bae86d2d1bdf65b86e542d246b7f4/papers/30_conifold_hym_dynamics/sections/02_geometry.tex#L44"
          }
        ]
      },
      {
        "from": 15,
        "to": 30,
        "kind": "method",
        "reason": "Extends stationary local reduction to the conifold family, verifying the complementary estimates and quotient geometry anew.",
        "evidence": [
          {
            "path": "papers/30_conifold_hym_dynamics/sections/01_introduction.tex",
            "line": 236,
            "endLine": 246,
            "excerpt": "Earlier work in this series treats stationary local\nreduction on a fixed smooth background \\cite{W_Local},\nfinite phase reduction for trajectories satisfying its\nconfinement hypotheses \\cite{W_Phase}, and all-time\napproximation on degenerating curves with the stated\nspatial initial-data class \\cite{W_Curves}.\nThe present proof verifies the complementary estimates,\nconfinement and quotient geometry anew on the nonflat\nconifold family. Its contribution is this geometric\nrealization and the simultaneous uniformity of the\nspectral, dynamical and harmonic-metric comparisons.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/9fc0e68d678bae86d2d1bdf65b86e542d246b7f4/papers/30_conifold_hym_dynamics/sections/01_introduction.tex#L236"
          }
        ]
      },
      {
        "from": 16,
        "to": 30,
        "kind": "method",
        "reason": "Extends finite phase reduction to the specified degenerating family with a verified open spatial basin.",
        "evidence": [
          {
            "path": "papers/30_conifold_hym_dynamics/sections/01_introduction.tex",
            "line": 236,
            "endLine": 246,
            "excerpt": "Earlier work in this series treats stationary local\nreduction on a fixed smooth background \\cite{W_Local},\nfinite phase reduction for trajectories satisfying its\nconfinement hypotheses \\cite{W_Phase}, and all-time\napproximation on degenerating curves with the stated\nspatial initial-data class \\cite{W_Curves}.\nThe present proof verifies the complementary estimates,\nconfinement and quotient geometry anew on the nonflat\nconifold family. Its contribution is this geometric\nrealization and the simultaneous uniformity of the\nspectral, dynamical and harmonic-metric comparisons.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/9fc0e68d678bae86d2d1bdf65b86e542d246b7f4/papers/30_conifold_hym_dynamics/sections/01_introduction.tex#L236"
          }
        ]
      },
      {
        "from": 29,
        "to": 31,
        "kind": "theorem",
        "reason": "Imports the full relative Ricci-flat Hodge theorem after verifying its hypotheses on the selected algebraic family.",
        "evidence": [
          {
            "path": "papers/31_conifold_integral_reconstruction/sections/09_integrated_theorem.tex",
            "line": 132,
            "endLine": 139,
            "excerpt": "The Hodge, bundle, flow and harmonic metric estimates are\nimported in their full stated forms from \\cite{W_Hodge,W_HYM},\nwith their hypotheses checked in\nProposition~\\ref{prop:analytic-reapplication}. The proof below\nestablishes their compatibility with the integral construction.\nIt also records the spectral--flow and action-map\nidentifications explicitly; the corresponding analytic\narguments are in \\cite[Sections~10--12]{W_HYM}.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/9fc0e68d678bae86d2d1bdf65b86e542d246b7f4/papers/31_conifold_integral_reconstruction/sections/09_integrated_theorem.tex#L132"
          }
        ]
      },
      {
        "from": 30,
        "to": 31,
        "kind": "theorem",
        "reason": "Imports the nonflat bundle, flow and harmonic metric conclusions on that same family; the connecting maps are identified explicitly.",
        "evidence": [
          {
            "path": "papers/31_conifold_integral_reconstruction/sections/09_integrated_theorem.tex",
            "line": 132,
            "endLine": 139,
            "excerpt": "The Hodge, bundle, flow and harmonic metric estimates are\nimported in their full stated forms from \\cite{W_Hodge,W_HYM},\nwith their hypotheses checked in\nProposition~\\ref{prop:analytic-reapplication}. The proof below\nestablishes their compatibility with the integral construction.\nIt also records the spectral--flow and action-map\nidentifications explicitly; the corresponding analytic\narguments are in \\cite[Sections~10--12]{W_HYM}.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/9fc0e68d678bae86d2d1bdf65b86e542d246b7f4/papers/31_conifold_integral_reconstruction/sections/09_integrated_theorem.tex#L132"
          }
        ]
      },
      {
        "from": 2,
        "to": 31,
        "kind": "theorem",
        "reason": "Uses the central compact transition and divisor data before constructing the certified integral observations.",
        "evidence": [
          {
            "path": "papers/31_conifold_integral_reconstruction/sections/01_introduction.tex",
            "line": 272,
            "endLine": 281,
            "excerpt": "The central compact transition and its divisor\ndata come from \\cite{W_Toric,W_HodgeRay}.\nThe relative Ricci-flat Hodge theorem and the\nnonflat bundle, HYM and harmonic quotient results\nare those of \\cite{W_Hodge,W_HYM}.\nThe present contribution is the terminating geometric\nobservation construction and its integral output\non a family to which those analytic conclusions\nare proved to apply. The final section records\nthe actual connecting maps and an example with",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/9fc0e68d678bae86d2d1bdf65b86e542d246b7f4/papers/31_conifold_integral_reconstruction/sections/01_introduction.tex#L272"
          }
        ]
      },
      {
        "from": 22,
        "to": 31,
        "kind": "theorem",
        "reason": "Uses the established compact transition data; the inverse construction itself is new to this paper.",
        "evidence": [
          {
            "path": "papers/31_conifold_integral_reconstruction/sections/01_introduction.tex",
            "line": 272,
            "endLine": 281,
            "excerpt": "The central compact transition and its divisor\ndata come from \\cite{W_Toric,W_HodgeRay}.\nThe relative Ricci-flat Hodge theorem and the\nnonflat bundle, HYM and harmonic quotient results\nare those of \\cite{W_Hodge,W_HYM}.\nThe present contribution is the terminating geometric\nobservation construction and its integral output\non a family to which those analytic conclusions\nare proved to apply. The final section records\nthe actual connecting maps and an example with",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/9fc0e68d678bae86d2d1bdf65b86e542d246b7f4/papers/31_conifold_integral_reconstruction/sections/01_introduction.tex#L272"
          }
        ]
      },
      {
        "from": 10,
        "to": 32,
        "kind": "theorem",
        "reason": "Uses the predecessor toric example for a sharp-profile application; its residue estimates are also reproved with fixed normalizations.",
        "evidence": [
          {
            "path": "papers/32_singular_hym_point_defects/sections/10_consequences_examples.tex",
            "line": 76,
            "endLine": 98,
            "excerpt": "\nWe spell out the specialization to the tangent-bundle example\nof \\cite[Section~2]{W_Singular}. Let \\(X\\) have fan with cyclic rays\n\\[\n (1,0),\\quad(1,1),\\quad(0,1),\\quad(-1,0),\\quad(1,-1).\n\\]\nConsecutive determinants are one. Removing \\((1,1)\\)\ngives the first Hirzebruch surface, so \\(X\\) is its\nblowup at the corresponding fixed point. With pullback\nsection and fibre classes \\(S,f\\) and exceptional class \\(E\\),\n\\[\n S^2=-1,\\quad Sf=1,\\quad f^2=0,\\quad E^2=-1,\\quad SE=fE=0.\n\\]\nChoose a Kähler form in \\(4S+7f-2E\\), and put\n\\[\n V=T_X,\\qquad L=\\OO_X(2S+f-E),\\qquad M=\\OO_X(2f).\n\\]\nThe torus direction \\((1,0)\\) gives a saturated tangent\nline. Its divisorial class is the sum of the two\nopposite-ray divisors, namely \\(2S+f-E\\).\nOn the chart of the cone \\(((1,1),(0,1))\\), its\ninclusion and quotient have the presentation\n\\[",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/9fc0e68d678bae86d2d1bdf65b86e542d246b7f4/papers/32_singular_hym_point_defects/sections/10_consequences_examples.tex#L76"
          }
        ]
      }
    ],
    "thematicConnections": [
      {
        "from": 11,
        "to": 12,
        "kind": "theme",
        "reason": "Independent responses to HKKP’s categorical metric programme: phase-flow cancellation versus harmonic paths and honeycombs. Neither paper imports a theorem from the other.",
        "evidence": [
          {
            "path": "papers/11_categorical_phase_flow/sections/01_introduction.tex",
            "line": 1,
            "endLine": 12,
            "excerpt": "\\section{Introduction}\\label{sec:introduction}\n\nHaiden, Katzarkov, Kontsevich and Pandit associate a mass and a metric\nphase flow to a complex of quiver representations\n\\cite[\\S\\S4.2 and 5.4]{hkkp26}. Their construction uses a coefficient\nof a superconnection exponential. Acyclic summands should disappear when\nthe differential becomes large in the evolving metric, leaving the\ncohomology representation. Question~5.18 of \\cite{hkkp26} asks whether\nthe mass is nonincreasing along the flow. We give a negative answer for\nthe phase determined by their positivity condition and degree branches.\nWe then prove that quantitative acyclic cancellation can hold despite\nthis failure.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/11_categorical_phase_flow/sections/01_introduction.tex#L1"
          },
          {
            "path": "papers/12_harmonic_paths_and_honeycombs/sections/01_introduction.tex",
            "line": 1,
            "endLine": 13,
            "excerpt": "\\section{Introduction}\\label{sec:introduction}\n\nA triple of non-Archimedean norms contains more information than the\nthree relative spectral lists. The harmonic-path problem of\nHaiden--Katzarkov--Kontsevich--Pandit asks for a geometric reconstruction\nthat retains this additional information: a path of non-expansive norms\nwhose spectral velocities trace a labelled network in the plane\n\\cite[\\S\\S7.2--7.3]{HKKP26}. We construct such paths for the identity\nrepresentation of the $A_2$ quiver, for every full boundary triple and in\nevery finite rank. The principal point is finite algebraic regularity of\na variational minimum in a completed norm space. A separate converse\nidentifies that minimum among paths satisfying an explicit first-order\nmatching condition.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/12_harmonic_paths_and_honeycombs/sections/01_introduction.tex#L1"
          }
        ]
      },
      {
        "from": 10,
        "to": 15,
        "kind": "theme",
        "reason": "The singular graded obstruction marks a boundary of the smooth locally free local theory, not an input to its proof.",
        "evidence": [
          {
            "path": "papers/15_local_hym_reduction/sections/07_recovery.tex",
            "line": 140,
            "endLine": 151,
            "excerpt": "The theorem is local near a fixed smooth locally free HE\nbackground with positive complementary elliptic gaps.\nIt does not supply harmonic spaces or such gaps for a singular\ngraded sheaf, or uniformly through collapse of the background\ngeometry. The singular-flow obstruction\n\\cite[Theorem~1.1 and Corollary~1.2]{wuebben10}\nhas a precise different scope. It concerns a locally free rank-two\nextension on a compact K\\\"ahler surface,\n\\[\n 0\\longrightarrow L\\longrightarrow V\\longrightarrow I_WM\n                    \\longrightarrow0,\\qquad\n \\deg L=\\deg M,",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/15_local_hym_reduction/sections/07_recovery.tex#L140"
          }
        ]
      },
      {
        "from": 15,
        "to": 25,
        "kind": "theme",
        "reason": "Fixed smooth-background local theory and degenerating-base HYM are complementary settings; Paper 25 explicitly does not assume uniformity of Paper 15 under pinching.",
        "evidence": [
          {
            "path": "papers/25_hym_nodal_curves/sections/01_introduction.tex",
            "line": 145,
            "endLine": 152,
            "excerpt": "framework \\cite{donaldson,hkkp}. Haiden--Katzarkov--Kontsevich--Pandit\ndescribe algebraically determined asymptotics on a fixed curve, and\nLam treats broader fixed compact K\\\"ahler backgrounds under his stated\nhypotheses \\cite{lam}. The local spectral and phase comparisons in\n\\cite{wuebben-local,wuebben-phase} also concern fixed smooth\nbackgrounds; their regularity constants cannot be assumed uniform\nunder a nodal degeneration.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/25_hym_nodal_curves/sections/01_introduction.tex#L145"
          }
        ]
      },
      {
        "from": 16,
        "to": 25,
        "kind": "theme",
        "reason": "Both study actual finite-dimensional HYM evolution, but the fixed-background phase estimates are not imported as uniform degeneration estimates.",
        "evidence": [
          {
            "path": "papers/25_hym_nodal_curves/sections/01_introduction.tex",
            "line": 145,
            "endLine": 152,
            "excerpt": "framework \\cite{donaldson,hkkp}. Haiden--Katzarkov--Kontsevich--Pandit\ndescribe algebraically determined asymptotics on a fixed curve, and\nLam treats broader fixed compact K\\\"ahler backgrounds under his stated\nhypotheses \\cite{lam}. The local spectral and phase comparisons in\n\\cite{wuebben-local,wuebben-phase} also concern fixed smooth\nbackgrounds; their regularity constants cannot be assumed uniform\nunder a nodal degeneration.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/25_hym_nodal_curves/sections/01_introduction.tex#L145"
          }
        ]
      },
      {
        "from": 22,
        "to": 23,
        "kind": "theme",
        "reason": "Related inverse-logarithmic spectral laws with a 2π node constant, for different form degrees and geometries. This is an analogy, not a theorem dependency.",
        "evidence": [
          {
            "path": "papers/23_curve_intersection_spectrum/main.tex",
            "line": 812,
            "endLine": 821,
            "excerpt": "change and normalization, minus one; we do not treat\nthis case. In higher dimension, for\ntwo-forms on Calabi--Yau threefolds in conifold transitions with\nRicci-flat metrics, it is shown in the preprint \\cite{wuebben-conifold}\nthat the small eigenvalues have the same rate and the same\nconstant $2\\pi$ per node, with the intersection form on divisor classes in\nthe role of $m$ and the periods over the exceptional curves in the role of\nthe differences $F_i-F_j$.\n\\end{remark}",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/64c2c23d6bae287ebfba0d97029466bb0f91524f/papers/23_curve_intersection_spectrum/main.tex#L812"
          }
        ]
      },
      {
        "from": 28,
        "to": 30,
        "kind": "theme",
        "reason": "Both treat all-time HYM behaviour under independent degeneration, with different geometries, error norms and basin hypotheses. The later paper verifies its estimates anew.",
        "evidence": [
          {
            "path": "papers/30_conifold_hym_dynamics/sections/01_introduction.tex",
            "line": 236,
            "endLine": 246,
            "excerpt": "Earlier work in this series treats stationary local\nreduction on a fixed smooth background \\cite{W_Local},\nfinite phase reduction for trajectories satisfying its\nconfinement hypotheses \\cite{W_Phase}, and all-time\napproximation on degenerating curves with the stated\nspatial initial-data class \\cite{W_Curves}.\nThe present proof verifies the complementary estimates,\nconfinement and quotient geometry anew on the nonflat\nconifold family. Its contribution is this geometric\nrealization and the simultaneous uniformity of the\nspectral, dynamical and harmonic-metric comparisons.",
            "url": "https://github.com/bwuebben/stability-degeneration/blob/9fc0e68d678bae86d2d1bdf65b86e542d246b7f4/papers/30_conifold_hym_dynamics/sections/01_introduction.tex#L236"
          }
        ]
      }
    ],
    "isolatedInSelectedDependencyGraph": [
      11,
      12
    ],
    "isolatedNote": "Papers 11 and 12 have no intra-series source citations in the inspected current manuscripts. Paper 23 has no incoming theorem/method edge but supplies Paper 25; these statuses do not imply low importance.",
    "excludedConnections": [
      {
        "from": 15,
        "to": 25,
        "reason": "Explicitly separated fixed-background estimates from uniform estimates under nodal degeneration."
      },
      {
        "from": 16,
        "to": 25,
        "reason": "Explicitly separated fixed-background phase theory from uniform estimates under nodal degeneration."
      },
      {
        "from": 22,
        "to": 23,
        "reason": "Cited as a higher-dimensional analogy, not used as a theorem premise."
      },
      {
        "from": 27,
        "to": 28,
        "reason": "No direct import or method attribution in Paper 28; it is a sibling threefold branch."
      }
    ],
    "sourceHashes": {
      "papers/03_metric_response_flow/sections/section_02_stationary.tex": "8b6426ad4c8de6e91630e2002f0956a341f1f51610b7ad1eccf982cd4be9e427",
      "papers/03_metric_response_flow/sections/section_09_tangent.tex": "55ae64811fc50556f447d3a0bd342da3237b8b62d5c0ed54cf2c7941b0cb09a8",
      "papers/04_repeated_factor_spectra/sections/01_introduction.tex": "7aee66788699338a91c4902461198827d1d2677093e26492adb8145c4fcc0cfb",
      "papers/05_three_step_metrics/sections/01_introduction.tex": "1279bf043682867794796727df7dfc1c507bde1f5b2113b89d4c298cc082d749",
      "papers/05_three_step_metrics/sections/09_intrinsic_response.tex": "2439ff51c5ff0d82006e801580e5741530587f687ef89bd8bdf002bf381a4769",
      "papers/06_wall_moduli_metrics/sections/01_introduction.tex": "dbb63a5a7ac6f09a2f71ef24b852622365805441af4affd6ad0de5a7e693a1d9",
      "papers/07_repeated_factor_moduli/sections/04_projection_calibration.tex": "8a8befb1587290d843e4e0782d8e9f8b91f820b55ec23bc253256876dc40bd6c",
      "papers/07_repeated_factor_moduli/sections/06_full_quotient.tex": "29022bca9559e8d4730391e1c4668795df03360d6cc88de3d852c46ad1f8e3fe",
      "papers/08_flow_phase/sections/01_introduction.tex": "aaf4fa2074b1fe9d5b5ee716f36d7b17d4c9c04420139d5b88838a300e19bf78",
      "papers/09_wall_unstable_flow/sections/01_introduction.tex": "36ebb27fbc85af424380615dcff00f1f88e6f95fd88d1594c582aa0ba459397e",
      "papers/10_singular_hym_asymptotics/sections/01_introduction.tex": "186bf4578ff87de1ad1f2b1119b55f432784e42058527c663423869173dfcec0",
      "papers/11_categorical_phase_flow/sections/01_introduction.tex": "88f6aed54657f5968a5aad55e95bd815d8128c73d231e7fe03f6f378a41bfc7b",
      "papers/12_harmonic_paths_and_honeycombs/sections/01_introduction.tex": "afbab1fb7970d77532de5d54b664a98ee7885d33465aa0ac39387c62ad75513f",
      "papers/13_k3_metric_wall_crossing/sections/01_introduction.tex": "e740cdf1e2e5cc583773461f455a0f215cc41214a43721ec0a41ef9f15e0ff18",
      "papers/14_quiver_metric_wall_crossing/sections/01_introduction.tex": "261cd5cbba2ea58ee538a00e17d903584e9978bb88bc50bf25b6d5a243d1e1e6",
      "papers/15_local_hym_reduction/sections/03_metrics.tex": "3a636e2ef32409b304a72e8a2484e3faa4a9d8d587838282df33cbc7322fa7cd",
      "papers/15_local_hym_reduction/sections/04_spectrum.tex": "1bb644e8ab8b7d264ae649966e2c83f83f022be5bf12796d3fc7c39d635490b9",
      "papers/15_local_hym_reduction/sections/07_recovery.tex": "6db60f982c952e415d916a9987ce006057d298b67fa22601b8a54531c3afdb6a",
      "papers/16_uniform_hym_phase/sections/02_coordinates.tex": "24f229240593586ce98d51fb06e5dfd0f6b56510992c6c4cf478b6612e3ba890",
      "papers/16_uniform_hym_phase/sections/05_geometric.tex": "33d918f939cebfccf718295f723828b54feb0db3b1488841ef3380986974f05c",
      "papers/17_exceptional_cycles/sections/02_harmonic_models.tex": "3ad32e01f4982e52d12cae5301575104414c293773ffdb14f77fd5cba079b59f",
      "papers/18_integral_reconstruction/sections/01_introduction.tex": "e4a979d638bd5f69971e8ddd02461162178231d2e4ece369b5a1521db4436f7c",
      "papers/18_integral_reconstruction/sections/02_geometric_data.tex": "2d79a470e7601861fba3f0fe86988d91d8f7ba861368cd1a7e2e71d1dc361664",
      "papers/19_integral_attachments/sections/01_introduction.tex": "e091b72dde356e65bd2c6cf84fe19ee82d672a09b91a59cc09d8402a2eac8348",
      "papers/19_integral_attachments/sections/07_harmonic_geometry.tex": "88950c57dd097b84b2ea05b2ccf09f4f107e2a3454cd038a58b17ef2e06497e1",
      "papers/20_singular_hyperkahler_cones/sections/01_introduction.tex": "ca1d8ac732ff3d41b27c688f4e61de897583e034c2d4e4b0aee790d34a8bc7fe",
      "papers/21_heterotic_k3_enhancement/sections/01_introduction.tex": "464fa95493a6be2e050e483ebfc68a14c98256a9c5e552537da8bd3e7140248d",
      "papers/21_heterotic_k3_enhancement/sections/02_compactification.tex": "dba91643d01abcf5b5174441ab3c5ff6c3aa6552b56607a81a63660047580ef5",
      "papers/22_cy_hodge_spectrum/sections/08_eight_node.tex": "52a1112a6b3679b32f1e8c50e71486eb42c63ffb26fca59a585a0127ddf8ccdf",
      "papers/23_curve_intersection_spectrum/main.tex": "2ec04c24d4889b60b47d1534fc0bfde02cdc689ebd0a8e122c28dd2aa220ab26",
      "papers/24_nodal_threefold_spectrum/sections/01_intro.tex": "a333f121e82bcfd7b7ba6b98de8c8055b84b05561dcb356f18d40c99bacd5dcd",
      "papers/25_hym_nodal_curves/sections/01_introduction.tex": "954bc2d1420dd5a42c9438ebd57b8024cc41ac67f588ee008b9b4195b8449110",
      "papers/25_hym_nodal_curves/sections/06_spectrum.tex": "8476946cf73e45d35b447bc4370e18bd11de81248b084b985d61fee4d8c6083a",
      "papers/26_global_gluing_hym_curves/sections/01_introduction.tex": "d21e0fdd7ac5f30281d7e11655f401bd3265ee7e9e61f9eacc730ed08812b5ce",
      "papers/27_type_k_hym_dynamics/sections/01_introduction.tex": "bd59b114fbc6d303e017e51310b122a492f87dc04b28b4a6e400bfb1d94ae030",
      "papers/28_all_time_hym_curves/sections/01_introduction.tex": "0b49d0e42a87ad242646b7ee58a424533a8498475734984332d4b549326a1375",
      "papers/29_multiscale_conifold_hodge/sections/02_geometry.tex": "8183f349e96e369bf6d66b995e3ab802fac14d5cab40aeb5888967a9438884ef",
      "papers/30_conifold_hym_dynamics/sections/02_geometry.tex": "65643aea5405928fe4f4cb159ad797fc269d772f0eb5d33ad4b33ff7790065b1",
      "papers/30_conifold_hym_dynamics/sections/01_introduction.tex": "d1fadcaf3ba65486673088ba0d018808ea3a39c88c19039bf0681268285169cf",
      "papers/31_conifold_integral_reconstruction/sections/09_integrated_theorem.tex": "023bfb3a95d5b8ab111ccd63dc15afcd780426bd685692aaea111f43ccdd5bac",
      "papers/31_conifold_integral_reconstruction/sections/01_introduction.tex": "5e8c613a3517b5d71535ac6610a40f9d39e32e7b59fff8f94638f93ee9bff31e",
      "papers/32_singular_hym_point_defects/sections/10_consequences_examples.tex": "e272405fad7407d1bb6283b749504711863cb3042528247321db2abef43c0609",
      "papers/03_metric_response_flow/paper.tex": "6fdfed3a80d1e0b9577008d78529230fbc6b86394aab41ce2486d99f914cb4ef",
      "papers/05_three_step_metrics/paper.tex": "48a2f6414d10e53288d6a94321410776eb5a6c2dc914901fd879544fb54cb409",
      "papers/06_wall_moduli_metrics/paper.tex": "17057a7824d9f3ee8b34bd1312e80ae0b8d54f6888b23df7e2688921b6c6ba2e",
      "papers/07_repeated_factor_moduli/paper.tex": "4c1068a81ae432edf4556e17e9039d0968d4ea7c025077235408622e5aea8346",
      "papers/08_flow_phase/paper.tex": "64e586efb49cbc82b08752bdd0acf3134346339fc46213fbd401c617684b1a8b",
      "papers/09_wall_unstable_flow/paper.tex": "69e46bc34a1e572eb62af0b35886e610c2dbe0d59df7766af0d44877fe89c936",
      "papers/10_singular_hym_asymptotics/paper.tex": "5e9a9a057040221db4c8b0484e1c247a0a4fd072bc1d785bf65a6df7e79cf450"
    },
    "rootsInSelectedDependencyGraph": [
      1,
      2,
      11,
      12,
      23
    ]
  },
  "order": [
    15,
    31,
    29,
    30,
    32,
    20,
    16,
    22,
    10,
    28,
    14,
    26,
    12,
    1,
    18,
    11,
    3,
    27,
    17,
    2,
    19,
    21,
    4,
    13,
    6,
    9,
    8,
    23,
    25,
    24,
    7,
    5
  ],
  "method": "Editorial ordering of the current manuscripts by breadth, conceptual advance, reusable foundations and lasting independent contribution. The reassessment includes Papers 29–32: integral recovery, ratio-unrestricted Ricci-flat analysis, common-family bundle dynamics and a sharp surface defect law. Paper 15 retains first place for generality; Paper 31 ranks second for the inverse construction, with its marking and effectiveness limits explicit. This is not a citation metric, a journal forecast, external peer review or a new correctness audit. Nearby ranks remain debatable.",
  "branches": {
    "foundations": {
      "name": "Local & spectral foundations",
      "color": "var(--atlas-foundations)"
    },
    "dynamics": {
      "name": "Flow & singular limits",
      "color": "var(--atlas-dynamics)"
    },
    "category": {
      "name": "Categorical directions",
      "color": "var(--atlas-category)"
    },
    "geometry": {
      "name": "Moduli and integral geometry",
      "color": "var(--atlas-geometry)"
    },
    "spectral": {
      "name": "Degenerating-base spectra",
      "color": "var(--atlas-spectral)"
    },
    "degeneration": {
      "name": "HYM on degenerating bases",
      "color": "var(--atlas-degeneration)"
    },
    "physics": {
      "name": "Heterotic application",
      "color": "var(--atlas-physics)"
    }
  }
};
