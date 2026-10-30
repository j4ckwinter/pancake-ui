import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("packed consumer renders themed foundations and loads bundled fonts", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:4173");
  await expect(
    page.getByRole("heading", { name: "A familiar starting point." }),
  ).toBeVisible();
  await expect(page.locator(".note")).toHaveCSS("line-height", "16.8px");
  const surface = page.getByLabel("Foundation preview");
  await expect(surface).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(surface).toHaveCSS("padding", "24px");
  await expect(surface).toHaveCSS("border-radius", "16px");
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() =>
      [...document.fonts].some(
        (font) => font.family === "Inter" && font.status === "loaded",
      ),
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 375, height: 812 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "artifacts/consumer-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("built Storybook renders the foundation story", async ({ page }) => {
  await page.goto(
    "http://127.0.0.1:6007/iframe.html?id=foundations-theme--palette&viewMode=story",
  );
  await expect(
    page.getByRole("heading", { name: "Pancake UI foundations" }),
  ).toBeVisible();
  await expect(page.locator(".pancake-surface")).toHaveCSS("padding", "24px");
});
