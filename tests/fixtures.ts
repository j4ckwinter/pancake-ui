import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { resolve, join } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { test as base, expect, type Page } from "@playwright/test";

const reachesEveryControl = (browserName: string) =>
  browserName === "webkit" ? "Alt+" : "";

export const test = base.extend<{
  runtimeErrors: void;
  tabKey: string;
  shiftTabKey: string;
}>({
  tabKey: async ({ browserName }, provide) => {
    await provide(`${reachesEveryControl(browserName)}Tab`);
  },
  shiftTabKey: async ({ browserName }, provide) => {
    await provide(`${reachesEveryControl(browserName)}Shift+Tab`);
  },
  launchOptions: [
    async ({ launchOptions, browserName }, provide) => {
      if (browserName !== "firefox" || process.platform !== "darwin") {
        await provide(launchOptions);
        return;
      }
      // Firefox 157 shares macOS-protected app data: https://github.com/microsoft/playwright/issues/42768
      await mkdir(".tmp", { recursive: true });
      const directory = await mkdtemp(resolve(".tmp/firefox-app-data-"));
      const roaming = join(directory, "roaming");
      const local = join(directory, "local");
      await mkdir(roaming);
      await mkdir(local);
      try {
        await provide({
          ...launchOptions,
          env: {
            ...process.env,
            ...launchOptions.env,
            MOZ_APP_DATA: roaming,
            MOZ_LOCAL_APP_DATA: local,
          },
        });
      } finally {
        await rm(directory, { recursive: true, force: true });
      }
    },
    { scope: "worker" },
  ],
  runtimeErrors: [
    async ({ page }, provide) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (["error", "warning"].includes(message.type()))
          errors.push(`${message.type()}: ${message.text()}`);
      });
      await provide();
      expect(errors, "Unexpected browser errors or warnings").toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };

export async function animationsSettled(page: Page) {
  await page.evaluate(() =>
    Promise.allSettled(
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.playState === "running" &&
            animation.effect?.getComputedTiming().iterations !== Infinity,
        )
        .map((animation) => animation.finished),
    ),
  );
}

export async function accessibilityViolations(page: Page) {
  await animationsSettled(page);
  return (await new AxeBuilder({ page }).analyze()).violations;
}
