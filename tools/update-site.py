#!/usr/bin/env python3
"""Refresh shared navigation and stylesheet versions in marked static pages."""

import argparse
import hashlib
import html
import json
import posixpath
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NAV = re.compile(r"<!-- site:navigation -->.*?<!-- /site:navigation -->", re.S)
STYLES = re.compile(r"<!-- site:styles -->.*?<!-- /site:styles -->", re.S)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Report stale pages without writing.")
    args = parser.parse_args()
    config = json.loads((ROOT / "site.json").read_text())
    template = (ROOT / "templates/navigation.html").read_text().rstrip()
    styles = ["assets/theme.css", "assets/style.css"]
    versions = {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest()[:12]
                for name in styles}
    pending = []
    for page in sorted(ROOT.rglob("*.html")):
        relative = page.relative_to(ROOT).as_posix()
        if relative.split("/")[0] in {"tools", "templates", ".git"}:
            continue
        source = page.read_text()
        if "<!-- site:navigation -->" not in source:
            continue
        if len(NAV.findall(source)) != 1 or len(STYLES.findall(source)) != 1:
            raise ValueError(f"{relative}: expected one navigation and one styles block")
        route = "/" + relative
        if route.endswith("index.html"):
            route = route[:-len("index.html")]
        parent = page.parent.relative_to(ROOT).as_posix()

        def local_url(url):
            target = url.lstrip("/") or "."
            result = posixpath.relpath(target, parent)
            return result.rstrip("/") + "/" if url.endswith("/") else result

        def render_link(item):
            target = ROOT / item["href"].lstrip("/")
            if item["href"].endswith("/"):
                target /= "index.html"
            if not target.is_file():
                raise ValueError(f"Navigation target does not exist: {item['href']}")
            current = ' aria-current="page"' if item["href"] == route else ""
            return (f'<a href="{html.escape(local_url(item["href"]), quote=True)}"'
                    f'{current}>{html.escape(item["label"])}</a>')

        links = []
        for item in config["navigation"]:
            if "children" in item:
                active = any(child["href"] == route for child in item["children"])
                classes = "nav-group is-current" if active else "nav-group"
                children = "\n".join(f'            <li>{render_link(child)}</li>'
                                     for child in item["children"])
                links.append(
                    f'      <li>\n'
                    f'        <details class="{classes}">\n'
                    f'          <summary>{html.escape(item["label"])}</summary>\n'
                    f'          <ul class="nav-submenu">\n{children}\n          </ul>\n'
                    f'        </details>\n'
                    f'      </li>')
            else:
                links.append(f'      <li>{render_link(item)}</li>')
        navigation = template.replace("{{links}}", "\n".join(links))
        stylesheet_links = "\n".join(
            f'<link rel="stylesheet" href="{local_url("/" + name)}?v={versions[name]}">'
            for name in styles)
        output = NAV.sub(lambda _: f"<!-- site:navigation -->\n{navigation}\n<!-- /site:navigation -->", source)
        output = STYLES.sub(lambda _: f"<!-- site:styles -->\n{stylesheet_links}\n<!-- /site:styles -->", output)
        if output != source:
            pending.append((page, output))
    for page, output in pending:
        print(f"{'Stale' if args.check else 'Updated'}: {page.relative_to(ROOT)}")
        if not args.check:
            page.write_text(output)
    if args.check and pending:
        raise SystemExit(1)
    if not pending:
        print("Shared navigation and styles are up to date.")


if __name__ == "__main__":
    main()
