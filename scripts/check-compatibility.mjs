import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = JSON.parse(await readFile("package.json", "utf8"));
const packed = JSON.parse(await readFile(".tmp/package/packed.json", "utf8"));
const minimum = /\^([\d.]+)/.exec(root.peerDependencies.react)?.[1];
assert(minimum, "Declare an explicit minimum React peer version.");
const minimumDom = /\^([\d.]+)/.exec(root.peerDependencies["react-dom"])?.[1];
assert(minimumDom, "Declare an explicit minimum React DOM peer version.");
const variants = [
  {
    name: "minimum",
    react: minimum,
    dom: minimumDom,
    reactTypes: minimum,
    domTypes: minimumDom,
  },
  {
    name: "current",
    react: root.devDependencies.react,
    dom: root.devDependencies["react-dom"],
    reactTypes: root.devDependencies["@types/react"],
    domTypes: root.devDependencies["@types/react-dom"],
  },
];
const run = (args, cwd) => execFileSync("npm", args, { cwd, stdio: "inherit" });
await rm(".tmp/compatibility/site", { recursive: true, force: true });
await mkdir(".tmp/compatibility/site", { recursive: true });
for (const variant of variants) {
  const directory = resolve(".tmp/compatibility", variant.name);
  await rm(directory, { recursive: true, force: true });
  await cp("compatibility", directory, { recursive: true });
  const manifest = {
    name: `pancake-ui-compatibility-${variant.name}`,
    private: true,
    type: "module",
    dependencies: {
      "@jack.winter/pancake-ui": `file:${resolve(".tmp/package", packed.filename)}`,
      react: variant.react,
      "react-dom": variant.dom,
    },
    devDependencies: {
      "@types/react": variant.reactTypes,
      "@types/react-dom": variant.domTypes,
      typescript: root.devDependencies.typescript,
      vite: root.devDependencies.vite,
    },
  };
  await writeFile(
    `${directory}/package.json`,
    JSON.stringify(manifest, null, 2),
  );
  await writeFile(
    `${directory}/vite.config.mjs`,
    `export default ${JSON.stringify({ base: `/${variant.name}/`, build: { outDir: `../site/${variant.name}`, emptyOutDir: true } })};\n`,
  );
  run(["install", "--ignore-scripts", "--no-audit", "--no-fund"], directory);
  const installedVersions = JSON.parse(
    execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        "import { version as react } from 'react'; import { version as dom } from 'react-dom'; process.stdout.write(JSON.stringify({react, dom}));",
      ],
      { cwd: directory, encoding: "utf8" },
    ),
  );
  assert.deepEqual(
    installedVersions,
    { react: variant.react, dom: variant.dom },
    "Compatibility checks must use the requested React versions.",
  );
  run(["exec", "--", "tsc", "--noEmit"], directory);
  execFileSync(process.execPath, ["render.mjs"], {
    cwd: directory,
    stdio: "inherit",
  });
  run(
    ["exec", "--", "vite", "build", "--config", "vite.config.mjs"],
    directory,
  );
  console.log(
    `Verified installed public types and server rendering with React ${variant.react} (${variant.name}).`,
  );
}
