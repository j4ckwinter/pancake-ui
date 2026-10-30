import {
  createElement,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
} from "react";
import {
  spacing,
  type SpacingToken,
  type TypographyToken,
  type ColorToken,
} from "./tokens";

type Alignment = "start" | "center" | "end" | "stretch";
type Justification = "start" | "center" | "end" | "space-between";
export type StackProps = ComponentPropsWithRef<"div"> & {
  gap?: SpacingToken;
  padding?: SpacingToken;
  align?: Alignment;
  justify?: Justification;
};
export type InlineProps = StackProps & { wrap?: boolean };
const alignment = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
} as const;
const justification = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  "space-between": "space-between",
} as const;
const space = (token: SpacingToken) =>
  `var(--spacing-pancake-${spacing[token]})`;

export function Stack({
  gap = "space16",
  padding,
  align = "stretch",
  justify = "start",
  className = "",
  style,
  ...props
}: StackProps) {
  return (
    <div
      {...props}
      className={`pancake-stack ${className}`}
      style={{
        gap: space(gap),
        padding: padding ? space(padding) : undefined,
        alignItems: alignment[align],
        justifyContent: justification[justify],
        ...style,
      }}
    />
  );
}
export function Inline({
  gap = "space12",
  padding,
  align = "center",
  justify = "start",
  wrap = true,
  className = "",
  style,
  ...props
}: InlineProps) {
  return (
    <div
      {...props}
      className={`pancake-inline ${className}`}
      style={{
        gap: space(gap),
        padding: padding ? space(padding) : undefined,
        alignItems: alignment[align],
        justifyContent: justification[justify],
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style,
      }}
    />
  );
}
export type TextProps = ComponentPropsWithRef<"span"> & {
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4";
  variant?: TypographyToken;
  color?: ColorToken;
};
const kebab = (value: string) =>
  value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
export function Text({
  as = "span",
  variant = "body",
  color = "ink",
  className = "",
  style,
  ...props
}: TextProps): ReactElement {
  const token = `--text-pancake-${kebab(variant)}`;
  const textStyle: CSSProperties = {
    fontFamily: "var(--font-pancake)",
    fontSize: `var(${token})`,
    lineHeight: `var(${token}--line-height)`,
    fontWeight: `var(${token}--font-weight)`,
    letterSpacing: `var(${token}--letter-spacing)`,
    color: `var(--color-pancake-${kebab(color)})`,
    ...style,
  };
  return createElement(as, {
    ...props,
    className: `pancake-text ${className}`,
    style: textStyle,
  });
}
