import type { ComponentPropsWithRef } from "react";
import type { SpacingToken } from "../../foundations/tokens";
import {
  alignment,
  justification,
  space,
  type Alignment,
  type Justification,
} from "./layout.shared";

export type StackProps = ComponentPropsWithRef<"div"> & {
  gap?: SpacingToken;
  padding?: SpacingToken;
  align?: Alignment;
  justify?: Justification;
};

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
