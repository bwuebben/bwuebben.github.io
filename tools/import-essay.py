#!/usr/bin/env python3
"""Import the mathematics and AI essay from its LaTeX source and built bibliography.

This handles the small TeX vocabulary used by this essay, not arbitrary LaTeX.
Unsupported commands fail explicitly instead of disappearing from the page.
The source files are only read; the page's title and metadata are edited separately.
"""

import argparse
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def inline(source):
    # URLs are literal: TeX's tilde and dash rules must never alter them.
    urls = {}

    def preserve_url(match):
        token = f"HTMLURLTOKEN{len(urls)}END"
        value = match[2]
        href = f"https://doi.org/{value}" if match[1] == "doi" else value
        label = f"doi: {value}" if match[1] == "doi" else value
        urls[token] = f'<a href="{html.escape(href, quote=True)}">{html.escape(label)}</a>'
        return token

    source = re.sub(r"\\(url|doi)\{([^{}]+)\}", preserve_url, source)
    source = re.sub(r"\s+", " ", source).strip()
    source = re.sub(r"\\natexlab\{([^{}]+)\}", r"\1", source)
    source = source.replace(r"\newblock", " ").replace(r"\penalty0", "")
    source = source.replace("---", "—").replace("--", "–")
    source = source.replace("``", "“").replace("''", "”").replace("~", "\u00a0")
    source = html.escape(source, quote=False)
    source = re.sub(r"\\emph\{([^{}]+)\}", r"<em>\1</em>", source)
    if "\\" in source:
        raise ValueError(f"Unsupported TeX in: {source}")
    source = re.sub(r" +", " ", source.replace("{", "").replace("}", ""))
    for token, rendered in urls.items():
        source = source.replace(token, rendered)
    return source


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Path to main.tex (or essay.tex)")
    parser.add_argument("--bibliography", type=Path, help="Built .bbl; defaults to essay.bbl beside the source")
    args = parser.parse_args()
    tex = args.source.read_text()
    bbl = (args.bibliography or args.source.with_name("essay.bbl")).read_text()
    entries = list(re.finditer(r"\\bibitem\[(.*?)\]\{([^{}]+)\}", bbl, re.S))
    if not entries:
        raise ValueError("No bibliography entries found; build the essay with BibTeX first.")
    labels, references, order = {}, [], {}
    for i, entry in enumerate(entries):
        label = inline(entry[1])
        author, year = re.match(r"(.+?)\(([^)]+)\)", label).groups()
        key = entry[2]
        labels[key] = (author, year)
        order[key] = i
        stop = entries[i + 1].start() if i + 1 < len(entries) else bbl.index(r"\end{thebibliography}")
        references.append(f'        <li id="ref-{key}">{inline(bbl[entry.end():stop])}</li>')

    used = set()
    citation_count = 0

    def paragraph(source):
        nonlocal citation_count
        # Render each text segment separately so inserted links are never escaped.
        parts, position = [], 0
        for cite in re.finditer(r"\\cite([pt])(?:\[([^\]]+)\])?\{([^{}]+)\}", source):
            citation_count += 1
            prefix = source[position:cite.start()]
            parts.append(inline(prefix) + (" " if prefix and prefix[-1].isspace() else ""))
            keys = sorted((key.strip() for key in cite[3].split(",")), key=lambda key: order[key])
            used.update(keys)
            suffix = f", {inline(cite[2])}" if cite[2] else ""
            if cite[1] == "p":
                links = "; ".join(f'<a href="#ref-{key}">{labels[key][0]}, {labels[key][1]}</a>'
                                  for key in keys)
                parts.append(f"({links}{suffix})")
            else:
                links = "; ".join(f'<a href="#ref-{key}">{labels[key][0]} ({labels[key][1]}'
                                  f'{suffix if key == keys[-1] else ""})</a>' for key in keys)
                parts.append(links)
            position = cite.end()
        tail = source[position:]
        parts.append((" " if tail and tail[0].isspace() and parts else "") + inline(tail))
        return "".join(parts)

    body = tex.split(r"\thispagestyle{plain}", 1)[1].split(r"\clearpage", 1)[0].strip()
    output = ['    <div class="essay-body">']
    paragraphs, sections = 0, 0
    for block in re.split(r"\n\s*\n", body):
        section = re.fullmatch(r"\\section\*\{([^{}]+)\}", block.strip())
        if section:
            sections += 1
            title = inline(section[1])
            slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
            output.append(f'      <h2 id="{slug}">{title}</h2>')
        elif block.startswith(r"\begin{quote}"):
            quote = block.replace(r"\begin{quote}", "").replace(r"\end{quote}", "").replace(r"\itshape", "")
            output.append(f"      <blockquote><p>{paragraph(quote.strip())}</p></blockquote>")
            paragraphs += 1
        else:
            output.append(f"      <p>{paragraph(block)}</p>")
            paragraphs += 1
    output += ['    </div>', '    <section class="essay-references" aria-labelledby="references">',
               '      <h2 id="references">References</h2>', '      <ul>', *references,
               '      </ul>', '    </section>']
    if used != labels.keys():
        raise ValueError(f"Bibliography and citations differ: {used ^ labels.keys()}")
    page = ROOT / "math-and-ai/index.html"
    pattern = r"<!-- essay:content -->.*?<!-- /essay:content -->"
    content = "<!-- essay:content -->\n" + "\n\n".join(output) + "\n<!-- /essay:content -->"
    rendered, count = re.subn(pattern, lambda _: content, page.read_text(), flags=re.S)
    if count != 1:
        raise ValueError("Expected one essay:content block in math-and-ai/index.html")
    page.write_text(rendered)
    print(f"Imported {paragraphs} paragraphs, {sections} sections, {citation_count} citations, "
          f"and {len(references)} references into math-and-ai/index.html.")


if __name__ == "__main__":
    main()
