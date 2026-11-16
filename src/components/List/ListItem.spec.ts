import { test, expect } from "../../../tests/contracts-fixture";

test("ListItem: shows title, description, decorative leading and a keyboard-operable trailing action", async ({
  page,
}) => {
  const row = page
    .getByRole("list", { name: "Contract people" })
    .getByRole("listitem")
    .first();
  await expect(row).toContainText("ada@example.com");
  await expect(row).toContainText("Owner");
  await expect(row).toHaveAttribute("data-ref-ready", "true");
  await expect(row).toHaveClass(/consumer-list-item/);
  await expect(row.getByRole("img")).toHaveCount(0);
  const remove = row.getByRole("button", { name: "Remove ada@example.com" });
  await remove.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("List removals")).toHaveText("1");
  const title = row.getByText("ada@example.com", { exact: true });
  const removeBox = await remove.boundingBox();
  const titleBox = await title.boundingBox();
  expect(removeBox!.x).toBeGreaterThan(titleBox!.x + titleBox!.width);
});

test("ListItem: long unbroken titles wrap inside a narrow screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  const row = page
    .getByRole("list", { name: "Contract people" })
    .getByRole("listitem")
    .last();
  await expect(row).toContainText("Member");
  expect(
    await row.evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
