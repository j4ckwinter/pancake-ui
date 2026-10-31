import { test, expect } from "../../../tests/contracts-fixture";

test("Inline: semantics and root ref", async ({ page }) => {
  await expect(page.locator('[data-contract="Inline"]')).toHaveAttribute(
    "data-ref-ready",
    "true",
  );
});
