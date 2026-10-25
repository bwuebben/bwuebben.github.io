#!/usr/bin/env python3
"""Check local links, metadata, preservation, and research coverage."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json,re,subprocess,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
BASE="8931bcd957786ef8e8c94c34cf804353a714b89a"  # Fixed public baseline, not the mutable preview HEAD.
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
# Preserve all entries and published manuscript metadata exactly.
before=subprocess.check_output(["git","show",BASE+":papers/index.html"],cwd=ROOT,text=True)
after=(ROOT/"papers/index.html").read_text()
entry=re.compile(r'<li id="[^"]+">\s*<span class="entry-title">.*?</li>',re.S)
assert entry.findall(before)==entry.findall(after),"Existing paper catalogue entries changed"
assert subprocess.check_output(["git","show",BASE+":data/papers.json"],cwd=ROOT)==(ROOT/"data/papers.json").read_bytes(),"Paper manifest changed"
papers=json.loads((ROOT/"data/papers.json").read_text())["papers"]
guide_links=[]
for guide in (ROOT/"research").glob("*/index.html"):
 guide_links+=re.findall(r'<h3><a href="/papers/([^/]+)/">',guide.read_text())
assert len(guide_links)==39 and set(guide_links)=={p["slug"] for p in papers},"Research guides must cover all 39 papers once"
ET.fromstring((ROOT/"feed.xml").read_text())
tree=ET.fromstring((ROOT/"sitemap.xml").read_text())
locations=[n[0].text for n in tree]
assert len(locations)==len(set(locations)),"Duplicate sitemap URLs"
assert not any("/review/" in x or "/tools/" in x for x in locations),"Review tools must not enter the sitemap"
if errors:
 print("\n".join(errors));raise SystemExit(1)
print(f"{len(pages)} pages checked; links and IDs resolve; all 39 catalogue entries and paper metadata preserved; six guides cover 39 papers; RSS and sitemap parse.")
