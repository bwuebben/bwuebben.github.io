"""Build the series atlas from editorial data and current public paper records."""
from hashlib import sha256
from html import escape
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ROUTE = 'research/geometry/quantitative-moduli/atlas/index.html'

def build_atlas(page):
    dataset = ROOT / 'data/stability-degeneration-atlas.json'
    data = json.loads(dataset.read_text())
    records = {p['slug']: p for p in json.loads((ROOT / 'data/papers.json').read_text())['papers']}
    assert sorted(p['id'] for p in data['papers']) == list(range(1, 29))
    assert sorted(p['rank'] for p in data['papers']) == list(range(1, 29))
    cards = []
    for p in sorted(data['papers'], key=lambda p: p['id']):
        current = records[p['slug']]
        p.update(title=current['title'], status='Public preprint', page=f"/papers/{p['slug']}/",
                 pdf=f"/papers/{p['slug']}/paper.pdf", sha256=current['pdf']['sha256'],
                 doi=current['citation_doi'], publicationDate=current['publication_date'],
                 revisionDate=current['revision_date'])
        e = p['explanation']
        assert all(e.get(k) for k in ('question', 'idea', 'result', 'significance', 'limits', 'prerequisite'))
        cards.append(f'''<article class="paper-guide-card" id="paper-guide-{p['id']:02}" data-guide-paper="{p['id']}">
<div class="card-meta"><span>Paper {p['id']:02}</span><span>Importance rank {p['rank']:02} / 28</span></div>
<h3>{escape(p['title'])}</h3><p class="question">{escape(e['question'])}</p>
<p><strong>The result.</strong> {escape(e['result'])}</p>
<details><summary>Method, significance and limits</summary>
<h4>The main idea</h4><p>{escape(e['idea'])}</p>
<h4>Why it matters</h4><p>{escape(e['significance'])}</p>
<h4>What remains outside the theorem</h4><p>{escape(e['limits'])}</p>
<h4>Before reading</h4><p>{escape(e['prerequisite'])}</p></details>
<div class="card-actions"><a href="{p['page']}">Full abstract &amp; citation ↗</a><a href="{p['pdf']}">Read PDF ↗</a><button data-map="{p['id']}">Show connections →</button></div></article>''')
    encoded = json.dumps(data, ensure_ascii=False, indent=2) + '\n'
    dataset.write_text(encoded)
    (ROOT / 'assets/stability-degeneration-data.js').write_text('window.ATLAS_DATA = ' + encoded.strip() + ';\n')
    body = (ROOT / 'content/stability-degeneration-atlas.html').read_text().replace('{{PAPER_GUIDE}}', '\n'.join(cards))
    assets = ['stability-degeneration-atlas.css', 'stability-degeneration-data.js', 'stability-degeneration-atlas.js']
    extra = []
    for name in assets:
        version = sha256((ROOT / 'assets' / name).read_bytes()).hexdigest()[:12]
        url = f'/assets/{name}?v={version}'
        extra.append(f'<link rel="stylesheet" href="{url}">' if name.endswith('.css') else f'<script src="{url}" defer></script>')
    page(ROUTE, 'Stability & Degeneration — Paper Atlas',
         'Explore the papers through their questions, results, importance ranking, documented dependencies and suggested reading paths.',
         body, extra='\n'.join(extra), image='stability-wall', cls='atlas-page')
