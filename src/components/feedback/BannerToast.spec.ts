import { test, expect } from "../../../tests/contracts-fixture";

test("BannerToast: live semantics and keyboard dismissal", async ({ page }) => {
  const banner = page
    .getByRole("status")
    .filter({ hasText: "Saved notification" });
  await expect(banner).toHaveAttribute("aria-live", "polite");
  await expect(banner).toHaveAttribute("data-ref-ready", "true");
  await expect(page.getByRole("alert")).toHaveAttribute(
    "aria-live",
    "assertive",
  );
  await page.getByRole("button", { name: "Dismiss notification" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Dismiss count")).toHaveText("1");
});
