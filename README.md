# bwuebben.github.io

Source for my personal site, published by GitHub Pages at
**<https://bwuebben.github.io/>**.

A GitHub *user site* — the repository name must stay exactly
`bwuebben.github.io`, and GitHub allows one per account. Everything is static
HTML, CSS, and (eventually) JavaScript; there is no build step and no server-side
code.

## Layout

```
index.html        the landing page
assets/style.css  shared stylesheet — reuse it on any page added later
.nojekyll         serve files as-is, skipping Jekyll processing
```

## Editing

Change a file, commit, push. GitHub rebuilds and redeploys within a minute or so.

```sh
git add -A && git commit -m "Update landing page" && git push
```

To preview locally, open `index.html` in a browser, or serve the directory so
relative paths behave exactly as they will in production:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

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
