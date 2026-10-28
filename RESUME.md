# Website maintenance

Updated 25 October 2026. Bernd approved the complete redesigned website for
publication, including the two new interactive essays. The approved design is
maintained on `main`. The branch `preview/site-direction-2026-10-25` preserves
the design review; do not use it as the current production source.

## Approved design

The homepage puts research first, with its portrait floated into the introduction,
smaller headings, and six selected papers in two rows. The selections are
Validation Bottleneck, Mirror Symmetry for Conifold Relations, Page Curve,
AI-Native Asset Manager, Cobordism Maps I, and the finite-Planck Higgs Branch paper.
The Papers page has subject links and all 44 entries, without search/filter controls
or the former introductory paragraph. About is last in the top navigation.

The release includes six research guides, the explorer gallery, Writing, About,
Updates, RSS, and both approved essays: What does an institution know? and The
material conditions of intelligence. Their models remain illustrative, with their
assumptions and limitations stated. No manuscript, bibliography, archive identity,
or public PDF has been revised by the redesign.

On 27 October, the stability-degeneration trilogy was added as a named programme
within Geometry & moduli: the three new papers remain together in the catalogue,
with geometric and analytic reading routes in the guide. The guide now has
12 papers. Bernd requested website publication before the determinant extension
attempt and subsequent Zenodo/DOI work. The determinant extension is now included
in Paper III; the three Zenodo archives and public ORCID checks are complete.
The citation pages use the corresponding version DOIs. arXiv submissions remain
pending in the project release queue. See TODO.md.

## Source and rebuild

- `tools/build-editorial.py`: homepage, guides, gallery, writing index, updates,
  RSS, and illustrations.
- `content/about.html` and `data/person.json`: approved biography and identity.
- `content/<slug>.html`: essay sources; `tools/build-essays.py` generates
  `writing/<slug>/`, and `python3 tools/build-essays.py <slug>` rebuilds one.
  The first two essays share `assets/essay-models.js` and
  `assets/essay-experiments.js`. Each later essay has its own
  `assets/essays/<slug>-model.js`, `<slug>.js` and `<slug>.css`, a cover in
  `assets/illustrations/`, a sharing card in `assets/share/` rendered from
  `tools/share-card.html`, and model checks in `tools/essay-checks/`. Build a
  new essay's page before running the editorial build, which refuses
  navigation links to missing pages. Bernd authorized publication of eight
  further essays, drafted on branch `essays-2026-10-25`, on 25 October 2026.
- `site.json`: shared navigation; `assets/editorial.css` and
  `assets/catalogue.css`: editorial and catalogue layout.
- `tools/integrate-site.py`: catalogue header, companion paper links, sharing
  images, and editorial sitemap entries.
- `data/papers.json`, `templates/paper.html`, `tools/update-papers.py`: paper
  metadata and generated individual pages. Follow PUBLICATION_WORKFLOW.md.

Run in this order:

```sh
python3 tools/build-editorial.py
python3 tools/build-essays.py
python3 tools/integrate-site.py
python3 tools/update-papers.py
python3 tools/update-site.py --check
python3 tools/update-papers.py --check
python3 tools/check-editorial.py
node tools/check-essay-models.cjs
for f in tools/essay-checks/*.cjs; do node "$f"; done
for f in assets/essays/*.js; do node --check "$f"; done
node --check assets/essay-experiments.js
git diff --check
```

The preservation check compares paper records and catalogue entries with public
baseline `d3e1bf2`. It permits the two authorized cross-link additions to the
local-chambers and earlier equilibrium-spectrum entries, preserving their titles,
existing resource links and manuscript metadata. It derives catalogue and guide
counts from `data/papers.json`. Revise the baseline when a later authorized
release changes existing manuscript metadata.

Preview locally with `python3 -m http.server 8000 --bind 127.0.0.1`.
GitHub Pages publishes `main` at `/`. After an authorized push, verify the Pages
build commit and the live HTML, assets, sitemap, and representative PDF bytes.
Deployment receipts are kept outside the repository under
`~/.local/share/website-checks/site-redesign-2026-10-25/`.

The sitemap is `https://bwuebben.github.io/sitemap.xml`; submit that URL in Google
Search Console. A valid sitemap and deployed pages are preparation for indexing,
not evidence that Google or Scholar has indexed them.

## Remaining work

Read TODO.md at session start and briefly remind Bernd of the open publication and
discoverability tasks: Zenodo coverage/visibility, Scholar inclusion, six missing
SSRN PDF mirrors, Search Console follow-up, and ongoing ORCID verification.
Preserve these tasks separately from the completed design work. New edits stay
local unless their publication is authorized.
