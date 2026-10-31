import { test, expect } from "../../../tests/contracts-fixture";
import {
  assertActionCount,
  assertDisabled,
} from "../../../tests/contracts-fixture";

test("Button: keyboard activation, inactivity, default type and ref", async ({
  page,
}) => {
  const action = page.getByRole("button", {
    name: "Count action",
    exact: true,
  });
  await page.getByRole("button", { name: "Focus action ref" }).click();
  await expect(action).toBeFocused();
  await page.keyboard.press("Enter");
  await assertActionCount(page, "1");
  await page.keyboard.press("Space");
  await expect(page.getByLabel("Action count", { exact: true })).toHaveText(
    "2",
  );
  await expect(page.getByLabel("Submit count")).toHaveText("0");
  for (const label of ["Disabled action", "Loading action"]) {
    const control = page.getByRole("button", { name: label, exact: true });
    await assertDisabled(control);
    await control.evaluate((element: HTMLButtonElement) => element.click());
  }
  await expect(
    page.getByRole("button", { name: "Loading action" }),
  ).toHaveAttribute("aria-busy", "true");
  await expect(page.getByLabel("Action count", { exact: true })).toHaveText(
    "2",
  );
});
