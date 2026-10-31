import { test, expect } from "../../../tests/contracts-fixture";

test("Textarea: native semantics, keyboard editing, descriptions and ref", async ({
  page,
}) => {
  const notes = page.getByRole("textbox", {
    name: "Controlled notes",
    exact: true,
  });
  await expect(notes).toHaveAttribute("rows", "4");
  await expect(notes).toHaveClass(/consumer-notes/);
  await expect(notes).toHaveCSS("border-radius", "0px");
  await expect(notes).toHaveAccessibleDescription(
    "Shared field guidance Describe the work",
  );
  await page.getByRole("button", { name: "Focus notes ref" }).click();
  await expect(notes).toBeFocused();
  await notes.fill("Updated");
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await page.keyboard.insertText("Second line");
  await expect(notes).toHaveValue("Updated\nSecond line");
  await expect(notes).toHaveCSS("outline-style", "solid");
  await expect(page.getByLabel("Notes change count")).toHaveText("3");
  await page.getByRole("button", { name: "Toggle field errors" }).click();
  await expect(notes).toHaveAttribute("aria-invalid", "true");
  await expect(notes).toHaveAccessibleDescription(
    "Shared field guidance Notes need attention",
  );
  await expect(
    page.getByRole("textbox", { name: "Disabled notes", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("textbox", { name: "Read only notes", exact: true }),
  ).not.toBeEditable();
});

test("Textarea: required validation, submission and controlled/uncontrolled reset", async ({
  page,
}) => {
  const notes = page.getByRole("textbox", {
    name: "Controlled notes",
    exact: true,
  });
  const draft = page.getByRole("textbox", {
    name: "Uncontrolled notes",
    exact: true,
  });
  await expect(draft).toHaveAttribute("rows", "2");
  await notes.fill("");
  await page.getByRole("button", { name: "Submit fields" }).click();
  await expect(notes).toBeFocused();
  await expect(page.getByLabel("Submitted fields")).toHaveText("");
  await notes.fill("Submitted notes");
  await draft.fill("Changed draft");
  await page.getByRole("button", { name: "Submit fields" }).click();
  await expect(page.getByLabel("Submitted fields")).toContainText(
    '"notes":"Submitted notes"',
  );
  await expect(page.getByLabel("Submitted fields")).toContainText(
    '"draft":"Changed draft"',
  );
  await expect(page.getByLabel("Submitted fields")).toContainText(
    '"readonlyNotes":"Fixed notes"',
  );
  await expect(page.getByLabel("Submitted fields")).not.toContainText(
    "disabledNotes",
  );
  await page.getByRole("button", { name: "Reset fields" }).click();
  await expect(notes).toHaveValue("Initial notes");
  await expect(draft).toHaveValue("Original draft");
});
