import { test, expect } from "../../../tests/contracts-fixture";

test("SegmentedControl: keyboard, state, disabled, submission, reset and ref", async ({
  page,
}) => {
  const group = page.getByRole("group", {
    name: "Controlled period",
    exact: true,
  });
  await expect(group).toHaveAttribute("data-ref-ready", "true");
  await group.getByRole("radio", { name: "One", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(group.getByRole("radio", { name: "Two" })).toBeChecked();
  await expect(page.getByLabel("Selection change count")).toHaveText("1");
  await expect(
    group.getByRole("radio", { name: "Unavailable" }),
  ).toBeDisabled();
  await page.keyboard.press("ArrowLeft");
  await expect(
    group.getByRole("radio", { name: "One", exact: true }),
  ).toBeChecked();
  await expect(page.getByLabel("Selection change count")).toHaveText("2");
  const uncontrolled = page.getByRole("group", {
    name: "Uncontrolled period",
    exact: true,
  });
  await uncontrolled.getByRole("radio", { name: "Two" }).check();
  const disabled = page.getByRole("group", {
    name: "Disabled period",
    exact: true,
  });
  await expect(disabled.getByRole("radio", { name: "Two" })).toBeDisabled();
  await page.getByRole("button", { name: "Submit contracts" }).click();
  await expect(page.getByLabel("Submitted values")).toContainText(
    '"period":"one"',
  );
  await expect(page.getByLabel("Submitted values")).toContainText(
    '"uncontrolledPeriod":"two"',
  );
  await page.getByRole("button", { name: "Reset contracts" }).click();
  await expect(
    uncontrolled.getByRole("radio", { name: "One", exact: true }),
  ).toBeChecked();
});
