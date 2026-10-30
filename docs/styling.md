# Component styling

Pancake UI uses shared tokens and namespaced component styles. New components should fit the existing spacing, typography, and interaction patterns. These rules apply to the library's defaults; applications can still override `style`, `className`, and theme variables.

## Choose values by their role

- Use `src/tokens.ts` as the source of design values and CSS variables in component styles. Run `npm run tokens` after changing tokens. Do not edit the generated `src/theme.css`.
- Use 4px for supporting-text spacing, 8px between labels and controls, 16px for ordinary vertical composition, and 24px for surface padding. Use `Stack`, `Inline`, and `Text` when composing components. Choose another existing spacing token when the composition calls for it.
- Preserve component-family sizing: buttons use 40px or 48px minimum heights, fields 52px, segments 48px, checkboxes 40px, and notification dismiss targets 44px. These are current defaults, not a requirement to force every control to one height. New families need an explicit sizing choice in review.
- Choose a typography role instead of assigning separate font metrics. The type scale uses proportional line heights; it is not a four-point baseline grid.
- Use existing radius roles: pill shapes for buttons and chips, 12px for fields, and 16px for surfaces. Other established components can use their existing radius tokens.
- Focus outlines use the dark `deep` colour and 2px width. Buttons and checkboxes use a 4px offset; other existing interactive controls use 2px. The lime `focusRing` token currently accents the focused input border, not its outline.
- Disabled controls use the shared disabled opacity. Preserve native disabled behaviour and visible keyboard focus.

These defaults preserve the current appearance. Changing them is a design change and should include before/after visual review.

## Automated checks

Run `npm run check:styles` for source checks, or `npm run verify` for the full suite. Verification also runs the guardrail tests and checks that generated theme CSS is current before the build can regenerate it.

The source checks inspect library CSS and JavaScript/TypeScript beneath `src`, including nested directories. Stories, the example application, token definitions, font declarations, and generated theme CSS are outside the component-style checks. Theme freshness is checked separately.

Component CSS belongs in `@layer components`. Selectors must remain scoped to `pancake-` classes. Use declared theme variables and supported namespaced Tailwind utilities instead of introducing raw colours, dimensions, typography, or opacity. Library-authored inline styles must follow the same token discipline; passing consumer styles through remains supported.

The checker has narrow, reviewed exceptions for existing accessibility geometry, forced-colour styles, responsive layout thresholds, and optical adjustments. Do not add a blanket exemption for a new component. When a value cannot reasonably use a shared token, add a specific exception with its reason and a test. Reusing a number is not, by itself, a reason to create a new design token.

The CSS checker supports explicit selectors and a defined set of token utilities; CSS nesting and `:is()`/`:where()` selectors are deliberately rejected. Add component styles through local CSS imports in `src/styles.css`.

The checks are static guardrails, not a general evaluator of arbitrary JavaScript or CSS. The TypeScript check follows local style objects and props bags, but does not trace arbitrary function calls or aliases of `createElement`. Prefer straightforward token-based styles that can be inspected. An unsupported expression should be simplified or explicitly supported by the checker with regression coverage.

See [verification and behaviour contracts](verification.md) for required interaction coverage, accessibility states, type checks, and compatibility tests.

## Review a new component

Show the component alongside existing components in Storybook. Check its default, focus, disabled, error, and loading states where applicable, with long content and a narrow viewport. Use the library styles without example-app global heading or paragraph overrides when judging the defaults.

Check whether related elements have consistent spacing and whether the component fits the established typography and control sizes. Automated checks can reject an arbitrary `13px` padding value; they cannot decide whether 12px or 16px is the better choice. The `Foundations/Comparison` story is the visual reference. It imports only library components and bundled fonts, without the example app’s styles. It covers default, disabled, loading, error, and long-content states. Browser tests capture the catalogue and focused actions/fields at 1100px and 375px viewport widths.

`npm run check:comparison` discovers public uppercase callable or constructable exports through `src/index.ts` and requires actual JSX usage imported through that entry point in `src/Comparison.stories.tsx`. Add a `data-component="ExportName"` marker to the rendered component or its wrapper so the browser test also verifies it is visible. Imports alone do not count. Function and class components are covered, including components authored with `createElement` in `.ts` files. Reserve uppercase callable exports for components; other component representations require extending this check before exporting them.

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
