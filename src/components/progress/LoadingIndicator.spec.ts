import { test, expect } from "../../../tests/contracts-fixture";

test("LoadingIndicator: status semantics, visible label and root ref", async ({
  page,
}) => {
  const status = page.locator('[data-contract="LoadingIndicator"]');
  await expect(status).toHaveRole("status");
  await expect(status).toHaveAttribute("aria-atomic", "true");
  await expect(status).toHaveJSProperty("tagName", "DIV");
  await expect(status).toHaveJSProperty("tabIndex", -1);
  await expect(status).toHaveText("Loading records");
  await expect(status).toHaveAttribute("data-ref-ready", "true");
  await expect(status).toHaveClass(/consumer-loading/);
  await expect(status).toHaveCSS("padding", "12px");
  await expect(status.locator(".pancake-loading-dots")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(status).not.toHaveAttribute("aria-valuenow");
});

test("LoadingIndicator: status text updates in place", async ({ page }) => {
  const status = page.locator('[data-contract="LoadingIndicator"]');
  await status.evaluate((element) =>
    element.setAttribute("data-original", "true"),
  );
  await page.getByRole("button", { name: "Complete loading" }).click();
  await expect(status).toHaveText("Records loaded");
  await expect(status).toHaveAttribute("data-original", "true");
  await expect(status).toHaveRole("status");
});

test("LoadingIndicator: static reduced-motion and forced-color presentation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  const status = page.locator('[data-contract="LoadingIndicator"]');
  await expect(status).toBeVisible();
  await expect(status).toHaveText("Loading records");
  const supportsForcedColorAdjustment = await page.evaluate(() =>
    CSS.supports("forced-color-adjust", "auto"),
  );
  await expect(status).toHaveCSS(
    "forced-color-adjust",
    supportsForcedColorAdjustment ? "auto" : "",
  );
  const dots = status.locator(".pancake-loading-dot");
  await expect(dots).toHaveCount(3);
  for (const dot of await dots.all()) {
    await expect(dot).toHaveCSS("animation-name", "none");
  }
});
