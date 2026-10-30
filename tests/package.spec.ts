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

test("controls support keyboard focus, validation, and native form data", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:4173");
  const name = page.getByRole("textbox", { name: "Your name" });
  const updates = page.getByRole("checkbox", { name: "Send me updates" });
  await expect(name).toHaveCSS("border-color", "rgb(99, 107, 110)");
  await page.keyboard.press("Tab");
  await expect(name).toBeFocused();
  await expect(name).toHaveCSS("outline-style", "solid");
  await name.fill("A");
  await page.getByRole("button", { name: "Save preferences" }).click();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toBeFocused();
  await name.blur();
  await expect(name).toHaveCSS("border-color", "rgb(56, 69, 64)");
  await name.focus();
  await expect(name).toHaveAccessibleDescription(
    "Enter at least two characters.",
  );
  await expect(name).toBeFocused();
  await name.fill("Alex");
  await expect(name).not.toHaveAttribute("aria-invalid", "true");
  await page.keyboard.press("Tab");
  await expect(updates).toBeFocused();
  await expect(updates).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Space");
  await expect(updates).toBeChecked();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Save preferences" }),
  ).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Save preferences" }),
  ).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Saved Alex · updates yes");
  await page.getByRole("button", { name: "Focus name" }).click();
  await expect(name).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("Saved Alex · updates yes");
  await page.getByText("Send me updates", { exact: true }).click();
  await expect(updates).not.toBeChecked();
  await name.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Saved Alex · updates off");
});

test("read-only, disabled, loading, and uncontrolled controls retain browser semantics", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:4173");
  await expect(
    page.getByRole("textbox", { name: "Account email" }),
  ).not.toBeEditable();
  await expect(
    page.getByRole("button", { name: "Unavailable" }),
  ).toBeDisabled();
  const loading = page.getByRole("button", { name: "Saving" });
  await expect(loading).toBeDisabled();
  await expect(loading).toHaveAttribute("aria-busy", "true");
  const disabled = page.getByRole("checkbox", { name: "Disabled option" });
  await expect(disabled).toBeDisabled();
  await expect(disabled).toBeChecked();
  const agreement = page.getByRole("checkbox", { name: "Required agreement" });
  await expect(agreement).not.toBeChecked();
  expect(
    await agreement.evaluate((input: HTMLInputElement) =>
      input.checkValidity(),
    ),
  ).toBe(false);
  await agreement.check();
  expect(
    await agreement.evaluate((input: HTMLInputElement) =>
      input.checkValidity(),
    ),
  ).toBe(true);
  const name = page.getByRole("textbox", { name: "Your name" });
  await page.getByRole("button", { name: "Save preferences" }).click();
  await expect(name).toBeFocused();
  await expect(page.getByRole("status")).toBeEmpty();
});
