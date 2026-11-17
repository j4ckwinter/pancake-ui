import { test, expect } from "./fixtures";
import { storyUrl } from "./servers";

test("Motion: controls ease between states and buttons give under a press", async ({
  page,
}) => {
  await page.goto(storyUrl("actions-button--default"));
  const button = page.getByRole("button").first();
  await expect(button).toHaveCSS("transition-duration", /0\.12s/);
  await button.hover();
  await page.mouse.down();
  await expect(button).toHaveCSS("scale", "0.97");
  await page.mouse.up();
  await expect(button).toHaveCSS("scale", "none");
});

test("Motion: dialogs fade in and out of view", async ({ page }) => {
  await page.goto(storyUrl("overlays-dialog--default"));
  await page.getByRole("button", { name: "Open dialog" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveCSS("transition-duration", /0\.2s/);
  await expect(dialog).toHaveCSS("opacity", "1");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("Motion: reduced motion turns transitions and the press off", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(storyUrl("actions-button--default"));
  const button = page.getByRole("button").first();
  await expect(button).toHaveCSS("transition-duration", /^0s/);
  await button.hover();
  await page.mouse.down();
  await expect(button).not.toHaveCSS("scale", "0.97");
  await page.mouse.up();
});
