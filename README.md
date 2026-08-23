# bwuebben.github.io

Source for my personal site, published by GitHub Pages at
**<https://bwuebben.github.io/>**.

A GitHub *user site* — the repository name must stay exactly
`bwuebben.github.io`, and GitHub allows one per account. Everything is static
HTML, CSS, and (eventually) JavaScript; there is no build step and no server-side
code.

## Layout

```
index.html              the landing page
assets/style.css        shared stylesheet — reuse it on any page added later
assets/bernd_dark1.jpg  masthead portrait
assets/social-card.jpg  1200x630 link preview (generated — see below)
tools/                  source and script for the link preview
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

## Editing

Change a file, commit, push. GitHub rebuilds and redeploys within a minute or so.

GitHub Pages sends `Cache-Control: max-age=600` on assets, so a browser can hold
a stale `style.css` for ten minutes after a deploy — long enough to pair new
markup with an old stylesheet and render a broken page. **When you change
`assets/style.css`, bump the version on its link in `index.html`:**

```html
<link rel="stylesheet" href="assets/style.css?v=3">
```

That changes the URL, so every browser fetches the new file immediately.

```sh
git add -A && git commit -m "Update landing page" && git push
```

To preview locally, open `index.html` in a browser, or serve the directory so
relative paths behave exactly as they will in production:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

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

## Sub-pages

New sections live in their own directory with an `index.html` that links back to
`/assets/style.css`:

```
writing/index.html   ->  https://bwuebben.github.io/writing/
```

Separate repositories publish under their own path instead — a repository named
`foo` with Pages enabled serves at `https://bwuebben.github.io/foo/`, independent
of this repository.

## Custom domain

To move the site to a domain of your own, add a `CNAME` file containing the bare
domain, point the DNS records at GitHub, and enable *Enforce HTTPS* in the
repository's Pages settings.
