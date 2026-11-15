import { defineConfig } from "@playwright/test";
import config from "./playwright.config";
import { storybook } from "./tests/servers";

export default defineConfig({
  ...config,
  projects: config.projects?.filter((project) => project.name === "visual"),
  testMatch: "visual.spec.ts",
  webServer: storybook.webServer,
});
