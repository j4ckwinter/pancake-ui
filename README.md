# Pancake UI

React and Tailwind foundations extracted from Padel Potato. Stage 3 adds reusable identity, feedback, navigation, progress, and layout components alongside Button, TextField, and Checkbox.

## Development

Use Node 22.18+ and npm. Run `npm ci`, then `npm run build`.

- `npm run storybook`: web component catalogue on port 6006.
- `npm run example`: build and launch the consuming application.
- `npx playwright install chromium`: install the browser required for verification.
- `npm run verify`: formatting, types, lint, package and Storybook builds, installation of a tarball into an isolated consumer, and browser checks.

The lockfile pins development dependencies. Storybook packages use the same exact version.

## Consume the package

The package is private and unpublished. Run `npm run build` then `npm pack`; install the resulting archive in another React 19 application with `npm install /path/to/pancake-ui-0.1.0.tgz`.

```tsx
import { Surface, colors } from "pancake-ui";
import "pancake-ui/styles.css";
import "pancake-ui/fonts.css"; // Optional bundled Inter fonts.

export function Example() {
  return <Surface style={{ color: colors.ink }}>Your next project</Surface>;
}
```

Exports include `Surface`, `Button`, `TextField`, `Checkbox`, and typed colour, spacing, sizing, radius, border, opacity, and typography tokens. Components accept native element props and React 19 refs. This is an ESM package. React and React DOM are peers and are excluded from the bundle. Consumers do not need Tailwind to use the compiled CSS. The stylesheet does not install a global reset.

For a Tailwind 4 application, import `pancake-ui/theme.css` into its Tailwind stylesheet to enable namespaced utilities such as `bg-pancake-accent`, `p-pancake-24`, and `text-pancake-body`. Continue importing `pancake-ui/styles.css` for component styles. Override the generated CSS custom properties after the library stylesheet to customise a theme.

Edit `src/tokens.ts`, then run `npm run tokens`. `src/theme.css` is generated; the build refreshes it. Fonts retain the SIL Open Font License in `assets/fonts/OFL.txt` and the distributed fonts directory. Project code licensing and a registry destination must be chosen before publication.

These first controls use native HTML semantics and namespaced component classes authored with Tailwind. No runtime dependencies beyond React peers are needed. Base UI and variant helpers can be introduced when a more complex control needs them. Routing, backend services, and application state belong to consuming applications.

`npm run test:package` expects an existing package and Storybook build. It creates ignored `artifacts/` and `.tmp/consumer/` directories. Browser checks currently target Chromium; Firefox, WebKit, and component interaction coverage are future work.

## Controls

```tsx
import { Button, Checkbox, TextField } from "pancake-ui";

<form onSubmit={handleSubmit}>
  <TextField
    label="Your name"
    name="name"
    required
    helperText="Your display name."
  />
  <Checkbox label="Send updates" name="updates" value="yes" />
  <Button type="submit">Save preferences</Button>
</form>;
```

`Button` defaults to `type="button"` to prevent accidental form submission. Its `variant` is `primary`, `secondary`, `destructive`, or `ghost`; `size` is 40 or 48. `loading` sets `aria-busy` and disables activation while preserving the label. All variants support disabled/loading states and both sizes.

`TextField` requires a visible `label`; supports text, email, password, search, tel, and URL inputs; and uses ordinary `value`/`defaultValue` and `onChange` props. `helperText` and `error` link to the input's accessible description. An error sets `aria-invalid`; application validation remains the caller's responsibility. `className` and `ref` target the input. Password visibility toggles and explicit search-clear actions are outside this first slice.

`Checkbox` requires a visible `label`. Use `checked` and `onCheckedChange` for controlled state, or `defaultChecked` for uncontrolled state. Native `onChange` remains available and runs before `onCheckedChange`. Native form reset applies to uncontrolled inputs; controlled state must be reset by the application. `className` and `ref` target the checkbox input.

The sample form verifies submission, required fields, custom errors, keyboard focus, controlled and uncontrolled checkboxes, and loading/disabled states. Browser focus outlines and input borders use darker existing tokens for contrast. The port retains the original palette and dimensions; it does not claim pixel parity with native rendering.

## Reusable catalogue

| Area                  | Components                                                           |
| --------------------- | -------------------------------------------------------------------- |
| Layout and typography | `Stack`, `Inline`, `Text`, `Surface`                                 |
| Identity              | `Avatar`, `AvatarGroup`                                              |
| Status and feedback   | `StatusChip`, `BannerToast`, `EmptyState`                            |
| Navigation            | `AppHeader`, `SectionHeader`, `BottomNavigation`, `SegmentedControl` |
| Progress              | `StepProgress`                                                       |

`Stack` and `Inline` accept spacing token names (`gap="space24"`), alignment, padding, and native div props. Inline wraps by default. `Text` accepts a typography `variant`, colour token, and an `as` tag for semantic headings or paragraphs. Layout and text reference CSS variables so local themes apply.

`Avatar` requires a name, accepts an optional image `src`, and falls back to initials after a failed image. Changing `src` retries the image. Use `decorative` when adjacent text already supplies the name. `AvatarGroup` accepts `{ id, name, src? }` items and a positive integer `max`; hidden identities are named on the overflow indicator.

`StatusChip` tones are neutral, success, warning, danger, and info. `BannerToast` accepts a title, children, an optional `onDismiss`, and success/warning/error/info tones. Error notifications use an alert; other tones use a polite status. Applications own notification timing and dismissal state. `EmptyState` accepts title, description, optional decorative icon, and action content.

`AppHeader` provides title, description, and leading/trailing slots. `SectionHeader` provides title, description, action, and heading levels 2–4. `BottomNavigation` takes `{ id, label, href, icon? }` items and `activeId`; navigation and active-route state remain with the application. It is in normal document flow rather than fixed to the viewport.

`SegmentedControl` is a labelled selection field, not a tab-panel widget. It accepts `{ value, label, disabled? }` options, native `name`, `disabled`, `required`, and `form` props, plus either `value`/`onValueChange` or `defaultValue`. Native radio keyboard navigation and uncontrolled form reset apply. Controlled selections must be reset by the caller. Use unique values per group and an explicit name for submitted data.

`StepProgress` takes a non-empty list of step labels and zero-based `currentStep`. A value equal to `steps.length` marks all steps complete. The current item exposes `aria-current="step"`.

The example verifies avatar image recovery, notification dismissal, navigation links, selection keyboard behaviour and form reset, progress semantics, and local theme overrides. Padel game cards, score displays, player preferences, photo-picking workflows, and branded artwork remain in Padel Potato. Additional action and specialised field variants are not part of this catalogue slice.
