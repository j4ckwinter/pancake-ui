import { test, expect } from "../../../tests/contracts-fixture";

test("BottomNavigation: native keyboard navigation and active semantics", async ({
  page,
}) => {
  const navigation = page.getByRole("navigation", {
    name: "Contract navigation",
  });
  await expect(navigation).toHaveAttribute("data-ref-ready", "true");
  await expect(navigation.getByRole("link", { name: "Home" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  const details = navigation.getByRole("link", { name: "Details" });
  await details.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#details$/);
  await expect(details).not.toHaveAttribute("aria-current");
});
