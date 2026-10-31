export const colors = Object.freeze({
  accent: "#ade533",
  accentDisabledLayer: "rgba(173, 229, 51, 0.8)",
  border: "#edede8",
  canvas: "#fbf8f0",
  danger: "#ffd6d6",
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
} as const);

export type ColorToken = keyof typeof colors;

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
  radius12: 12,
  radius16: 16,
  radius20: 20,
  radius28: 28,
  radius36: 36,
  radius8: 8,
  radiusFull: 999,
} as const);

export type RadiusToken = keyof typeof radii;

/** Fixed UI geometry on the shared four-point grid. */
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

export type FoundationTextStyle = Readonly<{
  fontFamily: "Inter, sans-serif";
  fontSize: number;
  fontWeight: "400" | "600" | "700";
  fontStyle: "normal";
  lineHeight: `${number}px`;
  letterSpacing: number;
}>;

const style = <T extends FoundationTextStyle>(value: T) => Object.freeze(value);

export const typography = Object.freeze({
  body: style({
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: "16.8px",
    letterSpacing: 0,
  }),
  bodyStrong: style({
    fontFamily: "Inter, sans-serif",
    fontSize: 15,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: "18px",
    letterSpacing: 0,
  }),
  caption: style({
    fontFamily: "Inter, sans-serif",
    fontSize: 11,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: "13.2px",
    letterSpacing: 0,
  }),
  display: style({
    fontFamily: "Inter, sans-serif",
    fontSize: 28,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: "33.6px",
    letterSpacing: 0,
  }),
  heading: style({
    fontFamily: "Inter, sans-serif",
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: "21.6px",
    letterSpacing: 0,
  }),
  label: style({
    fontFamily: "Inter, sans-serif",
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: "14.4px",
    letterSpacing: 0,
  }),
  micro: style({
    fontFamily: "Inter, sans-serif",
    fontSize: 10,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: "12px",
    letterSpacing: 0,
  }),
  section: style({
    fontFamily: "Inter, sans-serif",
    fontSize: 20,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: "24px",
    letterSpacing: 0,
  }),
  title: style({
    fontFamily: "Inter, sans-serif",
    fontSize: 25,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: "30px",
    letterSpacing: 0,
  }),
} as const satisfies Readonly<Record<string, FoundationTextStyle>>);

export type TypographyToken = keyof typeof typography;
