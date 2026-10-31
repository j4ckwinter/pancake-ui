import { test, expect } from "../../../tests/contracts-fixture";

test("Checkbox: keyboard, event order, state, form reset and ref", async ({
  page,
}) => {
  const control = page.getByRole("checkbox", {
    name: "Controlled agreement",
    exact: true,
  });
  await page.getByRole("button", { name: "Focus checkbox ref" }).click();
  await expect(control).toBeFocused();
  await page.keyboard.press("Space");
  await expect(control).toBeChecked();
  await expect(page.getByLabel("Checkbox events")).toHaveText(
    "native,checked,",
  );
  await page.getByRole("button", { name: "Submit contracts" }).click();
  await expect(page.getByLabel("Submitted values")).toContainText(
    '"agreement":"yes"',
  );
  const uncontrolled = page.getByRole("checkbox", {
    name: "Uncontrolled agreement",
    exact: true,
  });
  await uncontrolled.uncheck();
  const disabled = page.getByRole("checkbox", { name: "Disabled agreement" });
  await expect(disabled).toBeDisabled();
  await disabled.evaluate((element: HTMLInputElement) => element.click());
  await expect(disabled).not.toBeChecked();
  await page.getByRole("button", { name: "Reset contracts" }).click();
  await expect(control).not.toBeChecked();
  await expect(uncontrolled).toBeChecked();
  await expect(page.getByLabel("Checkbox events")).toHaveText(
    "native,checked,",
  );
});
