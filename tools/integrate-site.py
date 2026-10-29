#!/usr/bin/env python3
"""Integrate the editorial pages, paper links, share images, and sitemap."""
from pathlib import Path
import json
import re
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/"papers/index.html"; s=p.read_text()
if "catalogue.css" not in s:
 s=s.replace("</head>",'<link rel="stylesheet" href="../assets/catalogue.css">\n</head>')
s=s.replace("<body>",'<body class="catalogue">')
# Keep the catalogue static, including when upgrading the earlier filtered preview.
s=re.sub(r'<script defer src="../assets/catalogue\.js"></script>\n?', '', s)
start=s.index('  <header class="masthead">'); end=s.index("</header>",start)+len("</header>")
intro='''  <header class="masthead"><h1>Papers</h1><nav class="catalogue-nav" aria-label="Paper subjects"><a href="#markets">Markets</a><a href="#mathematics">Mathematics</a><a href="#physics">Physics</a><a href="#ai">AI &amp; institutions</a><a href="#politics">International relations</a></nav></header>'''
s=s[:start]+intro+s[end:]
s=re.sub(r'\n<form id="paper-filters".*?</form><p id="empty-results".*?</p>', '', s, flags=re.S)
for title,slug in [("Markets and quantitative finance","markets"),("Mathematics","mathematics"),("Theoretical physics","physics"),("AI and the machine economy","ai"),("International relations and politics","politics")]:
 s=s.replace(f'<h2 class="paper-category">{title}',f'<h2 class="paper-category" id="{slug}">{title}')
# Preserve existing entry anchors while resolving two duplicate heading IDs.
s=s.replace('<h4 class="paper-series" id="toric-tangent-stability">','<h4 class="paper-series" id="toric-tangent-stability-series">')
s=s.replace('<h3 class="paper-topic" id="exotic-four-manifolds">','<h3 class="paper-topic" id="exotic-four-manifolds-series">')
p.write_text(s)
# Distinct sharing images for the major essays and laboratories.
for route,image in [("not-enough.html","drums"),("pillowcase-explorer/index.html","knot"),("conifold-lab/index.html","conifold"),("cobordism-explorer/index.html","cobordism"),("beyond-hrp-lab/index.html","portfolio")]:
 p=ROOT/route;s=p.read_text()
 s=re.sub(r'(<meta property="og:image" content=")[^"]+',r'\g<1>https://bwuebben.github.io/assets/share/'+image+'.png',s)
 s=re.sub(r'(<meta property="og:image:alt" content=")[^"]+',r'\g<1>Illustration accompanying '+route.split("/")[0].replace(".html","").replace("-"," "),s)
 p.write_text(s)
papers=json.loads((ROOT/"data/papers.json").read_text())["papers"]
resources={r["url"]:item["slug"] for item in papers for r in item["resources"] if "PDF" in r["label"]}
for name in ["pillowcase-explorer","conifold-lab","cobordism-explorer","beyond-hrp-lab"]:
 p=ROOT/name/"index.html";s=p.read_text()
 # Titles in the companion list now lead to the complete local paper record.
 marker='<div class="reading-list">'
 if marker in s:
  a=s.index(marker);b=s.index('</section>',a);block=s[a:b]
  for url,slug in resources.items():block=block.replace('href="'+url+'"','href="../papers/'+slug+'/"')
  block=block.replace(" · PDF ↗"," · Abstract, PDF &amp; citation ↗")
  s=s[:a]+block+s[b:]
 p.write_text(s)
# Include the public editorial pages in the sitemap.
ns="http://www.sitemaps.org/schemas/sitemap/0.9";ET.register_namespace("",ns)
p=ROOT/"sitemap.xml";tree=ET.fromstring(p.read_text())
existing={n.find("{"+ns+"}loc").text for n in tree}
for folder in ["explorers","research","about","updates","writing","at-the-wall"]:
 for f in sorted((ROOT/folder).rglob("index.html")):
  url="https://bwuebben.github.io/"+str(f.relative_to(ROOT)).removesuffix("index.html")
  if url not in existing:
   node=ET.SubElement(tree,"{"+ns+"}url");ET.SubElement(node,"{"+ns+"}loc").text=url
ET.indent(tree,space="  ")
p.write_text('<?xml version="1.0" encoding="UTF-8"?>\n'+ET.tostring(tree,encoding="unicode")+"\n")
