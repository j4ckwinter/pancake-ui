import { test, expect } from "../../../tests/contracts-fixture";
import { assertFieldName } from "../../../tests/contracts-fixture";

test("TextField: state, descriptions, disabled, form reset and ref", async ({
  page,
}) => {
  const field = page.getByRole("textbox", {
    name: "Controlled title",
    exact: true,
  });
  await assertFieldName(field);
  await page.getByRole("button", { name: "Focus text ref" }).click();
  await expect(field).toBeFocused();
  await field.fill("Updated");
  await expect(field).toHaveValue("Updated");
  await expect(page.getByLabel("Text change count")).toHaveText("1");
  await expect(field).toHaveAccessibleDescription(
    "Shared external guidance Your project title",
  );
  await page.getByRole("button", { name: "Toggle validation" }).click();
  await expect(field).toHaveAttribute("aria-invalid", "true");
  await expect(field).toHaveAccessibleDescription(
    "Shared external guidance Please correct this title",
  );
  await expect(
    page.getByRole("textbox", { name: "Disabled title" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("textbox", { name: "Read only title" }),
  ).not.toBeEditable();
  const uncontrolled = page.getByRole("textbox", {
    name: "Uncontrolled title",
    exact: true,
  });
  await uncontrolled.fill("Changed");
  await page.getByRole("button", { name: "Submit contracts" }).click();
  await expect(page.getByLabel("Submitted values")).toContainText(
    '"title":"Updated"',
  );
  await expect(page.getByLabel("Submitted values")).toContainText(
    '"uncontrolled":"Changed"',
  );
  await page.getByRole("button", { name: "Reset contracts" }).click();
  await expect(field).toHaveValue("Initial");
  await expect(uncontrolled).toHaveValue("Original");
});
