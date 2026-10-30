# Pancake UI

React and Tailwind foundations extracted from Padel Potato. Stage 1 establishes the package, theme, Storybook, and an example consumer. Interactive controls are planned for stage 2.

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

Exports include `Surface` with native div props and ref support, and typed colour, spacing, sizing, radius, border, opacity, and typography tokens. This is an ESM package. React and React DOM are peers and are excluded from the bundle. Consumers do not need Tailwind to use the compiled CSS. The stylesheet does not install a global reset.

For a Tailwind 4 application, import `pancake-ui/theme.css` into its Tailwind stylesheet to enable namespaced utilities such as `bg-pancake-accent`, `p-pancake-24`, and `text-pancake-body`. Continue importing `pancake-ui/styles.css` for component styles. Override the generated CSS custom properties after the library stylesheet to customise a theme.

Edit `src/tokens.ts`, then run `npm run tokens`. `src/theme.css` is generated; the build refreshes it. Fonts retain the SIL Open Font License in `assets/fonts/OFL.txt` and the distributed fonts directory. Project code licensing and a registry destination must be chosen before publication.

Base UI, CVA, and class-merging helpers will be added when the interactive components use them. Stage 1 has no runtime dependencies beyond its React peers. Routing, backend services, and application state belong to consuming applications.

`npm run test:package` expects an existing package and Storybook build. It creates ignored `artifacts/` and `.tmp/consumer/` directories. Browser checks currently target Chromium; Firefox, WebKit, and component interaction coverage are future work.
