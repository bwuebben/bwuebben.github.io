#!/usr/bin/env python3
"""Build the editorial website from released paper metadata. No network or publication."""
from pathlib import Path
import html
import json
import math
import re
import subprocess
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import format_datetime

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://bwuebben.github.io"
papers = json.loads((ROOT / "data/papers.json").read_text())["papers"]
by_slug = {p["slug"]: p for p in papers}
E = html.escape
# Version the editorial stylesheet by content so browsers fetch changes immediately.
EDITORIAL_CSS_VERSION = __import__("hashlib").sha256((ROOT / "assets/editorial.css").read_bytes()).hexdigest()[:12]

def write(path, text):
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text.strip() + "\n")

def link(url, text, cls="quiet-link"):
    return f'<a class="{cls}" href="{url}">{text}<span class="arrow" aria-hidden="true">↗</span></a>'

def art(name, content, caption):
    write(f"assets/illustrations/{name}.svg", f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
<title>{E(caption)}</title><rect width="800" height="500" fill="#f3f1ec"/>
<g fill="none" stroke="#7a2e2e" stroke-width="1.6">{content}</g>
</svg>''')

def artworks():
    s=(ROOT/"not-enough.html").read_text()
    polys=[json.loads(re.search(r'"poly'+n+r'":(\[\[.*?\]\])',s).group(1)) for n in "AB"]
    shapes=""
    for i,poly in enumerate(polys):
        pts=" ".join(f"{x*65+130+i*350},{320-y*65}" for x,y in poly)
        shapes+=f'<polygon points="{pts}" fill="#7a2e2e" fill-opacity=".07" stroke-width="2.5"/>'
        for k in range(19):
            x=110+i*350+k*13
            shapes+=f'<path d="M{x} 410 v{-12-35*abs(math.sin(k*1.73)):.2f}" opacity=".55"/>'
    art("drums",shapes,"Two different Gordon–Webb–Wolpert drum boundaries and decorative frequency marks")
    pts=[]
    for i in range(701):
        t=i*2*math.pi/700
        pts.append((400+72*(math.sin(t)+2*math.sin(2*t)),250+72*(math.cos(t)-2*math.cos(2*t))))
    path="M"+" L".join(f"{x:.2f},{y:.2f}" for x,y in pts)
    knot=f'<path d="{path}" stroke="#40685b" stroke-width="5"/><ellipse cx="400" cy="245" rx="240" ry="175" stroke="#a17b44" stroke-dasharray="4 8"/><path d="M100 245H700" opacity=".15"/>'
    art("knot",knot,"Schematic planar projection of a trefoil")
    geom=""
    for j in range(-11,12):
        y=250+j*16
        rx=12+abs(j)*16
        geom+=f'<ellipse cx="400" cy="{y}" rx="{rx}" ry="{rx*.22}" opacity=".65"/>'
    for a in range(0,360,30):
        x=math.cos(math.radians(a))*188
        geom+=f'<path d="M{400+x} 74 Q400 240 400 250 Q400 260 {400+x} 426" opacity=".3"/>'
    art("conifold",geom,'A schematic pinched surface, a lower-dimensional analogy for a singularity')
    flow=""
    def torus(u,v):
        return 400+(180+65*math.cos(v))*math.cos(u),250+(180+65*math.cos(v))*math.sin(u)*.52+65*math.sin(v)*.85
    for axis in (0,1):
        for j in range(24):
            fixed=2*math.pi*j/24
            pts=[torus(2*math.pi*i/160,fixed) if axis==0 else torus(fixed,2*math.pi*i/160) for i in range(161)]
            path="M"+" L".join(f"{x:.2f},{y:.2f}" for x,y in pts)
            flow+=f'<path d="{path}" opacity=".38" stroke-width="1.1"/>'
    art("cobordism",flow,"A wireframe torus, a lower-dimensional illustration of a handle")
    tree='<path d="M400 100V180H200V260H100V350 M200 260H300V350 M400 180H600V260H500V350 M600 260H700V350" stroke="#86827a" stroke-width="2"/>'
    for x,y,r in [(400,100,18),(200,180,13),(600,180,13),(100,350,10),(300,350,10),(500,350,10),(700,350,10)]:
        tree+=f'<circle cx="{x}" cy="{y}" r="{r}" fill="#f3f1ec" stroke-width="2"/>'
    for x,h in [(100,45),(300,25),(500,-25),(700,65)]:
        tree+=f'<path d="M{x} 420v{-h}" stroke="#40685b" stroke-width="8"/>'
    art("portfolio",tree,"A schematic allocation tree with positive and negative signals")
    nodes=[(140,130),(140,250),(140,370),(360,160),(360,340),(600,250)]
    lines=""
    for i,j in [(0,3),(1,3),(1,4),(2,4),(3,5),(4,5)]:
        x,y=nodes[i]; xx,yy=nodes[j]
        lines+=f'<path d="M{x} {y}C{x+90} {y} {xx-90} {yy} {xx} {yy}" opacity=".45"/>'
    for i,(x,y) in enumerate(nodes):
        lines+=f'<circle cx="{x}" cy="{y}" r="{12+i*3}" fill="#f3f1ec" stroke-width="2"/>'
    art("institution",lines,"Evidence flows through people and processes into a decision")
    energy=""
    for j in range(3):
        for i in range(6):
            x=270+i*57; y=140+j*76
            energy+=f'<rect x="{x}" y="{y}" width="35" height="50" fill="#7a2e2e" fill-opacity="{.07+.025*i}"/><path d="M{x+8} {y+12}h19m-19 8h19m-19 8h19" opacity=".5"/>'
    energy+='<path d="M180 110L120 260H175L145 390L240 215H185Z" fill="#a17b44" fill-opacity=".12" stroke="#a17b44" stroke-width="2"/><path d="M235 250H260M640 250H700" stroke-width="2"/>'
    art("energy",energy,"Electricity feeds an array of computing machines")
    circles=""
    for k in range(17):
        circles+=f'<ellipse cx="400" cy="250" rx="{35+k*10}" ry="{35+k*6}" transform="rotate({k*11} 400 250)" opacity=".45"/>'
    art("geometry",circles,"Intersecting families of curves, a schematic image of a space of possibilities")

def page(path, title, desc, body, extra="", image="drums", cls=""):
    route="/"+path.removesuffix("index.html")
    browser_title=title if title=="Bernd Johannes Wuebben" else title+" — Bernd Johannes Wuebben"
    social_image=f"/assets/share/{image}.png" if path.startswith("writing/") and path!="writing/index.html" else "/assets/social-card.jpg"
    footer='''<footer class="edition-footer"><span>Bernd Johannes Wuebben<br>Finance · Mathematics · Theoretical Physics</span><nav aria-label="Footer"><a href="/about/">About &amp; contact</a><a href="/updates/">Updates</a><a href="/feed.xml">RSS</a><a href="https://scholar.google.com/citations?user=uCkoy4IAAAAJ">Google Scholar ↗</a></nav></footer>'''
    write(path,f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(browser_title)}</title><meta name="description" content="{E(desc,quote=True)}">
<meta name="author" content="Bernd Johannes Wuebben"><link rel="canonical" href="{BASE}{route}">
<meta property="og:title" content="{E(title,quote=True)}"><meta property="og:description" content="{E(desc,quote=True)}">
<meta property="og:type" content="website"><meta property="og:url" content="{BASE}{route}">
<meta property="og:image" content="{BASE}{social_image}"><meta name="twitter:card" content="summary_large_image">
<link rel="alternate" type="application/rss+xml" title="Bernd Wuebben — Updates" href="/feed.xml">
<!-- site:styles --><!-- /site:styles -->
<link rel="stylesheet" href="/assets/editorial.css?v={EDITORIAL_CSS_VERSION}">
{extra}</head><body class="editorial {cls}">
<!-- site:navigation --><!-- /site:navigation -->
<main id="main" class="edition" tabindex="-1">{body}{footer}</main></body></html>''')

explorers=[
 ("pillowcase-explorer","knot","01 · Topology","From a knot to a complex.","Cut a knot along a sphere and a three-dimensional problem becomes a count of intersecting curves.","Five guided moves · Worked trefoil example"),
 ("conifold-lab","conifold","02 · Algebraic geometry","A sphere disappears. Another takes its place.","Pass through a singularity, then see why the global relations decide what can happen.","Three experiments · Local geometry and global topology"),
 ("cobordism-explorer","cobordism","03 · Gauge theory","Four dimensions. Two languages.","A space changes. Two mathematical languages describe the change, and the question is whether they agree.","Six guided moves · Geometry, maps and comparison"),
 ("beyond-hrp-lab","portfolio","04 · Quantitative finance","Give the hierarchy an expected return.","Change the forecast. Watch four portfolio rules decide what to hold.","Four experiments · Weights computed in your browser"),
 ("at-the-wall","stability-wall","05 · Geometric analysis","A small change. An enormous response.","Approach a stability wall and watch a chamber, a network, and three small eigenvalues reveal how geometry loses rigidity.","Four experiments · Chambers, spectra, and flow"),
 ("when-walls-collide","colliding-walls","06 · Enumerative geometry","Take two paths. Find the missing wall.","Cross two walls in a different order. Repair the disagreement, follow a frame around an annulus, and discover the distinction that periods miss.","Four experiments · Paths, holonomy, and a hidden discrepancy")
]

programs=[
 dict(slug="markets", name="Markets & inference", image="portfolio", question="What can a successful model actually tell us?", intro="A return is observable. Its explanation is not, and a model that earns has not thereby explained anything. These papers carry the distinction into portfolio construction, into the testing of ideas that now cost nothing to produce, and into the design of a firm that has to decide what to believe.", start="beyond-de-prado-and-cotton", start_text="Start with a portfolio you can change", explorer="/beyond-hrp-lab/", themes=[("Construction","How should a hierarchy of assets respond to an expected-return forecast?"),("Validation","What happens to discovery when generating hypotheses becomes cheap?"),("Organization","How does a firm turn analysis into beliefs, decisions, and learning?")], scope="The portfolio lab is an illustration, not a backtest. The three papers are of three kinds, an allocation method, a study of validation with pre-registered experiments, and an organizational argument, and each should be judged by the standards of its kind.", slugs=[p["slug"] for p in papers[:3]]),
 dict(slug="topology",name="Knots, four-manifolds & Floer theory",image="knot",question="What survives when we cut a space apart?",intro="Cut a space apart and a geometric question becomes a comparison between algebraic objects, one for each piece. The art lies in keeping the information needed to glue the pieces back together, which is exactly what the pieces, examined one at a time, forget.",start="traceless-characters-instanton-gradings",start_text="Start with a trefoil",explorer="/pillowcase-explorer/",themes=[("Knots","Compare instanton invariants with immersed curves in the pillowcase."),("Cobordisms","Ask how comparisons behave when the spaces themselves change."),("Four-manifolds","Separate the structure of a construction from its unresolved filling question.")],scope="These manuscripts do not share a proof status, and the differences matter. The Maurer–Cartan paper makes comparisons that are conditional on a conjecture. The exotic four-manifold manuscript, a working revision, withdraws an earlier claim and leaves its final filling question open. Each paper’s page states its own qualifications.",slugs=["traceless-characters-instanton-gradings","s-complex-torus-knots","pillowcase-torus-knots","pretzel-instanton-pillowcase","pretzel-maurer-cartan","af-point-operations","af-cobordism-i","af-cobordism-ii","one-bubble-neighborhoods","exotic-four-manifolds"]),
 dict(slug="calabi-yau",name="Calabi–Yau transitions",image="conifold",question="When can a singular space become smooth, and how do its curve counts change?",intro="Every singularity has a local story. A compact space has a global one, and the two need not agree. The smoothability programme determines when local possibilities coexist and how mirror symmetry transforms their relations. Universal curve counting asks how enumerative invariants pass through the resulting transitions and where integer product expansions fail.",start="cy-non-smoothable",start_text="Start by watching the transition",explorer="/conifold-lab/",themes=[("Local possibilities","Which singularities admit smoothings, and which already obstruct the whole space?"),("Global compatibility","What relations must the local smoothing parameters satisfy?"),("Mirror geometry and curve counting","How do mirror symmetry and curve-counting formulas record a transition?")],scope="Paper 5 concerns nodes and specified del Pezzo and quadric cone points. Paper 6 treats specified Batyrev families and the connected nodal components meeting its construction near the maximally degenerate limit. The universal specialization theorem assumes smooth algebraic total space and torsion-free second homology; the counterexample concerns scalar local-curve factors. Each conclusion retains its stated hypotheses.",slugs=[p["slug"] for p in papers if p["slug"].startswith("cy-")]+["universal-conifold-counting","universal-integrality-counterexample"]),
 {'slug': 'geometry', 'name': 'Geometry & moduli', 'image': 'geometry', 'question': 'How does geometry organize its possibilities?', 'intro': 'As a bundle approaches a stability wall, its metric loses rigidity and small Dolbeault eigenvalues record the scales of that loss. One programme connects algebraic chambers to spectra, metrics and geometric flows. Related work studies quotient metrics when stabilizers change. Separate projects concern enumerative wall crossing and the realization of prescribed moduli structures.', 'start': 'toric-tangent-stability', 'start_text': 'Start with the stability of a tangent bundle', 'explorer': '/at-the-wall/', 'themes': [('Stability walls and geometric degeneration', 'Determine which chambers occur, how the small spectrum degenerates, and what happens to metrics and flows.'), ('Enumerative wall crossing', 'Follow factorization and scattering in the three open FJRW papers.'), ('Realization of moduli structures', 'Ask which prescribed degeneration data and algebraic structures compactified moduli spaces can realize.')], 'scope': 'The stability programme proves a connection between chamber geometry, spectra, metrics and flows on a specified family of weak-Fano toric tangent bundles. Its analytic theorems concern two-step extensions with distinct stable factors. Open FJRW theory and inverse moduli remain separate projects, each with its own hypotheses and conclusions. The singular quotient-metric paper proves uniform relative estimates for central Yang–Mills connections on closed surfaces, with explicit quaternionic space-form comparisons.', 'slugs': ['toric-tangent-stability', 'toric-tangent-blowups-bundles', 'toric-local-stability-chambers', 'small-dolbeault-stability-walls', 'small-dolbeault-eigenvalues', 'uniform-hermitian-einstein-spectra', 'nonsimplicial-toric-stability-chambers', 'metric-response-hym-flow', 'relative-metrics-reducible-yang-mills', 'fjrw-central-charge-threshold', 'fjrw-slope-ordered-factorization', 'fjrw-annular-scattering', 'inverse-moduli-theory']},
 dict(slug="physics",name="Geometry, gravity & information",image="geometry",question="Which information does a physical description retain?",intro="Every physical description keeps some information and discards the rest. In compact Calabi–Yau models of M-theory, geometry decides which transitions can happen at all; in black-hole physics, an entropy curve records far less than the quantum channel behind it. These papers ask what each description captures and what a complete account would need beyond it.",start="hawking-to-marchenko-pastur",start_text="Start with the Page curve",explorer="/not-enough.html",themes=[("Compact transitions","Track the global constraints and gravitational setting of Higgs transitions."),("Black hole information","Distinguish an entropy curve from the full structure of a quantum channel."),("Spectra","Study transition laws, random matrices, and higher-dimensional models.")],scope="Each conclusion holds in the physical and mathematical model its paper specifies. An entropy curve or a spectral law, however well illustrated, does not by itself establish a microscopic theory of black-hole evaporation.",slugs=[p["slug"] for p in papers if p["slug"].startswith(("compact-higgs-","page-curve-"))]+["hawking-to-marchenko-pastur","informational-singularities"]),
 dict(slug="ai-institutions",name="AI, institutions & power",image="energy",question="What changes when intelligence becomes abundant?",intro="Abundant analysis does not abolish the need for institutions, for physical infrastructure or for someone who answers for a decision. It moves the scarcity onto them. This work follows AI from the decisions inside a firm to the markets between machines and the relations between states.",start="material-deployment-power",start_text="Start with the physical constraints",explorer="/writing/physical-limits/",themes=[("Markets","Consider prediction markets and the institutional infrastructure of a machine economy."),("Material capacity","Examine the physical systems needed to turn technical capability into sustained deployment."),("Responsibility","Ask what algorithmic delegation does to attribution, intent, and deterrence.")],scope="These papers make institutional and political arguments. The accompanying essays isolate mechanisms in illustrative models, and their numbers are not forecasts or estimates for any firm or country.",slugs=["prediction-markets-machine-economy","institutional-plumbing-machine-economy","material-deployment-power","algorithmic-plausible-deniability"])
]
roles={
 "universal-conifold-counting":"Specialization: a rational universal transition formula and a complete compact source calculation with 37 candidates.",
 "universal-integrality-counterexample":"Arithmetic boundary: a compact scalar exponent with fractional part 2/3, alongside integrality through divisibility two.",
 'uniform-hermitian-einstein-spectra':'The spectral mechanism: relative estimates for every small eigenvalue on connected bipartite supports, uniformly through arbitrarily separated positive scales.',
 'nonsimplicial-toric-stability-chambers':'Geometric realization: nonsimplicial tangent chambers, positive-spanning slope access without local freeness, and an explicit Calabi–Yau conifold transition.',
 'metric-response-hym-flow':'Metrics and flows: intrinsic response, singular inverses and actual HYM comparisons, culminating in the integrated theorem on the same tangent family.',

 "validation-bottleneck":"Discovery under multiple testing: why producing more hypotheses does not produce more independent evidence.",
 "ai-native-asset-manager":"An organizational argument about generating, challenging, sizing, and learning from investment beliefs.",
 "beyond-de-prado-and-cotton":"Three methods that bring expected-return forecasts into hierarchical and regularized portfolio construction.",
 "traceless-characters-instanton-gradings":"The instanton side: generators, gradings, and differential ranks for torus and two-bridge knots, with results credited to their sources.",
 "s-complex-torus-knots":"The torus-knot differential: floor-sum formulas, rank bounds, and a classification of when it vanishes.",
 "pillowcase-torus-knots":"The pillowcase side: a graded computation for the T(3,n) family and comparison with instanton homology.",
 "pretzel-instanton-pillowcase":"A suitable tangle decomposition of hyperbolic P(−2,3,q) pretzel knots and the resulting Floer comparison.",
 "pretzel-maurer-cartan":"A different decomposition needs bounding cochains; explicit algebraic deformations lead to conditional comparisons.",
 "af-point-operations":"Point operations in the Atiyah–Floer comparison, including genus-dependent correction terms.",
 "af-cobordism-i":"Compatibility with four-dimensional cobordism maps over the field of two elements.",
 "af-cobordism-ii":"The integral comparison: orientations, signed counts, and the remaining overall sign for each cobordism.",
 "one-bubble-neighborhoods":"An oriented neighborhood model at the first Uhlenbeck level of SO(3)-monopole moduli spaces under regularity hypotheses.",
 "exotic-four-manifolds":"A working revision deriving the full group presentation; the final filling question remains open.",
 "toric-tangent-stability":"Constructions of toric Fano varieties with stable tangent bundles, compared with Kähler–Einstein conditions.",
 "toric-tangent-blowups-bundles":"Stability criteria for specified Fano blowups and bundles, with a complete exact census of Picard-number-ten eightfolds.",
 "toric-local-stability-chambers":"Varying the polarization: an all-dimensional projective-bundle classification with arbitrarily many chamber boundaries, a geometric criterion, and local chambers for the 31 indecomposable semistable census cases.",
 "fjrw-central-charge-threshold":"Where wall crossing begins: primary invariants are independent of symmetric canonical boundary conditions exactly in the simple cases, ĉ below 1.",
 "fjrw-slope-ordered-factorization":"How it factors: a unique slope-ordered factorization in every finite truncation, realized ray by ray by homotopies of boundary conditions.",
 "fjrw-annular-scattering":"Where it lives: an integral-affine annulus for x⁴ + y⁴, a wall structure consistent at its two joints, and a period-invisible discrepancy with Gross–Kelly–Tessler for two markings.",
 "small-dolbeault-stability-walls":"From stability chambers to the equilibrium spectrum: every small Hermitian–Einstein eigenvalue is determined to uniform relative error by ranks and slope gaps, even at arbitrarily separated scales.",
 "small-dolbeault-eigenvalues":"Small spectral modes along Hermitian Yang–Mills flow, described by evolving weighted graph Laplacians in specified bundle classes.",
 "relative-metrics-reducible-yang-mills":"Relative surface gauge quotient-metric and small-spectrum estimates, uniform across changing stabilizers and arbitrarily separated scales.",
 "inverse-moduli-theory":"The inverse problem for moduli-space structures, including an obstruction to extending stabilizing bundles.",
 "compact-higgs-global-constraints":"Which local Higgs flows remain available when several singularities share one compact Calabi–Yau threefold?",
 "compact-higgs-quantum-transition":"An explicit coupled transition, its integral charge lattice, and its quantum thresholds.",
 "compact-higgs-magnetic-sheaves":"Magnetic sheaves, stability, and numerical contributions on the two sides of a specified compact transition.",
 "compact-higgs-finite-planck":"A local normal form for quaternionic Kähler quotients under a freeness hypothesis.",
 "page-curve-transition":"An order-one correction to the diagonal entropy approximation in the west-coast evaporation model.",
 "page-curve-higher-dimensions":"Critical fluctuations and finite-size Page transitions in a specified canonical random-state model.",
 "page-curve-not-enough":"Explicit examples separating entropy curves and spectral averages from finer ensemble and channel information.",
 "hawking-to-marchenko-pastur":"A tutorial from entanglement and Hawking radiation to random matrices, fluctuation laws, and the limits of entropy data.",
 "informational-singularities":"A conceptual distinction between informational completion and geometric completion in quantum gravity.",
 "prediction-markets-machine-economy":"An argument for market-generated risk signals in the institutional infrastructure of autonomous commerce.",
 "institutional-plumbing-machine-economy":"The identity, settlement, reputation, and liability systems that machine commerce would require.",
 "material-deployment-power":"How physical systems constrain the conversion of AI capability into sustained deployment and political power.",
 "algorithmic-plausible-deniability":"How algorithmic delegation can complicate attribution, intent, and deterrence.",
 "cy-non-smoothable":"Local obstructions: construct nonsmoothable examples from reflexive polytopes.",
 "cy-toric-pairs":"Ambient constructions: identify when toric deformations produce smoothings.",
 "cy-mirror-pairs":"A classification: study mirror pairs whose singularities are isolated on both sides.",
 "cy-vanishing-cycle":"A global obstruction: locally smoothable singularities need not smooth together.",
 "cy-mixed-smoothing":"A criterion: combine the relation space with the allowed local smoothing components.",
 "cy-conifold-relations":"Mirror relations: compare integral relation lattices in specified Batyrev families."
}

# Focus sections are kept in content/<stem>.html. Each is a <section> with an id, an h2,
# an optional data-question and an optional status badge, which the research index collects.
FOCUS={
 "markets":["markets-evidence-allocation"],
 "topology":["topology-atiyah-floer","topology-wider-problems"],
 "calabi-yau":["calabi-yau-reading-guide","calabi-yau-universal-counting","calabi-yau-physics-companions"],
 "geometry":["geometry-stability-degeneration","singular-quotient-metrics","geometry-fjrw-scattering","geometry-inverse-moduli"],
 "physics":["physics-compact-higgs","physics-black-hole-information"],
}
STATUS_ORDER=[
 ("Integrated programme","Results proved apart have been joined by a theorem."),
 ("Developing programme","Established results, and a precisely identified missing bridge."),
 ("Exploratory frontier","First results, and a problem much larger than anything yet proved."),
 ("Proposed agenda","A question connecting existing work that no paper has yet answered."),
]
# The research index pairs each guide with an illustration; physics uses the essay art for its spectral law.
INDEX_ART={"physics":"one-law"}
# Manuscript groups: (label, focus-section id, slugs). Together they must list a guide's slugs in order.
GROUPS={
 "calabi-yau":[("Smoothability and mirror relations","six-paper-guide",["cy-non-smoothable","cy-toric-pairs","cy-mirror-pairs","cy-vanishing-cycle","cy-mixed-smoothing","cy-conifold-relations"]),
                ("Universal curve counting","universal-curve-counting",["universal-conifold-counting","universal-integrality-counterexample"])],
 "topology":[("Knots and the pillowcase","atiyah-floer",["traceless-characters-instanton-gradings","s-complex-torus-knots","pillowcase-torus-knots","pretzel-instanton-pillowcase","pretzel-maurer-cartan"]),
             ("Atiyah–Floer comparisons","atiyah-floer",["af-point-operations","af-cobordism-i","af-cobordism-ii"]),
             ("Four-manifolds","wider-problems",["one-bubble-neighborhoods","exotic-four-manifolds"])],
 "geometry":[("Stability walls and geometric degeneration","stability-degeneration",["toric-tangent-stability","toric-tangent-blowups-bundles","toric-local-stability-chambers","small-dolbeault-stability-walls","small-dolbeault-eigenvalues","uniform-hermitian-einstein-spectra","nonsimplicial-toric-stability-chambers","metric-response-hym-flow"]),
             ("Singular quotient metrics","singular-quotient-metrics",["relative-metrics-reducible-yang-mills"]),
             ("Open FJRW theory","fjrw-scattering",["fjrw-central-charge-threshold","fjrw-slope-ordered-factorization","fjrw-annular-scattering"]),
             ("Realization of moduli structures","inverse-moduli",["inverse-moduli-theory"])],
 "physics":[("Compact Higgs transitions","compact-higgs",["compact-higgs-global-constraints","compact-higgs-quantum-transition","compact-higgs-magnetic-sheaves","compact-higgs-finite-planck"]),
            ("Black-hole information","black-hole-information",["page-curve-transition","page-curve-higher-dimensions","page-curve-not-enough","hawking-to-marchenko-pastur","informational-singularities"])],
}
# Papers whose full entry lives in another guide, listed briefly under a guide's own manuscripts:
# (label, local section id, home-guide URL, slugs).
COMPANIONS={
 "calabi-yau":("Physics companions","physics-companions","/research/physics/#manuscripts",["compact-higgs-global-constraints","compact-higgs-quantum-transition","compact-higgs-magnetic-sheaves","compact-higgs-finite-planck"]),
}

def focus_sections(stems):
    out=[]
    for stem in stems:
        text=(ROOT/f"content/{stem}.html").read_text()
        status=re.search(r'<span class="status[^"]*">([^<]+)</span>',text)
        question=re.search(r'data-question="([^"]+)"',text)
        remains=re.search(r'data-remains="([^"]+)"',text)
        out.append(dict(id=re.search(r'<section\b[^>]*\bid="([^"]+)"',text)[1],
                        title=re.sub(r"<[^>]+>","",re.search(r"<h2[^>]*>(.*?)</h2>",text,re.S)[1]).strip(),
                        status=status[1] if status else None,
                        question=html.unescape(question[1]) if question else "",
                        remains=html.unescape(remains[1]) if remains else "",
                        text=text))
    assert all(s["status"] in (None,*[x for x,_ in STATUS_ORDER]) for s in out),"Unknown focus status"
    return out

def paper_contexts():
    """Map each paper to its home guide and programme section; tools/update-papers.py links paper pages to it."""
    result={}
    for p in programs:
        sections={s["id"]:s for s in focus_sections(FOCUS.get(p["slug"],[]))}
        default=next((s["id"] for s in sections.values() if s["status"]),None)
        for _,anchor,slugs in GROUPS.get(p["slug"],[(None,default,p["slugs"])]):
            s=sections.get(anchor)
            for slug in slugs:
                result[slug]=dict(guide=p["name"],url=f'/research/{p["slug"]}/'+(f'#{anchor}' if s else ''),
                                  section=s["title"].rstrip(".") if s else None,status=s["status"] if s else None)
    assert set(result)=={x["slug"] for x in papers},"Every paper needs one home guide"
    return result

def status_badge(status):
    return f'<span class="status {status.split()[0].lower()}">{status}</span>'

def explorer_card(x):
    route,img,kicker,title,desc,meta=x
    return f'''<a class="visual-link" href="/{route}/"><div class="art-panel"><img src="/assets/illustrations/{img}.svg" alt="" width="800" height="500" loading="lazy"></div><p class="kicker">{kicker}</p><h3>{title} <span class="arrow" aria-hidden="true">↗</span></h3><p>{desc}</p><p class="small">{meta}</p></a>'''

# Homepage summaries: what each guide's work does, without counts. The guides' own intros appear on /research/.
HOME_SUMMARY={
 "markets":"A model that earns has not thereby explained anything. The papers ask what discovery means once language models make hypotheses free while evidence still arrives one year per year, how a portfolio should respond to a forecast, and how a firm should form, test and revise its beliefs.",
 "topology":"Cut a space along a surface and a hard question becomes a comparison between simpler pieces. The papers compare two Floer theories, one built from instantons and one from holomorphic curves, exactly for families of knots and for the maps that four-dimensional cobordisms induce.",
 "calabi-yau":"A singular threefold can be smoothable at every singular point and still admit no smoothing at all. The papers determine when local smoothings coexist, how mirror symmetry transforms their relations, and how universal curve counts change through a transition. A compact counterexample identifies a limit to integer product expansions.",
 "geometry":"As a bundle approaches a stability wall, its metric loses rigidity, and small eigenvalues record the scale of the loss. The papers connect stability chambers to spectra, metrics and geometric flows, and ask how wall crossing becomes geometry in open FJRW theory and which algebra a moduli space can realize.",
 "physics":"In a compact universe, singularities that could each change on their own may only change together; the papers work out which transitions the geometry allows. For black holes, they ask how much an entropy curve, even computed exactly, reveals about the quantum process behind it.",
 "ai-institutions":"Abundant analysis does not abolish the need for institutions, infrastructure or someone who answers for a decision; it moves the scarcity onto them. The papers follow that shift into markets between machines, the physical systems that sustain deployment, and the attribution of responsibility when decisions are delegated to algorithms.",
}

def research_cards():
    assert set(HOME_SUMMARY)=={p["slug"] for p in programs},"Every guide needs a homepage summary"
    return '<div class="research-grid">'+''.join(f'''<article class="research-entry"><span class="number">0{i+1}</span><h3><a href="/research/{p["slug"]}/">{p["name"]}</a></h3><p class="research-question">{p["question"]}</p><p class="small">{E(HOME_SUMMARY[p["slug"]])}</p></article>''' for i,p in enumerate(programs))+'</div>'

def build_home():
    body='''<header class="home-intro"><p class="kicker">Finance · Mathematics · Theoretical Physics</p><h1>Bernd Johannes<br>Wuebben</h1>
<div class="home-intro-copy"><figure><a href="/about/"><img src="/assets/bernd_dark1-576.jpg" width="576" height="864" alt="Bernd Wuebben" fetchpriority="high"></a></figure>
<p class="intro">A price is a claim about the future that somebody was willing to fund. My research in finance asks what can be known about such claims: whether a model that earns is a model that explains, where compensation for risk ends and compensation for absorbing other people’s constraints begins, and what remains hidden in a record of success.</p>
<p class="intro">These questions lead outward: toward who is on the other side of a trade and what they are solving for, and toward markets as aggregation mechanisms that sometimes aggregate belief and sometimes only aggregate attention.</p>
<p class="intro">In mathematics and theoretical physics, I pursue questions about geometry, topology, and information: how local structures constrain a whole, what survives a change of description, and how much of an object its invariants can reveal. My particular interests include four-manifolds, gauge and Floer theory, mirror symmetry, and moduli spaces.</p>
<p class="research-purpose">This site collects my <a href="/papers/">research papers</a> and essays, including work on AI, institutions, and international order.</p></div>
<div class="entry-links"><a class="button" href="/papers/">Read the research papers <span class="arrow" aria-hidden="true">↗</span></a><a class="quiet-link" href="/research/">Research programs <span class="arrow" aria-hidden="true">↗</span></a></div></header>'''
    body+='<section class="section-block home-papers" aria-labelledby="selected-papers"><div class="section-top"><div><p class="kicker">From the research</p><h2 id="selected-papers">Selected papers</h2></div>'+link("/papers/",f"Complete collection · {len(papers)} papers")+'</div><div class="paper-picks">'
    selected_papers = [
        ("validation-bottleneck", "Language models have made investment hypotheses free. The evidence that can judge them still arrives one year per year, and the paper works out what that does to discovery."),
        ("cy-conifold-relations", "Mirror symmetry trades relations among exceptional curves for relations among vanishing spheres. The paper proves the trade exact, as an equality of integral lattices, for specified Batyrev families near the maximally degenerate limit."),
        ("page-curve-not-enough", "An entropy curve can agree exactly while the ensembles behind it fluctuate differently and the channels behind it differ in what they keep. The paper builds exact finite examples of both."),
        ("ai-native-asset-manager", "When analysis is cheap, the scarce resource is the architecture by which a firm generates, challenges, sizes and learns from its beliefs. The paper designs an investment firm around it."),
        ("af-cobordism-i", "Daemi, Fukaya and Lipyanskiy identified framed instanton homology with a Lagrangian Floer homology. The paper proves that such identifications also respect four-dimensional cobordism maps, over the field of two elements."),
        ("compact-higgs-finite-planck", "Without gravity, a Higgs branch comes with a dial that can smooth its singularity. With gravity the dial disappears, and the paper shows that the singularity keeps its shape, under stated freeness and regularity hypotheses."),
    ]
    for slug,desc in selected_papers:
        p=by_slug[slug]
        body+=f'<article><p class="kicker">{E(p["label"])}</p><h3><a href="/papers/{slug}/">{E(p["title"])}</a></h3><p class="small">{desc}</p></article>'
    body+='</div></section>'
    body+='<section class="section-block"><div class="section-top"><div><p class="kicker">Questions, constructions, and arguments</p><h2>Research programs</h2></div>'+link("/research/","Guides to the papers")+'</div>'+research_cards()+'</section>'
    body+='''<section class="feature home-essay" aria-labelledby="featured-title"><div class="feature-copy"><p class="kicker">An essay across the research</p><h2 id="featured-title"><a href="/not-enough.html">Not Enough</a></h2><p>Two drums can ring identically and differ in shape. So can two track records, the radiation of two black holes and two cuts of the same knot. The essay follows what each sound leaves out.</p><a class="quiet-link" href="/not-enough.html">Read the essay <span class="arrow" aria-hidden="true">↗</span></a></div><a class="feature-art" href="/not-enough.html" aria-label="Read Not Enough"><img src="/assets/illustrations/drums.svg" width="800" height="500" alt="Two differently shaped drums" loading="lazy"></a></section>'''
    body+='<section class="section-block home-companions"><div class="section-top"><div><p class="kicker">Constructions and examples</p><h2>Visual companions<br>to the research</h2></div>'+link("/explorers/","All six companions")+'</div><p class="companion-intro">Each companion takes one construction from the papers and puts it in your hands: a knot cut along a sphere, a three-sphere shrinking to a point, a portfolio rebuilt around a forecast. The pictures suggest; the papers state exactly what follows.</p><div class="visual-grid">'+explorer_card(explorers[1])+explorer_card(explorers[3])+'</div></section>'
    # Recent additions come from data/updates.json, the source of the Updates page and RSS feed.
    latest=sorted(json.loads((ROOT/"data/updates.json").read_text()),key=lambda x:x["date"],reverse=True)[:3]
    body+='<section class="split-note"><div><p class="kicker">The continuing work</p><h2>Recent additions</h2><p class="small">New papers, revised arguments, and essays.</p>'+link("/updates/","Publication updates")+'</div><div>'
    for u in latest:
        summary=re.split(r'(?<=[.!?])\s+(?=[A-Z])',u["description"])[0]
        body+=f'<div class="update-row"><time datetime="{u["date"]}">{datetime.fromisoformat(u["date"]).strftime("%-d %B %Y")}</time><p><a href="{E(u["url"],quote=True)}">{E(u["title"])}</a><br><span class="small">{E(summary)}</span></p></div>'
    body+='''<p class="small" style="margin-top:1.5rem"><a href="/feed.xml">Subscribe by RSS ↗</a> · <a href="/about/">About &amp; contact ↗</a></p></div></section>'''
    person='<script type="application/ld+json">\n'+(ROOT/"data/person.json").read_text()+'</script>'
    page("index.html","Bernd Johannes Wuebben","Research papers and essays by Bernd Wuebben in finance, mathematics, theoretical physics, AI, and international relations.",body,extra=person)

def build_explorers():
    body='''<header class="page-intro"><p class="kicker">Visual companions to the papers</p><h1>Constructions,<br>made explicit.</h1><p class="intro">A picture can show a relation before anyone understands its proof, and a numerical example can expose a distinction a formula hides. Each companion makes one construction from the research explicit, with the assumptions and limits of its model stated beside it.</p><p class="small"><a href="/papers/">Research papers ↗</a> · <a href="/research/">Guides to the research ↗</a></p></header><div class="visual-grid">'''
    body+=''.join(map(explorer_card,explorers))+'</div>'
    body+='''<aside class="guide-aside"><p>A place to start.</p><p class="small">The <a href="/beyond-hrp-lab/">portfolio lab</a> starts with familiar decisions about risk and return. The <a href="/pillowcase-explorer/">pillowcase explorer</a> builds its geometry one move at a time. For a tour across the subjects, start with <a href="/not-enough.html">Not Enough</a>.</p></aside>'''
    page("explorers/index.html","Explorers","Six interactive laboratories in geometry, topology, geometric analysis, and portfolio construction.",body,image="conifold")

def guide_rows():
    body='<section class="guide-rows" aria-label="The six guides">'
    for i,p in enumerate(programs):
        sections=[x for x in focus_sections(FOCUS.get(p["slug"],[])) if x["status"]]
        items=''.join(f'<li><a href="/research/{p["slug"]}/#{x["id"]}">{E(x["title"].rstrip("."))}</a>{status_badge(x["status"])}</li>' for x in sections) or ''.join(f'<li><span>{E(t)}</span></li>' for t,_ in p["themes"])
        art=INDEX_ART.get(p["slug"],p["image"])
        body+=f'''<article class="guide-row"><a class="guide-row-art" href="/research/{p["slug"]}/" aria-label="{E(p["name"])}"><img src="/assets/illustrations/{art}.svg" alt="" width="800" height="500" loading="lazy"></a><div><p class="kicker">0{i+1} · {E(p["name"])}</p><h2><a href="/research/{p["slug"]}/">{E(p["question"])}</a></h2><p class="guide-row-intro">{p["intro"]}</p><ul class="guide-programmes">{items}</ul>{link("/research/"+p["slug"]+"/","Open the guide")}</div></article>'''
    return body+'</section>'

def stage_table():
    body='<section class="section-block" id="where-the-work-stands"><p class="kicker">Programmes within the guides</p><h2>Where the work stands.</h2><p class="focus-lede">The programmes differ in how far each argument has reached.</p><table class="stage-table"><thead><tr><th scope="col">Programme</th><th scope="col">Stage</th><th scope="col">What remains</th></tr></thead><tbody>'
    sections=[(p,x) for p in programs for x in focus_sections(FOCUS.get(p["slug"],[])) if x["status"]]
    for status,definition in STATUS_ORDER:
        for p,x in sections:
            if x["status"]!=status:continue
            assert x["remains"],"Programme section needs data-remains: "+x["id"]
            body+=f'<tr><td><a href="/research/{p["slug"]}/#{x["id"]}">{E(x["title"].rstrip("."))}</a><span class="stage-guide">{E(p["name"])}</span></td><td><span title="{E(definition,quote=True)}">{status_badge(status)}</span></td><td>{E(x["remains"])}</td></tr>'
    return body+'</tbody></table></section>'

def build_research():
    page("research/index.html","Research","Reading guides to six strands of research by Bernd Wuebben.",'''<header class="page-intro"><p class="kicker">Research programs</p><h1>The questions<br>behind the papers.</h1><p class="intro">A paper isolates one question, sharply enough that an argument becomes possible. The sharpening has a price: the paper stops saying which constructions it borrowed, which distinctions it exposed for its neighbours, and what it left unresolved. These guides put that context back.</p><p><a class="button" href="/papers/">Complete collection of research papers ↗</a></p></header>'''+guide_rows()+stage_table()+(ROOT/"content/research-connections.html").read_text(),image="geometry")
    missing=[slug for p in programs for slug in p["slugs"] if slug not in roles]
    assert not missing,"Every paper in a guide needs a one-line role in roles: "+", ".join(missing)
    for p in programs:
        focus=focus_sections(FOCUS.get(p["slug"],[]))
        body=f'''<header class="program-hero"><div><p class="kicker"><a href="/research/">Research</a> / {E(p["name"])}</p><h1>{p["question"]}</h1><p class="intro">{p["intro"]}</p></div><img src="/assets/illustrations/{p["image"]}.svg" width="800" height="500" alt="Schematic illustration of {E(p["name"])}"></header>'''
        if focus:
            body+='<nav class="page-contents" aria-label="On this page"><p class="kicker">On this page</p><ol>'
            for s in focus+[dict(id="manuscripts",title="The manuscripts.",status=None)]:
                body+=f'<li><a href="#{s["id"]}">{E(s["title"].rstrip("."))}</a>'+(status_badge(s["status"]) if s["status"] else "")+'</li>'
            body+='</ol></nav>'
        body+=f'''<section class="section-block"><p class="kicker">A route through the subject</p><h2>{p["name"]}</h2><div class="reading-path">'''
        for i,(title,desc) in enumerate(p["themes"]):
            body+=f'<div><p class="kicker">0{i+1}</p><h3>{title}</h3><p class="small">{desc}</p></div>'
        body+='</div><div class="prose-columns"><div><h3>'+p["start_text"]+'</h3><p>'
        if p["explorer"]:
            body+=link(p["explorer"],"Open the visual introduction")+'</p><p class="small">Then continue to the manuscripts below. The illustrations offer intuition; each paper states the mathematical or empirical scope of its argument.</p>'
        else:
            body+=link('/papers/'+p["start"]+'/',E(by_slug[p["start"]]["title"]))+'</p>'
        body+='<p class="small">A manuscript to begin with: <a href="/papers/'+p["start"]+'/">'+E(by_slug[p["start"]]["title"])+'</a>.</p>'
        body+='</div><div><h3>Scope of the work</h3><p class="small">'+p["scope"]+'</p></div></div></section>'
        body+="".join(s["text"] for s in focus)
        body+=f'<section class="section-block" id="manuscripts"><p class="kicker">{len(p["slugs"])} papers · Suggested reading sequence</p><h2>The manuscripts.</h2>'
        groups=GROUPS.get(p["slug"],[(None,None,p["slugs"])])
        assert [s for g in groups for s in g[2]]==p["slugs"],"Manuscript groups must list the guide's papers in order: "+p["slug"]
        i=0
        for label,anchor,slugs in groups:
            if label:
                count=f'{len(slugs)} paper'+('s' if len(slugs)>1 else '')
                body+=f'<p class="paper-group">{E(label)} · {count}<a href="#{anchor}">The programme ↑</a></p>'
            body+=f'<ol class="program-papers" start="{i+1}">'
            for slug in slugs:
                i+=1
                item=by_slug[slug]
                body+=f'''<li><span class="paper-number">{i:02}</span><div><h3><a href="/papers/{slug}/">{E(item["title"])}</a></h3><p class="small">{E(roles.get(slug,item["label"]))}</p><p class="small">{E(item["status"])} · {item["publication_date"][:4]} · <a href="/papers/{slug}/">Abstract, PDF &amp; citation ↗</a></p><details><summary>Read the abstract</summary>{item["abstract_html"]}</details></div></li>'''
            body+='</ol>'
        if p["slug"] in COMPANIONS:
            label,anchor,home,slugs=COMPANIONS[p["slug"]]
            body+=f'<p class="paper-group">{E(label)} · {len(slugs)} papers<a href="#{anchor}">Reading notes ↑</a></p><ul class="companion-papers">'
            body+="".join(f'<li><a href="/papers/{slug}/">{E(by_slug[slug]["title"])}</a><span class="small">{E(roles.get(slug,""))}</span></li>' for slug in slugs)
            body+=f'</ul><p class="small">Full entries, with abstracts, are in the <a href="{home}">physics guide</a>.</p>'
        body+='</section>'
        page(f'research/{p["slug"]}/index.html',p["name"],p["intro"],body,image=p["image"])

def build_about():
    body=(ROOT/"content/about.html").read_text()
    page("about/index.html","About","Bernd Wuebben: research in mathematics, finance, and theoretical physics.",body,image="institution")

def build_writing_updates():
    essays=[("not-enough.html","drums","Interactive essay","Not Enough","Two drums, two portfolios, and the information that lives only in the whole."),
            ("writing/institutional-knowledge/","institution","Interactive essay","What does an institution know?","When ten agreeing voices are one piece of evidence, repeated ten times."),
            ("writing/physical-limits/","energy","Essay","The material conditions of intelligence","How physical constraints shape the passage from computational possibility to sustained capability."),
            ("writing/one-law/","one-law","Interactive essay","The same law in a black hole and a stock market","A few hundred stocks of pure noise and an evaporating black hole share one spectrum."),
            ("writing/one-year-per-year/","one-year-per-year","Interactive essay","One year per year","When hypotheses are free, the scarce input is the calendar."),
            ("writing/nobody-did-it/","nobody-did-it","Interactive essay","Nobody did it","Deterrence assumes an author. Delegation to machines can remove one."),
            ("writing/broken-things/","broken-things","Interactive essay","Why broken things make invariants","Modern geometry counts with the ways its solutions fall apart."),
            ("writing/who-vouches/","who-vouches","Interactive essay","Who vouches for a machine?","Machines can already pay one another. Trusting one another is harder."),
            ("writing/two-failures/","two-failures","Interactive essay","Two ways for a theory to fail","A dome, a black hole, and the difference between a broken geometry and a lost answer."),
            ("writing/balance-point/","balance-point","Interactive essay","The balance point of a hexagon","Six roots, one centre of gravity, and when a space admits its best metric."),
            ("writing/nothing-condenses-alone/","nothing-condenses-alone","Interactive essay","Nothing condenses alone","In a compact universe, gravity turns a local symmetry into a shared constraint."),
            ("poem.html","geometry","Poem","Gradient of Mind","A reflection on awareness, energy, and the forms that intelligence takes.")]
    body='''<header class="page-intro"><p class="kicker">Essays &amp; perspectives</p><h1>On knowledge,<br>structure, and explanation.</h1><p class="intro">A description can be accurate and still leave out what matters: the shape of a drum, the risks a track record was paid for, the relation that decides whether a space can be smoothed. These essays follow that gap through markets, geometry, physics and the institutions now being rebuilt around machines. Where a model sharpens the argument, the essay builds one and states its limits beside it.</p><p class="small"><a href="/papers/">Research papers ↗</a></p></header><div class="visual-grid">'''
    for route,img,kind,title,desc in essays:
        body+=f'<a class="visual-link" href="/{route}"><div class="art-panel"><img src="/assets/illustrations/{img}.svg" width="800" height="500" alt="" loading="lazy"></div><p class="kicker">{kind}</p><h3>{title} <span class="arrow">↗</span></h3><p>{desc}</p></a>'
    page("writing/index.html","Writing","Interactive essays and a poem about mathematics, markets, and intelligence.",body+"</div>",image="institution")
    updates=[(x["date"],x["title"],x["url"],x["description"]) for x in json.loads((ROOT/"data/updates.json").read_text())]
    body='''<header class="page-intro"><p class="kicker">Updates</p><h1>The work continues.</h1><p class="intro">New papers, substantial revisions, and additions to the site.</p><a class="feed-link" href="/feed.xml">Subscribe with an RSS reader ↗</a></header>'''
    for d,t,u,x in updates:
        date_label=datetime.fromisoformat(d).strftime("%-d %B %Y")
        body+=f'<article class="update-row"><time datetime="{d}">{date_label}</time><div><h3><a href="{u}">{E(t)}</a></h3><p>{E(x)}</p></div></article>'
    body+='''<aside class="guide-aside"><p class="small">RSS is a feed you can follow in a reader of your choice. Copy <a href="/feed.xml">the feed address</a> into your reader to receive additions.</p></aside>'''
    page("updates/index.html","Updates","New papers, revised manuscripts, and additions to Bernd Wuebben's website.",body)
    rss=ET.Element("rss",version="2.0")
    channel=ET.SubElement(rss,"channel")
    for k,v in [("title","Bernd Wuebben — Updates"),("link",BASE+"/updates/"),("description","New papers, revised manuscripts, and additions to the website."),("language","en")]:
        ET.SubElement(channel,k).text=v
    for d,t,u,x in updates:
        item=ET.SubElement(channel,"item")
        date_rss=format_datetime(datetime.fromisoformat(d).replace(tzinfo=timezone.utc))
        for k,v in [("title",t),("link",BASE+u),("guid",BASE+u+"#update-"+d),("description",x),("pubDate",date_rss)]:
            ET.SubElement(item,k).text=v
    ET.indent(rss)
    write("feed.xml",'<?xml version="1.0" encoding="UTF-8"?>\n'+ET.tostring(rss,encoding="unicode"))

def main():
    artworks()
    build_home()
    build_explorers()
    build_research()
    build_about()
    build_writing_updates()
    subprocess.run(["python3",str(ROOT/"tools/update-site.py")],check=True)

if __name__=="__main__":
    main()
