import { test, expect } from "./fixtures";
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
  expect(
    await page
      .locator(".note")
      .evaluate((node) => parseFloat(getComputedStyle(node).lineHeight)),
  ).toBeCloseTo(16.8, 4);
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
  browserName,
}) => {
  await page.goto("http://127.0.0.1:4173");
  const name = page.getByRole("textbox", { name: "Your name" });
  const updates = page.getByRole("checkbox", { name: "Send me updates" });
  await expect(name).toHaveCSS("border-color", "rgb(99, 107, 110)");
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
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
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(updates).toBeFocused();
  await expect(updates).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Space");
  await expect(updates).toBeChecked();
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(
    page.getByRole("button", { name: "Save preferences" }),
  ).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Save preferences" }),
  ).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("status", { name: "Preference result" }),
  ).toHaveText("Saved Alex · updates yes");
  await page.getByRole("button", { name: "Focus name" }).click();
  await expect(name).toBeFocused();
  await expect(
    page.getByRole("status", { name: "Preference result" }),
  ).toHaveText("Saved Alex · updates yes");
  await page.getByText("Send me updates", { exact: true }).click();
  await expect(updates).not.toBeChecked();
  await name.press("Enter");
  await expect(
    page.getByRole("status", { name: "Preference result" }),
  ).toHaveText("Saved Alex · updates off");
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
  await expect(
    page.getByRole("status", { name: "Preference result" }),
  ).toBeEmpty();
});

test("avatars recover from missing images and expose overflow identities", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:4173");
  const avatar = page.getByRole("img", { name: "Taylor Brooks", exact: true });
  await expect(avatar).toHaveText("TB");
  await page.getByRole("button", { name: "Try missing photo" }).click();
  await expect(avatar).toHaveText("TB");
  await page.getByRole("button", { name: "Load photo" }).click();
  await expect(avatar.locator("img")).toBeVisible();
  expect(
    await avatar
      .locator("img")
      .evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
  ).toBe(true);
  const group = page.getByRole("list", { name: "Project team" });
  await expect(group.getByRole("img", { name: "Alex Morgan" })).toBeVisible();
  await expect(group.getByRole("img", { name: "1 more: Jo Chen" })).toHaveText(
    "+1",
  );
});

test("feedback actions, navigation links, progress and theme overrides work", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:4173");
  await page.getByRole("button", { name: "Show notification" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Changes saved" }),
  ).toBeVisible();
  const dismiss = page.getByRole("button", { name: "Dismiss notification" });
  await dismiss.focus();
  await page.keyboard.press("Enter");
  await expect(dismiss).toHaveCount(0);
  await page.getByRole("button", { name: "Check for updates" }).click();
  await expect(page.getByText("Changes saved", { exact: true })).toBeVisible();
  const nav = page.getByRole("navigation", { name: "Catalogue navigation" });
  await expect(nav.getByRole("link", { name: "People" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await nav.getByRole("link", { name: "Updates" }).click();
  await expect(page).toHaveURL(/#updates$/);
  await expect(
    page
      .getByRole("list", { name: "Progress" })
      .locator('[aria-current="step"]'),
  ).toHaveText("2Preferences");
  const themed = page.getByLabel("Custom theme");
  await expect(themed).toHaveCSS("gap", "30px");
  await expect(themed.getByRole("heading")).toHaveCSS(
    "color",
    "rgb(56, 69, 64)",
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("segmented selections support arrow keys, native form data, disabled options and reset", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:4173");
  const period = page.getByRole("group", { name: "Period", exact: true });
  const week = period.getByRole("radio", { name: "Week" });
  const month = period.getByRole("radio", { name: "Month" });
  await week.focus();
  await page.keyboard.press("ArrowRight");
  await expect(month).toBeChecked();
  await page.keyboard.press("ArrowLeft");
  await expect(week).toBeChecked();
  await expect(period.getByRole("radio", { name: "Year" })).toBeDisabled();
  await month.check();
  const visibility = page.getByRole("group", { name: "Visibility" });
  await visibility.getByRole("radio", { name: "Public" }).check();
  await expect(
    page
      .getByRole("group", { name: "Locked selection" })
      .getByRole("radio", { name: "No", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Apply display" }).click();
  await expect(page.getByLabel("Display summary")).toHaveText("month / public");
  await page.getByRole("button", { name: "Reset display" }).click();
  await expect(week).toBeChecked();
  await expect(
    visibility.getByRole("radio", { name: "Private" }),
  ).toBeChecked();
});

test("installed theme builds utilities for a Tailwind consumer", async ({
  page,
}) => {
  const { readFile } = await import("node:fs/promises");
  await page.setContent(
    '<main><p class="bg-pancake-accent p-pancake-24 text-pancake-body">Theme integration</p></main>',
  );
  await page.addStyleTag({
    content: await readFile(".tmp/theme-proof.css", "utf8"),
  });
  const text = page.getByText("Theme integration");
  await expect(text).toHaveCSS("background-color", "rgb(173, 229, 51)");
  await expect(text).toHaveCSS("padding", "24px");
  await expect(text).toHaveCSS("font-size", "14px");
  expect(
    await text.evaluate((node) =>
      parseFloat(getComputedStyle(node).lineHeight),
    ),
  ).toBeCloseTo(16.8, 4);
});
