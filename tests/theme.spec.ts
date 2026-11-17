import type { Page } from "@playwright/test";
import {
  test,
  expect,
  accessibilityViolations,
  animationsSettled,
} from "./fixtures";
import { storyUrl } from "./servers";

const catalogue = storyUrl("foundations-comparison--catalogue", {
  storybookAxe: "manual",
});
async function setTheme(page: Page, theme: string) {
  await page.evaluate(
    (value) =>
      document.documentElement.setAttribute("data-pancake-theme", value),
    theme,
  );
  await animationsSettled(page);
}
async function openCatalogue(page: Page) {
  await page.goto(catalogue);
  await expect(page.getByTestId("comparison")).toBeVisible();
}

test("Theme: stays light unless an app opts in", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await openCatalogue(page);
  await page.evaluate(() =>
    document.documentElement.removeAttribute("data-pancake-theme"),
  );
  await expect(page.locator(".pancake-surface").first()).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("Theme: dark repaints surfaces and text but keeps text on lime dark", async ({
  page,
}) => {
  await openCatalogue(page);
  await setTheme(page, "dark");
  await expect(page.locator(".pancake-surface").first()).toHaveCSS(
    "background-color",
    "rgb(24, 29, 27)",
  );
  await expect(page.locator(".pancake-surface").first()).toHaveCSS(
    "color",
    "rgb(238, 242, 236)",
  );
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toHaveCSS("color", "rgb(14, 23, 22)");
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
});

test("Theme: system follows the visitor's preference", async ({ page }) => {
  await openCatalogue(page);
  await setTheme(page, "system");
  const surface = page.locator(".pancake-surface").first();
  await page.emulateMedia({ colorScheme: "light" });
  await expect(surface).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(surface).toHaveCSS("background-color", "rgb(24, 29, 27)");
});

test("Theme: dark passes the accessibility scan", async ({ page }) => {
  await openCatalogue(page);
  await setTheme(page, "dark");
  await expect(page.locator(".pancake-surface").first()).toHaveCSS(
    "background-color",
    "rgb(24, 29, 27)",
  );
  expect(await accessibilityViolations(page)).toEqual([]);
});
