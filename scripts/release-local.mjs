import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import assert from "node:assert/strict";

execFileSync("npm", ["run", "verify"], { stdio: "inherit" });
const packed = JSON.parse(await readFile(".tmp/package/packed.json", "utf8"));
const sha256 = createHash("sha256")
  .update(await readFile(`.tmp/package/${packed.filename}`))
  .digest("hex");
assert.equal(
  sha256,
  packed.sha256,
  "Archive changed after package verification.",
);
const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const release = {
  name: packed.name,
  version: packed.version,
  archive: packed.filename,
  sha256,
  sourceCommit: git("rev-parse", "HEAD"),
  workingTreeDirty: git("status", "--porcelain").length > 0,
  node: process.version,
  npm: execFileSync("npm", ["--version"], { encoding: "utf8" }).trim(),
  verifiedAt: new Date().toISOString(),
  verification: "npm run verify",
};
await mkdir("artifacts", { recursive: true });
await copyFile(
  `.tmp/package/${packed.filename}`,
  `artifacts/${packed.filename}`,
);
await writeFile(
  `artifacts/${packed.filename}.sha256`,
  `${sha256}  ${packed.filename}\n`,
);
const stem = packed.filename.replace(/\.tgz$/, "");
await writeFile(
  `artifacts/${stem}.release.json`,
  JSON.stringify(release, null, 2) + "\n",
);
console.log(`Local release ready: artifacts/${packed.filename}`);
console.log(`SHA-256: ${sha256}`);
if (release.workingTreeDirty)
  console.log(
    "The archive includes uncommitted source changes; see the release manifest.",
  );
