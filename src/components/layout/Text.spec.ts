import { test, expect } from "../../../tests/contracts-fixture";

test("Text: semantics and root ref", async ({ page }) => {
  await expect(page.locator('[data-contract="Text"]')).toHaveAttribute(
    "data-ref-ready",
    "true",
  );
  await expect(page.locator('p[data-contract="Text"]')).toHaveText(
    "Semantic text",
  );
});
