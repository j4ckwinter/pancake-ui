import { test, expect } from "../../../tests/contracts-fixture";

test("FileField: native semantics, descriptions, overrides and ref", async ({
  page,
}) => {
  const input = page.getByLabel("Supporting documents");
  await expect(input).toHaveAttribute("type", "file");
  await expect(input).toHaveAccessibleName("Supporting documents");
  await expect(input).toHaveAttribute("accept", ".txt,text/plain");
  await expect(input).toHaveJSProperty("multiple", true);
  await expect(input).toHaveAttribute("data-ref-ready", "true");
  await expect(input).toHaveClass(/consumer-file/);
  await expect(input).toHaveCSS("border-radius", "0px");
  await expect(input).toHaveAccessibleDescription(
    "Documents stay on this device until submitted Choose text documents",
  );
  await expect(input).toHaveJSProperty("required", true);
  await expect(page.getByLabel("Unavailable attachment")).toBeDisabled();
  await page.getByRole("button", { name: "Toggle document error" }).click();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAccessibleDescription(
    "Documents stay on this device until submitted Choose a different document",
  );
  await page.getByRole("button", { name: "Focus document field" }).click();
  await expect(input).toBeFocused();
});

test("FileField: keyboard file chooser, selection, required form and reset", async ({
  page,
}) => {
  const input = page.getByLabel("Supporting documents");
  await page.getByRole("button", { name: "Submit documents" }).click();
  await expect(
    page.getByLabel("Document submissions", { exact: true }),
  ).toHaveText("0");
  expect(
    await input.evaluate(
      (node: HTMLInputElement) => node.validity.valueMissing,
    ),
  ).toBe(true);
  await expect(
    page.getByLabel("Submitted documents", { exact: true }),
  ).toHaveText("");
  await page.getByRole("button", { name: "Focus document field" }).click();
  const chooserPromise = page.waitForEvent("filechooser");
  await input.press("Space");
  const chooser = await chooserPromise;
  expect(chooser.isMultiple()).toBe(true);
  await chooser.setFiles([
    { name: "first.txt", mimeType: "text/plain", buffer: Buffer.from("first") },
    {
      name: "second.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("second"),
    },
  ]);
  await expect(page.getByLabel("Selected document names")).toHaveText(
    "first.txt, second.txt",
  );
  await expect(page.getByLabel("Document changes", { exact: true })).toHaveText(
    "1",
  );
  expect(
    await input.evaluate((node: HTMLInputElement) => node.files?.length),
  ).toBe(2);
  await page.getByRole("button", { name: "Submit documents" }).click();
  await expect(
    page.getByLabel("Submitted documents", { exact: true }),
  ).toHaveText("first.txt, second.txt");
  await page.getByRole("button", { name: "Reset documents" }).click();
  expect(
    await input.evaluate((node: HTMLInputElement) => node.files?.length),
  ).toBe(0);
  await expect(input).toHaveValue("");
  await expect(
    page.getByLabel("Document submissions", { exact: true }),
  ).toHaveText("1");
  await expect(page.getByLabel("Selected document names")).toHaveText("");
  await expect(page.getByLabel("Document changes", { exact: true })).toHaveText(
    "1",
  );
});
