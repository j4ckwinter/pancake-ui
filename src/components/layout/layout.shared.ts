import { spacing, type SpacingToken } from "../../foundations/tokens";

export type Alignment = "start" | "center" | "end" | "stretch";
export type Justification = "start" | "center" | "end" | "space-between";
export const alignment = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
} as const;
export const justification = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  "space-between": "space-between",
} as const;
export const space = (token: SpacingToken) =>
  `var(--spacing-pancake-${spacing[token]})`;
