import { test, expect } from "../../../tests/contracts-fixture";
import { storyUrl } from "../../../tests/servers";

test("BottomNavigation: native keyboard navigation and active semantics", async ({
  page,
}) => {
  const navigation = page.getByRole("navigation", {
    name: "Contract navigation",
  });
  await expect(navigation).toHaveAttribute("data-ref-ready", "true");
  await expect(navigation.getByRole("link", { name: "Home" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  const details = navigation.getByRole("link", { name: "Details" });
  await details.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#details$/);
  await expect(details).not.toHaveAttribute("aria-current");
});

for (const width of [1100, 375]) {
  for (const story of ["default", "with-icons", "long-labels"]) {
    test(`BottomNavigation: balanced content spacing for ${story} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(
        storyUrl(`navigation-bottomnavigation--${story}`, {
          storybookAxe: "manual",
        }),
      );
      const navigation = page.getByRole("navigation", {
        name: "Workspace navigation",
      });
      await expect(navigation).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const geometry = await navigation.evaluate((element) => {
        const list = element.querySelector("ul")!.getBoundingClientRect();
        const links = Array.from(element.querySelectorAll("a"), (link) => {
          const rect = link.getBoundingClientRect();
          const item = link.parentElement!.getBoundingClientRect();
          return {
            top: rect.top,
            bottom: rect.bottom,
            height: rect.height,
            unusedRowHeight: item.height - rect.height,
          };
        });
        return {
          height: element.getBoundingClientRect().height,
          topInset: Math.min(...links.map((link) => link.top)) - list.top,
          bottomInset:
            list.bottom - Math.max(...links.map((link) => link.bottom)),
          links,
        };
      });
      expect(geometry.links).toHaveLength(3);
      expect(geometry.topInset).toBeCloseTo(4, 0);
      expect(geometry.bottomInset).toBeCloseTo(4, 0);
      for (const link of geometry.links) {
        expect(link.height).toBeGreaterThanOrEqual(40);
        expect(link.unusedRowHeight).toBeCloseTo(0, 0);
      }
      if (story === "default") expect(geometry.height).toBeCloseTo(50, 0);
      await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
    });
  }
}
