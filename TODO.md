# Publication and discoverability TODOs

Requested by Bernd on 25 October 2026. These items are pending; recording them
does not mean that deposits or indexing have been completed. Scope: all publicly
released papers listed on the website, currently 44, not private research drafts.

## Current archive and ORCID check — 27 October 2026

- Calabi–Yau Papers IV and V are public as [arXiv:2610.35911](https://arxiv.org/abs/2610.35911) and [arXiv:2610.35915](https://arxiv.org/abs/2610.35915). Their arXiv landing pages and DOIs now take precedence on the website and in citations; Zenodo remains archival history.
- The [expanded Calabi–Yau reading guide](https://bwuebben.github.io/research/calabi-yau/) is live, with six mathematical papers and four optional physics companions.
- All **44** website papers match exactly one public ORCID work group each, including the three stability-degeneration papers and their revised archives. No recent paper needs to be added as a duplicate.
- Both new arXiv identifiers and DOIs are now present in ORCID and their author-supplied arXiv records are the preferred sources (put-codes 231462659 and 231462966). Existing Zenodo/DataCite assertions remain grouped. Public verification still finds exactly 44 work groups. Both arXiv DOI resolver URLs now return HTTP 200 and lead to the correct arXiv landing pages; the earlier activation delay has cleared.
- Verification details: `../papers_ai_1/cy_smoothing/release_arxiv_20261027/README.md`. The dated inventories below retain their historical scope.

## Next-session reminder

Briefly remind Bernd of this backlog when work resumes in this repository.
Start with any reply from Zenodo support and the Search Console sitemap status;
then choose the next task with Bernd. Do not repeat completed website preparation
or assume that publishing a page proves Google/Scholar inclusion.

Completed on 25 October 2026: all 39 individual paper pages and 33 verified PDF
copies were deployed in website commit `8931bcd`; the live sitemap contains 48
URLs. All 39 papers were also verified in the public ORCID record. These are
dated baselines, not guarantees about future releases or crawler inclusion.

Paper 3 was added on 26 October 2026 with Zenodo record 23681809 and verified
public ORCID coverage. Its 27 October link correction is archived as
Zenodo:23682140; the earlier version remains available. The inventory was 40 paper pages, 34 PDF mirrors,
and 22 Zenodo archives at that point. The spectral companion, *Small Dolbeault
eigenvalues near stability walls*, was added on 27 October 2026 with Zenodo
record 23682045 and verified public ORCID coverage. The inventory at that point was
41 paper pages, 35 PDF mirrors and 23 Zenodo archives. Both new papers remain pending arXiv submission. The 18 older
archive deposits and six SSRN PDF mirrors
listed below remain pending.

The stability-degeneration trilogy brings the catalogue to 44 papers, 38 PDF
mirrors and 26 Zenodo archives. The bounded determinant extension was accepted
and included in Paper III before archival.

- [x] Archive the final PDFs: III [23717123](https://zenodo.org/records/23717123),
  IV [23717178](https://zenodo.org/records/23717178),
  V [23717290](https://zenodo.org/records/23717290). All version and concept DOIs
  resolve, and every downloaded PDF matches its released checksum.
- [x] Add separate catalogue archive links and version-specific citation DOIs.
- [x] Verify public ORCID coverage: DataCite supplied one work group per paper,
  with version and concept assertions grouped and readable titles. Checked
  28 October 2026 UTC (27 October in New York).
- [x] Record the trilogy in the project's arXiv queue.
- [ ] Submit the trilogy to arXiv when scheduled; verify current submission
  rules and capacity then. No submission has been made.

## Open work

Website redesign: Bernd approved the complete design for publication on
25 October 2026. This production source incorporates the final portrait/text
layout, smaller headings, six selected papers, simplified Papers page, and About
as the last navigation item. It also includes the research guides, gallery,
Writing, About, Updates/RSS, and both new essays. The preview review hub and
local-only server are excluded. See RESUME.md for the production build procedure.
The new sitemap includes every public page; Search Console acceptance and actual
indexing remain separate follow-ups below.

- [ ] **Get all public papers onto Zenodo**, including papers already on arXiv
  or SSRN. Check existing records, exact versions, licenses, and existing DOIs
  before depositing. Preserve the public-repository current-PDF links and add
  the separate Zenodo links. Refreshed on 25 October 2026 against the signed-in
  Zenodo uploads dashboard: its 21 published records exactly match the website;
  18 papers (8 arXiv, 10 SSRN) still need deposits. All 18 exact public PDFs are
  now saved locally with SHA-256 checksums, including the six recovered SSRN
  downloads. See the missing-paper inventory below. No new deposits were made
  during this audit; rights and version-specific DOI checks remain pending.
- [ ] **Resolve Zenodo search visibility.** Investigate and remove the
  `noindex, nofollow` restriction observed on records `23642520` and `23643187`.
  Confirm public crawler behavior and ask Zenodo to review account/record
  safelisting if required; verify the resulting directives, not merely public
  download access. See the detailed research-repository TODO for evidence.
- [ ] **Get all public papers onto Google Scholar.** Reconcile the existing
  author profile with the paper inventory, merge duplicate versions, and add
  missing works. Individual abstract pages with Scholar citation metadata are
  now live for all 39 papers, with 33 verified PDF copies and six archive-only
  reading links. Existing current-PDF links to public repositories are retained.
  Track profile completeness and confirmed Scholar search inclusion separately;
  Google controls indexing. Complete the six PDF mirrors using the exact SSRN
  downloads recovered locally on 25 October: **The AI-Native Asset Manager**, **Informational
  Singularities**, **Prediction Markets**, **Institutional Plumbing**, **Material
  Deployment Power**, and **Algorithmic Plausible Deniability**. Exact archive
  URLs and the previous pending reasons are in `data/papers.json`. The six PDFs
  have been downloaded through Chrome and their titles, dates, and page counts
  checked. Website metadata, PDF copies, and deployment still need updating;
  the live site remains at 33 PDF mirrors. No private or newer unreleased PDF
  was substituted.
- [ ] **Check Google Search Console after the paper-page deployment.** Confirm
  that `https://bwuebben.github.io/sitemap.xml` reports Success and that Google
  discovers the new paper URLs. The earlier sitemap report said Couldn't fetch;
  the deployed XML itself has been verified readable and valid. Inspect the
  papers catalogue and a few priority paper URLs; request indexing as useful,
  then monitor the Pages report. Bernd is handling Search Console manually.
  Record actual results and dates. Ordinary Google indexing and Google Scholar
  indexing are separate tasks.
- [ ] **Keep ORCID up to date for every public paper and revision — ongoing.**
  Verify the actual ORCID record after each release, additional archive deposit,
  or version update. Add missing works and identifiers, correct titles, and
  group versions/copies of the same paper. Automatic DataCite/Crossref imports
  must be checked rather than assumed. This remains a release requirement after
  the current backlog is complete.

## Missing Zenodo deposits — verified 25 October 2026

| Paper | Existing archive |
| --- | --- |
| The Validation Bottleneck | SSRN:7180460 |
| The AI-Native Asset Manager | SSRN:6487798 |
| Beyond De Prado and Cotton | arXiv:2604.23833 |
| Traceless SU(2) characters and ℤ/4 instanton gradings | arXiv:2607.26095 |
| Instanton and pillowcase homology of the (−2,3,q) pretzel knots | arXiv:2607.26096 |
| Slope stability of tangent bundles of smooth toric Fano varieties | arXiv:2608.20411 |
| Non-smoothable Calabi–Yau threefolds from reflexive polytopes | arXiv:2609.28499 |
| Deformations of toric pairs and the smoothing of Batyrev Calabi–Yau threefolds | arXiv:2610.06884 |
| Doubly isolated Batyrev mirror pairs and non-smoothable Calabi–Yau threefolds | arXiv:2610.03753 |
| Toward an exotic S²×S² and an exotic ℂP²#ℂP̄² | arXiv:2608.17267 |
| The Page Curve Through the Transition | SSRN:6372958 |
| The Page Curve in Higher Dimensions | SSRN:6372978 |
| The Page Curve Is Not Enough | SSRN:6521478 |
| Informational Singularities and the Completion of Gravity | SSRN:7151179 |
| Prediction Markets as the Informational Substrate of the Machine Economy | SSRN:6561300 |
| The Institutional Plumbing for a Machine Economy | SSRN:6372838 |
| Material Deployment Power in the Age of Artificial Intelligence | SSRN:6481923 |
| Algorithmic Plausible Deniability | SSRN:6482039 |

Local audit and prepared PDFs:
`~/.local/share/zenodo-deposits/coverage-audit-2026-10-25/inventory.json`
and its per-paper directories. This is preparation evidence, not a deposit ledger
or publication receipt. The previous `zenodo-deposit` skill/API helper, author
profile, and deposit index were absent from their documented paths on this Mac;
restore or rebuild that setup before continuing the prescribed deposit workflow.
The signed-in Chrome account is accessible; direct Zenodo API reads returned 403.

For each deposit, verify whether the existing archive DOI identifies these exact
bytes or an older revision; Zenodo requires the existing DOI for the same content.
Preserve manuscript rights, including the explicit rights reservations on the
first three Calabi–Yau papers. After publication, update archive links and verify
ORCID grouping. Also correct the Validation Bottleneck source link from `main`
to the public repository's actual `master` branch; its downloaded `master` PDF
matches the existing catalogue checksum.

The canonical backlog and restart evidence are in
[`../papers_ai_1/TODO.md`](../papers_ai_1/TODO.md#publication-and-discoverability).
Follow [PUBLICATION_WORKFLOW.md](PUBLICATION_WORKFLOW.md) for each release.
Deployment receipts are in
`~/.local/share/website-checks/paper-pages-build/deployment-verification.json`
and `orcid-release-verification.json` in the same directory.
