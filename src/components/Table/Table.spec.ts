import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../../../tests/contracts-fixture";

test("Table: native caption, headers, props, ref and consumer styling", async ({
  page,
}) => {
  const table = page.getByRole("table", { name: "Contract records" });
  await expect(table).toHaveAccessibleDescription(
    "Choose records before submitting.",
  );
  await expect(table).toHaveAttribute("data-ref-ready", "true");
  await expect(table).toHaveClass(/consumer-table/);
  await expect(table).toHaveCSS("min-width", "640px");
  expect(await table.evaluate((node) => node instanceof HTMLTableElement)).toBe(
    true,
  );
  await expect(table.locator("caption")).toHaveText("Contract records");
  await expect(
    table.getByRole("columnheader", { name: "Selection" }),
  ).toHaveAttribute("scope", "col");
  await expect(
    table.getByRole("rowheader", { name: "Alpha", exact: true }),
  ).toHaveAttribute("scope", "row");
  await expect(
    page.getByRole("region", { name: "Contract records" }),
  ).toHaveAttribute("tabindex", "0");
  const grouped = page.getByRole("table", { name: "Grouped table headers" });
  await expect(
    grouped.getByRole("columnheader", { name: "Activity", exact: true }),
  ).toHaveAttribute("colspan", "2");
  await expect(
    grouped.getByRole("cell", { name: "12", exact: true }),
  ).toHaveAttribute("headers", "table-group table-total table-week");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Table: keyboard scrolling and nested control navigation", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 375, height: 700 });
  const region = page.getByRole("region", { name: "Contract records" });
  const table = page.getByRole("table", { name: "Contract records" });
  const tab = browserName === "webkit" ? "Alt+Tab" : "Tab";
  await page.getByRole("button", { name: "Before table" }).focus();
  await page.keyboard.press(tab);
  await expect(region).toBeFocused();
  await expect(region).toHaveCSS("outline-style", "solid");
  expect(
    await region.evaluate((node) => node.scrollWidth > node.clientWidth),
  ).toBe(true);
  await page.keyboard.down("ArrowRight");
  try {
    await expect
      .poll(() => region.evaluate((node) => node.scrollLeft))
      .toBeGreaterThan(0);
  } finally {
    await page.keyboard.up("ArrowRight");
  }
  expect(
    await region.evaluate(
      (node) => node.getBoundingClientRect().right <= innerWidth,
    ),
  ).toBe(true);
  await page.keyboard.press(tab);
  await expect(
    table.getByRole("button", { name: "Sort record name" }),
  ).toBeFocused();
  await page.keyboard.press(tab);
  await expect(
    table.getByRole("checkbox", { name: "Select Alpha" }),
  ).toBeFocused();
  await page.keyboard.press("Space");
  await expect(
    table.getByRole("checkbox", { name: "Select Alpha" }),
  ).toBeChecked();
  await page.keyboard.press(tab);
  await expect(
    table.getByRole("button", { name: "Inspect Alpha" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Table actions")).toHaveText("1");
});

test("Table: application sorting and empty rows retain table semantics", async ({
  page,
}) => {
  const table = page.getByRole("table", { name: "Contract records" });
  const sort = table.getByRole("button", { name: "Sort record name" });
  await expect(table.locator("tbody th").first()).toHaveText("Alpha");
  await sort.focus();
  await page.keyboard.press("Enter");
  await expect(sort).toBeFocused();
  await expect(
    table.getByRole("columnheader", { name: "Sort record name" }),
  ).toHaveAttribute("aria-sort", "descending");
  await expect(table.locator("tbody th").first()).toHaveText("Beta");
  await page.getByRole("button", { name: "Toggle empty table" }).click();
  await expect(
    table.getByRole("cell", { name: "No matching records" }),
  ).toHaveAttribute("colspan", "3");
  await expect(table.locator("tbody tr")).toHaveCount(1);
  await expect(table).toHaveAccessibleName("Contract records");
  await page.getByRole("button", { name: "Toggle empty table" }).click();
  await expect(table.locator("tbody tr")).toHaveCount(2);
});

test("Table: nested controls preserve native form submission", async ({
  page,
}) => {
  const table = page.getByRole("table", { name: "Contract records" });
  await table.getByRole("button", { name: "Inspect Alpha" }).click();
  await expect(page.getByLabel("Table actions")).toHaveText("1");
  await expect(page.getByLabel("Table submissions")).toHaveText("0");
  await table.getByRole("checkbox", { name: "Select Beta" }).check();
  expect(
    await table.evaluate((node) => [
      ...new FormData(node.closest("form")!).entries(),
    ]),
  ).toEqual([["record", "Beta"]]);
  await table.getByRole("button", { name: "Submit table selection" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Table submissions")).toHaveText("1");
});
