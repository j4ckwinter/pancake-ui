import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const runner = fileURLToPath(new URL("./check-styles.mjs", import.meta.url));

test("source check discovers nested components and leaves demos outside its scope", async () => {
  const directory = await mkdtemp(join(tmpdir(), "pancake-styles-"));
  try {
    await mkdir(join(directory, "src/nested"), { recursive: true });
    await writeFile(
      join(directory, "src/nested/Good.css"),
      "@layer components { .pancake-good { padding: var(--spacing-pancake-12); } }",
    );
    await writeFile(
      join(directory, "src/nested/Demo.stories.tsx"),
      "export const Demo = () => <div style={{ padding: 13 }} />;",
    );
    assert.match(
      execFileSync(process.execPath, [runner], {
        cwd: directory,
        encoding: "utf8",
      }),
      /styling follows/,
    );
    await writeFile(
      join(directory, "src/nested/Bad.tsx"),
      "export const Bad = () => <div style={{ padding: 13 }} />;",
    );
    const result = spawnSync(process.execPath, [runner], {
      cwd: directory,
      encoding: "utf8",
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /src\/nested\/Bad.tsx:1:/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
