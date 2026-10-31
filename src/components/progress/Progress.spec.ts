import { test, expect } from "../../../tests/contracts-fixture";

test("Progress: native semantics, label, normalization and ref", async ({
  page,
}) => {
  const progress = page.getByRole("progressbar", { name: "Import progress" });
  await expect(progress).toHaveJSProperty("tagName", "PROGRESS");
  await expect(progress).toHaveAccessibleDescription("Records processed");
  await expect(progress).toHaveJSProperty("max", 100);
  await expect(progress).toHaveJSProperty("value", 25);
  await expect(progress).toHaveJSProperty("position", 0.25);
  await expect(progress).toHaveAttribute("data-ref-ready", "true");
  await expect(progress).toHaveClass(/consumer-progress/);
  await expect(progress).toHaveCSS("height", "24px");
  const id = await progress.getAttribute("id");
  expect(id).toBeTruthy();
  await expect(page.locator(`label[for="${id}"]`)).toHaveText(
    "Import progress",
  );
  const bounded = page.getByRole("progressbar", {
    name: "Bounded progress",
    exact: true,
  });
  await expect(bounded).toHaveAttribute("id", "custom-progress");
  await expect(bounded).toHaveJSProperty("value", 40);
  await expect(bounded).toHaveJSProperty("max", 40);
  await expect(
    page.getByRole("progressbar", { name: "Negative progress", exact: true }),
  ).toHaveJSProperty("value", 0);
  const invalidMax = page.getByRole("progressbar", {
    name: "Invalid maximum progress",
  });
  await expect(invalidMax).toHaveJSProperty("max", 1);
  await expect(invalidMax).toHaveJSProperty("value", 1);
});

test("Progress: determinate and indeterminate state transitions", async ({
  page,
}) => {
  const progress = page.getByRole("progressbar", { name: "Import progress" });
  await page.getByRole("button", { name: "Wait for progress" }).click();
  await expect(progress).not.toHaveAttribute("value");
  await expect(progress).toHaveJSProperty("position", -1);
  await expect(progress).toHaveAccessibleName("Import progress");
  await page.getByRole("button", { name: "Advance progress" }).click();
  await expect(progress).toHaveAttribute("value", "75");
  await expect(progress).toHaveJSProperty("position", 0.75);
});

test("Progress: native rendering remains available in forced colors", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  const progress = page.getByRole("progressbar", { name: "Import progress" });
  await expect(progress).toBeVisible();
  await expect(progress).toHaveJSProperty("position", 0.25);
  expect(
    await progress.evaluate((element) => getComputedStyle(element).appearance),
  ).not.toBe("none");
  const supportsForcedColorAdjustment = await page.evaluate(() =>
    CSS.supports("forced-color-adjust", "auto"),
  );
  await expect(progress).toHaveCSS(
    "forced-color-adjust",
    supportsForcedColorAdjustment ? "auto" : "",
  );
});
