import { test, expect } from "../../../tests/contracts-fixture";

test("SectionHeader: semantics and root ref", async ({ page }) => {
  await expect(page.locator('[data-contract="SectionHeader"]')).toHaveAttribute(
    "data-ref-ready",
    "true",
  );
  await expect(
    page.getByRole("heading", { name: "Form contracts", level: 2 }),
  ).toBeVisible();
});
