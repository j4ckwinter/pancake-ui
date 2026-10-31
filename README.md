# Pancake UI

Reusable React components and design tokens for web apps. Pancake UI includes form controls, layout, typography, navigation, identity, feedback, and progress components, with compiled CSS and optional Inter fonts. Tailwind is optional for consuming apps.

Use the same package across apps and customise its CSS variables for each product. Applications own routing, data fetching, authentication, validation, and business logic.

## Consume the package

The package is private and unpublished. With Node 22.18+ and npm installed, run these commands in this repository:

```sh
npm ci
npx playwright install chromium firefox webkit
npm run release:local
```

Verification builds a candidate under `.tmp/package/`; the release command copies it to `artifacts/` only after all checks pass. The release command produces `artifacts/pancake-ui-0.1.0.tgz`, its `.tgz.sha256` checksum, and `pancake-ui-0.1.0.release.json`. The metadata records the package version, checksum, source commit, whether the working tree had changes, and Node/npm versions. A dirty-tree record means the archive includes work beyond the recorded commit; it is not a claim that the commit alone reproduces the archive.

From the consuming application's root, copy the archive into a stable location and install it:

```sh
mkdir -p vendor
cp /path/to/pancake-ui/artifacts/pancake-ui-0.1.0.tgz vendor/
npm install ./vendor/pancake-ui-0.1.0.tgz
```

Commit `vendor/pancake-ui-0.1.0.tgz`, `package.json`, and the consumer's lockfile together. This keeps the local dependency available after cloning the application. An absolute path to another checkout is convenient for a temporary test but is not portable.

To check a copied archive, copy its `.tgz.sha256` file into the same directory and run `shasum -a 256 -c pancake-ui-0.1.0.tgz.sha256` there. Ordinary `npm pack` also builds the package through `prepack`, but it does not run the complete release verification.

```tsx
import { Button, Stack, Surface, Text } from "pancake-ui";
import "pancake-ui/styles.css";
import "pancake-ui/fonts.css"; // Optional bundled Inter fonts.

export function Example() {
  return (
    <Surface>
      <Stack gap="space16">
        <Text as="h1" variant="title">
          Your next project
        </Text>
        <Text>Build your app with shared components.</Text>
        <Button>Get started</Button>
      </Stack>
    </Surface>
  );
}
```

Exports include `Surface`, `Button`, `TextField`, `Checkbox`, and typed colour, spacing, sizing, radius, border, opacity, and typography tokens. Components accept native element props and React 19 refs. This is an ESM package. React and React DOM are peers and are excluded from the bundle. Consumers do not need Tailwind to use the compiled CSS. The stylesheet does not install a global reset.

## Theming

For an application without Tailwind, import `pancake-ui/styles.css` as shown above. Override its CSS variables in your own stylesheet, loaded afterwards:

```css
:root {
  --color-pancake-accent: #b9e96f;
  --font-pancake: Inter, sans-serif;
}
```

For a Tailwind 4 application, use this in the application's Tailwind stylesheet:

```css
@import "tailwindcss";
@import "pancake-ui/styles.css";
@import "pancake-ui/theme.css";
```

Import that stylesheet once from the application's entry point. The theme enables namespaced utilities such as `bg-pancake-accent`, `p-pancake-24`, and `text-pancake-body`. No scan of the package in `node_modules` is required: component styles already ship compiled. Your own utility classes still need to be included in the consuming application's normal Tailwind source detection. `className` customises the underlying element; it does not perform runtime class-conflict merging.

Edit `src/foundations/tokens.ts`, then run `npm run tokens`. `src/foundations/theme.css` is generated; the build refreshes it. Fonts retain the SIL Open Font License in `assets/fonts/OFL.txt` and the distributed fonts directory. Project code licensing and a registry destination must be chosen before publication.

Components use native HTML semantics and namespaced classes authored with Tailwind. No runtime dependencies beyond React peers are needed. Import the styles once at your application entry point. Fonts are opt-in; set `--font-pancake` to use your application’s font.

The exported JavaScript tokens (such as `colors` and `typography`) contain default values; CSS overrides do not change those objects. Use components such as `Text`, or CSS `var(--color-pancake-ink)`, when values should respond to a theme. Override related colours together, including `--color-pancake-accent` and `--color-pancake-surface-accent` for primary buttons and their hover state. Check contrast for each theme.

The library does not set body styles, page width, or a CSS reset. Set those in your app. The [example application](examples/web/src/main.tsx) demonstrates this separation and exercises the component catalogue.

## Compatibility and verification

The package requires React and React DOM 19.2 or later within React 19 and an ESM-capable bundler. It targets modern browsers supported by Tailwind 4. The browser suite runs in Chromium, Firefox and WebKit. Assistive-technology announcements have not been manually verified. React Native is not supported by this package.

For frameworks with React Server Components, import interactive components from a client boundary (for example, a file beginning with `"use client"` in Next.js). Next.js integration is not part of the current verification matrix.

`npm run test:package` expects an existing package and Storybook build. It creates an archive under `.tmp/package/` and an isolated app under `.tmp/consumer/`; browser screenshots go to `artifacts/`. It installs the built archive into a separate application, compiles its imports, and exercises the rendered controls. The main example uses compiled CSS without requiring Tailwind in the consumer.

## Versioning local releases

Before 1.0, use patch versions for compatible fixes and minor versions for additions or breaking API changes. Record breaking changes and migration instructions explicitly in [CHANGELOG.md](CHANGELOG.md). Do not replace an archive already shared with a different implementation under the same version.

For a patch release:

```sh
npm version patch --no-git-tag-version
npm --prefix examples/web install
# Update CHANGELOG.md with the version and changes.
npm run release:local
```

Use `minor` instead of `patch` when appropriate. The version command updates the package manifest and lockfile without creating a Git commit or tag. Refreshing the example install updates its local-package metadata. Review and commit those changes through the normal development workflow. Install the new versioned archive in each consumer and keep its lockfile in sync.

Local releases do not publish to a registry or create a Git remote. Code licensing and a registry destination remain undecided; the package stays private. Bundled Inter fonts retain their SIL Open Font License.

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

`TextField` requires a visible `label`; supports text, email, password, search, tel, and URL inputs; and uses ordinary `value`/`defaultValue` and `onChange` props. `helperText` and `error` link to the input's accessible description. An error sets `aria-invalid`; application validation remains the caller's responsibility. `className` and `ref` target the input. Password visibility toggles and explicit search-clear actions are not built in.

`Checkbox` requires a visible `label`. Use `checked` and `onCheckedChange` for controlled state, or `defaultChecked` for uncontrolled state. Native `onChange` remains available and runs before `onCheckedChange`. Native form reset applies to uncontrolled inputs; controlled state must be reset by the application. `className` and `ref` target the checkbox input.

The sample form verifies submission, required fields, custom errors, keyboard focus, controlled and uncontrolled checkboxes, and loading/disabled states. Browser focus outlines and input borders use darker existing tokens for contrast.

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

The example verifies avatar image recovery, notification dismissal, navigation links, selection keyboard behaviour and form reset, progress semantics, and local theme overrides. Product-specific screens, workflows, and branded artwork belong in consuming apps.

## Development

Use Node 22.18+ and npm. Run `npm ci`, then `npm run build`.

- `npm run storybook`: web component catalogue on port 6006.
- `npm run example`: build and launch the consuming application.
- `npx playwright install chromium firefox webkit`: install the browser required for verification.
- `npm run verify`: formatting, types, lint, package and Storybook builds, installation of a tarball into an isolated consumer, and browser checks.
- `npm run release:local`: run verification and produce the local archive with checksum and source metadata.

The lockfile pins development dependencies. Storybook packages use the same exact version.

## Contributing components

Follow the [verification and behaviour contracts](docs/verification.md) and the [component styling rules](docs/styling.md) when adding or changing components. `npm run check:styles` checks token usage and styling boundaries; `npm run test:styles` tests those guardrails. Both run in `npm run verify`. The same command checks public-component coverage in the comparison story and compares desktop/mobile screenshots. See the styling guide for baseline review and platform requirements.

Keep public exports in `src/index.ts` and use the shared tokens in `src/foundations/tokens.ts`. Keep component styles under namespaced `pancake-` classes and avoid global element styles. Components should accept application content and callbacks without importing app routes, services, or domain models.

Add Storybook examples for relevant states and update the consuming example when adding a public API. Use the package browser tests for behaviour that needs regression coverage. Run `npm run verify` before sharing a release; it checks the installed archive, not just source imports. The GitHub Actions workflow runs the same verification on pushes and pull requests when hosted on GitHub.

`Textarea` and `Select` provide labelled multiline and native selection controls with `helperText`, `error`, native form props, and refs to their controls. Supply `option` and `optgroup` children to `Select`. Like `TextField`, their `className` and `style` props target the control.

`Select` accepts one scalar value, not `multiple` or listbox `size`. Uncontrolled controls use native form reset. For controlled forms, the app owns reset: restore state and reapply a select’s value after the native reset completes, including when the initial state has not changed. The contract fixture demonstrates this ordering.

`IconButton` requires a `label` for its accessible name and renders decorative icon children. It shares Button variants, sizes, loading/disabled states and native button props. `ButtonLink` shares button styling but renders a native anchor with a required `href`; it supports anchor refs and link props, without fake disabled or loading states.

## Dialogs

`Dialog` is a controlled native modal. Pass `open`, `onOpenChange` and a visible `title`; an optional `description` is associated with the dialog. It uses `showModal()` after mounting, so server markup is stable and the modal opens after hydration. The browser owns modal focus containment and background inertness. Escape and the built-in close button request dismissal through `onOpenChange(false)`; the app must update `open`. Backdrop clicks do not dismiss it. Set `closeLabel` to localise the close button. Native refs, classes and styles target the dialog element.

```tsx
const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>Review changes</Button>
  <Dialog open={open} onOpenChange={setOpen} title="Review changes">
    <Text as="p">Check your changes before saving.</Text>
    <Button onClick={() => setOpen(false)}>Done</Button>
  </Dialog>
</>;
```

`RadioGroup` provides labelled native radio choices with optional option descriptions, group guidance/errors and disabled options. Use unique option values and `value`/`onValueChange` or `defaultValue`. `Switch` provides a labelled native checkbox with switch semantics and `onCheckedChange`; applications own the setting it changes. Native form props and consumer styling remain supported.
