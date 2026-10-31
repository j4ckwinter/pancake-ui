import { test, expect } from "../../../tests/contracts-fixture";

test("IconButton: accessible name, keyboard activation, inactivity and ref", async ({
  page,
  browserName,
}) => {
  const icon = page.getByRole("button", { name: "Add item", exact: true });
  await expect(icon).toHaveClass(/consumer-icon/);
  await expect(icon).toHaveCSS("border-radius", "0px");
  await expect(icon).toHaveCSS("width", "48px");
  await expect(icon).toHaveCSS("height", "48px");
  await expect(
    page.getByRole("img", { name: "Decorative icon name" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Focus icon ref" }).click();
  await expect(icon).toBeFocused();
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await page.keyboard.press(
    browserName === "webkit" ? "Alt+Shift+Tab" : "Shift+Tab",
  );
  await expect(icon).toBeFocused();
  await expect(icon).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Icon activation count")).toHaveText("1");
  await page.keyboard.press("Space");
  await expect(page.getByLabel("Icon activation count")).toHaveText("2");
  for (const name of ["Unavailable icon", "Loading icon"]) {
    const disabled = page.getByRole("button", { name, exact: true });
    await expect(disabled).toBeDisabled();
    await disabled.evaluate((element: HTMLButtonElement) => element.click());
  }
  await expect(
    page.getByRole("button", { name: "Loading icon" }),
  ).toHaveAttribute("aria-busy", "true");
  await expect(page.getByLabel("Icon activation count")).toHaveText("2");
});

test("IconButton: default button type and explicit form submission", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Add item", exact: true }).click();
  await expect(page.getByLabel("Icon form submissions")).toHaveText("0");
  await page.getByRole("button", { name: "Submit icon", exact: true }).click();
  await expect(page.getByLabel("Icon form submissions")).toHaveText("1");
  await expect(page.getByLabel("Submitted icon intent")).toHaveText("save");
});
