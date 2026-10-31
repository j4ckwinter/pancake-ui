# Component styling

Pancake UI uses shared tokens and namespaced component styles. New components should fit the existing spacing, typography, and interaction patterns. These rules apply to the library's defaults; applications can still override `style`, `className`, and theme variables.

## Source organisation

- `src/components/<component-or-family>/`: one public component per matching TSX file, with adjacent props, private helpers and component/family CSS. Small shared implementation modules use explicit filenames such as `layout.shared.ts`.
- `src/foundations/`: tokens, generated theme CSS and font declarations.
- `src/stories/`: catalogue/foundation stories, the comparison page, and contract fixtures. Form fixtures own shared submission/reset state; feedback and presentation fixtures own their separate responsibilities.
- `src/index.ts`: the only public barrel. `src/styles.css`: the compiled stylesheet entry. Public package imports stay unchanged.
- `scripts/style/`: styling policy, exact exceptions, theme data, and AST resolution helpers. `scripts/style-css.mjs` and `scripts/style-tsx.mjs` remain the checker entry points.

`npm run check:structure` enforces source placement, one public component per TSX file, and dependency direction. Runtime code cannot depend on stories, tests, examples, or the public barrel; foundations cannot depend on components. ESLint limits runtime source files to 180 nonblank, noncomment lines. This is a backstop for review, not a reason to scatter one coherent operation across tiny helpers. Stories and declarative token/policy tables are not subject to that runtime limit.

`npm run test:structure` proves those rules reject representative violations. Both commands run in `verify`. Reorganisations must preserve exports, CSS order, story IDs and screenshot baselines; do not regenerate images to accommodate a file move.

## Choose values by their role

- Use `src/foundations/tokens.ts` as the source of design values and CSS variables in component styles. Run `npm run tokens` after changing tokens. Do not edit the generated `src/foundations/theme.css`.
- Use 4px for supporting-text spacing, 8px between labels and controls, 16px for ordinary vertical composition, and 24px for surface padding. Use `Stack`, `Inline`, and `Text` when composing components. Choose another existing spacing token when the composition calls for it.
- Preserve component-family sizing: buttons use 40px or 48px minimum heights, fields (including Select) 52px, segments 48px, checkboxes 40px, and notification dismiss targets 44px. These are current defaults, not a requirement to force every control to one height. New families need an explicit sizing choice in review.
- Textarea uses the field styles with four native text rows by default and vertical resizing; Select retains native selection with a decorative chevron and a 52px minimum height.
- Dialog uses a 560px maximum-width sizing token, 24px surface padding, 16px radius, and a dedicated 50% backdrop-opacity token. Viewport margins and scrolling keep content reachable on narrow screens.
- RadioGroup uses 24px native radios within 40px rows. Its outline applies on focus, including pointer focus, to retain a visible indicator during WebKit native arrow navigation. Switch uses a 64px by 40px track and a 24px thumb, with the existing focus and disabled tokens.
- Choose a typography role instead of assigning separate font metrics. The type scale uses proportional line heights; it is not a four-point baseline grid.
- Use existing radius roles: pill shapes for buttons and chips, 12px for fields, and 16px for surfaces. Other established components can use their existing radius tokens.
- Focus outlines use the dark `deep` colour and 2px width. Buttons and checkboxes use a 4px offset; other existing interactive controls use 2px. The lime `focusRing` token currently accents the focused input border, not its outline.
- Disabled controls use the shared disabled opacity. Preserve native disabled behaviour and visible keyboard focus.

These defaults preserve the current appearance. Changing them is a design change and should include before/after visual review.

## Automated checks

Run `npm run check:styles` for source checks, or `npm run verify` for the full suite. Verification also runs the guardrail tests and checks that generated theme CSS is current before the build can regenerate it.

The source checks inspect library CSS and JavaScript/TypeScript beneath `src`, including nested directories. Everything under `src/stories`, the example application, token definitions, font declarations, and generated theme CSS are outside the component-style checks. Theme freshness is checked separately.

Component CSS belongs in `@layer components`. Selectors must remain scoped to `pancake-` classes. Use declared theme variables and supported namespaced Tailwind utilities instead of introducing raw colours, dimensions, typography, or opacity. Library-authored inline styles must follow the same token discipline; passing consumer styles through remains supported.

The checker has narrow, reviewed exceptions for existing accessibility geometry, forced-colour styles, responsive layout thresholds, and optical adjustments. Do not add a blanket exemption for a new component. When a value cannot reasonably use a shared token, add a specific exception with its reason and a test. Reusing a number is not, by itself, a reason to create a new design token.

The CSS checker supports explicit selectors and a defined set of token utilities; CSS nesting and `:is()`/`:where()` selectors are deliberately rejected. Add component styles through local CSS imports in `src/styles.css`.

The checks are static guardrails, not a general evaluator of arbitrary JavaScript or CSS. The TypeScript check follows local style objects and props bags, but does not trace arbitrary function calls or aliases of `createElement`. Prefer straightforward token-based styles that can be inspected. An unsupported expression should be simplified or explicitly supported by the checker with regression coverage.

See [verification and behaviour contracts](verification.md) for required interaction coverage, accessibility states, type checks, and compatibility tests.

## Review a new component

Show the component alongside existing components in Storybook. Check its default, focus, disabled, error, and loading states where applicable, with long content and a narrow viewport. Use the library styles without example-app global heading or paragraph overrides when judging the defaults.

Check whether related elements have consistent spacing and whether the component fits the established typography and control sizes. Automated checks can reject an arbitrary `13px` padding value; they cannot decide whether 12px or 16px is the better choice. The `Foundations/Comparison` story is the visual reference. It imports only library components and bundled fonts, without the example app’s styles. It covers default, disabled, loading, error, and long-content states. Browser tests capture the catalogue and focused actions/fields at 1100px and 375px viewport widths.

`npm run check:comparison` discovers public uppercase callable or constructable exports through `src/index.ts` and requires actual JSX usage imported through that entry point in `src/stories/comparison/Comparison.stories.tsx`. Add a `data-component="ExportName"` marker to the rendered component or its wrapper so the browser test also verifies it is visible. Imports alone do not count. Function and class components are covered, including components authored with `createElement` in `.ts` files. Reserve uppercase callable exports for components; other component representations require extending this check before exporting them.

## Screenshot regression workflow

`npm run verify` runs coverage checks and screenshot comparisons alongside the existing browser tests. Missing baselines and visual differences fail; ordinary verification never creates or updates a baseline.

To inspect the story, run `npm run storybook` and open **Foundations → Comparison → Catalogue**. To run only the visual checks after building Storybook:

```sh
npm run storybook:build
npm run test:visual
```

For an intentional visual change, update the snapshots explicitly:

```sh
npm run test:visual:update
```

Inspect every changed image in `tests/visual.spec.ts-snapshots/` and review the Storybook composition before committing those images with the component change. Do not regenerate snapshots simply to make CI pass. Failures put expected, actual, and diff images in `test-results/`; CI uploads that directory.

The checked-in baselines were generated with the locked Playwright Chromium on macOS 27 ARM64, using bundled Inter fonts. CI uses GitHub’s [`xcode-27` macOS ARM64 runner](https://docs.github.com/en/actions/reference/runners/github-hosted-runners). [Playwright snapshots vary by operating system](https://playwright.dev/docs/test-snapshots), so Linux and Windows need separately generated and reviewed baselines; no platform is silently skipped. Hosted CI has not yet been exercised for these initial baselines, and even macOS runner updates can require reviewing rendering differences. Keep the browser dependency pinned and use the same environment when updating snapshots.

The workspace registers `@apply` and `@theme` through `.vscode/tailwind.css-data.json` for VS Code-compatible CSS validation. Unknown at-rule diagnostics remain enabled. Reload the editor window if it has not picked up `.vscode/settings.json`.
