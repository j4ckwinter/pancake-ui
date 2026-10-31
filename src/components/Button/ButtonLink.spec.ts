import { test, expect } from "../../../tests/contracts-fixture";

test("ButtonLink: native link semantics, keyboard navigation and ref", async ({
  page,
  browserName,
}) => {
  const link = page.getByRole("link", { name: "Open action details" });
  await expect(link).toHaveAttribute("href", "#action-details");
  await expect(link).toHaveClass(/consumer-link/);
  await expect(link).toHaveCSS("border-radius", "0px");
  await expect(link).toHaveCSS("text-decoration-line", "none");
  await page.getByRole("button", { name: "Focus link ref" }).click();
  await expect(link).toBeFocused();
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await page.keyboard.press(
    browserName === "webkit" ? "Alt+Shift+Tab" : "Shift+Tab",
  );
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#action-details$/);
  await expect(page.getByLabel("Icon form submissions")).toHaveText("0");
  const download = page.getByRole("link", { name: "Download document" });
  await expect(download).toHaveAttribute("download", "document.pdf");
  await expect(download).toHaveAttribute("target", "_blank");
  await expect(download).toHaveAttribute("rel", "noopener");
});

test("ButtonLink: consumers can prevent native navigation", async ({
  page,
}) => {
  const link = page.getByRole("link", { name: "Prevent navigation" });
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Prevented navigation count")).toHaveText("1");
  await expect(page).not.toHaveURL(/#prevented-action$/);
  await expect(page.getByLabel("Icon form submissions")).toHaveText("0");
});
