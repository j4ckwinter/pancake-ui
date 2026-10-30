import { execFileSync } from "node:child_process";
import { test, expect } from "./fixtures";

const parsedComponents: unknown = JSON.parse(
  execFileSync(process.execPath, ["scripts/check-comparison.mjs", "--json"], {
    encoding: "utf8",
  }),
);

if (
  !Array.isArray(parsedComponents) ||
  !parsedComponents.every((value: unknown) => typeof value === "string")
) {
  throw new Error("Comparison coverage must return component names.");
}
const components: string[] = parsedComponents;

for (const width of [1100, 375]) {
  test(`component comparison at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(
      "http://127.0.0.1:6007/iframe.html?id=foundations-comparison--catalogue&viewMode=story",
    );
    const comparison = page.getByTestId("comparison");
    await expect(comparison).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() =>
        [...document.fonts].some(
          (font) => font.family === "Inter" && font.status === "loaded",
        ),
      ),
    ).toBe(true);
    for (const name of components) {
      await expect(
        comparison.locator(`[data-component="${name}"]`).first(),
      ).toBeVisible();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(comparison).toHaveScreenshot(`catalogue-${width}.png`, {
      animations: "disabled",
    });

    const button = page.getByRole("button", { name: "Continue", exact: true });
    await button.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS("outline-style", "solid");
    await expect(
      page.locator(".pancake-surface").filter({ has: button }),
    ).toHaveScreenshot(`actions-focus-${width}.png`);

    const field = page.getByRole("textbox", {
      name: "Project name",
      exact: true,
    });
    await field.focus();
    await expect(field).toBeFocused();
    await expect(field).toHaveCSS("outline-style", "solid");
    await expect(
      page.locator(".pancake-surface").filter({ has: field }),
    ).toHaveScreenshot(`fields-focus-${width}.png`);
  });
}
