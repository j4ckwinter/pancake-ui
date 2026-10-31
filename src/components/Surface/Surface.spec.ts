import { test, expect } from "../../../tests/contracts-fixture";

test("Surface: semantics and root ref", async ({ page }) => {
  await expect(page.locator('[data-contract="Surface"]')).toHaveAttribute(
    "data-ref-ready",
    "true",
  );
});
