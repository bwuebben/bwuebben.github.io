# Resume the website redesign

Updated 25 October 2026. **The active design work is on
`preview/site-direction-2026-10-25`, not this `main` branch.**

Bernd asked for a complete six-part website proposal that he can preview,
discuss, and adopt partially or fully without changing the public site. It has
been built. His first feedback was to put research papers unmistakably first
and give the prose greater intellectual and philosophical depth. That revision
is also complete and awaits his next review.

He has now authorized committing and pushing everything so another machine and
agent can continue. **This authorizes the Git handoff, not adoption or deployment
of the preview.** GitHub Pages was verified on 25 October to publish `main` at `/`.
Do not merge the preview into main, change Pages settings, or publish its essay
drafts without his explicit instruction.

## Open the actual work

The comprehensive handoff, including current design, exact editorial direction,
file map, verification, remaining decisions, and next steps, is the
[preview branch's RESUME.md](https://github.com/bwuebben/bwuebben.github.io/blob/preview/site-direction-2026-10-25/RESUME.md).

For a new, separate checkout, run from your preferred parent directory:

```sh
git clone --branch preview/site-direction-2026-10-25 https://github.com/bwuebben/bwuebben.github.io.git bwuebben-site-preview
cd bwuebben-site-preview
cat RESUME.md
python3 tools/serve-preview.py
```

Open <http://127.0.0.1:8766/> and <http://127.0.0.1:8766/review/>. Python 3 is
sufficient to view the committed pages. Node.js is needed only for the JavaScript
checks. The full preview does not require the research monorepo to run.

If you already have a clean website clone, fetch origin and use a separate
worktree for the remote preview branch. Do not overwrite local work or assume
the original machine's worktree paths exist. The detailed handoff gives commands.

## Other pending work

Read [TODO.md](TODO.md) and briefly remind Bernd of the publication/discoverability
backlog, then follow his current request. Zenodo visibility, remaining archive
coverage, Scholar inclusion, six missing public SSRN PDF mirrors, and Search
Console follow-up remain open; ORCID verification is an ongoing release task.
The matching TODO changes are also being committed in `papers_ai_1` on `main`.

This main-branch handoff changes documentation only. The deployed HTML, CSS,
JavaScript, paper records, PDFs, and sitemap remain at the public design based on
`8931bcd957786ef8e8c94c34cf804353a714b89a`.
