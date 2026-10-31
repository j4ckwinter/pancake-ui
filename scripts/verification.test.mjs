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
    for (const filePath of [
      "tests/package.spec.ts",
      "src/components/Button/Button.spec.ts",
    ]) {
      const candidate = filePath.startsWith("src/")
        ? source.replaceAll('"./fixtures"', '"../../../tests/fixtures"')
        : source;
      const [result] = await eslint.lintText(candidate, { filePath });
      assert(result.messages.some((message) => message.ruleId === rule));
    }
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
      `export default ${JSON.stringify({ testDir: ".", outputDir: join(directory, "results"), workers: 1, forbidOnly: true, use: { browserName: "chromium" } })};`,
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

test("colocated fixture opens every spec and rejects startup warnings", async () => {
  await mkdir(".tmp", { recursive: true });
  const directory = await mkdtemp(resolve(".tmp/contract-startup-probe-"));
  try {
    await writeFile(
      join(directory, "fixture.ts"),
      `
import {test as base, expect} from ${JSON.stringify(resolve("tests/contracts-fixture.ts"))};
export const test = base.extend({
  page: async ({page}, provide) => {
    await page.route("**/iframe.html?**", route => route.fulfill({
      contentType: "text/html",
      body: '<h1>Component contracts</h1>' + (process.env.PANCAKE_STARTUP_WARNING === "1" ? '<script>console.warn("contract-startup-warning")</script>' : "")
    }));
    await provide(page);
  }
});
export {expect};
`,
    );
    for (const name of ["first", "second"])
      await writeFile(
        join(directory, `${name}.spec.ts`),
        `
import {test, expect} from "./fixture";
test("${name} story setup", async ({page}) => {
  await expect(page.getByRole("heading", {name: "Component contracts"})).toBeVisible();
});
`,
      );
    await writeFile(
      join(directory, "playwright.config.ts"),
      `export default ${JSON.stringify({ testDir: ".", outputDir: join(directory, "results"), workers: 1, forbidOnly: true, use: { browserName: "chromium" } })};`,
    );
    const run = (warning) =>
      spawnSync(
        process.execPath,
        [
          "node_modules/playwright/cli.js",
          "test",
          "-c",
          join(directory, "playwright.config.ts"),
          "--reporter=line",
        ],
        {
          encoding: "utf8",
          timeout: 30000,
          env: { ...process.env, PANCAKE_STARTUP_WARNING: warning ? "1" : "0" },
        },
      );
    const clean = run(false);
    assert.equal(clean.status, 0, clean.stdout + clean.stderr);
    assert.match(clean.stdout, /2 passed/);
    const result = run(true);
    assert.equal(result.status, 1);
    const output = result.stdout + result.stderr;
    assert.match(output, /2 failed/);
    assert.match(output, /contract-startup-warning/);
    assert.match(output, /Unexpected browser errors or warnings/);
    assert.doesNotMatch(output, /Test timeout|toBeVisible.*failed/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
