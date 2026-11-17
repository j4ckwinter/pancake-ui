import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";
import "../src/foundations/fonts.css";

type Theme = "light" | "dark" | "system";

const preview: Preview = {
  parameters: { a11y: { test: "error" } },
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
      const root = document.documentElement;
      root.dataset.pancakeTheme = theme;
      root.style.background =
        theme === "light" ? "" : "var(--color-pancake-canvas)";
      return Story();
    },
  ],
};
export default preview;
