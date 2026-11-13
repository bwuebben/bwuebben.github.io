#!/usr/bin/env python3
"""Build or check the compact Papers catalogue after generating paper pages."""
from pathlib import Path
import argparse
import hashlib
import html
import json
import re
import runpy
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
E = html.escape
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--check', action='store_true', help='Verify the catalogue and shared navigation without writing')
args = parser.parse_args()
original = (ROOT / 'papers/index.html').read_text()
source = original
editorial = runpy.run_path(str(ROOT / 'tools/build-editorial.py'))
papers = editorial['by_slug']
programs = editorial['programs']
entries = {m[1]: m[0] for m in re.finditer(r'<li id="([^"]+)">\s*<span class="entry-title">.*?</li>', source, re.S)}
assert set(entries) == {p['catalogue_anchor'] for p in papers.values()}

# Preserve the existing programme and category anchors as well as every paper anchor.
aliases = {
    'markets': ['markets'],
    'topology': ['mathematics', 'knot-instanton-homology', 'atiyah-floer', 'exotic-four-manifolds-series'],
    'calabi-yau': ['calabi-yau-smoothability', 'universal-curve-counting'],
    'geometry': ['toric-tangent-stability-series', 'open-fjrw', 'stability-degeneration'],
    'physics': ['physics', 'compact-higgs-transitions', 'heterotic-k3', 'black-hole-information'],
    'ai-institutions': ['ai', 'politics'],
}
labels = {
    'markets': 'Markets & inference',
    'topology': 'Topology & Floer theory',
    'calabi-yau': 'Calabi–Yau geometry',
    'geometry': 'Geometry & moduli',
    'physics': 'Theoretical physics',
    'ai-institutions': 'AI, institutions & power',
}
descriptions = {
    'markets': 'Evidence, investment models and portfolio construction.',
    'topology': 'Knots, four-manifolds and the maps between Floer theories.',
    'calabi-yau': 'Smoothability, mirror relations and curve counting.',
    'geometry': 'Stability, canonical metrics, degeneration and moduli spaces.',
    'physics': 'Compact Higgs transitions, black holes and information.',
    'ai-institutions': 'Machine economies, institutional design and international order.',
}
metadata = {'fields': [], 'papers': [], 'aliases': aliases}
nav = [f'<a href="#catalogue-results" data-field="all" aria-current="true"><span>All papers</span><span>{len(papers)}</span></a>']
sections = []
for program in programs:
    key = program['slug']
    slugs = program['slugs']
    metadata['fields'].append({'id': key, 'label': labels[key]})
    nav.append(f'<a href="#field-{key}" data-field="{key}"><span>{E(labels[key])}</span><span>{len(slugs)}</span></a>')
    groups = editorial['GROUPS'].get(key, [(None, None, slugs)])
    parts = []
    for group_name, anchor, group_slugs in groups:
        if group_name:
            parts.append(f'<h3 class="series-heading">{E(group_name)}</h3>')
        parts.append('<ul class="entries">')
        for slug in group_slugs:
            p = papers[slug]
            parts.append(entries[p['catalogue_anchor']])
            # Match the primary reading button on the individual paper page.
            archive = p.get('archive')
            if archive and (not p.get('pdf') or archive['name'] in ('arXiv', 'SSRN')):
                read_url, read_label = archive['url'], archive['name']
            else:
                read_url, read_label = slug + '/paper.pdf', 'PDF'
            metadata['papers'].append({
                'anchor': p['catalogue_anchor'], 'slug': slug, 'field': key,
                'title': p['catalogue_title'], 'series': group_name or labels[key],
                'date': p.get('revision_date') or p['publication_date'],
                'revised': bool(p.get('revision_date')), 'status': p['status'],
                'read_url': read_url, 'read_label': read_label,
            })
        parts.append('</ul>')
    preserved = ''.join(f'<span id="{a}" class="catalogue-anchor"></span>' for a in aliases[key])
    sections.append(f'''<section class="catalogue-field" id="field-{key}" data-field-section="{key}">
{preserved}<header class="field-heading"><div><h2>{E(labels[key])}</h2><p>{E(descriptions[key])}</p></div>
<a href="../research/{key}/">Reading guide <span aria-hidden="true">↗</span></a></header>
{''.join(parts)}</section>''')

assert len(metadata['papers']) == len(papers) == len({p['slug'] for p in metadata['papers']})
subject_options = f'<option value="all">All papers ({len(papers)})</option>' + ''.join(
    f'<option value="{p["slug"]}">{E(labels[p["slug"]])} ({len(p["slugs"])})</option>' for p in programs)
body = f'''<main id="main" class="wrap paper-browser" tabindex="-1">
  <header class="masthead"><div class="catalogue-intro"><div><p class="catalogue-kicker">The research collection</p><h1>Papers.</h1></div>
<p>Find a paper, follow a subject.<br>Open a title for its full abstract and manuscript.</p></div></header>
<div class="catalogue-layout"><aside class="catalogue-sidebar"><nav aria-label="Browse papers by subject">
<p class="catalogue-kicker">Browse by subject</p>{''.join(nav)}</nav>
<label class="catalogue-mobile-field" for="catalogue-subject"><span class="catalogue-kicker">Browse by subject</span><select id="catalogue-subject">{subject_options}</select></label>
<div class="catalogue-aside-note"><p>Looking for a way in?</p><a href="../research/">Read the research guides <span aria-hidden="true">↗</span></a>
<p class="aside-detail">The questions, connections and suggested reading orders behind the collection.</p></div></aside>
<div class="catalogue-content"><div class="catalogue-tools" hidden>
<div class="catalogue-search"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>
<label class="visually-hidden" for="paper-search">Search papers</label><input id="paper-search" type="search" placeholder="Search titles, subjects or summaries" autocomplete="off"><button type="button" id="clear-search" hidden aria-label="Clear search">×</button></div>
<div class="catalogue-toolbar"><p id="catalogue-count" role="status" aria-live="polite">All subjects · {len(papers)} papers</p>
<div class="catalogue-options"><label class="catalogue-summary-toggle"><input type="checkbox" id="show-summaries"> Show summaries</label>
<label class="visually-hidden" for="catalogue-sort">Sort papers</label><select id="catalogue-sort"><option value="programme">By programme</option><option value="newest">Newest version</option><option value="title">Title A–Z</option></select></div></div></div>
<div id="catalogue-results">{''.join(sections)}</div>
<div id="catalogue-empty" hidden><h2>No papers found.</h2><p>Try a broader term or search across all subjects.</p><button type="button" id="reset-catalogue">Reset search and subjects</button></div>
</div></div><footer class="catalogue-footer"><span>Bernd Johannes Wuebben</span><a href="../research/">Research programmes ↗</a><a href="../about/">About &amp; contact</a></footer>
</main>'''
source = re.sub(r'<main\b.*?</main>', lambda _: body, source, count=1, flags=re.S)
source = re.sub(r'\n<link rel="stylesheet" href="../assets/catalogue-browser\.css[^\"]*">', '', source)
source = re.sub(r'\n<script(?: type="application/json" id="catalogue-data"| defer src="../assets/catalogue-browser\.js[^\"]*").*?</script>', '', source, flags=re.S)
css = hashlib.sha256((ROOT / 'assets/catalogue-browser.css').read_bytes()).hexdigest()[:12]
js = hashlib.sha256((ROOT / 'assets/catalogue-browser.js').read_bytes()).hexdigest()[:12]
source = source.replace('</head>', f'<link rel="stylesheet" href="../assets/catalogue-browser.css?v={css}">\n</head>')
encoded = json.dumps(metadata, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
source = source.replace('</body>', f'<script type="application/json" id="catalogue-data">{encoded}</script>\n<script defer src="../assets/catalogue-browser.js?v={js}"></script>\n</body>')
if args.check:
    if source != original:
        print('Stale: papers/index.html; run python3 tools/update-papers.py')
        raise SystemExit(1)
else:
    (ROOT / 'papers/index.html').write_text(source)
subprocess.run([sys.executable, str(ROOT / 'tools/update-site.py')] + (['--check'] if args.check else []), check=True)
print(f'{"Checked" if args.check else "Built"} compact catalogue: {len(papers)} unchanged entries, {len(programs)} subjects.')
