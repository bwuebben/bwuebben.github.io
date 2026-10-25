# Website agent instructions

Before adding or updating a public paper, read
[PUBLICATION_WORKFLOW.md](PUBLICATION_WORKFLOW.md) and the canonical procedure in
`../papers_ai_1/PUBLICATION_WORKFLOW.md`. This applies to every agent. The release
includes the SSRN/arXiv route, Zenodo while arXiv-bound papers wait, and verified
ORCID coverage. Preserve the manuscript's rights and existing review gates.
Keep `current version (PDF)` linked to the latest PDF in the public repository.
Append a separate `Zenodo:<record number>` link to the published landing page at
the end of each applicable paper's description; update it for new Zenodo versions.

Read README.md for local preview, shared navigation, and site checks. Keep review
changes local unless publication is authorized. Stage explicit paths only; avoid
unrelated work. Run `python3 tools/update-site.py --check` for site changes and
verify Pages and live content after an authorized deployment.
