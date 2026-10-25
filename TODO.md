# Publication and discoverability TODOs

Requested by Bernd on 25 October 2026. These items are pending; recording them
does not mean that deposits or indexing have been completed. Scope: all publicly
released papers listed on the website, currently 39, not private research drafts.

- [ ] **Get all public papers onto Zenodo**, including papers already on arXiv
  or SSRN. Check existing records, exact versions, licenses, and existing DOIs
  before depositing. Preserve the public-repository current-PDF links and add
  the separate Zenodo links. The current inventory has 21 Zenodo records and
  18 papers on arXiv/SSRN without Zenodo deposits; refresh it when resuming.
- [ ] **Resolve Zenodo search visibility.** Investigate and remove the
  `noindex, nofollow` restriction observed on records `23642520` and `23643187`.
  Confirm public crawler behavior and ask Zenodo to review account/record
  safelisting if required; verify the resulting directives, not merely public
  download access. See the detailed research-repository TODO for evidence.
- [ ] **Get all public papers onto Google Scholar.** Reconcile the existing
  author profile with the paper inventory, merge duplicate versions, and add
  missing works. Prepare individually accessible abstract pages and searchable
  PDFs with Scholar citation metadata on this website, retaining the existing
  current-PDF links to public repositories. Track profile completeness and
  confirmed Scholar search inclusion separately; Google controls indexing.
  Individual pages now cover all 39 papers, with 33 verified PDF copies and six
  archive-only reading links. Track deployment and actual Scholar inclusion
  separately. Complete the six PDF mirrors when SSRN
  downloads are available: **The AI-Native Asset Manager**, **Informational
  Singularities**, **Prediction Markets**, **Institutional Plumbing**, **Material
  Deployment Power**, and **Algorithmic Plausible Deniability**. Exact archive
  URLs and pending reasons are in `data/papers.json`. SSRN/Crossref supplied their
  full abstracts; no private or newer unreleased PDF was substituted.
- [ ] **Keep ORCID up to date for every public paper and revision — ongoing.**
  Verify the actual ORCID record after each release, additional archive deposit,
  or version update. Add missing works and identifiers, correct titles, and
  group versions/copies of the same paper. Automatic DataCite/Crossref imports
  must be checked rather than assumed. This remains a release requirement after
  the current backlog is complete.

The canonical backlog and restart evidence are in
[`../papers_ai_1/TODO.md`](../papers_ai_1/TODO.md#publication-and-discoverability).
Follow [PUBLICATION_WORKFLOW.md](PUBLICATION_WORKFLOW.md) for each release.
