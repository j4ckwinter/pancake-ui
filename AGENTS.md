# Component changes

- Keep runtime components under `src/components`, design tokens under `src/foundations`, and all Storybook stories/fixtures under `src/stories`. Only `src/index.ts` and `src/styles.css` belong directly in `src/`.
- Colocate component behaviour tests as `<Component>.spec.ts` beside the implementation. Keep shared fixtures and cross-component suites in `tests/`. Runtime modules must never import specs.
- Use one named public component per matching TSX file. Keep its props and small private helpers local. Use direct internal imports; do not import the public barrel from runtime components or add nested barrels.
- Runtime source has a 180-line lint budget (excluding comments/blank lines). Extract a cohesive responsibility when it grows; do not move arbitrary lines into pass-through helpers or disable the limit to satisfy it.
- Keep checker policy and exceptions under `scripts/style`; parser helpers and rule evaluation have separate owners.

- Read `docs/styling.md` and `docs/verification.md` before adding a component.
- Add the public export, dedicated component stories, comparison story, applicable behaviour contracts, and installed-package type examples together. A screenshot alone is not behaviour coverage.
- Every public component needs `src/stories/catalogue/<Component>.stories.tsx` with its matching public-import `component`, a title ending in the component name, `autodocs`, `Default`, and meaningful named state/variant/composition examples. Forward args so controls work; make stateful examples interactive. Group and contract stories do not substitute. `check:stories` and `check:stories:built` enforce source and built entries; browser tests render every dedicated example and docs page.
- Run `npm run verify` before committing. Report failed or unavailable checks accurately; do not claim hosted CI ran from local results.
- Do not remove assertions, skip tests, broaden exceptions, or update screenshot baselines merely to make a failure pass. Establish whether the implementation or the expectation is wrong first.
- Identify changes to verification scripts, tests, baselines, lint configuration, and workflows in the completion report. These changes require independent review, including confirmation that an appropriate deliberate defect still fails the affected check.
- Screenshot updates are deliberate design changes. Inspect changed images before committing them.
- Keep consumer styles and native props supported. Avoid app routes, backend clients, or product-specific state in library components.
