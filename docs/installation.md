# Installation and releases

[Back to the README](../README.md).

## Install in an app

Use React and React DOM 19.2+ within React 19, Node 22.18+, and an ESM bundler such as Vite. Tailwind is **not required**. The package is not published to npm; `npm install pancake-ui` is not the installation path for this repository.

Successful **push runs on main** in [Verify](https://github.com/j4ckwinter/pancake-ui/actions/workflows/verify.yml) upload a `pancake-ui-package` artifact containing the exact compiled `.tgz` tested by CI and its `packed.json` manifest. Runs from before package uploads were added have no package artifact; use the local build instructions below if none is available.

1. Open a successful main-branch run and download `pancake-ui-package` from its Artifacts section. GitHub requires you to be signed in. Extract the ZIP into your app's `vendor/pancake-ui/` directory.
2. Install the **`.tgz` inside the ZIP**, from your app's root:

```sh
npm install ./vendor/pancake-ui/pancake-ui-0.1.0.tgz
```

Use the filename from your download if its version differs. The app needs React and React DOM installed; an existing React app normally already has them. No library clone, Playwright, Tailwind or library build is needed.

With [GitHub CLI](https://cli.github.com/) installed and authenticated, you can download the same artifact instead of using the browser. Replace `RUN_ID` with the successful main run's numeric ID:

```sh
gh run download RUN_ID --repo j4ckwinter/pancake-ui --name pancake-ui-package --dir vendor/pancake-ui
npm install ./vendor/pancake-ui/pancake-ui-0.1.0.tgz
```

Commit the downloaded archive, `packed.json`, your app's `package.json`, and its lockfile. Fresh clones can then use `npm ci` without GitHub credentials. Record the source run URL when upgrading, use a new package version, and do not overwrite an archive already used by an app. GitHub artifacts expire after 90 days (or earlier if deleted); keeping the archive in your app makes it independent of that retention period. See [GitHub's artifact download instructions](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts).

Direct Git installation is not a supported distribution path: this repository contains source rather than committed `dist/` files. A Git install can report success without usable exports. Use the compiled archive.

### Add your first component

Import styles once in your app entry point, and optionally import the bundled Inter fonts:

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

The library does not set body styles, page width, or a CSS reset. Set those in your app. The [example application](https://github.com/j4ckwinter/pancake-ui/blob/main/examples/web/src/main.tsx) demonstrates this separation and exercises the component catalogue.

## Compatibility and verification

The package requires React and React DOM 19.2 or later within React 19 and an ESM-capable bundler. It targets modern browsers supported by Tailwind 4. The browser suite runs in Chromium, Firefox and WebKit. Assistive-technology announcements have not been manually verified. React Native is not supported by this package.

For frameworks with React Server Components, import interactive components from a client boundary (for example, a file beginning with `"use client"` in Next.js). Next.js integration is not part of the current verification matrix.

`npm run test:package` expects an existing package and Storybook build. It creates an archive under `.tmp/package/` and an isolated app under `.tmp/consumer/`; browser screenshots go to `artifacts/`. It installs the built archive into a separate application, compiles its imports, and exercises the rendered controls. The main example uses compiled CSS without requiring Tailwind in the consumer.

## Build an archive locally

Use this when working on unpublished changes or before a main-branch CI artifact is available. In a checkout of [j4ckwinter/pancake-ui](https://github.com/j4ckwinter/pancake-ui):

```sh
git clone https://github.com/j4ckwinter/pancake-ui.git
cd pancake-ui
npm ci
npx playwright install chromium firefox webkit
npm run release:local
```

This runs full verification and produces `artifacts/pancake-ui-0.1.0.tgz`, its SHA-256 checksum and a release manifest recording the source commit and whether the working tree was dirty. Copy the archive into the consuming app's `vendor/pancake-ui/` directory and install it as above. Ordinary `npm pack` builds an archive but does not run the full verification suite.

## Versioning local releases

Before 1.0, use patch versions for compatible fixes and minor versions for additions or breaking API changes. Record breaking changes and migration instructions explicitly in [CHANGELOG.md](../CHANGELOG.md). Do not replace an archive already shared with a different implementation under the same version.

For a patch release:

```sh
npm version patch --no-git-tag-version
npm --prefix examples/web install
# Update CHANGELOG.md with the version and changes.
npm run release:local
```

Use `minor` instead of `patch` when appropriate. The version command updates the package manifest and lockfile without creating a Git commit or tag. Refreshing the example install updates its local-package metadata. Review and commit those changes through the normal development workflow. Install the new versioned archive in each consumer and keep its lockfile in sync.

Local releases do not publish to a registry or upload to GitHub. Code licensing and a registry destination remain undecided; the package stays private. Bundled Inter fonts retain their SIL Open Font License.
