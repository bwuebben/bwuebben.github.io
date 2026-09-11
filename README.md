# bwuebben.github.io

Source for my personal site, published by GitHub Pages at
**<https://bwuebben.github.io/>**.

A GitHub *user site* — the repository name must stay exactly
`bwuebben.github.io`, and GitHub allows one per account. Everything is static
HTML and CSS; there is no server-side code or runtime JavaScript. The checked-in
pages are ready to serve. A small Python helper updates shared navigation and
stylesheet links when the site's configuration changes.

## Layout

```
index.html              the landing page
papers/index.html       research papers, grouped by subject
math-and-ai/index.html   When Mathematics Outgrows Its Gatekeepers
poem.html               Gradient of Mind (Entropy in the navigation)
site.json               navigation labels, groups, order, and destinations
templates/navigation.html shared navigation markup
templates/page.html     starting point for additional pages
assets/theme.css        shared fonts, colours, and reading width
assets/style.css        shared layout and page styles
assets/bernd_dark1.jpg   masthead portrait
assets/social-card.jpg  1200x630 link preview (generated — see below)
tools/                  site helpers and link-preview tools
.nojekyll               serve files as-is, skipping Jekyll processing
```

## Link preview

`assets/social-card.jpg` is what LinkedIn, Slack, and iMessage show when the
site is shared. It is generated, not hand-edited — the portrait on its own is
2:3, and unfurlers crop to roughly 1.91:1, which would slice straight through
the face. `tools/social-card.html` composes it against the dark field instead.

After changing the portrait, the name, or the tagline, re-render it:

```sh
tools/render-card.sh
```

## Local preview and editing

Preview the checked-in pages without installing any dependencies:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit <http://127.0.0.1:8000/> or the essay at
<http://127.0.0.1:8000/math-and-ai/>. Refresh after edits. Stop the server with
Ctrl+C. This serves only on your computer; it does not publish anything.

**Theme:** edit `assets/theme.css` for fonts, light/dark colours, and reading
width. The existing Iowan/Palatino/Georgia stack and the poem's Palatino setting
are kept there. Layout, navigation, responsive rules, and essay styles live in
`assets/style.css`.

**Navigation:** edit the links in `site.json` or their outer markup in
`templates/navigation.html`. The top level contains Home, Papers, and Misc.
Misc's `children` list contains Mathematics & AI and Entropy. Groups use a
native HTML disclosure: click or tap the label, or focus it and press Enter or
Space, to open or close its submenu. Then run after configuration changes:

```sh
python3 tools/update-site.py
python3 tools/update-site.py --check
```

Run this after stylesheet changes too. It propagates navigation to every page
with the shared markers, sets the active-page link, resolves relative paths,
and versions both stylesheets by content hash so browsers fetch changed CSS.
Navigation is ordinary HTML and works without JavaScript. The helper updates
only the marked navigation and stylesheet blocks; page content stays editable.

Keep changes local while reviewing. Publishing is a separate, deliberate Git
commit and push of the reviewed files to GitHub Pages.

## The papers page

`papers/index.html` holds the Papers section formerly on the landing page.
Edit paper entries here. Its subject groupings, descriptions, and links are
preserved, with heading levels adjusted for a standalone page. Preview it at
<http://127.0.0.1:8000/papers/>.

The Calabi–Yau smoothability entry links to the
[five-paper repository](https://github.com/bwuebben/calabi-yau-smoothability).
The summary distinguishes explicit examples from computer-assisted database
classifications using the verified input copy, and states the degree and
projection hypotheses of the mixed criterion. Keep this summary aligned with the
repository's paper guides when the manuscripts change.

## The essay page

`math-and-ai/index.html` contains the full text of *When Mathematics Outgrows Its
Gatekeepers*, including linked author–year citations and the complete bibliography.
The source is `../papers_ai_1/math_and_ai/main.tex` (formerly referred to as
`essay.tex`); the LaTeX build writes `essay.bbl` and `essay.pdf` beside it.

To refresh the essay after changing and building that source:

```sh
python3 tools/import-essay.py ../papers_ai_1/math_and_ai/main.tex
python3 tools/update-site.py
```

The importer reads the source and its built `essay.bbl`; it never edits them.
It supports the TeX commands used in this essay and stops on unsupported
commands. Rebuild the LaTeX bibliography before importing citation changes.
The HTML title, subtitle, date, and page metadata are maintained separately.
The expandable “The argument at a glance” overview is also maintained in the
HTML, between the `essay:overview` markers. It sits outside `essay:content`,
so importing the LaTeX preserves its thirteen points and section links.
Review the resulting diff and local page after each import. The public page is
self-contained; readers and GitHub Pages do not need the research repository.

## The poem page

`poem.html` is the HTML setting of the LaTeX source for *Gradient of Mind*; the
epigraph on the landing page links to it.

Its mathematics is **pre-rendered with KaTeX at build time**, not typeset in the
browser. `tools/render-poem-math.js` runs `katex.renderToString` over the four
formulas and writes the markup straight into the page, so the site ships no
runtime JavaScript and depends on no CDN — only `assets/katex/katex.min.css`
and the woff2 fonts beside it (324 KB in total, and the `.woff`/`.ttf` fallback
URLs are stripped from the CSS because they are not shipped).

To change a formula, edit `tools/render-poem-math.js` and re-run it:

```sh
npm install katex        # once, anywhere
node tools/render-poem-math.js
```

then paste the regenerated markup into `poem.html`. KaTeX colours itself from
the inherited CSS `color`, so the maths follows light and dark mode with no
extra work.

## Search discovery

The paper titles and full descriptions are ordinary HTML, reachable through
the Papers link on every page. Each page has a canonical URL and descriptive
metadata. `robots.txt` allows crawling and advertises `sitemap.xml`; add new
public pages to the sitemap when adding them to the navigation. Preserve
`google5536594b14b40920.html`, the existing Google verification file.

After publishing, submit `https://bwuebben.github.io/sitemap.xml` in Google
Search Console. Inspect `https://bwuebben.github.io/papers/` there and request
indexing, then monitor the Page Indexing report. Crawling and indexing are
Google's decisions; these files make discovery possible but do not guarantee
indexing or rankings.

## Sub-pages

New pages can live in their own directory:

```
writing/index.html   ->  https://bwuebben.github.io/writing/
```

Copy `templates/page.html` to the new location, replace its title, description,
and content, add its link to `site.json`, and run `python3 tools/update-site.py`.
Keep the `site:navigation` and `site:styles` comment markers and the `main` ID.
The helper supplies the same navigation and theme, including correct relative
links at any directory depth. The `tools/` and `templates/` directories are
excluded from propagation.

Separate repositories publish under their own path instead — a repository named
`foo` with Pages enabled serves at `https://bwuebben.github.io/foo/`, independent
of this repository.

## Custom domain

To move the site to a domain of your own, add a `CNAME` file containing the bare
domain, point the DNS records at GitHub, and enable *Enforce HTTPS* in the
repository's Pages settings.
