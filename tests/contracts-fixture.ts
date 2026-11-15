import type { Locator, Page } from "@playwright/test";
import { test as base, expect } from "./fixtures";
import { storyUrl } from "./servers";

const probeTimeoutMs = 1000;
const story = storyUrl("verification-contracts--interactive", {
  storybookAxe: "manual",
});
export const test = base.extend<{ contractStory: void }>({
  contractStory: [
    async ({ page, runtimeErrors }, provide) => {
      // Start error monitoring before the story executes any scripts.
      void runtimeErrors;
      await page.goto(story);
      await expect(
        page.getByRole("heading", { name: "Component contracts" }),
      ).toBeVisible();
      await provide();
    },
    { auto: true },
  ],
});

export async function assertActionCount(page: Page, expected: string) {
  await expect(page.getByLabel("Action count", { exact: true })).toHaveText(
    expected,
    {
      timeout: probeTimeoutMs,
    },
  );
}
export async function assertFieldName(field: Locator) {
  await expect(field).toHaveAccessibleName("Controlled title", {
    timeout: probeTimeoutMs,
  });
}
export async function assertDisabled(control: Locator) {
  await expect(control).toBeDisabled({ timeout: probeTimeoutMs });
}

export { expect };
