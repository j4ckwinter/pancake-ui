import { test, expect } from "../../../tests/contracts-fixture";

test("AvatarGroup: semantics and root ref", async ({ page }) => {
  await expect(page.locator('[data-contract="AvatarGroup"]')).toHaveAttribute(
    "data-ref-ready",
    "true",
  );
  await expect(page.getByRole("img", { name: "1 more: Jo Chen" })).toHaveText(
    "+1",
  );
});
