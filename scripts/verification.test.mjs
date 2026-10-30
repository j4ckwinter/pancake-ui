import assert from "node:assert/strict";
import { test } from "node:test";
import { ESLint } from "eslint";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const eslint = new ESLint();
for (const [source, rule] of [
  [
    'import {test} from "./fixtures"; test.only("partial", async () => {});',
    "no-restricted-syntax",
  ],
  [
    'import {test} from "./fixtures"; test.skip("missing", async () => {});',
    "no-restricted-syntax",
  ],
  [
    'import {test} from "@playwright/test"; test("bypass", async () => {});',
    "no-restricted-imports",
  ],
  [
    'import {test,expect} from "./fixtures"; test("unawaited", async ({page}) => { expect(page.locator("button")).toBeVisible(); });',
    "@typescript-eslint/no-floating-promises",
  ],
]) {
  test(`lint rejects ${rule}: ${source.slice(0, 65)}`, async () => {
    const [result] = await eslint.lintText(source, {
      filePath: "tests/package.spec.ts",
    });
    assert(result.messages.some((message) => message.ruleId === rule));
  });
}

test("shared browser fixture rejects an unexpected runtime warning", async () => {
  await mkdir(".tmp", { recursive: true });
  const directory = await mkdtemp(resolve(".tmp/runtime-probe-"));
  try {
    await writeFile(
      join(directory, "probe.spec.ts"),
      `import {test} from ${JSON.stringify(resolve("tests/fixtures.ts"))};\ntest("runtime warning", async ({page}) => { await page.goto("about:blank"); await page.evaluate(() => console.warn("verification-warning-probe")); });`,
    );
    await writeFile(
      join(directory, "playwright.config.ts"),
      'export default { testDir: ".", workers: 1, forbidOnly: true, use: { browserName: "chromium" } };',
    );
    const result = spawnSync(
      process.execPath,
      [
        "node_modules/playwright/cli.js",
        "test",
        "-c",
        join(directory, "playwright.config.ts"),
        "--reporter=line",
      ],
      { encoding: "utf8", timeout: 30000 },
    );
    assert.equal(result.status, 1);
    assert.match(
      result.stdout + result.stderr,
      /Unexpected browser errors or warnings/,
    );
    assert.match(result.stdout + result.stderr, /verification-warning-probe/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
