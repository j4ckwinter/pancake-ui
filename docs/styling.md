# Component styling

Pancake UI uses shared tokens and namespaced component styles. New components should fit the existing spacing, typography, and interaction patterns. These rules apply to the library's defaults; applications can still override `style`, `className`, and theme variables.

## Source organisation

- `src/components/<component-or-family>/`: one public component per matching TSX file, with adjacent props, private helpers and component/family CSS. Small shared implementation modules use explicit filenames such as `layout.shared.ts`.
- `src/foundations/`: tokens, the token-name rule shared with the theme generator, generated theme CSS and font declarations.
- `src/stories/`: catalogue/foundation stories, the comparison page, and contract fixtures. Form fixtures own shared submission/reset state; feedback and presentation fixtures own their separate responsibilities.
- `src/index.ts`: the only public barrel. `src/styles.css`: the compiled stylesheet entry. Public package imports stay unchanged.
- `scripts/style/`: styling policy, exact exceptions, theme data, and AST resolution helpers. `scripts/style-css.mjs` and `scripts/style-tsx.mjs` remain the checker entry points.

`npm run check:structure` enforces source placement, one public component per TSX file, and dependency direction. Runtime code cannot depend on stories, tests, examples, or the public barrel; foundations cannot depend on components. ESLint limits runtime source files to 180 nonblank, noncomment lines. This is a backstop for review, not a reason to scatter one coherent operation across tiny helpers. Stories and declarative token/policy tables are not subject to that runtime limit.

`npm run test:structure` proves those rules reject representative violations. Both commands run in `verify`. Reorganisations must preserve exports, CSS order, story IDs and screenshot baselines; do not regenerate images to accommodate a file move.

## Choose values by their role

- Use `src/foundations/tokens.ts` as the source of design values and CSS variables in component styles. Run `npm run tokens` after changing tokens. Do not edit the generated `src/foundations/theme.css`. The `sizing` tokens hold fixed UI geometry on the shared four-point grid.
- The defaults are compact: 14px text on 20px lines, 36px buttons, menu items and tabs, and 40px fields. Use 4px between a label or supporting text and its control, 8px between a control and its inline label, 16px for ordinary vertical composition, and 16px for surface padding. Use `Stack`, `Inline`, and `Text` when composing components. Choose another existing spacing token when the composition calls for it.
- Preserve component-family sizing: buttons use 32px, 36px, or 40px minimum heights with 12px inline padding (16px at 40px) and size to their content. Icon buttons are squares of the same heights with a 20px icon box. Fields (including Select) use 40px, segments 32px inside a 40px control, checkboxes 20px within a 24px label row, status chips 24px, and notification dismiss targets 32px. These are current defaults, not a requirement to force every control to one height. New families need an explicit sizing choice in review.
- Numeric and temporal TextField modes retain native browser controls within the 40px field family. FileField uses the same field shell and native file selector, with token-based button padding and typography.
- Textarea uses the field styles with four native text rows by default and vertical resizing; Select retains native selection with a decorative chevron and a 40px minimum height.
- Table uses body typography, 8px by 12px cell padding and a 112px minimum cell content width inside a keyboard-scrollable wrapper. This keeps embedded controls and status labels readable; narrow layouts scroll instead of compressing columns into letter fragments. Pagination uses the 32px button family, 4px gaps, wrapping and shared current/focus states.
- Tooltip reuses native Popover anchoring with caption typography, 4px by 8px padding and an 8px radius. It inverts the page colours, `ink` behind `surface` text, so it stands apart from whatever it covers in either theme. Its trigger retains the original component styling.
- DropdownMenu reuses Popover anchoring, with 4px panel padding, a 12px panel radius, 36px minimum item heights and shared focus/disabled tokens. Long labels wrap within the panel.
- Popover uses a 320px width token, 16px padding, 16px radius and 8px anchor spacing. Native CSS anchor positioning chooses the side with more room; viewport constraints and overflow scrolling keep long content reachable.
- List rows are at least 48px tall with a 12px gap between leading content, text and trailing content; descriptions and menu text lines use the caption role in secondary text. Dialog actions sit 8px apart. Menu radio items reserve a 16px check-mark box at the end, and item descriptions use the caption role.
- Dialog uses a 480px maximum-width sizing token, 20px surface padding, 16px radius, a 32px close button, and a dedicated 50% backdrop-opacity token. Viewport margins and scrolling keep content reachable on narrow screens.
- RadioGroup uses 16px styled native radio inputs within 28px rows, with caption-sized option descriptions. Its outline applies on focus, including pointer focus, to retain a visible indicator during WebKit native arrow navigation. Switch uses a 40px by 24px track and a 16px thumb, with the existing focus and disabled tokens.
- Progress retains the native browser bar at an 8px height with a deep accent and a 4px label gap. LoadingIndicator uses static 4px decorative dots, body typography and an 8px text gap; status feedback does not depend on animation.
- Tabs use 36px minimum button heights with an 8px radius and the shared focus/selection tokens. Disclosure uses a native summary marker, 8px by 12px summary padding and a 12px radius.
- Choose a typography role instead of assigning separate font metrics. Line heights sit on a four-point grid: 12px text on 16px lines, 14px on 20px, 18px on 24px, 20px on 28px, 24px on 32px, and 28px on 36px.
- Use existing radius roles: pill shapes for buttons and chips, 4px for checkboxes, 8px for fields, tabs, and menu items, 12px for menus, banners, and disclosures, and 16px for surfaces. Other established components can use their existing radius tokens.
- Form controls and Disclosure use the olive `controlFocus` outline; other focus outlines use `deep`. Both use 2px width. Buttons and checkboxes use a 4px offset; other existing interactive controls use 2px. The lime `focusRing` token currently accents the focused input border, not its outline.
- Text and marks on the lime accent (primary buttons, the current navigation item, completed steps, and checked checkboxes, radios and switches) use `onAccent`, which stays dark in both themes. Everything else follows the theme. `scripts/style-palette.test.mjs` holds the contrast pairs each palette must pass.
- Disabled controls use the shared disabled opacity, 0.5: faded enough to read as unavailable, still legible. Preserve native disabled behaviour and visible keyboard focus.

- Dialogs, popovers, menus and tooltips share the `shadowOverlay` elevation, which is deeper in the dark theme where a light shadow would not show.
- Motion uses the `motion` tokens: `durationFast` for colour and press feedback on controls, `durationBase` for overlays entering and leaving, one shared easing, a 0.97 press scale on buttons, and a 0.96 entry scale on dialogs. Popovers, menus and tooltips only fade: scaling them would briefly pull their edge away from the trigger and break the hover path between the two. `reducedMotion` sets the durations to zero and both scales to 1 when the visitor prefers reduced motion. Animate only colour, opacity, scale and the switch thumb; nothing a component shows depends on an animation finishing.

These are the current defaults. Changing them is a design change and should include before/after visual review.

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

The checked-in baselines were generated with the locked Playwright Chromium on macOS 27 ARM64, using bundled Inter fonts. The visual project pins `en-GB` locale for native date/time and file-control labels. CI uses GitHub’s [`xcode-27` macOS ARM64 runner](https://docs.github.com/en/actions/reference/runners/github-hosted-runners). [Playwright snapshots vary by operating system](https://playwright.dev/docs/test-snapshots), so Linux and Windows need separately generated and reviewed baselines; no platform is silently skipped. Hosted CI has not yet been exercised for these initial baselines, and even macOS runner updates can require reviewing rendering differences. Keep the browser dependency pinned and use the same environment when updating snapshots.

The workspace registers `@apply` and `@theme` through `.vscode/tailwind.css-data.json` for VS Code-compatible CSS validation. Unknown at-rule diagnostics remain enabled. Reload the editor window if it has not picked up `.vscode/settings.json`.

### Borders and navigation spacing

Use soft fills for button hover and the border token for decorative panel edges and table dividers. Selected segments use a label underline as well as a fill. Tabs sit on the surface without a fill; the selected tab takes the muted fill and full-strength text, a hovered unselected tab the lighter canvas fill, and gains a label underline in forced colours, where fills are dropped, so selection stays distinct from keyboard focus. Vertical tabs align their labels to the start. Preserve focus outlines and form-control boundaries.

Bottom navigation sizes to its contents: 4px list padding surrounds links with a minimum 40px target height. Links fill their row when icons or wrapping labels make neighbouring items taller; do not add a fixed list minimum height.

Form controls share the olive `controlBorder` token for their default boundaries. Keep it distinct from the faint decorative `border` token. Invalid fields use `errorStrong` with the existing thicker border and error message. Checkbox, radio and switch selection retains a checkmark, dot or thumb position as well as the lime fill; forced-colour mode restores native rendering.
