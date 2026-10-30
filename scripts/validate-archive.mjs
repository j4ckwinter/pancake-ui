import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

export async function validateArchive(packed) {
  const manifest = JSON.parse(await readFile("package.json", "utf8"));
  assert.equal(packed.name, manifest.name);
  assert.equal(packed.version, manifest.version);
  const files = new Set(packed.files.map((file) => file.path));
  const targets = Object.values(manifest.exports).flatMap((entry) =>
    typeof entry === "string" ? [entry] : Object.values(entry),
  );
  for (const target of targets)
    assert(
      files.has(target.replace(/^\.\//, "")),
      `Missing package export: ${target}`,
    );
  for (const file of [
    "README.md",
    "CHANGELOG.md",
    "docs/styling.md",
    "package.json",
    "dist/fonts/OFL.txt",
    "dist/fonts/Inter-Regular.ttf",
    "dist/fonts/Inter-SemiBold.ttf",
    "dist/fonts/Inter-Bold.ttf",
  ])
    assert(files.has(file), `Missing archive file: ${file}`);
  for (const file of files)
    assert(
      file.startsWith("dist/") ||
        [
          "README.md",
          "CHANGELOG.md",
          "package.json",
          "docs/styling.md",
        ].includes(file),
      `Unexpected archive file: ${file}`,
    );
  const archive = await readFile(`.tmp/package/${packed.filename}`);
  const sha256 = createHash("sha256").update(archive).digest("hex");
  await writeFile(
    ".tmp/package/packed.json",
    JSON.stringify(
      {
        name: packed.name,
        version: packed.version,
        filename: packed.filename,
        sha256,
        files: [...files],
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `Validated ${packed.filename}: ${files.size} files, all exports and font licences included.`,
  );
}
