import { defineConfig, devices } from "@playwright/test";
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
      testIgnore: "visual.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testIgnore: "visual.spec.ts",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testIgnore: "visual.spec.ts",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "visual",
      testMatch: "visual.spec.ts",
      use: { ...devices["Desktop Chrome"], locale: "en-GB" },
    },
  ],
  webServer: [
    {
      command:
        "npx vite preview --outDir .tmp/compatibility/site --host 127.0.0.1 --port 4174 --strictPort",
      url: "http://127.0.0.1:4174/minimum/",
      reuseExistingServer: false,
    },
    {
      command:
        "npx vite preview --outDir .tmp/consumer/dist --host 127.0.0.1 --port 4173 --strictPort",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: false,
    },
    {
      command:
        "npx vite preview --outDir storybook-static --host 127.0.0.1 --port 6007 --strictPort",
      url: "http://127.0.0.1:6007",
      reuseExistingServer: false,
    },
  ],
});
