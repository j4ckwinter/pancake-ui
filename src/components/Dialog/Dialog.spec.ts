import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../../../tests/contracts-fixture";

test("Dialog: modal semantics, descriptions, focus containment and ref", async ({
  page,
  browserName,
}) => {
  const trigger = page.getByRole("button", { name: "Open contract dialog" });
  const modal = page.getByRole("dialog", { name: "Edit contract project" });
  await expect(modal).not.toBeVisible();
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(modal).toBeVisible();
  await expect(modal).toHaveAttribute("data-ref-ready", "true");
  await expect(modal).toHaveClass(/consumer-dialog/);
  await expect(modal).toHaveCSS("border-radius", "0px");
  await expect(modal).toHaveAccessibleDescription(
    "Shared dialog guidance Changes remain local until you apply them.",
  );
  expect(await modal.evaluate((node) => node.matches(":modal"))).toBe(true);
  const close = modal.getByRole("button", { name: "Close contract dialog" });
  await expect(close).toBeFocused();
  const tab = browserName === "webkit" ? "Alt+Tab" : "Tab";
  const reverseTab = browserName === "webkit" ? "Alt+Shift+Tab" : "Shift+Tab";
  await page.keyboard.press(tab);
  await expect(
    modal.getByRole("textbox", { name: "Dialog project title" }),
  ).toBeFocused();
  await page.keyboard.press(reverseTab);
  await expect(close).toBeFocused();
  await expect(close).toHaveCSS("outline-style", "solid");
  await page.keyboard.press(reverseTab);
  // Native modal navigation may visit browser chrome, but never background controls.
  expect(
    await modal.evaluate(
      (node) => node.contains(document.activeElement) || !document.hasFocus(),
    ),
  ).toBe(true);
  await page.keyboard.press(tab);
  await expect(close).toBeFocused();
  const order = [
    close,
    modal.getByRole("textbox", { name: "Dialog project title" }),
    modal.getByRole("checkbox", { name: "Prevent dialog Escape" }),
    modal.getByRole("button", { name: "Apply dialog changes" }),
    modal.getByRole("button", { name: "Reopen dialog before close event" }),
    modal.getByRole("button", { name: "Unmount contract dialog" }),
    modal.getByRole("button", { name: "Confirm native dialog form" }),
  ];
  for (const control of order.slice(1)) {
    await page.keyboard.press(tab);
    await expect(control).toBeFocused();
  }
  for (const control of order.slice(0, -1).reverse()) {
    await page.keyboard.press(reverseTab);
    await expect(control).toBeFocused();
  }
  await modal
    .getByRole("button", { name: "Confirm native dialog form" })
    .focus();
  await page.keyboard.press(tab);
  expect(
    await modal.evaluate(
      (node) => node.contains(document.activeElement) || !document.hasFocus(),
    ),
  ).toBe(true);
  await close.focus();
  await expect(close).toBeFocused();
  const background = page.getByRole("button", {
    name: "Dialog background action",
    includeHidden: true,
  });
  await background.evaluate((node: HTMLButtonElement) => node.focus());
  await expect(close).toBeFocused();
  await page.mouse.click(1, 1);
  await expect(modal).toBeVisible();
  await expect(page.getByLabel("Dialog background activations")).toHaveText(
    "0",
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Dialog: Escape, close action and controlled state restore focus", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: "Open contract dialog" });
  const modal = page.getByRole("dialog", { name: "Edit contract project" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Escape");
  await expect(modal).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByLabel("Dialog close requests")).toHaveText("1");
  await trigger.focus();
  await page.keyboard.press("Enter");
  await modal.getByRole("button", { name: "Close contract dialog" }).click();
  await expect(modal).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByLabel("Dialog close requests")).toHaveText("2");
  await trigger.focus();
  await page.keyboard.press("Enter");
  await modal.getByRole("button", { name: "Apply dialog changes" }).click();
  await expect(modal).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByLabel("Dialog close requests")).toHaveText("2");
});

test("Dialog: cancellation, stale close events and unmount preserve lifecycle", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: "Open contract dialog" });
  const modal = page.getByRole("dialog", { name: "Edit contract project" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await modal.getByRole("checkbox", { name: "Prevent dialog Escape" }).check();
  await page.keyboard.press("Escape");
  await expect(modal).toBeVisible();
  await expect(page.getByLabel("Dialog close requests")).toHaveText("0");
  await modal
    .getByRole("button", { name: "Reopen dialog before close event" })
    .click();
  await expect(modal).toBeVisible();
  await modal
    .getByRole("textbox", { name: "Dialog project title" })
    .fill("After reopening");
  await expect(page.getByLabel("Dialog close requests")).toHaveText("0");
  await modal.getByRole("button", { name: "Unmount contract dialog" }).click();
  await expect(modal).not.toBeVisible();
  await expect(page.getByLabel("Dialog mounted state")).toHaveText("false");
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "Dialog background action" }).click();
  await expect(page.getByLabel("Dialog background activations")).toHaveText(
    "1",
  );
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(modal).toBeVisible();
  await expect(modal).toHaveAttribute("data-ref-ready", "true");
});

test("Dialog: native dialog form submission synchronises controlled state", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: "Open contract dialog" });
  const modal = page.getByRole("dialog", { name: "Edit contract project" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await modal
    .getByRole("button", { name: "Confirm native dialog form" })
    .click();
  await expect(modal).not.toBeVisible();
  await expect(page.getByLabel("Dialog native return value")).toHaveText(
    "confirmed",
  );
  await expect(page.getByLabel("Dialog close requests")).toHaveText("1");
  await expect(trigger).toBeFocused();
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(modal).toBeVisible();
});

test("Dialog: narrow viewports keep long content and final actions reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 500 });
  const trigger = page.getByRole("button", {
    name: "Open long contract dialog",
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const modal = page.getByRole("dialog", { name: "Edit contract project" });
  await expect(modal).toBeVisible();
  const geometry = await modal.evaluate((node) => ({
    scrolls: node.scrollHeight > node.clientHeight,
    fits: node.scrollWidth <= node.clientWidth,
    width: node.getBoundingClientRect().width,
    height: node.getBoundingClientRect().height,
  }));
  expect(geometry.scrolls).toBe(true);
  expect(geometry.fits).toBe(true);
  expect(geometry.width).toBeLessThanOrEqual(327);
  expect(geometry.height).toBeLessThanOrEqual(452);
  await modal
    .getByRole("button", { name: "Confirm native dialog form" })
    .click();
  await expect(modal).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
