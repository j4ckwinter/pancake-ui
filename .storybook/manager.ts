import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";
import { colors, fontFamily } from "../src/foundations/tokens";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "pancake ui",
    brandUrl: "https://github.com/j4ckwinter/pancake-ui",
    brandTarget: "_self",
    colorPrimary: colors.accent,
    colorSecondary: colors.deep,
    appBg: colors.canvas,
    appContentBg: colors.surface,
    appPreviewBg: colors.surface,
    appBorderColor: colors.border,
    textColor: colors.ink,
    textMutedColor: colors.muted,
    barBg: colors.surface,
    barTextColor: colors.textSecondary,
    barSelectedColor: colors.deep,
    barHoverColor: colors.deep,
    inputBorder: colors.controlBorder,
    fontBase: fontFamily,
  }),
});
