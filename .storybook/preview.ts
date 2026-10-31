import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";
import "../src/foundations/fonts.css";
const preview: Preview = { parameters: { a11y: { test: "error" } } };
export default preview;
