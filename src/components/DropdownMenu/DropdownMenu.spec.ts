import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../../../tests/contracts-fixture";

test("DropdownMenu: semantics, native props, refs and consumer styling", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "Contract menu",
    exact: true,
  });
  await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toHaveAttribute("data-ref-ready", "true");
  await trigger.click();
  const menu = page.getByRole("menu", { name: "Contract menu", exact: true });
  await expect(menu).toHaveAttribute("popover", "auto");
  await expect(menu).toHaveAttribute("data-ref-ready", "true");
  await expect(menu).toHaveClass(/consumer-menu/);
  await expect(menu).toHaveCSS("border-radius", "0px");
  await expect(menu).toHaveAccessibleDescription("Menu guidance");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(menu.getByRole("menuitem")).toHaveCount(5);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("DropdownMenu: keyboard entry, wrapping, disabled focus, typeahead and Escape", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "Contract menu",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("ArrowUp");
  await expect(
    page.getByRole("menuitem", { name: "Disabled destination" }),
  ).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitem", { name: "Alpha action" }),
  ).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitem", { name: "Disabled action", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Menu actions")).toHaveText("0");
  await expect(page.getByLabel("Menu keys")).toHaveText("3");
  await page.keyboard.press("b");
  await expect(
    page.getByRole("menuitem", { name: "Beta action" }),
  ).toBeFocused();
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("menuitem", { name: "Alpha action" }),
  ).toBeFocused();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("menuitem", { name: "Disabled destination" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("menuitem", { name: "Alpha action" }),
  ).toBeFocused();
});

test("DropdownMenu: actions fire once, restore focus and never submit forms", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "Contract menu",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Menu changes")).toHaveText("true,");
  await expect(
    page.getByRole("menuitem", { name: "Alpha action" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Menu actions")).toHaveText("1");
  await expect(trigger).toBeFocused();
  await expect(page.getByLabel("Menu changes")).toHaveText("true,false,");
  await expect(
    page.getByRole("menu", { name: "Contract menu", exact: true }),
  ).toBeHidden();
  await trigger.click();
  await expect(page.getByLabel("Menu changes")).toHaveText("true,false,true,");
  await page.getByRole("menuitem", { name: "Beta action" }).click();
  await expect(page.getByLabel("Menu actions")).toHaveText("2");
  await expect(page.getByLabel("Menu submissions")).toHaveText("0");
  await expect(page.getByLabel("Menu changes")).toHaveText(
    "true,false,true,false,",
  );
});

test("DropdownMenu: Tab exits the composite in both directions", async ({
  page,
  browserName,
}) => {
  const trigger = page.getByRole("button", {
    name: "Contract menu",
    exact: true,
  });
  const tab = browserName === "webkit" ? "Alt+Tab" : "Tab";
  await trigger.click();
  await page.keyboard.press(tab);
  await expect(
    page.getByRole("button", { name: "After menu", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("menu", { name: "Contract menu", exact: true }),
  ).toBeHidden();
  await trigger.click();
  await page.keyboard.press(`Shift+${tab}`);
  await expect(
    page.getByRole("button", { name: "Before menu", exact: true }),
  ).toBeFocused();
});

test("DropdownMenu: links preserve native destination and disabled items stay inactive", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Contract menu", exact: true })
    .click();
  const disabled = page.getByRole("menuitem", { name: "Disabled destination" });
  await expect(disabled).toHaveAttribute("aria-disabled", "true");
  await expect(disabled).not.toHaveAttribute("href");
  await disabled.evaluate((node: HTMLElement) => node.click());
  await expect(
    page.getByRole("menu", { name: "Contract menu", exact: true }),
  ).toBeVisible();
  const link = page.getByRole("menuitem", { name: "Read menu guide" });
  await expect(link).toHaveAttribute("href", "#menu-guide");
  await expect(link).toHaveAttribute("target", "_self");
  await expect(link).toHaveAttribute("rel", "help");
  await link.focus();
  await page.keyboard.press("Space");
  await expect(page).toHaveURL(/#menu-guide$/);
  await expect(
    page.getByRole("menu", { name: "Contract menu", exact: true }),
  ).toBeHidden();
  await expect(page.getByLabel("Menu actions")).toHaveText("0");
});

test("DropdownMenu: disabled, empty, canceled opening and dynamic items", async ({
  page,
}) => {
  for (const name of ["Disabled menu", "Empty menu"]) {
    const trigger = page.getByRole("button", { name, exact: true });
    await expect(trigger).toBeDisabled();
    await trigger.evaluate((node: HTMLButtonElement) => node.click());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  }
  await page.getByRole("checkbox", { name: "Cancel menu opening" }).check();
  const trigger = page.getByRole("button", {
    name: "Contract menu",
    exact: true,
  });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByLabel("Menu changes")).toBeEmpty();
  await page.getByRole("checkbox", { name: "Cancel menu opening" }).uncheck();
  await page.getByRole("button", { name: "Reverse menu items" }).click();
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitem", { name: "Disabled destination" }),
  ).toBeFocused();
});

test("DropdownMenu: narrow viewport keeps long menu items reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 400 });
  await page.getByRole("button", { name: "Long menu", exact: true }).click();
  const menu = page.getByRole("menu", { name: "Long menu", exact: true });
  await expect(menu).toBeVisible();
  expect(
    await menu.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      return (
        bounds.left >= 0 &&
        bounds.right <= innerWidth &&
        bounds.top >= 0 &&
        bounds.bottom <= innerHeight &&
        node.scrollWidth <= node.clientWidth &&
        node.scrollHeight > node.clientHeight
      );
    }),
  ).toBe(true);
  await page.keyboard.press("End");
  await expect(menu.getByRole("menuitem").last()).toBeFocused();
  await expect(menu.getByRole("menuitem").last()).toBeInViewport();
});

test("DropdownMenu: typeahead starts fresh after closing and reopening", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2026-01-01T00:00:00Z"));
  const trigger = page.getByRole("button", {
    name: "Contract menu",
    exact: true,
  });
  await trigger.click();
  await page.keyboard.press("b");
  await expect(
    page.getByRole("menuitem", { name: "Beta action" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("End");
  await page.keyboard.press("a");
  await expect(
    page.getByRole("menuitem", { name: "Alpha action" }),
  ).toBeFocused();
});

test("DropdownMenu: removing the focused item recovers focus and emptying closes", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "Contract menu",
    exact: true,
  });
  const menu = page.getByRole("menu", { name: "Contract menu", exact: true });
  await trigger.click();
  await expect(
    page.getByRole("menuitem", { name: "Alpha action" }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Remove first menu item" })
    .evaluate((node: HTMLButtonElement) => node.click());
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem")).toHaveCount(4);
  await expect(
    page.getByRole("menuitem", { name: "Disabled action", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Remove all menu items" })
    .evaluate((node: HTMLButtonElement) => node.click());
  await expect(menu).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeDisabled();
});

test("DropdownMenu: pointer opening restores its trigger on Escape", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Before menu", exact: true }).focus();
  const trigger = page.getByRole("button", {
    name: "Contract menu",
    exact: true,
  });
  await trigger.click();
  await expect(
    page.getByRole("menuitem", { name: "Alpha action" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("menu", { name: "Contract menu", exact: true }),
  ).toBeHidden();
  await expect(trigger).toBeFocused();
});
