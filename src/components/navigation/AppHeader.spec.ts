import { test, expect } from "../../../tests/contracts-fixture";

test("AppHeader: semantics and root ref", async ({ page }) => {
  await expect(page.locator('[data-contract="AppHeader"]')).toHaveAttribute(
    "data-ref-ready",
    "true",
  );
  await expect(
    page.getByRole("heading", { name: "Component contracts", level: 1 }),
  ).toBeVisible();
});
