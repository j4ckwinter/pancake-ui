import AxeBuilder from "@axe-core/playwright";
import {
  test,
  expect,
  assertActionCount,
  assertFieldName,
  assertDisabled,
} from "./contracts-fixture";

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
    "http://127.0.0.1:6007/iframe.html?id=foundations-comparison--catalogue&viewMode=story&globals=a11y.manual:!true",
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

test("Accessibility: explicit scans reject an unlabeled control", async ({
  page,
}) => {
  await page.evaluate(() => {
    const button = document.createElement("button");
    button.id = "deliberate-unlabeled-control";
    button.type = "button";
    document.querySelector("main")!.append(button);
  });
  const violations = (await new AxeBuilder({ page }).analyze()).violations;
  expect(
    violations.some(
      (violation) =>
        violation.id === "button-name" &&
        violation.nodes.some((node) =>
          node.target.includes("#deliberate-unlabeled-control"),
        ),
    ),
  ).toBe(true);
});
