import { test, expect } from "../../../tests/contracts-fixture";

test("Stack: semantics and root ref", async ({ page }) => {
  await expect(page.locator('[data-contract="Stack"]')).toHaveAttribute(
    "data-ref-ready",
    "true",
  );
});
