# Website agent instructions

Read [RESUME.md](RESUME.md) first, then [PREVIEW.md](PREVIEW.md). This branch contains
a complete website proposal awaiting Bernd's review and partial or full adoption.
On 25 October 2026 he authorized committing and pushing it for continuation on
another machine. This does not authorize merging into main or deploying the
redesign. Keep manuscript files and bibliographic identity intact.

At the start of a new session, also read [TODO.md](TODO.md) and briefly remind
Bernd of the publication/discoverability backlog, then follow his current request.
The website's primary purpose is to disseminate his research papers and thinking.
Keep papers prominent and use a substantive intellectual/philosophical register;
the visual companions support the research. See RESUME.md for his exact feedback.

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
