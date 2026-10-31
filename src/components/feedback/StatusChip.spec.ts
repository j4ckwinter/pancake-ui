import { test, expect } from "../../../tests/contracts-fixture";

test("StatusChip: semantics and root ref", async ({ page }) => {
  await expect(page.locator('[data-contract="StatusChip"]')).toHaveAttribute(
    "data-ref-ready",
    "true",
  );
  await expect(page.locator('[data-contract="StatusChip"]')).toHaveText(
    "Ready status",
  );
});
