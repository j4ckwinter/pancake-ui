export const colors = Object.freeze({
  accent: "#ade533",
  accentDisabledLayer: "rgba(173, 229, 51, 0.8)",
  border: "#edede8",
  canvas: "#fbf8f0",
  controlBorder: "#7e8c70",
  controlFocus: "#647a45",
  errorStrong: "#a34c3e",
  danger: "#ffd6d6",
  dangerHover: "#ffc2c2",
  deep: "#384540",
  info: "#d6edfa",
  ink: "#0e1716",
  muted: "#636b6e",
  olive: "#636657",
  surface: "#ffffff",
  surfaceAccent: "#d1f28a",
  surfaceMuted: "#f0f0eb",
  textSecondary: "#3b4742",
  transparent: "transparent",
  warning: "#ffeb9e",
  focusRing: "#ADE533",
  onAccent: "#0e1716",
  accentHover: "#d1f28a",
  backdrop: "#384540",
} as const);

export type ColorToken = keyof typeof colors;

export const darkColors = Object.freeze({
  accent: "#ade533",
  accentDisabledLayer: "rgba(173, 229, 51, 0.8)",
  border: "#2b3330",
  canvas: "#101412",
  controlBorder: "#76846e",
  controlFocus: "#b5d46e",
  errorStrong: "#ff9b8a",
  danger: "#4d2626",
  dangerHover: "#5e2e2e",
  deep: "#d5e0cf",
  info: "#1b3446",
  ink: "#eef2ec",
  muted: "#9ba49f",
  olive: "#b0b39f",
  surface: "#181d1b",
  surfaceAccent: "#2c3b12",
  surfaceMuted: "#242b28",
  textSecondary: "#c4ccc5",
  transparent: "transparent",
  warning: "#463a12",
  focusRing: "#ADE533",
  onAccent: "#0e1716",
  accentHover: "#c3f060",
  backdrop: "#000000",
} as const satisfies Record<ColorToken, string>);

export const spacing = Object.freeze({
  space0: 0,
  space12: 12,
  space16: 16,
  space20: 20,
  space24: 24,
  space32: 32,
  space4: 4,
  space40: 40,
  space8: 8,
} as const);

export type SpacingToken = keyof typeof spacing;

export const radii = Object.freeze({
  radius4: 4,
  radius12: 12,
  radius16: 16,
  radius20: 20,
  radius28: 28,
  radius36: 36,
  radius8: 8,
  radiusFull: 999,
} as const);

export type RadiusToken = keyof typeof radii;

export const sizing = Object.freeze({
  size0: 0,
  size4: 4,
  size8: 8,
  size12: 12,
  size16: 16,
  size20: 20,
  size24: 24,
  size28: 28,
  size32: 32,
  size36: 36,
  size40: 40,
  size44: 44,
  size48: 48,
  size52: 52,
  size56: 56,
  size64: 64,
  size72: 72,
  size76: 76,
  size80: 80,
  size88: 88,
  size92: 92,
  size104: 104,
  size112: 112,
  size320: 320,
  size480: 480,
  size560: 560,
} as const);

export type SizingToken = keyof typeof sizing;

export const borders = Object.freeze({
  borderDefault: 1,
  focusRingWidth: 2,
} as const);

export type BorderToken = keyof typeof borders;

export const opacity = Object.freeze({
  opacityDisabled: 0.4,
  opacityOverlay: 0.5,
} as const);

export type OpacityToken = keyof typeof opacity;

export const motion = Object.freeze({
  durationFast: "120ms",
  durationBase: "200ms",
  easing: "cubic-bezier(0.2, 0, 0, 1)",
  pressScale: 0.97,
  enterScale: 0.96,
} as const);

export const reducedMotion = Object.freeze({
  durationFast: "0ms",
  durationBase: "0ms",
  pressScale: 1,
  enterScale: 1,
} as const satisfies Partial<Record<keyof typeof motion, string | number>>);

export const fontFamily = "Inter, sans-serif";

export type FoundationTextStyle = Readonly<{
  fontFamily: typeof fontFamily;
  fontSize: number;
  fontWeight: "400" | "600" | "700";
  fontStyle: "normal";
  lineHeight: `${number}px`;
  letterSpacing: number;
}>;

const style = <T extends FoundationTextStyle>(value: T) => Object.freeze(value);

export const typography = Object.freeze({
  body: style({
    fontFamily,
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: "20px",
    letterSpacing: 0,
  }),
  bodyStrong: style({
    fontFamily,
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: "20px",
    letterSpacing: 0,
  }),
  caption: style({
    fontFamily,
    fontSize: 12,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: "16px",
    letterSpacing: 0,
  }),
  display: style({
    fontFamily,
    fontSize: 28,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: "36px",
    letterSpacing: 0,
  }),
  heading: style({
    fontFamily,
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: "24px",
    letterSpacing: 0,
  }),
  label: style({
    fontFamily,
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: "16px",
    letterSpacing: 0,
  }),
  micro: style({
    fontFamily,
    fontSize: 10,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: "12px",
    letterSpacing: 0,
  }),
  section: style({
    fontFamily,
    fontSize: 20,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: "28px",
    letterSpacing: 0,
  }),
  title: style({
    fontFamily,
    fontSize: 24,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: "32px",
    letterSpacing: 0,
  }),
} as const satisfies Readonly<Record<string, FoundationTextStyle>>);

export type TypographyToken = keyof typeof typography;
