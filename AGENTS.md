# Working on Pancake UI

Pancake UI is a React component library published to npm as `@jack.winter/pancake-ui`. Read `docs/styling.md` and `docs/verification.md` before adding a component, and `docs/installation.md` before a release.

## Commands

Use Node 22.18 or newer. Run these from the repository root.

| Command                                          | What it does                                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `npm ci`                                         | Installs the locked dependencies.                                                                 |
| `npx playwright install chromium firefox webkit` | Installs the browsers the suite needs.                                                            |
| `npm run verify`                                 | Runs the source checks, then builds, packs, and runs the browser suite. Run it before committing. |
| `npm run check:source`                           | Formatting, types, lint, and every source gate with its own tests. No build or browser.           |
| `npm run format`                                 | Applies Prettier.                                                                                 |
| `npm run tokens`                                 | Regenerates `src/foundations/theme.css` from the tokens.                                          |
| `npm run storybook`                              | Serves the stories on port 6006.                                                                  |
| `npm run example`                                | Builds the library and serves the consuming example app.                                          |
| `npm run test:visual:update`                     | Rewrites the screenshot baselines. Only for a deliberate design change.                           |
| `npm run release:local`                          | Runs `verify` and writes a checked archive to `artifacts/`. It publishes nothing.                 |

`docs/verification.md` lists the focused commands and what each gate proves.

## Owners

Each decision has one owner. Put new code with the owner of the decision it makes, and update this table in the change that adds or moves one.

| Decision                                                   | Owner                                                                       |
| ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| Design values: colour, spacing, sizing, radius, type, font | `src/foundations/tokens.ts`                                                 |
| How a token name becomes a CSS variable name               | `src/foundations/kebab.ts`, applied by `scripts/generate-theme.mjs`         |
| The public API                                             | `src/index.ts`                                                              |
| The stylesheet entry and CSS order                         | `src/styles.css`                                                            |
| A component's markup, props, and behaviour                 | `src/components/<family>/<Component>.tsx`                                   |
| A field's description, error state, and ARIA wiring        | `src/components/TextField/field.shared.ts`                                  |
| Layout alignment and spacing values                        | `src/components/layout/layout.shared.ts`                                    |
| Menu keyboard navigation and typeahead                     | `src/components/DropdownMenu/menuKeyboard.ts`                               |
| Tooltip show and hide timing                               | `src/components/Tooltip/useTooltip.ts`                                      |
| Which page numbers pagination lists                        | `src/components/Pagination/paginationPages.ts`                              |
| Styling policy and its reviewed exceptions                 | `scripts/style/`                                                            |
| Source placement and dependency direction                  | `scripts/check-structure.mjs`                                               |
| Which exports count as public components                   | `scripts/check-comparison.mjs`, reused by the story and contract gates      |
| Which behaviours each component must prove                 | `tests/component-contracts.json`, enforced by `scripts/check-contracts.mjs` |
| Test server origins, ports, and story URLs                 | `tests/servers.ts`                                                          |
| Browser error policy and the tab keys tests press          | `tests/fixtures.ts`                                                         |
| Contract story setup and the negative-probe helpers        | `tests/contracts-fixture.ts`                                                |
| What the published archive must contain                    | `scripts/validate-archive.mjs`                                              |
| What may be published, and from which run                  | `scripts/publish-source.mjs`, `scripts/publish-artifact.mjs`                |
| CI job wiring and the required result                      | `.github/workflows/verify.yml`, `scripts/check-ci-results.mjs`              |
| The runtime line budget and banned test modifiers          | `eslint.config.js`                                                          |

## Standards

- State each fact, threshold, and rule once, give it a name, and refer to it from everywhere else. Do not merge code only because it looks alike; wait for a third case that would change with the others.
- Separate deciding from doing. Helpers that decide take values and return values. Pass time in: `menuKeyboard` takes its clock as an argument.
- Name things for what they mean to the caller. Keep a function to one job. Give a number that tunes behaviour a name and one home.
- Make the simplest change that meets the outcome. Add an abstraction only when it removes real duplication or protects an invariant that exists today.
- Choose types that cannot hold an invalid state. A component with distinct modes takes a discriminated union, as `Pagination` and `Disclosure` do.
- Delete code that nothing uses. Leave no commented-out code, debug switches, or TODO notes.
- Handle a failure where something can be done about it. Do not swallow an error the caller needs.
- Leave comments out. Name the condition or extract the function instead. A comment stays only when it stops a plausible wrong fix and nothing in the code can carry the reason. The `@ts-expect-error` reasons in `compatibility/types.tsx` are required.
- Add or update a test with every change to behaviour, and name it for the behaviour it checks. When a new test passes the first time, break the code briefly to confirm it can fail.
- Make a file split or other refactor its own commit with no behaviour change.

## Conventions

- Keep runtime components under `src/components`, design tokens under `src/foundations`, and all Storybook stories and fixtures under `src/stories`. Only `src/index.ts` and `src/styles.css` belong directly in `src/`.
- Use one named public component per matching TSX file. Keep its props and small private helpers local. Shared implementation modules use a lowercase `.shared.ts` or helper filename. Use direct internal imports; do not import the public barrel from runtime components or add nested barrels.
- Runtime source has a 180-line lint budget, excluding comments and blank lines. Extract a cohesive responsibility when a file grows; do not move arbitrary lines into pass-through helpers or disable the limit to satisfy it.
- Token values are numbers in pixels unless the token says otherwise. Class names start with `pancake-`. The style checker reads `className` and `style` statically, so write class names as literals or templates in the component, not through a helper call.
- Keep consumer styles and native props supported. Avoid app routes, backend clients, or product-specific state in library components.
- Colocate component behaviour tests as `<Component>.spec.ts` beside the implementation. Keep shared fixtures and cross-component suites in `tests/`. Runtime modules must never import specs. Specs import `test` from the shared fixtures and title each test `<Component>: <behaviours>`.
- Keep checker policy and exceptions under `scripts/style`; parser helpers and rule evaluation have separate owners.

## Component changes

- Add the public export, dedicated component stories, comparison story, applicable behaviour contracts, and installed-package type examples together. A screenshot alone is not behaviour coverage.
- Every public component needs `src/stories/catalogue/<Component>.stories.tsx` with its matching public-import `component`, a title ending in the component name, `autodocs`, `Default`, and meaningful named state, variant, or composition examples. Forward args so controls work; make stateful examples interactive. Group and contract stories do not substitute. `check:stories` and `check:stories:built` enforce source and built entries; browser tests render every dedicated example and docs page.
- Do not remove assertions, skip tests, broaden exceptions, or update screenshot baselines merely to make a failure pass. Establish whether the implementation or the expectation is wrong first.
- Identify changes to verification scripts, tests, baselines, lint configuration, and workflows in the completion report. These changes require independent review, including confirmation that an appropriate deliberate defect still fails the affected check.
- Screenshot updates are deliberate design changes. Inspect changed images before committing them.

## Committing and releasing

- Commit on a branch when the task asks for a change. `main` accepts changes only through a pull request with a passing `verify` check.
- Run `npm run verify` before committing. Report failed or unavailable checks accurately; do not claim hosted CI ran from local results.
- Use Conventional Commits: `type(scope): summary`, one logical change per commit. Do not add `Co-Authored-By` trailers or any line crediting an AI tool.
- These need Jack's request: pushing a branch, opening or merging a pull request, changing the version, dispatching the Publish workflow, and updating screenshot baselines.
- A release follows `docs/installation.md`: bump the version, update `CHANGELOG.md`, merge, wait for Verify on `main`, then dispatch Publish with that run's ID. Published versions cannot be changed.
