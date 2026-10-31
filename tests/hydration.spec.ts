import { test, expect } from "./fixtures";

declare global {
  interface Window {
    serverIds: string[];
    serverRadioNames: string[];
  }
}

for (const variant of ["minimum", "current"]) {
  test(`installed archive hydrates with ${variant} supported React`, async ({
    page,
  }) => {
    await page.goto(`http://127.0.0.1:4174/${variant}/`);
    await expect(page.locator("main")).toHaveAttribute("data-hydrated", "yes");
    const associations = await page.evaluate(() => {
      return {
        serverIds: window.serverIds,
        clientIds: [...document.querySelectorAll("[id]")].map(
          (element) => element.id,
        ),
        serverNames: window.serverRadioNames,
        clientNames: [
          ...document.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
        ].map((element) => element.name),
      };
    });
    expect(associations.clientIds).toEqual(associations.serverIds);
    expect(associations.clientNames).toEqual(associations.serverNames);
    const initialDialog = page.getByRole("dialog", {
      name: "Initially hydrated dialog",
    });
    await expect(initialDialog).toBeVisible();
    await expect(initialDialog).toHaveAccessibleDescription(
      "Opened after server markup hydration.",
    );
    expect(await initialDialog.evaluate((node) => node.matches(":modal"))).toBe(
      true,
    );
    await page.keyboard.press("Escape");
    await expect(initialDialog).not.toBeVisible();
    const field = page.getByRole("textbox", { name: "Project name" });
    await expect(field).toHaveAccessibleDescription(
      "Keep this description associated after hydration.",
    );
    await field.fill("Hydrated project");
    await page.getByRole("checkbox", { name: "Receive updates" }).check();
    await page.getByRole("radio", { name: "Month" }).check();
    await page.getByRole("button", { name: "Count activation" }).click();
    await expect(page.getByLabel("Hydrated state")).toHaveText(
      "Hydrated project / true / month / 1",
    );
    await page.getByRole("button", { name: "Focus field" }).click();
    await expect(field).toBeFocused();
    const details = page.getByRole("textbox", { name: "Hydrated details" });
    await expect(details).toHaveAccessibleDescription("Additional details");
    await expect(details).toHaveValue("Server details");
    await details.fill("Client details");
    await expect(details).toHaveValue("Client details");
    const visibility = page.getByRole("combobox", {
      name: "Hydrated visibility",
    });
    await expect(visibility).toHaveAccessibleDescription("Who can see this");
    await expect(visibility).toHaveValue("team");
    await visibility.selectOption("private");
    await expect(visibility).toHaveValue("private");
    await page.getByRole("button", { name: "Hydrated icon action" }).click();
    await expect(page.getByLabel("Hydrated state")).toHaveText(
      "Hydrated project / true / month / 2",
    );
    const destination = page.getByRole("link", {
      name: "Hydrated destination",
    });
    await destination.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#hydration-details$/);
    const dialogTrigger = page.getByRole("button", {
      name: "Open hydrated dialog",
    });
    await dialogTrigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Hydrated dialog" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleDescription(
      "Server and client dialog identifiers agree.",
    );
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(dialogTrigger).toBeFocused();
    const delivery = page.getByRole("group", { name: "Hydrated delivery" });
    await expect(delivery).toHaveAccessibleDescription(
      "Select a delivery schedule",
    );
    await delivery.getByRole("radio", { name: "Immediate" }).check();
    await page.getByRole("switch", { name: "Hydrated notifications" }).check();
    await expect(page.getByLabel("Hydrated selection preferences")).toHaveText(
      "immediate / true",
    );
  });
}
