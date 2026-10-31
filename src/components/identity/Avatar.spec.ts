import { test, expect } from "../../../tests/contracts-fixture";

test("Avatar: semantics and root ref", async ({ page }) => {
  await expect(page.locator('[data-contract="Avatar"]')).toHaveAttribute(
    "data-ref-ready",
    "true",
  );
  await expect(
    page.getByRole("img", { name: "Alex Morgan", exact: true }),
  ).toHaveText("AM");
  await expect(
    page.getByRole("img", { name: "Decorative person" }),
  ).toHaveCount(0);
});
