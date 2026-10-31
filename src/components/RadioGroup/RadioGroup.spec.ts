import { test, expect } from "../../../tests/contracts-fixture";

test("RadioGroup: semantics, descriptions, native props and ref", async ({
  page,
}) => {
  const group = page.getByRole("group", {
    name: "Controlled contact",
    exact: true,
  });
  await expect(group).toHaveAccessibleDescription(
    "Shared selection guidance Choose a contact method",
  );
  await expect(
    group.getByRole("radio", { name: "Email", exact: true }),
  ).toHaveAccessibleDescription("Delivered to your inbox");
  await expect(group).toHaveClass(/consumer-radio/);
  await expect(group).toHaveCSS("padding", "4px");
  await page.getByRole("button", { name: "Inspect contact ref" }).click();
  await expect(group).toHaveAttribute("data-ref-ready", "true");
  await page.getByRole("button", { name: "Toggle contact error" }).click();
  await expect(group).toHaveAttribute("aria-invalid", "true");
  await expect(group).toHaveAccessibleDescription(
    "Shared selection guidance Check your contact choice",
  );
});

test("RadioGroup: keyboard, controlled state and disabled options", async ({
  page,
  browserName,
}) => {
  const group = page.getByRole("group", {
    name: "Controlled contact",
    exact: true,
  });
  const email = group.getByRole("radio", { name: "Email", exact: true });
  const post = group.getByRole("radio", { name: "Post", exact: true });
  await email.focus();
  await page.keyboard.press(
    browserName === "webkit" ? "Alt+Shift+Tab" : "Shift+Tab",
  );
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(email).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(post).toBeChecked();
  await expect(post).toBeFocused();
  await expect(post).toHaveCSS("outline-style", "solid");
  await expect(page.getByLabel("Contact changes", { exact: true })).toHaveText(
    "1",
  );
  await page.keyboard.press("ArrowUp");
  await expect(email).toBeChecked();
  await expect(page.getByLabel("Contact changes", { exact: true })).toHaveText(
    "2",
  );
  const phone = group.getByRole("radio", { name: "Phone", exact: true });
  await expect(phone).toBeDisabled();
  await phone.evaluate((element: HTMLInputElement) => element.click());
  await expect(phone).not.toBeChecked();
  const disabled = page
    .getByRole("group", { name: "Disabled contact", exact: true })
    .getByRole("radio", { name: "Post", exact: true });
  await expect(disabled).toBeDisabled();
  await disabled.evaluate((element: HTMLInputElement) => element.click());
  await expect(disabled).not.toBeChecked();
  await expect(page.getByLabel("Contact changes", { exact: true })).toHaveText(
    "2",
  );
});

test("RadioGroup: native submission, required validation and reset", async ({
  page,
}) => {
  const draft = page.getByRole("group", {
    name: "Uncontrolled contact",
    exact: true,
  });
  await draft.getByRole("radio", { name: "Post", exact: true }).check();
  await page.getByRole("button", { name: "Submit selections" }).click();
  await expect(page.getByLabel("Submitted selections")).toContainText(
    '"contact":"email"',
  );
  await expect(page.getByLabel("Submitted selections")).toContainText(
    '"draftContact":"post"',
  );
  await expect(page.getByLabel("Submitted selections")).toContainText(
    '"externalContact":"post"',
  );
  await expect(page.getByLabel("Submitted selections")).not.toContainText(
    "disabledContact",
  );
  const controlled = page.getByRole("group", {
    name: "Controlled contact",
    exact: true,
  });
  await controlled.getByRole("radio", { name: "Post", exact: true }).check();
  await page.getByRole("button", { name: "Reset selections" }).click();
  await expect(
    controlled.getByRole("radio", { name: "Email", exact: true }),
  ).toBeChecked();
  await expect(
    draft.getByRole("radio", { name: "Email", exact: true }),
  ).toBeChecked();
  const required = page.getByRole("group", {
    name: "Required contact",
    exact: true,
  });
  const email = required.getByRole("radio", { name: "Email", exact: true });
  expect(
    await email.evaluate((element: HTMLInputElement) =>
      element.checkValidity(),
    ),
  ).toBe(false);
  await email.check();
  expect(
    await email.evaluate((element: HTMLInputElement) =>
      element.checkValidity(),
    ),
  ).toBe(true);
});
