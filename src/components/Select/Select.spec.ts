import { test, expect } from "../../../tests/contracts-fixture";

test("Select: native semantics, keyboard selection, descriptions and ref", async ({
  page,
  browserName,
}) => {
  const colour = page.getByRole("combobox", {
    name: "Controlled colour",
    exact: true,
  });
  await expect(colour).toHaveClass(/consumer-select/);
  await expect(colour).toHaveCSS("border-radius", "0px");
  await expect(colour).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(colour).toHaveAccessibleDescription(
    "Shared field guidance Choose the colour",
  );
  await expect(
    colour.getByRole("option", { name: "Unavailable green" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Focus colour ref" }).click();
  await expect(colour).toBeFocused();
  await page.getByRole("button", { name: "Focus notes ref" }).focus();
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(colour).toBeFocused();
  await page.keyboard.press("b");
  await expect(colour).toHaveValue("blue");
  await expect(colour).toHaveCSS("outline-style", "solid");
  await expect(page.getByLabel("Colour change count")).toHaveText("1");
  await page.getByRole("button", { name: "Toggle field errors" }).click();
  await expect(colour).toHaveAttribute("aria-invalid", "true");
  await expect(colour).toHaveAccessibleDescription(
    "Shared field guidance Colour needs attention",
  );
  await expect(
    page.getByRole("combobox", { name: "Disabled colour", exact: true }),
  ).toBeDisabled();
});

test("Select: required validation, submission and controlled/uncontrolled reset", async ({
  page,
}) => {
  const colour = page.getByRole("combobox", {
    name: "Controlled colour",
    exact: true,
  });
  const draft = page.getByRole("combobox", {
    name: "Uncontrolled colour",
    exact: true,
  });
  await colour.selectOption("");
  await page.getByRole("button", { name: "Submit fields" }).click();
  await expect(colour).toBeFocused();
  await expect(page.getByLabel("Submitted fields")).toHaveText("");
  await colour.selectOption("blue");
  await draft.selectOption("blue");
  await page.getByRole("button", { name: "Submit fields" }).click();
  await expect(page.getByLabel("Submitted fields")).toContainText(
    '"colour":"blue"',
  );
  await expect(page.getByLabel("Submitted fields")).toContainText(
    '"draftColour":"blue"',
  );
  await expect(page.getByLabel("Submitted fields")).not.toContainText(
    "disabledColour",
  );
  await page.getByRole("button", { name: "Reset fields" }).click();
  await expect(colour).toHaveValue("red");
  await expect(draft).toHaveValue("red");
  await page.getByRole("button", { name: "Reset fields" }).click();
  await expect(colour).toHaveValue("red");
  await expect(draft).toHaveValue("red");
});
