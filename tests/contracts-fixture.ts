import type { Locator, Page } from "@playwright/test";
import { test as base, expect } from "./fixtures";

// Playwright owns explicit axe scans; prevent Storybook from running axe concurrently.
const story =
  "http://127.0.0.1:6007/iframe.html?id=verification-contracts--interactive&viewMode=story&globals=a11y.manual:!true";
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
      timeout: 1000,
    },
  );
}
export async function assertFieldName(field: Locator) {
  await expect(field).toHaveAccessibleName("Controlled title", {
    timeout: 1000,
  });
}
export async function assertDisabled(control: Locator) {
  await expect(control).toBeDisabled({ timeout: 1000 });
}

export { expect };
