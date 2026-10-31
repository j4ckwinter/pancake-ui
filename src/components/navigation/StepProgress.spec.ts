import { test, expect } from "../../../tests/contracts-fixture";

test("StepProgress: semantics and root ref", async ({ page }) => {
  await expect(page.locator('[data-contract="StepProgress"]')).toHaveAttribute(
    "data-ref-ready",
    "true",
  );
  await expect(
    page
      .getByRole("list", { name: "Progress" })
      .locator('[aria-current="step"]'),
  ).toHaveText("2Second");
  await expect(
    page.getByRole("list", { name: "Progress" }).locator("[data-complete]"),
  ).toHaveText("✓First (complete)");
});
