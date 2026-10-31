# Changelog

## Unreleased

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
