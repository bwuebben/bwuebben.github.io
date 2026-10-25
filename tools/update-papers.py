#!/usr/bin/env python3
"""Generate individual paper pages from verified public-manuscript metadata.

No third-party Python dependencies. PDF retrieval is explicit and only accepts
the checksum recorded in the reviewed catalogue; it never imports a new revision
or changes archive/ORCID records automatically.
"""
import argparse
import datetime as dt
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import string
import subprocess
import sys
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://bwuebben.github.io'
SHARED = re.compile(r'<!-- site:(navigation|styles) -->.*?<!-- /site:\1 -->', re.S)
ENTRY = re.compile(r'(<li(?:\s+id="([^"]+)")?>)(\s*<span class="entry-title"><a href=")([^\"]+)(">(.*?)</a></span>)', re.S)
SITEMAP = 'http://www.sitemaps.org/schemas/sitemap/0.9'


class PlainText(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.parts = []
        self.feed(source)

    def handle_data(self, value):
        self.parts.append(value)


def text(source):
    return ' '.join(''.join(PlainText(source).parts).split())


def esc(value):
    return html.escape(str(value), quote=True)


def pretty_date(value):
    if len(value) == 4:
        return value
    if len(value) == 7:
        return dt.date.fromisoformat(value + '-01').strftime('%B %Y')
    date = dt.date.fromisoformat(value)
    return f'{date.day} {date:%B %Y}'


def shared_blank(source):
    return SHARED.sub(lambda m: f'<!-- site:{m[1]} -->\n<!-- /site:{m[1]} -->', source)


def validate(papers):
    for field in ('slug', 'catalogue_title', 'catalogue_anchor'):
        values = [p[field] for p in papers]
        if len(values) != len(set(values)):
            raise ValueError(f'Duplicate {field}')
    for p in papers:
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', p['slug']):
            raise ValueError(f'Invalid slug: {p["slug"]}')
        for field in ('title', 'authors', 'abstract_html', 'abstract_source', 'publication_date'):
            if not p.get(field):
                raise ValueError(f'{p["slug"]}: missing {field}')
        if '<p>' not in p['abstract_html'] or re.search(r'<(?:script|iframe)|\bon\w+\s*=', p['abstract_html'], re.I):
            raise ValueError(f'{p["slug"]}: invalid abstract markup')
        pretty_date(p['publication_date'])
        if p.get('revision_date'):
            pretty_date(p['revision_date'])
            if p['revision_date'] < p['publication_date']:
                raise ValueError(f'{p["slug"]}: revision predates publication')
        if p.get('citation_doi') and p['citation_doi'] != p['archive']['doi']:
            raise ValueError(f'{p["slug"]}: unexpected citation DOI')
        if not p.get('pdf') and not p.get('pdf_pending_reason'):
            raise ValueError(f'{p["slug"]}: missing PDF or explicit archive-only reason')
        if p.get('pdf'):
            pdf = p['pdf']
            if not re.fullmatch(r'[a-f0-9]{64}', pdf['sha256']):
                raise ValueError(f'{p["slug"]}: invalid PDF checksum')
            if pdf['size_bytes'] > 5_000_000:
                raise ValueError(f'{p["slug"]}: PDF exceeds Scholar size limit')
            if not pdf['download_url'].startswith('https://'):
                raise ValueError(f'{p["slug"]}: PDF source must use HTTPS')


def pdf_bytes(p, fetch):
    target = ROOT / 'papers' / p['slug'] / 'paper.pdf'
    expected = p['pdf']
    if not target.exists() and fetch:
        request = urllib.request.Request(expected['download_url'], headers={'User-Agent': 'Wuebben-paper-pages/1.0'})
        with urllib.request.urlopen(request, timeout=60) as response:
            data = response.read(5_000_001)
    elif target.exists():
        data = target.read_bytes()
    else:
        raise ValueError(f'{target.relative_to(ROOT)} missing; use --fetch-pdfs to retrieve the verified version')
    if not data.startswith(b'%PDF-') or hashlib.sha256(data).hexdigest() != expected['sha256'] or len(data) != expected['size_bytes']:
        raise ValueError(f'{p["slug"]}: PDF does not match reviewed metadata; refusing to overwrite or publish it')
    return target, data


def render(p, template, css_version):
    canonical = f'{BASE}/papers/{p["slug"]}/'
    author_names = ', '.join(a['name'] for a in p['authors'])
    metas = [('citation_title', p['title'])]
    metas += [('citation_author', a['name']) for a in p['authors']]
    date = p['publication_date']
    metas.append(('citation_publication_date', date.replace('-', '/') if len(date) == 10 else date[:4]))
    if p.get('pdf'):
        metas.append(('citation_pdf_url', canonical + 'paper.pdf'))
    if p.get('citation_doi'):
        metas.append(('citation_doi', p['citation_doi']))
    metas.append(('citation_language', 'en'))
    citation_meta = '\n'.join(f'<meta name="{name}" content="{esc(value)}">' for name, value in metas)
    authors = ', '.join(f'<a href="{esc(a["orcid"])}" rel="author"><span class="citation_author">{esc(a["name"])}</span> <span class="paper-orcid">ORCID ↗</span></a>' if a.get('orcid') else f'<span class="citation_author">{esc(a["name"])}</span>' for a in p['authors'])
    dates = f'<span>{esc(p["status"])} · <time datetime="{date}">{pretty_date(date)}</time></span>'
    if p.get('revision_date') and p['revision_date'] != date:
        revised = p['revision_date']
        dates += f'<span class="date-separator" aria-hidden="true"> · </span><span>Revised <time datetime="{revised}">{pretty_date(revised)}</time></span>'
    pdf = p.get('pdf')
    if pdf:
        read_link = f'<a class="paper-download" href="paper.pdf">Read paper (PDF) <span aria-hidden="true">&nbsp;↗</span></a>\n        <span class="paper-file-detail">{pdf["pages"]} pages · {round(pdf["size_bytes"] / 1000):,} KB</span>'
    else:
        read_link = f'<a class="paper-download" href="{esc(p["archive"]["url"])}">Read on {esc(p["archive"]["name"])} <span aria-hidden="true">&nbsp;↗</span></a>'
    archive = p['archive']
    identifier = archive['doi'].split('/')[-1].split('.', 1)[1] if archive['name'] in ('SSRN', 'arXiv') else archive['url'].rstrip('/').split('/')[-1]
    resources = p['resources'] + [{'label': archive['name'] + ':' + identifier, 'url': archive['url']}]
    links = '\n'.join(f'        <li><a href="{esc(r["url"])}">{esc(r["label"])}</a></li>' for r in resources)
    year = (p.get('revision_date') or date)[:4]
    citation_url = 'https://doi.org/' + p['citation_doi'] if p.get('citation_doi') else canonical
    citation_label = 'doi:' + p['citation_doi'] if p.get('citation_doi') else 'Current manuscript'
    citation_status = p['status']
    if p.get('revision_date'):
        citation_status += ', revised ' + pretty_date(p['revision_date'])
    related = ''.join(f'<a href="{esc(r["url"])}">{esc(r["label"])}</a> · ' for r in p['related'])
    related += f'<a href="../#{esc(p["catalogue_anchor"])}">Browse all papers</a>.'
    structured = {'@context': 'https://schema.org', '@type': 'ScholarlyArticle', 'headline': p['title'], 'url': canonical, 'author': [{'@type': 'Person', 'name': a['name'], 'sameAs': a['orcid']} for a in p['authors']], 'datePublished': date, 'inLanguage': 'en', 'isAccessibleForFree': True}
    if p.get('revision_date'):
        structured['dateModified'] = p['revision_date']
    if pdf:
        structured['encoding'] = {'@type': 'MediaObject', 'contentUrl': canonical + 'paper.pdf', 'encodingFormat': 'application/pdf'}
    if p.get('citation_doi'):
        structured['identifier'] = p['citation_doi']
    page = template.substitute(
        title=esc(p['title']), author_names=esc(author_names), canonical=canonical,
        description=esc(f'{p["title"]}. Research by {author_names}. Full abstract, manuscript, and citation.'),
        citation_meta=citation_meta, structured_data=json.dumps(structured, ensure_ascii=False).replace('</', '<\\/'),
        paper_css_version=css_version, catalogue_anchor=esc(p['catalogue_anchor']), label=esc(p['label']),
        authors=authors, dates=dates, read_link=read_link, abstract_html=p['abstract_html'],
        status_note=f'<p class="paper-status-note">{esc(p["status_note"])}</p>' if p.get('status_note') else '',
        resources=links, citation_status=esc(p['status']), year=year,
        citation_link=f'<a href="{esc(citation_url)}">{esc(citation_label)}</a>', related=related)
    bib_title = p.get('bibtex_title', p['title'])
    for char in ('&', '%', '#', '_'):
        bib_title = bib_title.replace(char, '\\' + char)
    bib = '@misc{Wuebben' + year + '-' + p['slug'] + ',\n'
    bib += '  author = {' + ' and '.join(a['name'] for a in p['authors']) + '},\n'
    bib += '  title = {{' + bib_title + '}},\n  year = {' + year + '},\n'
    if p.get('citation_doi'):
        bib += '  doi = {' + p['citation_doi'] + '},\n'
    bib += '  url = {' + citation_url + '},\n  note = {' + citation_status + '}\n}\n'
    return page, bib


def catalogue(source, papers):
    by_title = {p['catalogue_title']: p for p in papers}
    seen = []
    def entry(m):
        name = text(m[6])
        if name not in by_title:
            raise ValueError(f'Unregistered catalogue entry: {name}')
        p = by_title[name]
        if m[2] and m[2] != p['catalogue_anchor']:
            raise ValueError(f'{p["slug"]}: existing catalogue anchor changed')
        seen.append(p['slug'])
        return f'<li id="{esc(p["catalogue_anchor"])}">' + m[3] + p['slug'] + '/' + m[5]
    result = ENTRY.sub(entry, source)
    if len(seen) != len(papers) or len(set(seen)) != len(seen):
        raise ValueError('Catalogue and paper manifest do not match one to one')
    return result


def sitemap(source, papers):
    ET.register_namespace('', SITEMAP)
    ET.register_namespace('image', 'http://www.google.com/schemas/sitemap-image/1.1')
    tree = ET.fromstring(source)
    for entry in list(tree):
        loc = entry.find(f'{{{SITEMAP}}}loc')
        if loc is not None and loc.text.startswith(BASE + '/papers/') and loc.text != BASE + '/papers/':
            tree.remove(entry)
    for p in papers:
        entry = ET.SubElement(tree, f'{{{SITEMAP}}}url')
        ET.SubElement(entry, f'{{{SITEMAP}}}loc').text = f'{BASE}/papers/{p["slug"]}/'
    ET.indent(tree, space='  ')
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(tree, encoding='unicode') + '\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Verify pages, metadata, PDF hashes, catalogue, and sitemap without writing')
    parser.add_argument('--fetch-pdfs', action='store_true', help='Retrieve missing PDFs using reviewed URLs and checksums')
    args = parser.parse_args()
    if args.check and args.fetch_pdfs:
        parser.error('--check and --fetch-pdfs cannot be combined')
    data = json.loads((ROOT / 'data/papers.json').read_text())
    if data['schema_version'] != 1:
        raise ValueError('Unsupported paper manifest schema')
    papers = data['papers']
    validate(papers)
    template = string.Template((ROOT / 'templates/paper.html').read_text())
    css_version = hashlib.sha256((ROOT / 'assets/paper.css').read_bytes()).hexdigest()[:12]
    pending = []
    for p in papers:
        directory = ROOT / 'papers' / p['slug']
        if p.get('pdf'):
            target, pdf = pdf_bytes(p, args.fetch_pdfs)
            if not target.exists():
                pending.append((target, pdf))
        page, bib = render(p, template, css_version)
        existing = directory / 'index.html'
        if existing.exists():
            shared = {m[1]: m[0] for m in SHARED.finditer(existing.read_text())}
            page = SHARED.sub(lambda m: shared.get(m[1], m[0]), page)
        outputs = {'index.html': page, 'citation.bib': bib, 'record.json': json.dumps(p, ensure_ascii=False, indent=2) + '\n'}
        for name, content in outputs.items():
            target = directory / name
            if not target.exists() or target.read_text() != content:
                pending.append((target, content.encode()))
    index = ROOT / 'papers/index.html'
    updated = catalogue(index.read_text(), papers)
    if updated != index.read_text():
        pending.append((index, updated.encode()))
    sm = ROOT / 'sitemap.xml'
    updated = sitemap(sm.read_text(), papers)
    if updated != sm.read_text():
        pending.append((sm, updated.encode()))
    if args.check:
        if pending:
            for path, _ in pending:
                print('Stale:', path.relative_to(ROOT))
            return 1
    else:
        for path, content in pending:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content)
    pdf_count = sum(bool(p.get('pdf')) for p in papers)
    print(f'{len(papers)} paper pages; {pdf_count} verified local PDFs; {len(papers) - pdf_count} archive-only reading links.')
    print(f'{len(pending)} generated files {"need updating" if args.check else "updated"}.')
    subprocess.run([sys.executable, str(ROOT / 'tools/update-site.py')] + (['--check'] if args.check else []), check=True)
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (ValueError, KeyError, OSError) as error:
        print(f'Paper page check failed: {error}', file=sys.stderr)
        raise SystemExit(1)
