import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  use: { ...devices["Desktop Chrome"] },
  webServer: [
    {
      command: "npm --prefix .tmp/consumer run dev -- --port 4173 --strictPort",
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
