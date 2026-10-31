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

test("TextField: native number semantics, changes, constraints and consumer props", async ({
  page,
}) => {
  const quantity = page.getByRole("spinbutton", {
    name: "Native quantity",
    exact: true,
  });
  await expect(quantity).toHaveAttribute("type", "number");
  await expect(quantity).toHaveAccessibleName("Native quantity");
  await expect(quantity).toHaveAccessibleDescription(
    "Native quantity guidance Enter an even quantity",
  );
  await expect(quantity).toHaveClass(/consumer-native-field/);
  await expect(quantity).toHaveAttribute("style", "width: 90%;");
  await expect(quantity).toHaveAttribute("data-native-consumer", "quantity");
  await page.getByRole("button", { name: "Focus native quantity ref" }).click();
  await expect(quantity).toBeFocused();
  await quantity.fill("4");
  await expect(quantity).toHaveValue("4");
  await expect(page.getByLabel("Native quantity changes")).toHaveText("1");
  await expect(page.getByLabel("Native numeric value")).toHaveText("4");
  await quantity.fill("");
  await expect(quantity).toHaveValue("");
  await expect(page.getByLabel("Native quantity changes")).toHaveText("2");
  await expect(page.getByLabel("Native numeric value")).toHaveText("NaN");
  await expect
    .poll(() =>
      quantity.evaluate(
        (input: HTMLInputElement) => input.validity.valueMissing,
      ),
    )
    .toBe(true);
  await quantity.fill("-2");
  await expect
    .poll(() =>
      quantity.evaluate(
        (input: HTMLInputElement) => input.validity.rangeUnderflow,
      ),
    )
    .toBe(true);
  await quantity.fill("12");
  await expect
    .poll(() =>
      quantity.evaluate(
        (input: HTMLInputElement) => input.validity.rangeOverflow,
      ),
    )
    .toBe(true);
  await quantity.fill("3");
  await expect
    .poll(() =>
      quantity.evaluate(
        (input: HTMLInputElement) => input.validity.stepMismatch,
      ),
    )
    .toBe(true);
  await quantity.fill("6");
  await expect
    .poll(() =>
      quantity.evaluate((input: HTMLInputElement) => input.validity.valid),
    )
    .toBe(true);
  await page
    .getByRole("button", { name: "Toggle native quantity error" })
    .click();
  await expect(quantity).toHaveAttribute("aria-invalid", "true");
  await expect(quantity).toHaveAccessibleDescription(
    "Native quantity guidance Check the quantity",
  );
});

test("TextField: native temporal semantics, constraints and refs", async ({
  page,
}) => {
  const date = page.getByLabel("Native start date");
  const time = page.getByLabel("Native start time");
  const appointment = page.getByLabel("Native appointment");
  await expect(date).toHaveAttribute("type", "date");
  await expect(date).toHaveAccessibleName("Native start date");
  await expect(time).toHaveAttribute("type", "time");
  await expect(time).toHaveAccessibleName("Native start time");
  await expect(appointment).toHaveAttribute("type", "datetime-local");
  await expect(appointment).toHaveAccessibleName("Native appointment");
  await page.getByRole("button", { name: "Focus native date ref" }).click();
  await expect(date).toBeFocused();
  for (const [field, below, above, valid] of [
    [date, "2026-05-31", "2026-07-01", "2026-06-20"],
    [time, "07:00", "19:00", "10:30"],
    [appointment, "2026-05-31T09:00", "2026-07-01T09:00", "2026-06-20T10:30"],
  ] as const) {
    await field.fill("");
    await expect
      .poll(() =>
        field.evaluate(
          (input: HTMLInputElement) => input.validity.valueMissing,
        ),
      )
      .toBe(true);
    await field.fill(below);
    await expect
      .poll(() =>
        field.evaluate(
          (input: HTMLInputElement) => input.validity.rangeUnderflow,
        ),
      )
      .toBe(true);
    await field.fill(above);
    await expect
      .poll(() =>
        field.evaluate(
          (input: HTMLInputElement) => input.validity.rangeOverflow,
        ),
      )
      .toBe(true);
    await field.fill(valid);
    await expect(field).toHaveValue(valid);
    await expect
      .poll(() =>
        field.evaluate((input: HTMLInputElement) => input.validity.valid),
      )
      .toBe(true);
  }
  await time.fill("10:31");
  await expect
    .poll(() =>
      time.evaluate((input: HTMLInputElement) => input.validity.stepMismatch),
    )
    .toBe(true);
});

test("TextField: native fields submit strings, omit disabled values and reset", async ({
  page,
}) => {
  const quantity = page.getByRole("spinbutton", {
    name: "Native quantity",
    exact: true,
  });
  const disabled = page.getByRole("spinbutton", {
    name: "Disabled native quantity",
  });
  const date = page.getByLabel("Native start date");
  const time = page.getByLabel("Native start time");
  const appointment = page.getByLabel("Native appointment");
  await expect(disabled).toBeDisabled();
  await quantity.fill("4");
  await date.fill("2026-06-20");
  await time.fill("10:30");
  await appointment.fill("2026-06-20T10:30");
  await page.getByRole("button", { name: "Submit native fields" }).click();
  await expect(page.getByLabel("Native form payload")).toHaveText(
    JSON.stringify({
      quantity: "4",
      startDate: "2026-06-20",
      startTime: "10:30",
      appointment: "2026-06-20T10:30",
    }),
  );
  await page.getByRole("button", { name: "Reset native fields" }).click();
  await expect(quantity).toHaveValue("2");
  await expect(date).toHaveValue("2026-06-15");
  await expect(time).toHaveValue("09:00");
  await expect(appointment).toHaveValue("2026-06-15T09:00");
  await expect(disabled).toHaveValue("8");
  await expect(page.getByLabel("Native quantity changes")).toHaveText("1");
});
