# bwuebben.github.io

Source for my personal site, published by GitHub Pages at
**<https://bwuebben.github.io/>**.

A GitHub *user site* — the repository name must stay exactly
`bwuebben.github.io`, and GitHub allows one per account. Everything is static
HTML, CSS, and the explorers' client-side JavaScript; there is no
server-side code. The other pages require no runtime JavaScript (the landing
page carries a JSON-LD `Person` block, which browsers do not execute). The
checked-in pages are ready to serve. A small Python helper updates shared
navigation and stylesheet links when the site's configuration changes.

## Layout

```
index.html              the landing page
papers/index.html       research papers, grouped by subject
pillowcase-explorer/    interactive trefoil and pillowcase diagrams
conifold-lab/           interactive conifold transitions laboratory
cobordism-explorer/     interactive Atiyah–Floer cobordism explorer
beyond-hrp-lab/         interactive signal-aware portfolio laboratory
poem.html               Gradient of Mind (a poem)
portrait/index.html     the portrait at full size (the masthead links here;
                         deliberately absent from the navigation)
site.json               navigation labels, groups, order, and destinations
templates/navigation.html shared navigation markup
templates/page.html     starting point for additional pages
assets/theme.css        shared fonts, colours, and reading width
assets/style.css        shared layout and page styles
assets/bernd_full_noir.jpg  full-length portrait shown on the portrait page
assets/bernd_dark1.jpg   masthead headshot at full size (the masthead loads
                         the -384 and -576 renditions through srcset)
assets/social-card.jpg  1200x630 link preview (generated — see below)
tools/                  site helpers and link-preview tools
.nojekyll               serve files as-is, skipping Jekyll processing
```

## Link preview

`assets/social-card.jpg` is what LinkedIn, Slack, and iMessage show when the
site, the papers page, or the poem is shared. It is generated, not hand-edited:
the portrait on its own is 2:3, and unfurlers crop to roughly 1.91:1, which
would slice straight through the face. `tools/social-card.html` composes it
against the dark field instead.

After changing the portrait, the name, or the tagline, re-render it:

```sh
tools/render-card.sh
```

## Local preview and editing

Preview the checked-in pages without installing any dependencies:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit <http://127.0.0.1:8000/>. Refresh after edits. Stop the server with
Ctrl+C. This serves only on your computer; it does not publish anything.

**Theme:** edit `assets/theme.css` for fonts, light/dark colours, and reading
width. The existing Iowan/Palatino/Georgia stack and the poem's Palatino setting
are kept there. Layout, navigation, responsive rules, and page styles live in
`assets/style.css`.

**Navigation:** edit the links in `site.json` or their outer markup in
`templates/navigation.html`. The top level contains Home, Papers, Explorers, and Writing.
Explorers contains Pillow Case, Conifold Transitions, Atiyah–Floer Cobordism, and Beyond HRP; add future explorers
to that group's `children` list.
Writing's `children` list contains Entropy, which opens the poem *Gradient of
Mind*. An item with a `children` list becomes a group, rendered as a native HTML
disclosure: click or tap the label, or focus it and press Enter or Space, to
open or close its submenu. Then run after configuration changes:

```sh
python3 tools/update-site.py
python3 tools/update-site.py --check
```

Run this after stylesheet changes too. It propagates navigation to every page
with the shared markers, sets the active-page link, resolves relative paths,
versions both stylesheets by content hash so browsers fetch changed CSS, and
writes the two `theme-color` metas from the light and dark `--bg` values in
`assets/theme.css`.
Navigation is ordinary HTML and works without JavaScript. The helper updates
only the marked navigation and stylesheet blocks; page content stays editable.

Keep changes local while reviewing. Publishing is a separate, deliberate Git
commit and push of the reviewed files to GitHub Pages.

## The Pillowcase Explorer

`pillowcase-explorer/index.html` is a guided, interactive trefoil example, linked
from the shared navigation and the instanton-knot papers. Preview it at
<http://127.0.0.1:8000/pillowcase-explorer/>. Its five steps cover cutting the knot,
boundary characters, immersed curves, intersections, and the chain complex.

The page uses the shared site navigation, fonts, and light/dark theme. Its styles
are scoped to `.pillowcase-app`; `site.css` provides theme adjustments. In light mode
the SVG diagrams keep their sage paper palette; in dark mode `site.css` supplies a
dark diagram palette through `--diagram-*` variables, which `app.js` reads with the
light colors as fallbacks. `model.js` contains the
mathematical model and `app.js` handles interaction. No build step or external
runtime dependencies are required. Run `python3 tools/update-site.py` after
editing these assets too: it versions their URLs by content hash.

`standalone.html` preserves the original portable export, without the site's
navigation or theme. The integrated page also needs the parent `assets/` folder.

## The Conifold Explorer

`conifold-lab/index.html`, titled *Calabi–Yau Geometry at the Threshold*, is linked
under Explorers → Conifold Transitions. It uses the shared navigation and site
theme, including fonts, backgrounds, text, and burgundy accents in light and dark
mode. Its canvas and SVG drawings read their colors from the same theme; a muted
ochre distinguishes the exceptional curves. Styles are scoped to `.conifold-app`.
Preview it at <http://127.0.0.1:8000/conifold-lab/> and run
`python3 tools/update-site.py` after editing its assets to refresh their versions.

## The Atiyah–Floer Cobordism Explorer

`cobordism-explorer/index.html`, titled *Four Dimensions, Two Languages*, is linked
under Explorers → Atiyah–Floer Cobordism and from the corresponding Paper I entry. Six chapters
explore cobordisms, the Atiyah–Floer dictionary, handle maps, a commuting square,
compression-body collapse, and composition with orientation signs.

The page uses the shared navigation without page-specific positioning, and its
explorer header and introductory spacing follow the other explorers. It uses
the shared fonts and warm neutral and burgundy theme in light and dark mode.
`site.css` scopes the design to `.cobordism-app`; the
canvas and SVG diagrams use the same theme, with ochre for the second family
of geometric objects. `standalone.html` uses `style.css` and can be copied
with `app.js` and `math.js` to any static host, or opened locally. There is no build
step and no JavaScript dependency. Google Fonts are optional; local fallbacks work
offline. Run `python3 tools/update-site.py` after editing the integrated assets.

All four integrated explorers end with a “From picture to paper” section:
five knot-instanton papers, six Calabi–Yau smoothability papers, the two
cobordism papers, and the Beyond HRP paper with its replication code
respectively. Titles and PDF links follow `papers/index.html`; update the
relevant explorer when a catalogue title or PDF destination changes.
The common reading-section layout lives in `assets/style.css`.

The geometry is schematic and the finite-dimensional algebra is an illustrative
model, not a computation of instanton homology. The on-page source guide records
the distinction and the scope of Papers I and II, including the overall sign in
the integral comparison.

## The Beyond HRP Portfolio Lab

`beyond-hrp-lab/index.html`, titled *Give the hierarchy an expected return*, is
linked under Explorers → Beyond HRP and from the paper's entry on the papers page
(`papers/#beyond-hrp`). Four tabs compare HRP, HRP-μ, HRP-Σμ, and CRISP on eight
illustrative assets: live forecasts, the allocation tree, the CRISP sweeps, and a
seeded estimation-noise experiment. Every weight is computed in the browser.

Styles are scoped to `.portfolio-app` in `site.css` and follow the site's fonts and
light/dark theme. The chart colors are theme variables, with CRISP in the burgundy
accent. `standalone.html` keeps the original portable design with `style.css`.
Preview it at <http://127.0.0.1:8000/beyond-hrp-lab/> and run
`python3 tools/update-site.py` after editing its assets. Its own README records the
file layout and the scope of the illustration: it is educational, not a backtest.

## The papers page

`papers/index.html` holds the Papers section formerly on the landing page.
Edit paper entries here. Its subject groupings, descriptions, and links are
preserved, with heading levels adjusted for a standalone page. Preview it at
<http://127.0.0.1:8000/papers/>.

The exotic four-manifolds entry presents *Toward an exotic S²×S² and an
exotic ℂP²#ℂP̄²*. Its title links to [arXiv:2608.17267](https://arxiv.org/abs/2608.17267),
and its latest-version PDF link points to `paper/main.pdf` in the
[exotic-s2xs2 repository](https://github.com/bwuebben/exotic-s2xs2).
The description states the complete group presentation and structural
results while leaving the final filling question open. The October 21,
2026 PDF is a 56-page working revision. Its proposed capacity obstruction,
exact-torus transfer-kernel construction, and conditional symplectic-homology
discussion await independent mathematical verification. The group-algebra
criterion does not establish its required nonvanishing or decide the group.
Keep the title linked to arXiv and the latest-version link pointed at the
repository PDF. The repository
contains the self-contained source and two Python standard-library
verification scripts; keep these links and qualifications aligned with
its README.

The toric stability entries share the
[toric-tangent-stability repository](https://github.com/bwuebben/toric-tangent-stability).
Paper 2, *Tangent stability on toric Fano blowups and bundles*, links directly to
its PDF and [separate guide](https://github.com/bwuebben/toric-tangent-stability/tree/main/paper2).
Its summary distinguishes the blowup-tree theorem from the sharp extremum within
the stated bundle class, identifies the computer-assisted proof components, and
leaves the unrestricted Picard bound open. Keep these qualifications when updating
the entry; Paper 2 is a separate preprint, not a replacement for Paper 1.

The Calabi–Yau smoothability and open FJRW papers each have their own
subsection, with one entry per paper linking to its PDF and source directory in
the [six-paper repository](https://github.com/bwuebben/calabi-yau-smoothability)
and the [three-paper repository](https://github.com/bwuebben/open-fjrw-scattering).
Once a paper is on arXiv, its title links to the arXiv abstract instead and the
note adds the arXiv identifier (Calabi–Yau Paper 1 is arXiv:2609.28499).
The Calabi–Yau subsection note states that database-wide counts use the verified
Kreuzer–Skarke input copy, and Paper 5's entry states its degree and projection
hypotheses. Keep these entries aligned with the repositories' paper guides when
the manuscripts change.

## The poem page

`poem.html` is the HTML setting of the LaTeX source for *Gradient of Mind*; the
epigraph on the landing page links to it.

Its mathematics is **pre-rendered with KaTeX at build time**, not typeset in the
browser. `tools/render-poem-math.js` runs `katex.renderToString` over the four
formulas and writes the markup straight into the page, so the site ships no
runtime JavaScript and depends on no CDN — only `assets/katex/katex.min.css`
and the woff2 fonts beside it (324 KB in total, and the `.woff`/`.ttf` fallback
URLs are stripped from the CSS because they are not shipped).

Each formula is emitted as HTML for sighted readers plus MathML for screen
readers; the KaTeX stylesheet hides the MathML visually. That stylesheet also
prefixes a few generic KaTeX class names (`base`, `strut`, `sizing`, ...) with
`katex-`, and the script renames its output to match. To change a formula,
edit its TeX in `tools/render-poem-math.js` and re-run the script. It writes
the markup straight into the `.pmath` blocks of `poem.html`, matched by their
`data-formula` attributes:

```sh
npm install katex        # once, anywhere on NODE_PATH
node tools/render-poem-math.js
```

KaTeX colours itself from the inherited CSS `color`, so the maths follows light
and dark mode with no extra work.

## Search discovery

The paper titles and full descriptions are ordinary HTML, reachable through
the Papers link on every page. Each page has a canonical URL and descriptive
metadata. `robots.txt` allows crawling and advertises `sitemap.xml`; add new
public pages to the sitemap when adding them. Preserve
`google5536594b14b40920.html`, the existing Google verification file.

The portrait page exists so that Google Images can find the full-length
photograph: Google indexes pictures it finds in `img` elements on crawled
pages, not files that are merely linked. `portrait/index.html` embeds
`assets/bernd_full_noir.jpg` with the name in the title, alt text, and
caption, carries an `ImageObject` block, and is listed in `sitemap.xml`
with an image entry. It is not in `site.json`, so it appears in no
navigation; the masthead portrait click on the landing page is its one
internal link, which is what keeps it from being an orphan page. The landing
page's `Person` block lists the same photograph first in its `image` field.

After publishing, submit `https://bwuebben.github.io/sitemap.xml` in Google
Search Console. Inspect `https://bwuebben.github.io/papers/` and
`https://bwuebben.github.io/portrait/` there and request indexing, then
monitor the Page Indexing report. Crawling and indexing are
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
