import { defineConfig, devices } from "@playwright/test";
import { compatibilitySite, consumerApp, storybook } from "./tests/servers";

const scratchCopies = /\/\.tmp\//;

export default defineConfig({
  forbidOnly: true,
  failOnFlakyTests: true,
  retries: 0,
  workers: 2,
  testDir: ".",
  testMatch: ["tests/**/*.spec.ts", "src/components/**/*.spec.ts"],
  updateSnapshots: "none",
  expect: { toHaveScreenshot: { maxDiffPixels: 0, animations: "disabled" } },
  snapshotPathTemplate:
    "{testDir}/{testFilePath}-snapshots/{arg}-{platform}{ext}",
  use: { trace: "retain-on-failure" },
  projects: [
    {
      name: "chromium",
      testIgnore: [scratchCopies, "visual.spec.ts"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testIgnore: [scratchCopies, "visual.spec.ts"],
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testIgnore: [scratchCopies, "visual.spec.ts"],
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "visual",
      testMatch: "visual.spec.ts",
      testIgnore: scratchCopies,
      use: { ...devices["Desktop Chrome"], locale: "en-GB" },
    },
  ],
  webServer: [
    compatibilitySite.webServer,
    consumerApp.webServer,
    storybook.webServer,
  ],
});
