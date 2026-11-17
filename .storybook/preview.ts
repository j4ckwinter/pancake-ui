import { createElement } from "react";
import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";
import "../src/foundations/fonts.css";

type Theme = "light" | "dark" | "system";

const preview: Preview = {
  parameters: {
    a11y: { test: "error" },
    options: {
      storySort: {
        order: [
          "Foundations",
          ["Comparison", "Theme", "Layout"],
          "Layout",
          "Typography",
          "Actions",
          "Forms",
          "Navigation",
          "Overlays",
          "Content",
          "Data",
          "Identity",
          "Feedback",
          "Components",
          "Verification",
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Colour scheme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
          { value: "system", title: "Follow the system" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme ?? "light") as Theme;
      const docs = context.viewMode === "docs";
      const root = document.documentElement;
      root.dataset.pancakeTheme = docs ? "light" : theme;
      root.style.background =
        docs || theme === "light" ? "" : "var(--color-pancake-canvas)";
      if (!docs || theme === "light") return Story();
      return createElement(
        "div",
        {
          "data-pancake-theme": theme,
          style: {
            background: "var(--color-pancake-canvas)",
            color: "var(--color-pancake-ink)",
            padding: "var(--spacing-pancake-16)",
            borderRadius: "var(--radius-pancake-12)",
          },
        },
        createElement(Story),
      );
    },
  ],
};
export default preview;
