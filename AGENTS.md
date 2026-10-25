# Website agent instructions

Read [RESUME.md](RESUME.md) first for the current site architecture and build
commands. Bernd approved publication of the complete redesigned website on
25 October 2026. The adopted design is maintained on `main`; the old preview
branch is historical. Future changes need their own publication authorization.

At the start of each new session in this repository, read [TODO.md](TODO.md)
and briefly remind Bernd of the outstanding tasks and the next useful action.
Bernd explicitly requested this reminder on 25 October 2026. Keep the reminder
short, then continue with the current request; it does not authorize executing
the entire backlog. Update the list as work is completed and distinguish
confirmed indexing from preparation for indexing.

Before adding or updating a public paper, read
[PUBLICATION_WORKFLOW.md](PUBLICATION_WORKFLOW.md) and the canonical procedure in
`../papers_ai_1/PUBLICATION_WORKFLOW.md`. This applies to every agent. The release
includes the SSRN/arXiv route, Zenodo while arXiv-bound papers wait, and verified
ORCID coverage. Preserve the manuscript's rights and existing review gates.
Keep `current version (PDF)` linked to the latest PDF in the public repository.
Append a separate `Zenodo:<record number>` link to the published landing page at
the end of each applicable paper's description; update it for new Zenodo versions.
Every listed paper also needs a stable individual abstract page. Maintain its
record in `data/papers.json`, then run `python3 tools/update-papers.py` and
`python3 tools/update-papers.py --check`. Do not hand-edit generated paper pages.
Keep hosted PDFs identical to the verified public source and preserve their
checksums, manuscript dates, and version-specific DOI identity. See README.md
for the six archive-only SSRN pages awaiting downloadable public PDFs.

Read README.md for local preview, shared navigation, and site checks. Keep review
changes local unless publication is authorized. Stage explicit paths only; avoid
unrelated work. Run `python3 tools/update-site.py --check` for site changes and
verify Pages and live content after an authorized deployment.
