# Paper release checklist

Standing instruction from Bernd, 25 October 2026, for all agents.

The canonical procedure is in the research repository:
[`../papers_ai_1/PUBLICATION_WORKFLOW.md`](../papers_ai_1/PUBLICATION_WORKFLOW.md).
Read it before adding or updating a paper on this website. Research source lives
in `papers_ai_1`; public paper mirrors and this website are release surfaces.

1. Identify the exact manuscript and existing archive identifiers. Decide whether
   it follows the SSRN or arXiv route, using the already agreed choice when known.
2. For SSRN, publish/revise there and verify the public DOI. For an arXiv-bound
   paper waiting for submission capacity, publish its released PDF on Zenodo
   first, record the arXiv queue action, and cross-link the records when arXiv
   becomes public. Papers already on SSRN or arXiv do not need redundant Zenodo
   deposits by default.
3. Preserve manuscript identity, author order, mathematical qualifications,
   existing rights, and project review gates. Record source/public commits and
   the released PDF's SHA-256. Inspect the latest remote public PDF.
4. For an updated Zenodo PDF, use **New version** on its existing record. Keep the
   concept DOI and record the new version DOI. Metadata-only corrections edit
   the existing record; unchanged PDFs need no new version.
5. Verify the paper on ORCID
   <https://orcid.org/0009-0002-4588-3284>. Use the existing DataCite/Crossref
   connections, but check the actual result. Import a missing arXiv or other work
   by DOI through the signed-in account; inspect titles, type, dates, identifiers,
   visibility, and grouping. Remove HTML debris from displayed titles while
   preserving words, DOI links, and source provenance.
6. Update the paper's website entry and relevant explorer references. Preserve
   the site's established author/year labels and linked `SSRN:<record number>`
   convention. Keep stable archive links and distinguish pending submissions
   from public papers. Do not put private package paths or draft URLs on pages.
7. Follow the current authorization for commit/push/deploy. Local preparation
   stays local when requested. For authorized site publication, run
   `python3 tools/update-site.py --check`, stage only intended files, check the
   staged diff, verify the remote commit and Pages build, and check live content.
8. Update the project's release/status note and local deposit ledger. Record
   archive/ORCID/website verification separately and spell out any remaining step.

The release request authorizes these accompanying steps for the selected paper;
do not ask repeatedly for permission already given. It does not authorize
publishing unrelated work or bypassing manuscript review requirements.

Local restart points: `~/.codex/skills/zenodo-deposit/SKILL.md`,
`~/.config/zenodo/profile.json`, and
`~/.local/share/zenodo-deposits/index.json`. The initial 39-paper inventory is in
`~/.local/share/zenodo-deposits/batch-2026-10-25/`. Credentials stay in Keychain;
never copy tokens or private receipts into this public repository.
