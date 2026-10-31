import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, readdir, appendFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export async function validatePublishArtifact(directory, manifest, license) {
  const packed = JSON.parse(
    await readFile(resolve(directory, "packed.json"), "utf8"),
  );
  assert.match(manifest.name, /^@[a-z0-9._-]+\/pancake-ui$/);
  assert.equal(packed.name, manifest.name);
  assert.equal(packed.version, manifest.version);
  assert.match(packed.version, /^\d+\.\d+\.\d+$/);
  assert.equal(
    packed.filename,
    `${packed.name.replace(/^@/, "").replace("/", "-")}-${packed.version}.tgz`,
  );
  assert.deepEqual(
    (await readdir(directory)).sort(),
    [packed.filename, "packed.json"].sort(),
  );
  const archive = resolve(directory, packed.filename);
  const sha256 = createHash("sha256")
    .update(await readFile(archive))
    .digest("hex");
  assert.equal(
    sha256,
    packed.sha256,
    "Archive SHA-256 does not match verified manifest",
  );
  const tar = (...args) =>
    execFileSync("tar", args, {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
  const entries = tar("-tzf", archive).trim().split("\n");
  assert(
    entries.every(
      (entry) =>
        entry.startsWith("package/") && !entry.split("/").includes(".."),
    ),
    "Unsafe archive paths",
  );
  assert.equal(
    new Set(entries).size,
    entries.length,
    "Duplicate archive entries",
  );
  assert.deepEqual(
    entries.map((entry) => entry.slice(8)).sort(),
    [...packed.files].sort(),
  );
  const metadata = JSON.parse(tar("-xOzf", archive, "package/package.json"));
  for (const key of [
    "name",
    "version",
    "license",
    "repository",
    "publishConfig",
  ])
    assert.deepEqual(
      metadata[key],
      manifest[key],
      `Archive ${key} differs from source`,
    );
  assert.notEqual(metadata.private, true);
  assert.equal(metadata.license, "MIT");
  assert.equal(
    metadata.repository.url,
    "git+https://github.com/j4ckwinter/pancake-ui.git",
  );
  assert.equal(metadata.publishConfig.access, "public");
  assert.equal(metadata.publishConfig.registry, "https://registry.npmjs.org/");
  assert.equal(tar("-xOzf", archive, "package/LICENSE"), license);
  assert.match(license, /MIT License/);
  assert(entries.includes("package/dist/fonts/OFL.txt"));
  return { archive, sha256, name: packed.name, version: packed.version };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const result = await validatePublishArtifact(
    process.argv[2],
    JSON.parse(await readFile("package.json", "utf8")),
    await readFile("LICENSE", "utf8"),
  );
  await appendFile(process.env.GITHUB_OUTPUT, `archive=${result.archive}\n`);
  console.log(
    `Ready to publish ${result.name}@${result.version}; SHA-256 ${result.sha256}`,
  );
}
