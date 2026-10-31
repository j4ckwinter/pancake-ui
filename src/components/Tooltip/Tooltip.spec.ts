import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../../../tests/contracts-fixture";

const description = "Supplementary contract description";

test("Tooltip: descriptions, native props, refs and consumer styling", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "Contract tooltip",
    exact: true,
  });
  const panel = page.getByRole("tooltip").filter({ hasText: description });
  await expect(trigger).toHaveAccessibleDescription(
    `Existing guidance ${description}`,
  );
  await expect(panel).toBeHidden();
  await trigger.focus();
  await expect(panel).toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("data-ref-ready", "true");
  await expect(trigger).toHaveClass(/consumer-tooltip-trigger/);
  await expect(trigger).toHaveCSS("border-radius", "0px");
  await expect(panel).toHaveAttribute("data-ref-ready", "true");
  await expect(panel).toHaveAttribute("popover", "manual");
  await expect(panel).toHaveClass(/consumer-tooltip/);
  await expect(panel).toHaveCSS("border-radius", "0px");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Tooltip: keyboard focus, Escape suppression and ordinary Tab order", async ({
  page,
  browserName,
}) => {
  const trigger = page.getByRole("button", {
    name: "Contract tooltip",
    exact: true,
  });
  const panel = page.getByRole("tooltip").filter({ hasText: description });
  const tab = browserName === "webkit" ? "Alt+Tab" : "Tab";
  await page.getByRole("button", { name: "Before tooltip" }).focus();
  await page.keyboard.press(tab);
  await expect(trigger).toBeFocused();
  await expect(panel).toBeVisible();
  await expect(page.getByLabel("Tooltip changes")).toHaveText("true,");
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(page.getByLabel("Tooltip changes")).toHaveText("true,false,");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(panel).toBeHidden();
  await page.keyboard.press(tab);
  await expect(
    page.getByRole("button", { name: "After tooltip" }),
  ).toBeFocused();
  await trigger.focus();
  await expect(panel).toBeVisible();
  await expect(page.getByLabel("Tooltip changes")).toHaveText(
    "true,false,true,",
  );
  await page.keyboard.press(tab);
  await expect(panel).toBeHidden();
  await expect(page.getByLabel("Tooltip changes")).toHaveText(
    "true,false,true,false,",
  );
});

test("Tooltip: hover remains readable across the trigger boundary and dismisses with Escape", async ({
  page,
}) => {
  await page.clock.install();
  const trigger = page.getByRole("button", {
    name: "Contract tooltip",
    exact: true,
  });
  const panel = page.getByRole("tooltip").filter({ hasText: description });
  await trigger.hover();
  await expect(panel).toBeVisible();
  const source = await trigger.boundingBox();
  const target = await panel.boundingBox();
  expect(source).not.toBeNull();
  expect(target).not.toBeNull();
  const x =
    Math.max(source!.x, target!.x) + Math.min(source!.width, target!.width) / 2;
  const below = target!.y >= source!.y;
  const edge = below ? source!.y + source!.height : source!.y;
  const direction = below ? 1 : -1;
  const gap = below ? target!.y - edge : edge - target!.y - target!.height;
  expect(Math.abs(gap)).toBeLessThanOrEqual(1);
  await page.mouse.move(x, edge - direction);
  await page.clock.runFor(500);
  await expect(panel).toBeVisible();
  await page.mouse.move(x, edge + direction);
  await page.clock.runFor(500);
  await expect(panel).toBeVisible();
  await trigger.hover();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await trigger.hover();
  await page.clock.runFor(500);
  await expect(panel).toBeHidden();
  // A genuine pointer exit and re-entry starts a fresh tooltip interaction.
  await page.mouse.move(0, 0);
  await page.clock.runFor(500);
  await trigger.hover();
  await expect(panel).toBeVisible();
  await page.mouse.move(0, 0);
  await page.clock.runFor(500);
  await expect(panel).toBeHidden();
});

test("Tooltip: native actions, form submission, links and disabled controls remain intact", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "Contract tooltip",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Tooltip actions")).toHaveText("1");
  await expect(page.getByLabel("Tooltip submissions")).toHaveText("0");
  await page
    .getByRole("button", { name: "Tooltip submit", exact: true })
    .click();
  await expect(page.getByLabel("Tooltip submissions")).toHaveText("1");
  const link = page.getByRole("link", { name: "Tooltip link" });
  await expect(link).toHaveAttribute("href", "#tooltip-existing");
  await link.focus();
  await expect(link).toHaveAccessibleDescription("View tooltip documentation");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#tooltip-existing$/);
  const disabled = page.getByRole("button", {
    name: "Disabled tooltip action",
  });
  await expect(disabled).toBeDisabled();
  await disabled.evaluate((node: HTMLButtonElement) => node.click());
  await expect(page.getByLabel("Tooltip actions")).toHaveText("1");
  await expect(disabled.locator("..")).not.toHaveAttribute("tabindex");
  await page.getByRole("button", { name: "Tooltip icon action" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Tooltip actions")).toHaveText("2");
});

test("Tooltip: canceled opening and unmount clean up pending dismissal", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "Contract tooltip",
    exact: true,
  });
  const panel = page.getByRole("tooltip").filter({ hasText: description });
  await page.getByRole("checkbox", { name: "Cancel tooltip opening" }).check();
  await trigger.focus();
  await expect(panel).toBeHidden();
  await expect(page.getByLabel("Tooltip changes")).toBeEmpty();
  await page
    .getByRole("checkbox", { name: "Cancel tooltip opening" })
    .uncheck();
  await trigger.focus();
  await expect(panel).toBeVisible();
  await page.clock.install();
  await page.getByRole("button", { name: "After tooltip" }).focus();
  await page
    .getByRole("button", { name: "Toggle tooltip mount" })
    .evaluate((node: HTMLButtonElement) => node.click());
  await page.clock.runFor(500);
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveCount(0);
  await page.getByRole("button", { name: "Toggle tooltip mount" }).click();
  await trigger.focus();
  await expect(panel).toBeVisible();
});

test.describe("Touch input", () => {
  test.use({ hasTouch: true });
  test("Tooltip: touch activation does not create sticky hover content", async ({
    page,
    browserName,
  }) => {
    const trigger = page.getByRole("button", {
      name: "Contract tooltip",
      exact: true,
    });
    const panel = page.getByRole("tooltip").filter({ hasText: description });
    await trigger.tap();
    await expect(panel).toBeHidden();
    await expect(page.getByLabel("Tooltip actions")).toHaveText("1");
    await page.getByRole("button", { name: "Before tooltip" }).focus();
    await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
    await expect(trigger).toBeFocused();
    await expect(panel).toBeVisible();
  });
});

test("Tooltip: Escape dismisses the tooltip before its containing dialog", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Open tooltip dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "Tooltip dialog" });
  const trigger = dialog.getByRole("button", { name: "Modal tooltip trigger" });
  await trigger.focus();
  const panel = page
    .getByRole("tooltip")
    .filter({ hasText: "Description inside a modal" });
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(dialog).toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("Tooltip: narrow viewport contains long unbroken descriptions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 400 });
  const trigger = page.getByRole("button", { name: "Long tooltip trigger" });
  await trigger.focus();
  const panel = page.getByRole("tooltip").filter({ hasText: "Long tooltip" });
  await expect(panel).toBeVisible();
  await expect
    .poll(() =>
      panel.evaluate((node) => {
        const bounds = node.getBoundingClientRect();
        return (
          bounds.left >= 0 &&
          bounds.right <= innerWidth &&
          bounds.top >= 0 &&
          bounds.bottom <= innerHeight &&
          node.scrollWidth <= node.clientWidth
        );
      }),
    )
    .toBe(true);
});
