import {
  createElement,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
} from "react";
import type { TypographyToken, ColorToken } from "../../foundations/tokens";

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
