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

test("Theme: a light panel stays light inside a dark page, and dark inside light", async ({
  page,
}) => {
  await openCatalogue(page);
  const surfaces = page.locator(".pancake-surface");
  await surfaces
    .nth(1)
    .evaluate((node) => node.setAttribute("data-pancake-theme", "light"));
  await setTheme(page, "dark");
  await expect(surfaces.nth(1)).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await expect(surfaces.nth(0)).toHaveCSS(
    "background-color",
    "rgb(24, 29, 27)",
  );
  await surfaces
    .nth(1)
    .evaluate((node) => node.setAttribute("data-pancake-theme", "dark"));
  await setTheme(page, "light");
  await expect(surfaces.nth(1)).toHaveCSS(
    "background-color",
    "rgb(24, 29, 27)",
  );
  await expect(surfaces.nth(0)).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("Theme: an app can override a dark value with the documented selector", async ({
  page,
}) => {
  await openCatalogue(page);
  await page.addStyleTag({
    content:
      ':root[data-pancake-theme="dark"], [data-pancake-theme="dark"] { --color-pancake-surface: rgb(1, 2, 3); }',
  });
  await setTheme(page, "dark");
  await expect(page.locator(".pancake-surface").first()).toHaveCSS(
    "background-color",
    "rgb(1, 2, 3)",
  );
});

test("Theme: tooltips invert the page colours and overlays cast a shadow", async ({
  page,
}) => {
  await page.goto(storyUrl("overlays-tooltip--default"));
  const trigger = page.getByRole("button").first();
  await trigger.focus();
  const tooltip = page.getByRole("tooltip");
  await expect(tooltip).toBeVisible();
  await animationsSettled(page);
  await expect(tooltip).toHaveCSS("background-color", "rgb(14, 23, 22)");
  await expect(tooltip).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(tooltip).toHaveCSS("box-shadow", /rgba\(14, 23, 22, 0\.12\)/);
  await setTheme(page, "dark");
  await expect(tooltip).toHaveCSS("background-color", "rgb(238, 242, 236)");
  await expect(tooltip).toHaveCSS("color", "rgb(24, 29, 27)");
  await expect(tooltip).toHaveCSS("box-shadow", /rgba\(0, 0, 0, 0\.5\)/);
});
