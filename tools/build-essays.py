#!/usr/bin/env python3
"""Build the two approved interactive essays."""
import importlib.util
from pathlib import Path
spec=importlib.util.spec_from_file_location("editorial",Path(__file__).with_name("build-editorial.py"))
editorial=importlib.util.module_from_spec(spec)
spec.loader.exec_module(editorial)
scripts='<script defer src="/assets/essay-models.js"></script><script defer src="/assets/essay-experiments.js"></script>'
for slug,title,description,image in [
    ("institutional-knowledge","What does an institution know?","An interactive essay about shared evidence, agreement, and institutional learning.","institution"),
    ("physical-limits","The material conditions of intelligence","An essay on the physical conditions that turn computational possibility into sustained capability.","energy")
]:
    editorial.page("writing/"+slug+"/index.html",title,description,
                   (editorial.ROOT/"content"/(slug+".html")).read_text(),extra=scripts,image=image)
