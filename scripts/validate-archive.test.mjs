import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { validateArchive } from "./validate-archive.mjs";

const manifest = JSON.parse(await readFile("package.json", "utf8"));
const files = [
  ...Object.values(manifest.exports)
    .flatMap((entry) =>
      typeof entry === "string" ? [entry] : Object.values(entry),
    )
    .map((path) => path.replace(/^\.\//, "")),
  "LICENSE",
  "README.md",
  "CHANGELOG.md",
  "package.json",
  "docs/styling.md",
  "docs/verification.md",
  "docs/installation.md",
  "docs/components.md",
  "dist/fonts/OFL.txt",
  "dist/fonts/Inter-Regular.ttf",
  "dist/fonts/Inter-SemiBold.ttf",
  "dist/fonts/Inter-Bold.ttf",
];

test("archive validation accepts licenses and rejects missing licenses or extra files", async () => {
  const original = process.cwd();
  const directory = await mkdtemp(join(tmpdir(), "pancake-archive-"));
  try {
    await mkdir(join(directory, ".tmp/package"), { recursive: true });
    await writeFile(join(directory, "package.json"), JSON.stringify(manifest));
    await writeFile(
      join(directory, ".tmp/package/fixture.tgz"),
      "archive fixture",
    );
    process.chdir(directory);
    const packed = {
      name: manifest.name,
      version: manifest.version,
      filename: "fixture.tgz",
      files: files.map((path) => ({ path })),
    };
    await validateArchive(packed);
    const recorded = JSON.parse(
      await readFile(".tmp/package/packed.json", "utf8"),
    );
    assert(recorded.files.includes("LICENSE"));
    assert.match(recorded.sha256, /^[a-f0-9]{64}$/);
    for (const missing of ["LICENSE", "dist/fonts/OFL.txt"]) {
      await assert.rejects(
        validateArchive({
          ...packed,
          files: packed.files.filter(({ path }) => path !== missing),
        }),
        { message: `Missing archive file: ${missing}` },
      );
    }
    await assert.rejects(
      validateArchive({
        ...packed,
        files: [...packed.files, { path: "src/private.ts" }],
      }),
      { message: "Unexpected archive file: src/private.ts" },
    );
  } finally {
    process.chdir(original);
    await rm(directory, { recursive: true, force: true });
  }
});
