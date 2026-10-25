# Website proposal — review before deployment

**Historical review branch:** Bernd approved the complete design on 25 October
2026. The final refinements have been adopted on `main` in release commit
`64be722`. Continue website maintenance from main's RESUME.md. The earlier
review and approval guards below describe the proposal before that authorization.

Bernd requested the complete six-part proposal on 25 October 2026, with discussion
and selective adoption before anything affects the public site. This unpublished
worktree is on branch preview/site-direction-2026-10-25, based on
8931bcd957786ef8e8c94c34cf804353a714b89a. On 25 October Bernd authorized committing
and pushing this branch so work can continue on another machine. Do not merge
into main or deploy until he explicitly chooses what to adopt and authorizes it.
Read [RESUME.md](RESUME.md) for the full handoff and portable checkout commands.

## Open or restart

Run from the root of your preview checkout:

    python3 tools/serve-preview.py

- Proposed homepage: <http://127.0.0.1:8766/>
- Review page and notes: <http://127.0.0.1:8766/review/>
- Current version for comparison: <http://127.0.0.1:8765/>

If the comparison server has stopped, run in a separate terminal:

    python3 -m http.server 8765 --bind 127.0.0.1 --directory ../bwuebben.github.io

That last path must be a separate main-branch checkout. If it is absent or on
another branch, use the comparison worktree setup in RESUME.md instead.

Both servers bind only to this computer. The preview server adds a visible local
banner, disables caching, and sends an X-Robots-Tag noindex/nofollow/noarchive
header. That header belongs to the local server, not the production pages. A port
already in use usually means the preview is still running; open the URL first.
The review page itself also has noindex metadata and is excluded from the sitemap.

## Six independently discussable proposals

Editorial direction after Bernd's first review: the primary purpose of the site
is the dissemination of research papers and thinking. Use a substantive,
intellectual, philosophical register throughout the new editorial material.
Depth should come from precise questions, distinctions, and arguments.
Avoid casual personal slogans or presenting the site as a collection of gadgets.
The homepage leads with the research and direct access to the papers; the essays
and visual companions support that work and appear later.

| Proposal | Review routes | Main files |
| --- | --- | --- |
| 1. Homepage | / | index.html; homepage function in tools/build-editorial.py |
| 2. Explorer gallery | /explorers/ | explorers/index.html; gallery function; SVG illustrations |
| 3. Research guides | /research/ and its six programs | research/; program definitions and paper descriptions in the editorial builder |
| 4. Catalogue | /papers/ | papers/index.html, assets/catalogue.css; subject links and full entries, without search/filter controls |
| 5. Interactive writing | /writing/, /writing/institutional-knowledge/, /writing/physical-limits/ | content/*.html, tools/build-essays.py, assets/essay-models.js, assets/essay-experiments.js |
| 6. About and ongoing work | /about/, /updates/, /feed.xml | About function, data/updates.json, update/feed function |

Shared dependencies: assets/editorial.css, assets/illustrations/, selected
sharing images in assets/share/, and the proposed navigation in site.json.
Existing explorer paper-title links now open individual paper records; their
current-version PDFs remain accessible there. Their mathematical engines and
the existing Not Enough interactive script are unchanged.

Each proposal can be revised or omitted. Individual guides and the two new
essays can also be selected separately. Partial adoption needs an intentional
navigation and link pass: retaining the homepage while omitting research guides
means redirecting its guide links to the catalogue. Do not copy links to routes
being left out. Rebuild the sitemap from only the adopted pages. Do not publish
review/, this document, the preserved homepage template, or the preview server.

The review page stores notes and decisions in this browser's local storage and
offers a JSON export. Decisions are discussion notes, not publication commands.
The new essays are explicitly marked as drafts. Their two models are illustrative
and state their assumptions; the new prose needs Bernd's editorial review.

## Rebuild the whole proposal

    python3 tools/build-editorial.py
    python3 tools/build-essays.py
    python3 tools/build-review.py
    python3 tools/integrate-preview.py
    python3 tools/update-papers.py

The editorial builder owns the new static pages and diagrams. Edit its copy or
the two content/ essay files, rather than generated HTML. Existing paper records
remain owned by tools/update-papers.py. The file data/updates.json is the update
log: add an entry only for a confirmed public release, revision, or published site
addition. The feed currently contains two existing releases; it does not announce
the unpublished design or new essay drafts.

The page tools/share-card.html?art=drums (also conifold, institution, energy,
geometry, knot, portfolio, cobordism) renders a 1200 × 630 sharing image. The PNGs
were captured from that renderer. Re-render the affected card after changing its
artwork or title. The portrait card remains the general site sharing image.

## Verification

    python3 tools/update-papers.py --check
    python3 tools/check-editorial.py
    node tools/check-essay-models.cjs
    node --check assets/essay-experiments.js
    node --check assets/review.js
    git diff --check

The checks cover paper metadata and PDF checksums, unchanged catalogue entries,
internal links and anchors, one-to-one coverage of 39 papers by the six guides,
RSS/sitemap parsing, and the substantive boundary cases of both models.
Browser review covers desktop layouts, all new routes at 390 px, catalogue
subject navigation and full paper visibility, essay controls, and saved review notes.
No actual iPhone hardware or Google/Scholar indexing claim is implied.

## Adoption later

1. Record Bernd's selections and requested revisions.
2. Apply selected modules to a clean adoption branch from the then-current
   public branch; preserve intervening paper releases and existing TODO edits.
3. Resolve shared navigation, excluded-route links, draft labels, metadata, and
   sitemap entries. Keep the correct public PDF and version provenance.
4. Run the checks and inspect the resulting desktop and mobile pages.
5. Publish only after explicit authorization; verify GitHub Pages and live bytes.

The publication TODOs and session reminder are also saved on main, with the
matching research-repository TODO update. They do not adopt the preview design.
