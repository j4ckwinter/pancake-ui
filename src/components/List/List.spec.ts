import { test, expect } from "../../../tests/contracts-fixture";

test("List: names the list, keeps native props, refs and consumer styling", async ({
  page,
}) => {
  const list = page.getByRole("list", { name: "Contract people" });
  await expect(list).toBeVisible();
  await expect(list.getByRole("listitem")).toHaveCount(2);
  await expect(list).toHaveAttribute("data-ref-ready", "true");
  await expect(list).toHaveClass(/pancake-list/);
  await expect(list).toHaveClass(/consumer-list/);
  await expect(list).toHaveCSS("border-radius", "0px");
  await expect(list).toHaveCSS("list-style-type", "none");
});
