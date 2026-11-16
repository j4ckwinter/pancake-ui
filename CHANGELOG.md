# Changelog

## 0.4.0

- `DropdownMenu` items can be `{ type: "radio", checked }` for picking one option, such as a model. They use the menu radio role and show a check mark beside the chosen item rather than a form radio button. Action, link and radio items take an optional `description` shown as a second line.
- Menu items lay out their label and description in a row, so long labels still wrap. `DropdownMenuItem` is now exported from its own module; the import from the package is unchanged. Code that switches exhaustively over `item.type` needs a `"radio"` case.

## 0.3.0

- Add `List` and `ListItem` for settings, people and status rows. `List` sets an explicit list role so Safari keeps announcing it without bullets. A row takes a `title`, an optional `description`, `leading` content such as an avatar, and `trailing` content such as a value or a button.
- Add `DialogActions` for the buttons at the end of a dialog. Buttons line up at the end in source order and wrap on narrow screens.
- `DropdownMenu` takes an `icon` to show on its trigger instead of the label, which becomes the trigger's accessible name. Items can be `{ type: "text" }` lines, such as the signed-in account. They describe the menu to assistive technology, and keyboard navigation and typeahead skip them. A menu with only text lines has a disabled trigger.

## 0.2.1

- Quieter tabs. Unselected tabs have no fill and secondary text; the selected tab takes the muted fill and full-strength text instead of the accent fill and underline. Hovering an unselected tab gives it the lighter canvas fill and full-strength text, so it never looks selected. The underline remains in forced colours, where fills are dropped. Vertical tabs align their labels to the start. No API changes.

## 0.2.0

- Make the defaults compact. Text sits on a four-point line grid: body 14px on 20px lines, `bodyStrong` 14px (was 15px), `caption` 12px on 16px (was 11px), `title` 24px on 32px (was 25px), and every other role's line height moves to the grid. Button text uses `bodyStrong` instead of `label`, and buttons lose their 112px minimum width. Buttons default to 36px, size to their content, and take `size` 32, 36 or 40; the 48px size is removed. Fields are 40px with an 8px radius, checkboxes 20px, radios 16px, switches 40px by 24px, and tabs and menu items 36px.
- Tighten surfaces and overlays: 16px surface and popover padding, a 480px dialog with 20px padding and a 32px close button, smaller banners, chips, table cells, pagination and bottom navigation.
- Breaking: `size={48}` on `Button`, `ButtonLink` and `IconButton` no longer type-checks. Use 40 for the largest size.

## 0.1.2

- No component API or behaviour changes. Remove a Pagination hover rule that had nothing left to cancel, and drop the `Progress` and `sizing` doc comments from the type declarations; the guides carry those notes.
- Give repeated rules one owner inside the library: field descriptions and their ARIA wiring, token-name to CSS-variable naming, the font family, menu typeahead timing, and the tooltip hide delay.
- Give the test servers, story URLs and WebKit tab key one owner in the browser suite, and type through the keyboard in the TextField keyboard contract test.
- Report only a missing Storybook build as missing in the story checks, share symbol discovery between the story and comparison gates, and make the contract-gate tests fail for the rules they name.
- Add commands, an owners table, standards and commit rules to the contributor instructions.

## 0.1.1

- Clarify registry installation and the first trusted-publisher release deadline.
- Validate GitHub trusted publishing using the verified package archive. No runtime component changes.

## 0.1.0

- Publish the first npm release as `@jack.winter/pancake-ui@0.1.0`, with MIT code licensing and retained SIL Open Font License notices for Inter. Migrate consumer imports to the scoped name.
- Add a manual trusted-publishing workflow that publishes the exact verified main-branch archive, with source, checksum, package metadata, and license checks.

- Run CI once per PR revision, cancel superseded PR runs, share build outputs across parallel browser jobs, and retain a required gate for all checks.

- Pin the macOS CI locale for native date/time screenshots and await settled Tooltip toggle callbacks in keyboard verification.

- Document installation from verified GitHub Actions package artifacts and upload the tested archive after successful main-branch verification. Add repository metadata for consumers.

- Coordinate form-control borders and focus outlines with olive theme tokens, use a warm invalid-field border, and style native radios to match checkbox and switch selection.

- Soften button hover fills and decorative borders; use underlined selected tabs and segments while retaining keyboard focus indicators.
- Remove unused bottom-navigation height and keep balanced spacing with icons, long labels, and narrow layouts.

- Add dedicated autodocs and state examples for every public component, with source, built-index and browser-rendering gates in verification.

- Add native Table presentation and controlled/link Pagination with responsive, keyboard, compatibility and visual coverage.

- Add text-only Tooltip descriptions for existing focusable controls, with keyboard, pointer, compatibility and visual coverage.

- Add DropdownMenu actions and native links with menu keyboard navigation, focus management, compatibility and visual coverage.

- Add native anchored Popover regions with dismissal, focus, positioning, compatibility and visual coverage.
- Prevent Storybook and Playwright accessibility scans from overlapping; verify explicit scans reject an unnamed control.

- Add native numeric/temporal TextField modes and FileField selection with form, compatibility and visual coverage.

- Add labelled native Progress and LoadingIndicator status feedback with behaviour and package verification.

- Add accessible Tabs and native Disclosure with keyboard, state, compatibility and visual verification.

- Add native RadioGroup choices and Switch settings with behaviour, accessibility, visual and installed-package coverage.

- Add a controlled native Dialog with keyboard, focus, lifecycle, visual and hydration verification.

- Add labelled IconButton actions and native ButtonLink navigation with shared button styling and verification.

- Add labelled Textarea and native Select controls with colocated behaviour tests, visual states, and installed-package compatibility coverage.

- Organise runtime components, foundations, and stories into separate directories; extract contract fixtures and checker policy/helpers.
- Enforce source placement, component boundaries, dependency direction, and a runtime-file size budget in verification.

- Require behavioural contracts and accessibility state checks for every public component.
- Verify production builds in Chromium, Firefox, and WebKit with shared browser-error checks and type-aware linting.
- Check installed public types and SSR/hydration against minimum/current React; keep Text’s return declaration compatible with React 19.2 types.
- Add negative verification probes and contributor review rules for test/checker changes.

- Add a shared component comparison story, public-component coverage checks, and desktop/mobile screenshot regression tests.

- Add styling guardrails to verification, with regression tests and component styling guidance.

- Reframe documentation, package metadata, stories, and the example around reuse across web apps.
- Document app ownership, theme overrides, and the component contribution workflow.
- Add GitHub Actions verification of builds and the installed package consumer.

## 0.1.0

Initial local archive release candidate. No registry publication.

- React and Tailwind package with TypeScript declarations, compiled styles, theme tokens, and optional licensed Inter fonts.
- Button, TextField, Checkbox, Surface, Stack, Inline, and Text.
- Avatars, status chips, notifications, empty states, headers, navigation, segmented selection, and step progress.
- Web Storybook and a consuming application with package-installation and Chromium behaviour checks.
- Local release command with archive checksum and source-state metadata.
