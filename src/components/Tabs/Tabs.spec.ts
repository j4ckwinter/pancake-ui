import { test, expect } from "../../../tests/contracts-fixture";

test("Tabs: associations, overrides and native root ref", async ({ page }) => {
  const root = page.getByTestId("controlled-tabs");
  const list = root.getByRole("tablist", { name: "Controlled tabs" });
  await expect(list).toHaveAttribute("aria-orientation", "horizontal");
  const first = list.getByRole("tab", { name: "First" });
  const panel = root.getByRole("tabpanel", { name: "First" });
  await expect(first).toHaveAttribute("aria-selected", "true");
  await expect(first).toHaveAttribute(
    "aria-controls",
    (await panel.getAttribute("id"))!,
  );
  await expect(panel).toHaveAttribute(
    "aria-labelledby",
    (await first.getAttribute("id"))!,
  );
  await expect(root.getByRole("tabpanel")).toHaveCount(1);
  await expect(root).toHaveClass(/consumer-tabs/);
  await expect(root).toHaveCSS("padding", "4px");
  await page.getByRole("button", { name: "Inspect tabs ref" }).click();
  await expect(root).toHaveAttribute("data-ref-ready", "true");
  expect(await root.evaluate((element) => element.tagName)).toBe("DIV");
});

test("Tabs: automatic keyboard navigation, disabled skipping and focus order", async ({
  page,
  browserName,
}) => {
  const root = page.getByTestId("controlled-tabs");
  const first = root.getByRole("tab", { name: "First" });
  const last = root.getByRole("tab", { name: "Last" });
  const tabKey = browserName === "webkit" ? "Alt+Tab" : "Tab";
  await page.getByRole("button", { name: "Before tabs", exact: true }).focus();
  await page.keyboard.press(tabKey);
  await expect(first).toBeFocused();
  await expect(first).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("ArrowRight");
  await expect(last).toBeFocused();
  await expect(last).toHaveAttribute("aria-selected", "true");
  await expect(first).toHaveAttribute("tabindex", "-1");
  await page.keyboard.press("ArrowRight");
  await expect(first).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(last).toBeFocused();
  await page.keyboard.press("Home");
  await expect(first).toBeFocused();
  await page.keyboard.press("End");
  await expect(last).toBeFocused();
  await expect(page.getByLabel("Tab selection events")).toHaveText("5");
  await page.keyboard.press(tabKey);
  await expect(root.getByRole("tabpanel", { name: "Last" })).toBeFocused();
  await page.keyboard.press(tabKey);
  await expect(
    page.getByRole("button", { name: "Submit tab form" }),
  ).toBeFocused();
  const locked = root.getByRole("tab", { name: "Locked" });
  await expect(locked).toBeDisabled();
  await locked.evaluate((element: HTMLButtonElement) => element.click());
  await expect(page.getByLabel("Tab selection events")).toHaveText("5");
});

test("Tabs: manual activation, vertical navigation and inherited RTL", async ({
  page,
}) => {
  const manual = page.getByRole("tablist", {
    name: "Manual tabs",
    exact: true,
  });
  const first = manual.getByRole("tab", { name: "First" });
  const last = manual.getByRole("tab", { name: "Last" });
  await last.focus();
  await last.press("Home");
  await expect(first).toBeFocused();
  await expect(last).toHaveAttribute("aria-selected", "true");
  await first.press("Space");
  await expect(first).toHaveAttribute("aria-selected", "true");
  await first.press("End");
  await last.press("Enter");
  await expect(last).toHaveAttribute("aria-selected", "true");
  const vertical = page.getByRole("tablist", {
    name: "Vertical tabs",
    exact: true,
  });
  await expect(vertical).toHaveAttribute("aria-orientation", "vertical");
  await vertical.getByRole("tab", { name: "First" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(vertical.getByRole("tab", { name: "First" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(vertical.getByRole("tab", { name: "Last" })).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(vertical.getByRole("tab", { name: "First" })).toBeFocused();
  const rtl = page.getByRole("tablist", { name: "RTL tabs", exact: true });
  await rtl.getByRole("tab", { name: "First" }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(rtl.getByRole("tab", { name: "Last" })).toBeFocused();
});

test("Tabs: controlled callbacks, mounted panels and native form safety", async ({
  page,
}) => {
  const root = page.getByTestId("controlled-tabs");
  const first = root.getByRole("tab", { name: "First" });
  const note = root.getByRole("textbox", { name: "Retained tab note" });
  await note.fill("Preserved draft");
  await first.click();
  await expect(page.getByLabel("Tab selection events")).toHaveText("0");
  await root.getByRole("tab", { name: "Last" }).click();
  await expect(page.getByLabel("Tab selection events")).toHaveText("1");
  await expect(note).toBeHidden();
  await first.click();
  await expect(note).toHaveValue("Preserved draft");
  await expect(page.getByLabel("Tab selection events")).toHaveText("2");
  await first.press("Enter");
  await expect(page.getByLabel("Tab form submissions")).toHaveText("0");
  await page.getByRole("button", { name: "Submit tab form" }).click();
  await expect(page.getByLabel("Tab form submissions")).toHaveText("1");
});

test("Tabs: invalid selections and dynamic items normalize without callbacks", async ({
  page,
}) => {
  const list = page.getByRole("tablist", { name: "Dynamic tabs", exact: true });
  await expect(list.getByRole("tab", { name: "First" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByLabel("Dynamic tab events")).toHaveText("0");
  await list.getByRole("tab", { name: "Last" }).click();
  await expect(page.getByLabel("Dynamic tab events")).toHaveText("1");
  await page.getByRole("button", { name: "Toggle last tab" }).click();
  await expect(list.getByRole("tab", { name: "First" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("button", { name: "Toggle all tabs disabled" }).click();
  await expect(list.locator('[aria-selected="true"]')).toHaveCount(0);
  await expect(list.locator('[tabindex="0"]')).toHaveCount(0);
  await expect(list.locator("..").getByRole("tabpanel")).toHaveCount(0);
  await page.getByRole("button", { name: "Toggle empty tabs" }).click();
  await expect(list.getByRole("tab")).toHaveCount(0);
  await page.getByRole("button", { name: "Toggle empty tabs" }).click();
  await page.getByRole("button", { name: "Toggle all tabs disabled" }).click();
  await expect(list.getByRole("tab", { name: "First" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByLabel("Dynamic tab events")).toHaveText("1");
});
