import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../../../tests/contracts-fixture";

test("Popover: named region, native props, ref and consumer styling", async ({
  page,
}) => {
  const panel = page.getByRole("region", {
    name: "Contract details",
    exact: true,
  });
  await expect(panel).not.toBeVisible();
  await page
    .getByRole("button", { name: "Open contract popover", exact: true })
    .click();
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute("popover", "auto");
  await expect(panel).toHaveAttribute("data-ref-ready", "true");
  await expect(panel).toHaveClass(/consumer-popover/);
  await expect(panel).toHaveCSS("border-radius", "0px");
  await expect(panel).toHaveAccessibleDescription(
    "Supplementary project details",
  );
  expect(
    await panel.evaluate(
      (node) => node instanceof HTMLDivElement && node.matches(":popover-open"),
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Popover: keyboard activation, nonmodal Tab and conditional focus return", async ({
  page,
  browserName,
}) => {
  const trigger = page.getByRole("button", {
    name: "Open contract popover",
    exact: true,
  });
  const panel = page.getByRole("region", {
    name: "Contract details",
    exact: true,
  });
  const draft = page.getByRole("textbox", { name: "Popover draft" });
  const outside = page.getByRole("button", { name: "Popover outside action" });
  const tab = browserName === "webkit" ? "Alt+Tab" : "Tab";
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(panel).toBeVisible();
  await page.keyboard.press(tab);
  await expect(draft).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(panel).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Space");
  await expect(panel).toBeVisible();
  await panel
    .getByRole("button", { name: "Close contract popover", exact: true })
    .focus();
  await page.keyboard.press(tab);
  await expect(outside).toBeFocused();
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).not.toBeVisible();
  await expect(outside).toBeFocused();
});

test("Popover: inside interaction, light dismissal, disabled trigger and form safety", async ({
  page,
}) => {
  const panel = page.getByRole("region", {
    name: "Contract details",
    exact: true,
  });
  const trigger = page.getByRole("button", {
    name: "Open contract popover",
    exact: true,
  });
  const disabled = page.getByRole("button", {
    name: "Disabled popover trigger",
  });
  await expect(disabled).toBeDisabled();
  await disabled.evaluate((node: HTMLButtonElement) => node.click());
  await expect(panel).not.toBeVisible();
  await trigger.click();
  await panel
    .getByRole("textbox", { name: "Popover draft" })
    .fill("Saved draft");
  await expect(panel).toBeVisible();
  await page.getByRole("button", { name: "Popover outside action" }).click();
  await expect(panel).not.toBeVisible();
  await expect(page.getByLabel("Popover outside activations")).toHaveText("1");
  await trigger.click();
  await expect(
    panel.getByRole("textbox", { name: "Popover draft" }),
  ).toHaveValue("Saved draft");
  await panel
    .getByRole("button", { name: "Close contract popover", exact: true })
    .click();
  await expect(panel).not.toBeVisible();
  await expect(page.getByLabel("Popover submissions")).toHaveText("0");
  await expect(page.getByLabel("Popover changes")).toHaveText(
    "true,false,true,false,",
  );
  await expect(page.getByLabel("Popover native toggles")).toHaveText("4");
});

test("Popover: canceled opening and coalesced native transitions report settled state once", async ({
  page,
}) => {
  const panel = page.getByRole("region", {
    name: "Contract details",
    exact: true,
  });
  await expect(page.getByLabel("Popover changes")).toBeEmpty();
  await page.getByRole("checkbox", { name: "Cancel popover opening" }).check();
  await page
    .getByRole("button", { name: "Open contract popover", exact: true })
    .click();
  await expect(panel).not.toBeVisible();
  await expect(page.getByLabel("Popover before toggles")).toHaveText("1");
  await expect(page.getByLabel("Popover native toggles")).toHaveText("0");
  await expect(page.getByLabel("Popover changes")).toBeEmpty();
  await page
    .getByRole("checkbox", { name: "Cancel popover opening" })
    .uncheck();
  await page.getByRole("button", { name: "Cycle popover through ref" }).click();
  await expect(panel).toBeVisible();
  await expect(page.getByLabel("Popover changes")).toHaveText("true,");
  await expect(page.getByLabel("Popover native toggles")).toHaveText("1");
  await expect(page.getByLabel("Popover before toggles")).toHaveText("4");
  await panel
    .getByRole("button", { name: "Close contract popover", exact: true })
    .click();
  await expect(page.getByLabel("Popover changes")).toHaveText("true,false,");
  await expect(page.getByLabel("Popover native toggles")).toHaveText("2");
});

test("Popover: sibling exclusion and nested dismissal follow the native stack", async ({
  page,
}) => {
  const parent = page.getByRole("region", {
    name: "Contract details",
    exact: true,
  });
  const nested = page.getByRole("region", {
    name: "Nested details",
    exact: true,
  });
  await page
    .getByRole("button", { name: "Open contract popover", exact: true })
    .click();
  await parent.getByRole("button", { name: "Open nested popover" }).click();
  await expect(parent).toBeVisible();
  await expect(nested).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(nested).not.toBeVisible();
  await expect(parent).toBeVisible();
  await page.getByRole("button", { name: "Open sibling popover" }).click();
  await expect(parent).not.toBeVisible();
  await expect(
    page.getByRole("region", { name: "Sibling details" }),
  ).toBeVisible();
});

test("Popover: edge positioning, scrolling and resize keep long content reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 500 });
  const trigger = page.getByRole("button", { name: "Open edge popover" });
  const panel = page.getByRole("region", { name: "Long edge details" });
  await trigger.click();
  await expect(panel).toBeVisible();
  for (const height of [500, 400]) {
    await page.setViewportSize({ width: 375, height });
    await expect
      .poll(async () =>
        panel.evaluate((node) => {
          const bounds = node.getBoundingClientRect();
          return (
            bounds.left >= 0 &&
            bounds.top >= 0 &&
            bounds.right <= innerWidth &&
            bounds.bottom <= innerHeight &&
            node.scrollWidth <= node.clientWidth
          );
        }),
      )
      .toBe(true);
    expect(
      await panel.evaluate((node) => node.scrollHeight > node.clientHeight),
    ).toBe(true);
  }
  await page.evaluate(() => window.scrollBy(0, 100));
  await expect(panel).toBeVisible();
  const bounds = await panel.boundingBox();
  const anchor = await trigger.boundingBox();
  expect(bounds).not.toBeNull();
  expect(anchor).not.toBeNull();
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(anchor!.y + 1);
  await panel.getByRole("button", { name: "Close edge popover" }).click();
  await expect(panel).not.toBeVisible();
});

test("Popover: unchanged coalesced visibility does not emit a state change", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Open and close popover through ref" })
    .click();
  await expect(page.getByLabel("Popover native toggles")).toHaveText("1");
  await expect(page.getByLabel("Popover changes")).toBeEmpty();
  await expect(
    page.getByRole("region", { name: "Contract details", exact: true }),
  ).toBeHidden();
  await page.getByRole("button", { name: "Popover outside action" }).click();
  await expect(page.getByLabel("Popover changes")).toBeEmpty();
  await expect(page.getByLabel("Popover native toggles")).toHaveText("1");
});

test("Popover: native anchoring follows a scrolling flow trigger", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "Open contract popover",
    exact: true,
  });
  const panel = page.getByRole("region", {
    name: "Contract details",
    exact: true,
  });
  await trigger.evaluate((node) => node.scrollIntoView({ block: "center" }));
  await trigger.click();
  await expect(panel).toBeVisible();
  const before = await trigger.boundingBox();
  expect(before).not.toBeNull();
  await page.evaluate(() => window.scrollBy(0, -32));
  await expect
    .poll(async () => (await trigger.boundingBox())!.y)
    .toBeGreaterThan(before!.y);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const button = document.querySelector(
          '[popovertarget="contract-popover"]',
        )!;
        const panel = document.getElementById("contract-popover")!;
        const anchor = button.getBoundingClientRect();
        const bounds = panel.getBoundingClientRect();
        const gap = Math.min(
          Math.abs(anchor.top - bounds.bottom),
          Math.abs(bounds.top - anchor.bottom),
        );
        return (
          gap >= 7 &&
          gap <= 9 &&
          bounds.right > anchor.left &&
          bounds.left < anchor.right
        );
      }),
    )
    .toBe(true);
});
