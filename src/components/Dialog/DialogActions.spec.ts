import { test, expect } from "../../../tests/contracts-fixture";

test("DialogActions: buttons sit at the end in source order and keep native props and ref", async ({
  page,
  tabKey,
}) => {
  const actions = page.locator('[data-contract="DialogActions"]');
  await expect(actions).toHaveAttribute("data-ref-ready", "true");
  await expect(actions).toHaveClass(/consumer-actions/);
  await expect(actions).toHaveCSS("border-radius", "0px");
  const cancel = actions.getByRole("button", {
    name: "Cancel contract action",
  });
  const confirm = actions.getByRole("button", {
    name: "Confirm contract action",
  });
  const row = (await actions.boundingBox())!;
  const cancelBox = (await cancel.boundingBox())!;
  const confirmBox = (await confirm.boundingBox())!;
  expect(confirmBox.x).toBeGreaterThan(cancelBox.x);
  expect(row.x + row.width - (confirmBox.x + confirmBox.width)).toBeLessThan(1);
  await cancel.focus();
  await page.keyboard.press(tabKey);
  await expect(confirm).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Dialog actions pressed")).toHaveText(
    "confirm,",
  );
});

test("DialogActions: a submit button inside a dialog form closes the dialog with its value", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Open contract dialog" }).click();
  const modal = page.getByRole("dialog", { name: "Edit contract project" });
  await modal
    .getByRole("button", { name: "Confirm native dialog form" })
    .click();
  await expect(modal).not.toBeVisible();
  await expect(page.getByLabel("Dialog native return value")).toHaveText(
    "confirmed",
  );
});
