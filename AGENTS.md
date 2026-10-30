# Component changes

- Read `docs/styling.md` and `docs/verification.md` before adding a component.
- Add the public export, comparison story, applicable behaviour contracts, and installed-package type examples together. A screenshot alone is not behaviour coverage.
- Run `npm run verify` before committing. Report failed or unavailable checks accurately; do not claim hosted CI ran from local results.
- Do not remove assertions, skip tests, broaden exceptions, or update screenshot baselines merely to make a failure pass. Establish whether the implementation or the expectation is wrong first.
- Identify changes to verification scripts, tests, baselines, lint configuration, and workflows in the completion report. These changes require independent review, including confirmation that an appropriate deliberate defect still fails the affected check.
- Screenshot updates are deliberate design changes. Inspect changed images before committing them.
- Keep consumer styles and native props supported. Avoid app routes, backend clients, or product-specific state in library components.
