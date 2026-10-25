# Resume: research-centered website redesign

Handoff prepared **25 October 2026** for continuation on another machine.

## Read this first

The complete six-part website proposal is built and working. Bernd has seen it
and requested a more intellectual, philosophical voice, with the research
papers clearly at the center. That first revision is implemented. **The next
step is review and refinement with Bernd, not another wholesale rebuild and not
deployment.**

- Repository: <https://github.com/bwuebben/bwuebben.github.io>.
- Active branch: **`preview/site-direction-2026-10-25`**.
- Original checkout: `/Users/bwuebben/git/bwuebben-site-preview`; this path is
  historical, not required. All runtime/build helpers resolve their checkout root.
- Public branch: `main`. The preview began at
  `8931bcd957786ef8e8c94c34cf804353a714b89a` (39 individual paper pages).
- The main checkout and `papers_ai_1/main` also have pending-session/backlog
  documentation saved as part of this handoff. They contain no redesign adoption.
- Latest instruction: "git commit and push everything ... continue on a different
  machine ... make sure there is a great RESUME.md". This authorizes pushing the
  preview branch. **It does not authorize merging into main, deploying the new
  site, or treating the two new essays as approved publications.**
- GitHub Pages was checked on 25 October: legacy build, source `main`, path `/`.
  There is no custom `.github` deployment workflow. Recheck settings before any
  later deployment. A push to this preview branch does not select it for Pages.

The branch is a Git backup in the existing GitHub repository; it is not a private
staging service. "Preview" here means not adopted on the public website.

## Start on the other machine

The committed HTML and assets are ready to serve; no package installation or
research-repository checkout is needed. Use Python 3; Node.js is needed for the
JavaScript validation commands below, not to view the site.

Fresh separate clone, from your preferred parent directory:

```sh
git clone --branch preview/site-direction-2026-10-25 https://github.com/bwuebben/bwuebben.github.io.git bwuebben-site-preview
cd bwuebben-site-preview
git status --short --branch
python3 tools/serve-preview.py
```

If a clean website clone already exists, a separate worktree is preferable:

```sh
git fetch origin
git worktree add --track -b preview/site-direction-2026-10-25 ../bwuebben-site-preview origin/preview/site-direction-2026-10-25
```

Run the second command from that existing clone only if the local branch and
target directory do not already exist. If the branch already exists, inspect
`git worktree list` and its status, reuse its checkout, and `git pull --ff-only`
when clean. Do not overwrite work or force-reset to the handoff.

Open these local URLs:

- Homepage: <http://127.0.0.1:8766/>.
- Review hub: <http://127.0.0.1:8766/review/>.
- Research catalogue: <http://127.0.0.1:8766/papers/>.
- Research programs: <http://127.0.0.1:8766/research/>.
- Writing: <http://127.0.0.1:8766/writing/>.

The server binds to loopback, adds a LOCAL PREVIEW ribbon, disables caching,
rewrites same-site links to local paths, and sends `X-Robots-Tag:
noindex, nofollow, noarchive`. Those headers belong only to the local server;
do not copy them to production. If port 8766 is occupied, check whether the
preview is already running before starting another server. Ctrl+C stops it.

For comparison with current main, run from the preview checkout:

```sh
git fetch origin
git worktree add --detach ../bwuebben-site-public origin/main
python3 -m http.server 8765 --bind 127.0.0.1 --directory ../bwuebben-site-public
```

Use a second terminal because each server stays running. If that comparison
directory already exists, inspect/reuse it instead of blindly adding it again.
The preview ribbon links to <http://127.0.0.1:8765/>. A browser's review notes do
not migrate with Git: the review form uses localStorage and has an Export button.
At this handoff all six decisions were Undecided and all note fields were empty.
Bernd's actual feedback is recorded below, so there is no review-form content to
recover from the original machine.

## What Bernd wants, in his own terms

The website's primary purpose is **the distribution of his research and his
thinking**. Readers should see that immediately. He felt the first proposal
put the "gadgety stuff" in the foreground and nearly hid the papers.

He rejected the casual opening "An idea takes hold, and I want to build something
with it: a theory, a proof, or an investment process that has to survive contact
with markets." Although based on his informal self-description, it did not have
the artfulness or philosophical depth he wants in public-facing prose. Do not
restore it or turn other informal chat remarks into homepage slogans.

His latest editorial instruction: **"a deeper, more intellectual more
philosophical tone throughout. depth!"**

Apply this through substantive questions, careful distinctions, and developed
arguments. Keep the writing concrete and tied to the actual work. Avoid casual
promotional slogans, generic declarations of rigor, inflated claims, or abstract
language that contributes no thought. Essays and visual companions remain useful
but should lead readers into the research. Keep the restrained serif typography,
portrait, ample space, and burgundy accents unless he asks otherwise.

The original homepage is preserved in `templates/home-before-preview.html`.
The About builder reuses its intellectual/biographical material. Preserve his
exact Cornell background and professional-role wording; do not invent an
employer, contact address, institutional affiliation, or stronger research claim.

## Current revision: what is already done

The homepage now opens with "A price is a claim about the future that somebody
was willing to fund." It develops questions about earning versus explaining,
risk versus constraints, and the limits of a track record, then connects the
mathematics and physics to structure, invariants, and information. This is a
proposed revision for review, not a final author-approved opening.

The navigation starts **Home / Papers / Research guides**. The introduction
explicitly links the research papers and has a prominent **Read the research
papers** button. Homepage order is now:

1. Intellectual introduction and direct paper links.
2. Selected papers: Validation Bottleneck, mixed Calabi–Yau smoothing, Page Curve.
3. Six research programs.
4. Not Enough as a supporting essay.
5. Visual companions to the research, reduced in visual dominance.
6. Recent additions.

The Research, Writing, About, and Explorers introductions have also been rewritten
to give them a more substantive intellectual tone. The second new essay is now
**The material conditions of intelligence**, replacing the earlier draft title
"Intelligence has a power cord." Its route stays `/writing/physical-limits/`.
The latest share image has been regenerated. The existing approved essay bodies,
manuscript abstracts, paper identities, and mathematical explorer engines were
not rewritten in this editorial pass.

## Six modules available for selective adoption

| Module | Current implementation and routes |
| --- | --- |
| Homepage | Research-first introduction, selected papers, six programs, supporting essays and illustrations; `/` |
| Explorer gallery | Four existing explorers with context and links into the papers; `/explorers/` |
| Research guides | `/research/` plus markets (3 papers), topology (10), calabi-yau (6), geometry (7), physics (9), ai-institutions (4); all 39 papers occur once |
| Paper catalogue | Existing entries plus search, subject filter, compact view, query-string persistence; `/papers/` |
| Writing | `/writing/`, existing Not Enough and Gradient of Mind, plus two new essay drafts: institutional-knowledge and physical-limits |
| About and updates | `/about/`, `/updates/`, and `/feed.xml`; feed contains confirmed public additions only, not announcements of this preview |

The two new essays include illustrative models with stated assumptions. The first
examines correlated evidence in institutional judgment; the second examines chip,
power, cooling, and utilization limits. These are explanatory models, not empirical
findings. Keep manuscript qualifications and the existing four-manifold and
gauge-theory scope boundaries intact. Design review is not mathematical clearance.

## Edit the source of each component

| Source | Owns |
| --- | --- |
| `tools/build-editorial.py` | Homepage, gallery, six research guides/index, About, writing index, updates/RSS, and SVG illustrations |
| `assets/editorial.css` | New editorial layout, typography, responsive rules |
| `content/institutional-knowledge.html`, `content/physical-limits.html` | New essay prose; `tools/build-essays.py` generates the pages and owns their title/metadata |
| `assets/essay-models.js` | Pure numerical functions; meaningful boundary tests in `tools/check-essay-models.cjs` |
| `assets/essay-experiments.js` | Essay controls, presets, displays, mobile summary |
| `assets/catalogue.js`, `assets/catalogue.css` | Progressive enhancement of the original paper catalogue |
| `tools/integrate-preview.py` | Proposed `site.json` navigation, catalogue toolbar, explorer paper links, share-image integration, new sitemap routes |
| `tools/update-site.py` | Shared navigation/style propagation; preview adds nested-route active navigation handling |
| `data/papers.json`, `templates/paper.html`, `tools/update-papers.py` | Existing authoritative paper metadata and generated individual paper pages; keep PDF hashes and identifiers intact |
| `data/updates.json` | Confirmed publication/update entries; no invented release dates |
| `tools/build-review.py`, `assets/review.js` | Review hub, decisions, browser-local notes and JSON export |
| `tools/share-card.html` | Browser renderer for eight 1200 × 630 share cards in `assets/share/` |
| `tools/serve-preview.py` | Local-only preview server and ribbon |

Edit generators or essay sources, not their generated HTML. In particular,
changing `site.json` alone will be overwritten by the next integration run: update
the config in `tools/integrate-preview.py`. Existing individual paper HTML changes
in this branch are shared navigation/styles only. No public PDF or bibliographic
record was changed by the redesign.

The complete rebuild is:

```sh
python3 tools/build-editorial.py
python3 tools/build-essays.py
python3 tools/build-review.py
python3 tools/integrate-preview.py
python3 tools/update-papers.py
```

Changing a share-card title/art also requires rendering its PNG from
`/tools/share-card.html?art=energy` (or the relevant art key) at 1200 × 630 in a
browser. The existing general portrait card is retained for general site pages.

## Checks and evidence

Run from the preview root:

```sh
python3 tools/update-site.py --check
python3 tools/update-papers.py --check
python3 tools/check-editorial.py
node tools/check-essay-models.cjs
node --check assets/catalogue.js
node --check assets/essay-experiments.js
node --check assets/review.js
git diff --check
```

Before handoff these checks passed: 63 HTML pages, resolving internal links and
anchors, 39 preserved catalogue entries and paper records, 33 verified PDFs,
six guides covering all papers once, parseable RSS/sitemap, and the model tests.
Six SSRN records remain archive-only with no mirrored PDF; do not substitute
private drafts. The catalogue/guide preservation check uses the fixed public
baseline `8931bcd` so it remains meaningful after committing this branch.

Prior browser review covered filtering and URL reloads, review-note persistence,
model controls and boundary behavior, and all new routes at 390 px without
horizontal overflow. The latest prose/layout revision was inspected on desktop
and at 390 px for the homepage and revised introductions. These are browser
viewport checks, not tests on physical iPhone hardware.

Latest visual evidence:

- `review/screenshots/home-research-first-desktop.png`
- `review/screenshots/home-research-first-phone.png`

The older `home-desktop.png` and `home-phone.png` show the first proposal before
Bernd's feedback. `review/validation.json`, `mobile-checks.json`, and
`public-site-unchanged.json` are dated historical receipts from the initial
build; their `committed: false`/old remote hash describe that earlier moment.
Use `review/handoff-validation.json` and current Git state for this handoff.

## Next session: proceed from here

1. Read AGENTS.md, this file, PREVIEW.md, and TODO.md; check branch/status.
2. Briefly mention the discoverability backlog, then focus on Bernd's request.
3. Start the preview and comparison server, and show him the revised homepage.
4. Continue his review of the opening, research prominence, other introductions,
   guides, essays, and visuals. Record decisions and new feedback in this file or
   a committed review note. Do not silently promote Undecided to Keep.
5. Make requested revisions in source, regenerate, and run checks appropriate to
   the change. Keep the preview branch remotely saved when he requests a push.
6. Only after he selects what to adopt and authorizes deployment, apply selected
   modules to a clean adoption branch from current main. Preserve intervening
   paper releases and documentation. Resolve links/shared navigation if modules
   are omitted. Do not blindly merge this entire preview into main.

Do not copy `review/`, PREVIEW.md, the preserved homepage template, or the preview
server into the adopted public design. Keep the production branch's operational
handoff and agent instructions appropriate to its status; do not blindly replace
them with this preview's review guards. Resolve essay draft labels and approval before
announcing them; the review interface is not an approval mechanism. Run checks,
review the staged scope, then verify Pages and live content after an authorized
deployment. No deployment has been requested by the present handoff instruction.

## Separate publication/discoverability backlog

TODO.md mirrors the canonical `papers_ai_1/TODO.md`. Pending work: complete Zenodo
coverage, investigate Zenodo noindex behavior/support reply, reconcile Scholar
profile and search inclusion, obtain six missing public SSRN PDF mirrors, and
check Search Console sitemap/indexing (Bernd handles that manually). Verify ORCID
after each public release or revision. Website preparation is complete for 39
paper landing pages, with 33 verified PDFs; it does not prove crawler inclusion.

Follow PUBLICATION_WORKFLOW.md when releasing papers. Zenodo credentials remain
in the original machine's Keychain and are not in this Git handoff. Local archive
and ORCID receipts referenced in TODO.md may also be machine-local; do not assume
those paths or authentication exist on the next machine. None is needed to
continue website design. Consult the appropriate workflow before archival work.
