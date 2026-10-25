# Publication and discoverability TODOs

Requested by Bernd on 25 October 2026. These items are pending; recording them
does not mean that deposits or indexing have been completed. Scope: all publicly
released papers listed on the website, currently 39, not private research drafts.

## Next-session reminder

Briefly remind Bernd of this backlog when work resumes in this repository.
Start with any reply from Zenodo support and the Search Console sitemap status;
then choose the next task with Bernd. Do not repeat completed website preparation
or assume that publishing a page proves Google/Scholar inclusion.

Completed on 25 October 2026: all 39 individual paper pages and 33 verified PDF
copies were deployed in website commit `8931bcd`; the live sitemap contains 48
URLs. All 39 papers were also verified in the public ORCID record. These are
dated baselines, not guarantees about future releases or crawler inclusion.

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
  the separate Zenodo links. The current inventory has 21 Zenodo records and
  18 papers on arXiv/SSRN without Zenodo deposits; refresh it when resuming.
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
  Google controls indexing. Complete the six PDF mirrors when SSRN
  downloads are available: **The AI-Native Asset Manager**, **Informational
  Singularities**, **Prediction Markets**, **Institutional Plumbing**, **Material
  Deployment Power**, and **Algorithmic Plausible Deniability**. Exact archive
  URLs and pending reasons are in `data/papers.json`. SSRN/Crossref supplied their
  full abstracts; no private or newer unreleased PDF was substituted.
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

The canonical backlog and restart evidence are in
[`../papers_ai_1/TODO.md`](../papers_ai_1/TODO.md#publication-and-discoverability).
Follow [PUBLICATION_WORKFLOW.md](PUBLICATION_WORKFLOW.md) for each release.
Deployment receipts are in
`~/.local/share/website-checks/paper-pages-build/deployment-verification.json`
and `orcid-release-verification.json` in the same directory.
