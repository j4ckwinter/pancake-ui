import { execFileSync } from "node:child_process";
import { test, expect } from "./fixtures";

type ComponentStories = {
  component: string;
  docsId: string;
  examples: { exportName: string; id: string }[];
};
const manifest: unknown = JSON.parse(
  execFileSync(
    process.execPath,
    ["scripts/check-stories.mjs", "--built", "--json"],
    { encoding: "utf8" },
  ),
);
function isComponentStories(value: unknown): value is ComponentStories {
  if (!value || typeof value !== "object") return false;
  if (
    !("component" in value) ||
    typeof value.component !== "string" ||
    !("docsId" in value) ||
    typeof value.docsId !== "string" ||
    !("examples" in value) ||
    !Array.isArray(value.examples) ||
    !value.examples.length
  )
    return false;
  return value.examples.every(
    (example: unknown) =>
      example !== null &&
      typeof example === "object" &&
      "exportName" in example &&
      typeof example.exportName === "string" &&
      "id" in example &&
      typeof example.id === "string",
  );
}
if (
  !Array.isArray(manifest) ||
  !manifest.length ||
  !manifest.every(isComponentStories)
)
  throw new Error(
    "Built component story coverage must return a nonempty validated manifest.",
  );
const components: ComponentStories[] = manifest;
for (const { component, examples, docsId } of components) {
  test(`Storybook: ${component} examples and documentation render`, async ({
    page,
  }) => {
    for (const { exportName, id } of examples) {
      await test.step(exportName, async () => {
        await page.goto(
          `http://127.0.0.1:6007/iframe.html?id=${id}&viewMode=story&globals=a11y.manual:!true`,
        );
        await expect(page.locator("#storybook-root")).toBeVisible();
        await expect(
          page.locator("#storybook-root > :visible").first(),
        ).toBeVisible();
        await expect(page.locator("body")).not.toHaveClass(
          /sb-show-errordisplay|sb-show-nopreview/,
        );
      });
    }
    await test.step("Autodocs", async () => {
      await page.goto(
        `http://127.0.0.1:6007/iframe.html?id=${docsId}&viewMode=docs&globals=a11y.manual:!true`,
      );
      await expect(page.locator("#storybook-docs")).toBeVisible();
      await expect(
        page
          .locator("#storybook-docs")
          .getByRole("heading", { name: component, exact: true })
          .first(),
      ).toBeVisible();
      await expect(page.locator("body")).not.toHaveClass(
        /sb-show-errordisplay|sb-show-nopreview/,
      );
    });
  });
}
