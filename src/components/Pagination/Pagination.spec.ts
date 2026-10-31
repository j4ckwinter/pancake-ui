import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../../../tests/contracts-fixture";

test("Pagination: navigation semantics, current page, native props and ref", async ({
  page,
}) => {
  const nav = page.getByRole("navigation", {
    name: "Contract pagination",
    exact: true,
  });
  await expect(nav).toHaveAccessibleDescription("Choose a results page");
  await expect(nav).toHaveClass(/consumer-pagination/);
  await expect(nav).toHaveCSS("border-radius", "0px");
  await expect(nav).toHaveAttribute("data-ref-ready", "true");
  await expect(
    nav.getByRole("button", { name: "Page 3", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(nav.getByRole("list")).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Pagination: keyboard activation updates once, preserves focus and never submits", async ({
  page,
  browserName,
}) => {
  const nav = page.getByRole("navigation", {
    name: "Contract pagination",
    exact: true,
  });
  const tab = browserName === "webkit" ? "Alt+Tab" : "Tab";
  await page.getByRole("button", { name: "Before pagination" }).focus();
  await page.keyboard.press(tab);
  await expect(
    nav.getByRole("button", { name: "Previous", exact: true }),
  ).toBeFocused();
  const fourth = nav.getByRole("button", { name: "Page 4", exact: true });
  await fourth.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Pagination changes")).toHaveText("4,");
  await expect(fourth).toHaveAttribute("aria-current", "page");
  await expect(fourth).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByLabel("Pagination changes")).toHaveText("4,");
  await page.keyboard.press(tab);
  const fifth = nav.getByRole("button", { name: "Page 5", exact: true });
  await expect(fifth).toBeFocused();
  await expect(fifth).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Space");
  await expect(page.getByLabel("Pagination changes")).toHaveText("4,5,");
  await expect(page.getByLabel("Pagination submissions")).toHaveText("0");
});

test("Pagination: controlled state and shrinking page counts remain application owned", async ({
  page,
}) => {
  const nav = page.getByRole("navigation", {
    name: "Contract pagination",
    exact: true,
  });
  await page.getByRole("checkbox", { name: "Hold pagination updates" }).check();
  await nav.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByLabel("Pagination changes")).toHaveText("4,");
  await expect(
    nav.getByRole("button", { name: "Page 3", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "Shrink pagination count" }).click();
  await expect(
    nav.getByRole("button", { name: "Page 2", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    nav.getByRole("button", { name: "Next", exact: true }),
  ).toBeDisabled();
  await expect(page.getByLabel("Pagination changes")).toHaveText("4,");
});

test("Pagination: boundaries, invalid values and huge counts produce bounded controls", async ({
  page,
}) => {
  const nav = page.getByRole("navigation", {
    name: "Contract pagination",
    exact: true,
  });
  await nav.getByRole("button", { name: "Page 1", exact: true }).click();
  await expect(
    nav.getByRole("button", { name: "Previous", exact: true }),
  ).toBeDisabled();
  await nav.getByRole("button", { name: "Page 10", exact: true }).click();
  await expect(
    nav.getByRole("button", { name: "Next", exact: true }),
  ).toBeDisabled();
  for (const name of ["Empty pagination", "Invalid pagination"]) {
    const empty = page.getByRole("navigation", { name, exact: true });
    await expect(empty.getByRole("button")).toHaveCount(2);
    await expect(
      empty.getByRole("button", { name: "Previous" }),
    ).toBeDisabled();
    await expect(empty.getByRole("button", { name: "Next" })).toBeDisabled();
    await expect(empty.locator("[aria-current]")).toHaveCount(0);
  }
  const single = page.getByRole("navigation", { name: "Single pagination" });
  await expect(
    single.getByRole("button", { name: "Page 1", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(single.getByRole("button", { name: "Previous" })).toBeDisabled();
  await expect(single.getByRole("button", { name: "Next" })).toBeDisabled();
  const fractional = page.getByRole("navigation", {
    name: "Fractional pagination",
  });
  await expect(fractional.getByRole("button")).toHaveCount(6);
  await expect(
    fractional.getByRole("button", { name: "Page 2", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  const huge = page.getByRole("navigation", { name: "Huge pagination" });
  expect(await huge.getByRole("button").count()).toBeLessThanOrEqual(7);
  await expect(
    huge.getByRole("button", {
      name: `Page ${Number.MAX_SAFE_INTEGER}`,
      exact: true,
    }),
  ).toBeVisible();
  await expect(huge.locator('[aria-current="page"]')).toHaveText(
    String(Number.MAX_SAFE_INTEGER - 1),
  );
  await expect(huge.locator(".pancake-pagination-gap")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(huge.locator(".pancake-pagination-gap")).not.toHaveAttribute(
    "tabindex",
  );
});

test("Pagination: native links preserve destinations and unavailable boundaries stay inert", async ({
  page,
}) => {
  const nav = page.getByRole("navigation", {
    name: "Linked pagination",
    exact: true,
  });
  const previous = nav.getByText("Previous", { exact: true });
  await expect(previous).toHaveAttribute("aria-disabled", "true");
  await expect(previous).not.toHaveAttribute("href");
  await expect(previous).not.toHaveAttribute("tabindex");
  await expect(
    nav.getByRole("link", { name: "Page 1", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  const second = nav.getByRole("link", { name: "Page 2", exact: true });
  await expect(second).toHaveAttribute("href", "#pagination-page-2");
  await expect(second).toHaveAttribute("target", "_self");
  await expect(second).toHaveAttribute("rel", "help");
  await second.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#pagination-page-2$/);
  await expect(page.getByLabel("Pagination changes")).toBeEmpty();
  const last = page.getByRole("navigation", { name: "Last linked pagination" });
  await expect(last.getByText("Next", { exact: true })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await expect(last.getByText("Next", { exact: true })).not.toHaveAttribute(
    "href",
  );
});

test("Pagination: localized long labels wrap in narrow right-to-left layouts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 700 });
  const nav = page.getByRole("navigation", { name: "Localized pagination" });
  await expect(nav).toHaveCSS("direction", "rtl");
  await expect(
    nav.getByRole("button", { name: "Result page 5", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await nav.scrollIntoViewIfNeeded();
  expect(
    await nav.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return (
        rect.left >= 0 &&
        rect.right <= innerWidth &&
        node.scrollWidth <= node.clientWidth
      );
    }),
  ).toBe(true);
  for (const button of await nav.getByRole("button").all()) {
    expect(
      await button.evaluate((node) => node.scrollWidth <= node.clientWidth),
    ).toBe(true);
  }
});
