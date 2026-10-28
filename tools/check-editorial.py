#!/usr/bin/env python3
"""Check local links, metadata, preservation, and research coverage."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json,re,subprocess,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
BASE="d3e1bf2"  # Published baseline before the authorized trilogy release.
CATALOGUE_CROSSLINKS={"toric-local-stability-chambers", "small-dolbeault-stability-walls"}
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.links=[];self.ids=[];self.h1=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if "id" in a:self.ids.append(a["id"])
  if tag=="h1":self.h1+=1
  for attr in ("href","src"):
   if attr in a:self.links.append(a[attr])
pages=[p for p in ROOT.rglob("*.html") if p.relative_to(ROOT).parts[0] not in {"tools","templates","content"} and p.name!="standalone.html"]
errors=[]
for path in pages:
 page=Page(path.read_text());rel=str(path.relative_to(ROOT))
 if page.h1!=1 and rel not in {"portrait/index.html","google5536594b14b40920.html"}:errors.append(rel+": expected one h1, found "+str(page.h1))
 if len(page.ids)!=len(set(page.ids)):errors.append(rel+": duplicate IDs")
 for url in page.links:
  parts=urlsplit(url)
  if parts.scheme or parts.netloc:continue
  target=(ROOT/parts.path.lstrip("/") if parts.path.startswith("/") else path.parent/parts.path) if parts.path else path
  target=Path(unquote(str(target)))
  if target.is_dir():target/= "index.html"
  if not target.exists():errors.append(rel+": missing "+url)
  if parts.fragment and target.is_file() and target.suffix==".html":
   if unquote(parts.fragment) not in Page(target.read_text()).ids:errors.append(rel+": missing fragment "+url)
# Preserve existing catalogue entries and manuscript metadata as new papers are added.
before=subprocess.check_output(["git","show",BASE+":papers/index.html"],cwd=ROOT,text=True)
after=(ROOT/"papers/index.html").read_text()
entry=re.compile(r'<li id="[^"]+">\s*<span class="entry-title">.*?</li>',re.S)
old_entries={re.search(r'<li id="([^"]+)"',e)[1]:e for e in entry.findall(before)}
new_entries={re.search(r'<li id="([^"]+)"',e)[1]:e for e in entry.findall(after)}
assert all(new_entries.get(k)==v for k,v in old_entries.items() if k not in CATALOGUE_CROSSLINKS),"Unrelated paper catalogue entries changed"
for key in CATALOGUE_CROSSLINKS:
 old=old_entries[key];new=new_entries[key]
 assert re.search(r'<span class="entry-title">.*?</span>',old,re.S)[0]==re.search(r'<span class="entry-title">.*?</span>',new,re.S)[0],"Existing title changed"
 assert set(re.findall(r'href="([^"]+)"',old)) <= set(re.findall(r'href="([^"]+)"',new)),"Existing paper resource removed"
papers=json.loads((ROOT/"data/papers.json").read_text())["papers"]
old_papers=json.loads(subprocess.check_output(["git","show",BASE+":data/papers.json"],cwd=ROOT))["papers"]
by_slug={p["slug"]:p for p in papers}
for p in old_papers:
 current=by_slug[p["slug"]]
 assert {k:v for k,v in p.items() if k!="related"}=={k:v for k,v in current.items() if k!="related"},"Existing manuscript metadata changed: "+p["slug"]
 assert all(r in current["related"] for r in p["related"]),"Existing related links removed: "+p["slug"]
assert set(new_entries)=={p["catalogue_anchor"] for p in papers},"Catalogue and manifest differ"
guide_links=[]
for guide in (ROOT/"research").glob("*/index.html"):
 guide_links+=re.findall(r'<h3><a href="/papers/([^/]+)/">',guide.read_text())
assert len(guide_links)==len(papers) and set(guide_links)=={p["slug"] for p in papers},"Research guides must cover every paper exactly once"
ET.fromstring((ROOT/"feed.xml").read_text())
tree=ET.fromstring((ROOT/"sitemap.xml").read_text())
locations=[n[0].text for n in tree]
assert len(locations)==len(set(locations)),"Duplicate sitemap URLs"
assert not any("/review/" in x or "/tools/" in x for x in locations),"Review tools must not enter the sitemap"
if errors:
 print("\n".join(errors));raise SystemExit(1)
print(f"{len(pages)} pages checked; links and IDs resolve; {len(old_papers)} existing catalogue entries and manuscript records preserved; six guides cover all {len(papers)} papers; RSS and sitemap parse.")
