# Verification and component contracts

Run `npm ci`, then `npx playwright install chromium firefox webkit`, then `npm run verify`. Verification builds the package and Storybook, installs the archive into consumers, and runs production-browser tests. The macOS CI runner sets `AppleLocale=en_GB` and `AppleLanguages=en-GB` before starting browsers because native date/time formatting also depends on OS preferences; Playwright locale alone is insufficient. Screenshot baselines remain specific to macOS Chromium; see [styling.md](styling.md) before updating them.

## Required evidence for a new component

1. Export the component, add dedicated stories as described below, and include it in `src/stories/comparison/Comparison.stories.tsx` with its visibility marker.
2. Add an entry in `tests/component-contracts.json` for semantics, keyboard, state, form behaviour, and refs. Each category points to an assertion-bearing test registered in the matching `src/components/<family>/<Component>.spec.ts`, or gives a reason it does not apply. Semantics always requires a test. The gate rejects missing exports, missing categories, unknown tests, and reuse of tests that do not identify the component.
3. Add interaction/state fixtures in `src/stories/contracts/Contracts.stories.tsx`. Test user-observable behaviour: accessible names and roles, keyboard operation, callbacks firing once, controlled and uncontrolled updates, disabled/loading inactivity, form submission/reset, descriptions, and ref targets as applicable.
4. Add positive and negative public API examples to `compatibility/types.tsx`. These compile against the installed archive with declaration checking enabled. Keep a descriptive `@ts-expect-error` beside each intentionally invalid call; it must fail compilation if the API accidentally starts accepting that call.
5. Run the full suite and inspect visual changes. A contract entry or passing screenshot does not establish that an assertion is meaningful; independent review checks the test's expectations against the component's purpose.

Playwright opens the contract and comparison pages with Storybook’s accessibility addon in manual mode when it owns explicit axe scans. This prevents concurrent scans of the same document; normal Storybook usage retains automatic checks. A deliberate unnamed-button probe verifies that the explicit scanner still detects violations.

The contracts include explicit axe scans of the comparison and interactive states, plus narrow layout, reduced-motion and forced-colour checks. Automated accessibility scans do not establish screen-reader announcements or complete accessibility conformance. Review new interaction patterns with keyboard and assistive technology.

## What verification runs

- Formatting, strict TypeScript, type-aware ESLint for library/tests/configuration (consumer templates receive ordinary lint plus installed-package type checks), style-token checks, and comparison/contract coverage gates.
- Tests of the gates themselves, including rejection of focused/skipped tests, missing contracts, unawaited assertions, and unexpected browser warnings.
- Library and Storybook builds, archive contents, and Tailwind theme integration.
- Installed-package positive and negative type examples with `skipLibCheck: false`.
- React 19.2.0 (the declared minimum) and the pinned development React version, with matching React DOM versions. Each installed version is asserted before checks run.
- Node server rendering without a browser environment, then production hydration of the server markup. Browser tests check stable IDs, accessible descriptions, refs, and interactive updates in both versions. This tests ordinary React SSR/hydration; it does not establish framework-specific RSC or Next.js support.
- Production consumer, behaviour, accessibility, and hydration tests in Chromium, Firefox, and WebKit. Screenshots run only in the canonical Chromium project.

On macOS, the pinned Firefox build uses isolated worker-local application-data directories to avoid its documented app-data launch issue. These directories are removed after browser teardown; user browser settings are not changed.

Component behaviour specs live beside their components. Shared accessibility/probe, visual, installed-package, and hydration suites remain under `tests/`. All browser specs use `tests/fixtures.ts`, directly or through `tests/contracts-fixture.ts` (which opens the contract story before each test). Unexpected page errors and console errors/warnings fail teardown. Intentional negative probes assert that the same behavioural oracles reject broken activation counts, names, and disabled semantics. They do not suppress normal test failures.

Focused tests, skipped tests, and expected-failure tests are prohibited in the verification suites. Retries are disabled, flaky passes fail, and normal runs never update screenshots. A single failed browser or compatibility variant fails the command. Traces and screenshot diffs are retained in `test-results/` for failures.

## Focused commands

```sh
npm run check:contracts
npm run test:contracts
npm run test:verification
# Requires a package build/archive prepared by test:package:
npm run check:compatibility
# After verify has prepared all builds and consumers:
npx playwright test --project=firefox src/components/Button/Button.spec.ts
```

Compatibility consumers live under `.tmp/compatibility/` and are rebuilt for each package verification. Installing their dependencies requires registry access. The production app served by the browser tests lives under `.tmp/consumer/dist/`; the browser is not testing Vite's development transforms.

## Protect the evidence

Changes to tests, checkers, workflow configuration, contract applicability, or screenshot baselines require independent review, as recorded in `AGENTS.md`. Report which expectations changed and why. Demonstrate that an appropriate deliberate defect still fails the affected check. Do not broadly suppress console warnings, accessibility rules, type errors, or screenshot differences to obtain a pass.

Repository instructions are guidance, not a security boundary. GitHub separately requires pull requests and the `verify` status check on `main`, and blocks force pushes/deletion. This solo-maintainer repository does not require an approving GitHub review or latest-push approval; its author can merge once checks pass and discussions are resolved. Independent agent review remains required for the changes described above. Keep verification/baseline changes visible in that review. Local tests cannot enforce GitHub branch settings.

The configured repository is [j4ckwinter/pancake-ui](https://github.com/j4ckwinter/pancake-ui). The main-branch policy is recorded in `.github/main-ruleset.json`: zero required approving reviews, no latest-push approval, resolved discussions, and the GitHub Actions `verify` check on an up-to-date branch. Force pushes and deletion are blocked, with no bypass actors. The [active GitHub ruleset](https://github.com/j4ckwinter/pancake-ui/rules/26247432) was read back on 2026-10-31 after the initial push. Check the [workflow runs](https://github.com/j4ckwinter/pancake-ui/actions/workflows/verify.yml) for current hosted results; a local green run does not establish hosted CI success.

After verification succeeds on a push to `main`, the workflow uploads the tested `.tmp/package` archive and its SHA-256/file manifest as `pancake-ui-package`. It does not rebuild or repack after testing. Pull-request runs and failed verification do not upload a consumer package. Artifacts are retained for 90 days; consuming apps should vendor the archive and commit their lockfile, as described in the README. No npm registry credentials or publication are involved.

## Dedicated component stories

Every public component has its own `src/stories/catalogue/<Component>.stories.tsx`. Use a named import from `src/index.ts`, explicit CSF metadata with the matching `component`, a title ending in the component name, and `tags: ["autodocs"]`. Export a `Default` story object and meaningful named variants, states or compositions. Include relevant disabled, error, loading, controlled and long-content examples. Keep args connected to rendering and provide working stateful interactions. Existing grouped catalogue and comparison stories remain useful alongside these entries.

`npm run check:stories` discovers public component exports using the same TypeScript symbol discovery as comparison coverage. It rejects missing or duplicate dedicated files, metadata for the wrong component, direct implementation imports, missing autodocs, and missing Default or additional examples. Metadata and story exports must use explicit objects; opaque spreads, accessors and computed keys are unsupported. Custom renderers must reference the component in JSX, directly or through local helper functions, so an unused import plus a placeholder renderer does not count. The check follows references rather than executing arbitrary JavaScript: it cannot prove every conditional path or judge whether every useful state is documented, so reviewers still assess the examples.

After a Storybook build, `npm run check:stories:built` requires every declared example and its autodocs page to appear in the generated index under the expected title and source path. This catches excluded stories and changes to Storybook discovery. The browser suite loads every dedicated example and docs page in Chromium, Firefox and WebKit, rejecting empty previews, error pages and unexpected runtime errors. These checks run in `verify`; focused component behavior contracts remain responsible for interaction correctness.

`npm run test:stories` proves the gate rejects representative missing and misleading coverage. Adding a public export without its dedicated story fails automatically; there is no hand-maintained component allowlist.

## CI execution

GitHub runs Verify for pull requests and pushes to `main`, avoiding a second full run for each PR branch push. A newer revision cancels an older run of the same PR. Main-branch runs are not interrupted by newer pushes.

- `checks` runs `npm run check:source` for formatting, types, lint and source/guardrail checks.
- `build` runs `npm run verify:build` and `npm run prepare:tests` once. It builds Storybook, validates the package archive, and prepares the installed consumer and both React compatibility sites.
- Four `browsers` jobs download those exact outputs and run Chromium, Firefox, WebKit and visual projects independently. The Chromium job also runs `test:verification`, including deliberate browser-warning probes. All browser jobs keep the existing macOS runner, native-control locale, two-worker limit and screenshot expectations.
- The required `verify` job runs even when a dependency fails or is skipped. It only passes when `checks`, `build` and every browser matrix job succeeded. A successful main run then makes the tested package downloadable.

The internal build bundle is retained for two days and contains no `node_modules`; each job installs pinned tool dependencies itself. Consumer package downloads remain available for 90 days. `npm run verify` still runs the complete suite locally. `npm run test:ci` tests failure propagation and critical workflow wiring, including deliberate missing-browser and ignored-failure mutations.

The previous successful hosted run took 14.6 minutes, with 10.8 minutes in the browser suite. Parallel jobs are intended to reduce that critical path; a new hosted run is needed to measure the improvement. Queue time and available macOS concurrency can limit the gain.
