import type { StackProps } from "./Stack";
import { alignment, justification, space } from "./layout.shared";

export type InlineProps = StackProps & { wrap?: boolean };

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
