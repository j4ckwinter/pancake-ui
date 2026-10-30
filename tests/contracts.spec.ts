import type { Locator, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

const story =
  "http://127.0.0.1:6007/iframe.html?id=verification-contracts--interactive&viewMode=story";
test.beforeEach(async ({ page }) => {
  await page.goto(story);
  await expect(
    page.getByRole("heading", { name: "Component contracts" }),
  ).toBeVisible();
});

async function assertActionCount(page: Page, expected: string) {
  await expect(page.getByLabel("Action count", { exact: true })).toHaveText(
    expected,
    {
      timeout: 1000,
    },
  );
}
async function assertFieldName(field: Locator) {
  await expect(field).toHaveAccessibleName("Controlled title", {
    timeout: 1000,
  });
}
async function assertDisabled(control: Locator) {
  await expect(control).toBeDisabled({ timeout: 1000 });
}

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

test("BannerToast: live semantics and keyboard dismissal", async ({ page }) => {
  const banner = page
    .getByRole("status")
    .filter({ hasText: "Saved notification" });
  await expect(banner).toHaveAttribute("aria-live", "polite");
  await expect(banner).toHaveAttribute("data-ref-ready", "true");
  await expect(page.getByRole("alert")).toHaveAttribute(
    "aria-live",
    "assertive",
  );
  await page.getByRole("button", { name: "Dismiss notification" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Dismiss count")).toHaveText("1");
});

test("BottomNavigation: native keyboard navigation and active semantics", async ({
  page,
}) => {
  const navigation = page.getByRole("navigation", {
    name: "Contract navigation",
  });
  await expect(navigation).toHaveAttribute("data-ref-ready", "true");
  await expect(navigation.getByRole("link", { name: "Home" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  const details = navigation.getByRole("link", { name: "Details" });
  await details.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#details$/);
  await expect(details).not.toHaveAttribute("aria-current");
});

test("EmptyState: semantic content, decorative icon and action", async ({
  page,
}) => {
  await expect(
    page.getByRole("heading", { name: "No results", level: 3 }),
  ).toBeVisible();
  await expect(
    page.getByText("Decorative symbol").locator(".."),
  ).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator('[data-contract="EmptyState"]')).toHaveAttribute(
    "data-ref-ready",
    "true",
  );
  await page.getByRole("button", { name: "Create an item" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Empty action count")).toHaveText("1");
});

test("Presentation components: semantics and root refs", async ({ page }) => {
  for (const name of [
    "Stack",
    "Inline",
    "Text",
    "Surface",
    "AppHeader",
    "SectionHeader",
    "Avatar",
    "AvatarGroup",
    "StatusChip",
    "StepProgress",
  ]) {
    await expect(page.locator(`[data-contract="${name}"]`)).toHaveAttribute(
      "data-ref-ready",
      "true",
    );
  }
  await expect(
    page.getByRole("heading", { name: "Component contracts", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Form contracts", level: 2 }),
  ).toBeVisible();
  await expect(page.locator('p[data-contract="Text"]')).toHaveText(
    "Semantic text",
  );
  await expect(
    page.getByRole("img", { name: "Alex Morgan", exact: true }),
  ).toHaveText("AM");
  await expect(
    page.getByRole("img", { name: "Decorative person" }),
  ).toHaveCount(0);
  await expect(page.getByRole("img", { name: "1 more: Jo Chen" })).toHaveText(
    "+1",
  );
  await expect(page.locator('[data-contract="StatusChip"]')).toHaveText(
    "Ready status",
  );
  await expect(
    page
      .getByRole("list", { name: "Progress" })
      .locator('[aria-current="step"]'),
  ).toHaveText("2Second");
  await expect(
    page.getByRole("list", { name: "Progress" }).locator("[data-complete]"),
  ).toHaveText("✓First (complete)");
});

test("Accessibility: default, error and selected states", async ({ page }) => {
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Toggle validation" }).click();
  await page
    .getByRole("checkbox", { name: "Controlled agreement", exact: true })
    .check();
  await page
    .getByRole("group", { name: "Controlled period", exact: true })
    .getByRole("radio", { name: "Two" })
    .check();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto(
    "http://127.0.0.1:6007/iframe.html?id=foundations-comparison--catalogue&viewMode=story",
  );
  await expect(page.getByTestId("comparison")).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Accessibility: narrow layout, reduced motion and forced colours", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  const field = page.getByRole("textbox", {
    name: "Controlled title",
    exact: true,
  });
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press("Tab");
    if (await field.evaluate((element) => element === document.activeElement))
      break;
  }
  await expect(field).toBeFocused();
  await expect(field).toHaveCSS("outline-style", "solid");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("checkbox", { name: "Controlled agreement", exact: true })
    .check();
  await expect(
    page.getByRole("checkbox", { name: "Controlled agreement", exact: true }),
  ).toBeChecked();
});

test("Contract probes reject broken callbacks, labels and disabled semantics", async ({
  page,
}) => {
  const action = page.getByRole("button", {
    name: "Count action",
    exact: true,
  });
  await action.evaluate((element) =>
    element.replaceWith(element.cloneNode(true)),
  );
  await page.getByRole("button", { name: "Count action", exact: true }).click();
  await expect(assertActionCount(page, "1")).rejects.toThrow();

  const field = page.locator('[data-contract="TextField"]');
  await field.evaluate((element: HTMLInputElement) => {
    for (const label of [...(element.labels ?? [])]) label.remove();
  });
  await expect(assertFieldName(field)).rejects.toThrow();

  const disabled = page.getByRole("button", {
    name: "Disabled action",
    exact: true,
  });
  await disabled.evaluate((element) => element.removeAttribute("disabled"));
  await expect(assertDisabled(disabled)).rejects.toThrow();
});
