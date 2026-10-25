#!/usr/bin/env python3
"""Build the interactive essays from content/<slug>.html.

With no arguments, build every essay (the full rebuild runs update-site.py later).
Pass essay slugs to rebuild only those pages and refresh their navigation.
"""
import fcntl
import importlib.util
import subprocess
import sys
from pathlib import Path
spec=importlib.util.spec_from_file_location("editorial",Path(__file__).with_name("build-editorial.py"))
editorial=importlib.util.module_from_spec(spec)
spec.loader.exec_module(editorial)
ROOT=editorial.ROOT
shared='<script defer src="/assets/essay-models.js"></script><script defer src="/assets/essay-experiments.js"></script>'
ESSAYS=[
    ("institutional-knowledge","What does an institution know?","An interactive essay about shared evidence, agreement, and institutional learning.","institution"),
    ("physical-limits","The material conditions of intelligence","An essay on the physical conditions that turn computational possibility into sustained capability.","energy"),
    ("one-law","The same law in a black hole and a stock market","An interactive essay on the Marchenko–Pastur law in portfolio noise and in the Page curve of an evaporating black hole.","one-law"),
    ("one-year-per-year","One year per year","An interactive essay on alpha discovery when hypotheses are free and evidence accrues at the speed of the calendar.","one-year-per-year"),
    ("nobody-did-it","Nobody did it","An interactive essay on algorithmic delegation, attribution, and the erosion of deterrence.","nobody-did-it"),
    ("broken-things","Why broken things make invariants","An interactive essay on how gauge theory and Floer theory count with the ways solutions break.","broken-things"),
    ("who-vouches","Who vouches for a machine?","An interactive essay on the trust layer that autonomous machine commerce still lacks.","who-vouches"),
    ("two-failures","Two ways for a theory to fail","An interactive essay on geometric and informational singularities, from Norton’s dome to the island formula.","two-failures"),
    ("balance-point","The balance point of a hexagon","An interactive essay on slope stability, Kähler–Einstein metrics, and the roots of a hexagon.","balance-point"),
    ("nothing-condenses-alone","Nothing condenses alone","An interactive essay on Higgs transitions in compact Calabi–Yau threefolds, where gravity turns local symmetries into shared constraints.","nothing-condenses-alone"),
]

def assets(slug):
    """Shared models for the first two essays; each later essay owns its files."""
    if slug in {"institutional-knowledge","physical-limits"}:
        return shared
    tags=[]
    for name,tag in [(slug+".css",'<link rel="stylesheet" href="/assets/essays/{}">'),
                     (slug+"-model.js",'<script defer src="/assets/essays/{}"></script>'),
                     (slug+".js",'<script defer src="/assets/essays/{}"></script>')]:
        if (ROOT/"assets/essays"/name).exists():
            tags.append(tag.format(name))
    return "".join(tags)

def build(slug,title,description,image):
    editorial.page("writing/"+slug+"/index.html",title,description,
                   (ROOT/"content"/(slug+".html")).read_text(),extra=assets(slug),image=image)

def main(slugs):
    known={e[0]:e for e in ESSAYS}
    unknown=[s for s in slugs if s not in known]
    if unknown:
        raise SystemExit("Unknown essay: "+", ".join(unknown))
    if not slugs:
        for essay in ESSAYS:
            build(*essay)
        return
    # Single-essay rebuilds may run concurrently; update-site.py rewrites every page.
    with open(ROOT/".git/essay-build.lock","w") as lock:
        fcntl.flock(lock,fcntl.LOCK_EX)
        for slug in slugs:
            build(*known[slug])
        subprocess.run(["python3",str(ROOT/"tools/update-site.py")],check=True)

if __name__=="__main__":
    main(sys.argv[1:])
