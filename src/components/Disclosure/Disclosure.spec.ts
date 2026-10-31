import { test, expect } from "../../../tests/contracts-fixture";

test("Disclosure: native semantics, independent state and preserved children", async ({
  page,
}) => {
  const summary = page.locator("summary", { hasText: "Saved preferences" });
  const details = summary.locator("..");
  const draft = page.getByRole("textbox", { name: "Persistent draft" });
  await expect(summary).toHaveAccessibleName("Saved preferences");
  await expect(details).toHaveJSProperty("tagName", "DETAILS");
  await expect(details).toHaveJSProperty("open", false);
  await expect(draft).not.toBeVisible();
  await summary.click();
  await expect(details).toHaveJSProperty("open", true);
  await expect(draft).toHaveValue("Original");
  await draft.fill("Retained draft");
  await summary.click();
  await expect(draft).not.toBeVisible();
  await summary.click();
  await expect(draft).toHaveValue("Retained draft");
  await expect(
    page.locator("summary", { hasText: "Independent help" }).locator(".."),
  ).toHaveJSProperty("open", false);
  await expect(
    page
      .locator("summary", { hasText: "Initially expanded help" })
      .locator(".."),
  ).toHaveJSProperty("open", true);
  await expect(page.getByLabel("Disclosure initial toggles")).toHaveText("1");
  await expect(page.getByLabel("Disclosure initial changes")).toHaveText("0");
});

test("Disclosure: keyboard activation, native toggles, refs and form isolation", async ({
  page,
  browserName,
}) => {
  const summary = page.locator("summary", { hasText: "Saved preferences" });
  const details = summary.locator("..");
  await expect(details).toHaveClass(/consumer-disclosure/);
  await expect(details).toHaveCSS("border-radius", "0px");
  await page.getByRole("button", { name: "Focus disclosure ref" }).click();
  await expect(summary).toBeFocused();
  await page.keyboard.press(
    browserName === "webkit" ? "Alt+Shift+Tab" : "Shift+Tab",
  );
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(summary).toBeFocused();
  await expect(summary).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(details).toHaveJSProperty("open", true);
  await expect(
    page.getByLabel("Disclosure changes", { exact: true }),
  ).toHaveText("true,");
  await expect(page.getByLabel("Disclosure native toggles")).toHaveText("1");
  await page.keyboard.press("Space");
  await expect(details).toHaveJSProperty("open", false);
  await expect(
    page.getByLabel("Disclosure changes", { exact: true }),
  ).toHaveText("true,false,");
  await expect(page.getByLabel("Disclosure native toggles")).toHaveText("2");
  await expect(page.getByLabel("Disclosure submissions")).toHaveText("0");
});

test("Disclosure: controlled requests, declined changes and prop updates", async ({
  page,
}) => {
  const summary = page.locator("summary", { hasText: "Controlled help" });
  const details = summary.locator("..");
  const requests = page.getByLabel("Disclosure requests");
  await expect(requests).toHaveText("");
  await summary.click();
  await expect(details).toHaveJSProperty("open", true);
  await expect(requests).toHaveText("true,");
  await page
    .getByRole("checkbox", { name: "Accept disclosure changes" })
    .uncheck();
  await summary.click();
  await expect(requests).toHaveText("true,false,");
  await expect(details).toHaveJSProperty("open", true);
  await summary.click();
  await expect(requests).toHaveText("true,false,false,");
  await expect(details).toHaveJSProperty("open", true);
  await page.getByRole("button", { name: "Change disclosure prop" }).click();
  await expect(details).toHaveJSProperty("open", false);
  await expect(requests).toHaveText("true,false,false,");
  await summary.click();
  await expect(requests).toHaveText("true,false,false,true,");
  await expect(details).toHaveJSProperty("open", false);
  await page
    .getByRole("checkbox", { name: "Accept disclosure changes" })
    .check();
  await summary.click();
  await expect(details).toHaveJSProperty("open", true);
  await summary.press("Enter");
  await expect(details).toHaveJSProperty("open", false);
  await expect(requests).toHaveText("true,false,false,true,true,false,");
});

test("Disclosure: native groups and coalesced toggle changes", async ({
  page,
}) => {
  const first = page.locator("summary", { hasText: "Grouped first" });
  const second = page.locator("summary", { hasText: "Grouped second" });
  await first.click();
  await expect(page.getByLabel("Disclosure group changes")).toHaveText(
    "first:true,",
  );
  await second.click();
  await expect(first.locator("..")).toHaveJSProperty("open", false);
  await expect(second.locator("..")).toHaveJSProperty("open", true);
  await expect(page.getByLabel("Disclosure group changes")).toContainText(
    "first:false,",
  );
  await expect(page.getByLabel("Disclosure group changes")).toContainText(
    "second:true,",
  );
  const details = page
    .locator("summary", { hasText: "Saved preferences" })
    .locator("..");
  await details.evaluate((element: HTMLDetailsElement) => {
    element.open = true;
    element.open = false;
  });
  await expect(page.getByLabel("Disclosure native toggles")).toHaveText("1");
  await expect(
    page.getByLabel("Disclosure changes", { exact: true }),
  ).toHaveText("");
  await details.evaluate((element: HTMLDetailsElement) => {
    element.open = true;
  });
  await expect(
    page.getByLabel("Disclosure changes", { exact: true }),
  ).toHaveText("true,");
  await expect(page.getByLabel("Disclosure native toggles")).toHaveText("2");
});
