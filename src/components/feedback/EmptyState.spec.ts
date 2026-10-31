import { test, expect } from "../../../tests/contracts-fixture";

test("EmptyState: semantic content, decorative icon and action", async ({
  page,
}) => {
  await expect(
    page.getByRole("heading", { name: "No results", level: 3 }),
  ).toBeVisible();
  await expect(
    page.getByText("Decorative symbol").locator(".."),
  ).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator('[data-contract="EmptyState"]')).toHaveAttribute(
    "data-ref-ready",
    "true",
  );
  await page.getByRole("button", { name: "Create an item" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Empty action count")).toHaveText("1");
});
