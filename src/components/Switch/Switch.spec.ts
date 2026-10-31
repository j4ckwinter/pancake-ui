import { test, expect } from "../../../tests/contracts-fixture";

test("Switch: semantics, keyboard, callbacks, disabled state and ref", async ({
  page,
}) => {
  const control = page.getByRole("switch", {
    name: "Controlled notifications",
    exact: true,
  });
  await expect(control).not.toBeChecked();
  await expect(control).toHaveClass(/consumer-switch/);
  await expect(control).toHaveCSS("border-radius", "0px");
  await page.getByRole("button", { name: "Focus notification ref" }).click();
  await expect(control).toBeFocused();
  await page.keyboard.press("Space");
  await expect(control).toBeChecked();
  await expect(page.getByLabel("Notification events")).toHaveText(
    "native,checked,",
  );
  await page.keyboard.press("Space");
  await expect(control).not.toBeChecked();
  await expect(page.getByLabel("Notification events")).toHaveText(
    "native,checked,native,checked,",
  );
  const disabled = page.getByRole("switch", {
    name: "Disabled notifications",
    exact: true,
  });
  await expect(disabled).toBeDisabled();
  await disabled.evaluate((element: HTMLInputElement) => element.click());
  await expect(disabled).not.toBeChecked();
});

test("Switch: native submission, required validation and reset", async ({
  page,
}) => {
  const control = page.getByRole("switch", {
    name: "Controlled notifications",
    exact: true,
  });
  const draft = page.getByRole("switch", {
    name: "Uncontrolled notifications",
    exact: true,
  });
  await control.check();
  await draft.uncheck();
  await page.getByRole("button", { name: "Submit selections" }).click();
  await expect(page.getByLabel("Submitted selections")).toContainText(
    '"notifications":"yes"',
  );
  await expect(page.getByLabel("Submitted selections")).toContainText(
    '"externalNotifications":"yes"',
  );
  await expect(page.getByLabel("Submitted selections")).not.toContainText(
    "draftNotifications",
  );
  await expect(page.getByLabel("Submitted selections")).not.toContainText(
    "disabledNotifications",
  );
  await page.getByRole("button", { name: "Reset selections" }).click();
  await expect(control).not.toBeChecked();
  await expect(draft).toBeChecked();
  await expect(page.getByLabel("Notification events")).toHaveText(
    "native,checked,",
  );
  const required = page.getByRole("switch", {
    name: "Required notifications",
    exact: true,
  });
  expect(
    await required.evaluate((element: HTMLInputElement) =>
      element.checkValidity(),
    ),
  ).toBe(false);
  await required.check();
  expect(
    await required.evaluate((element: HTMLInputElement) =>
      element.checkValidity(),
    ),
  ).toBe(true);
});
