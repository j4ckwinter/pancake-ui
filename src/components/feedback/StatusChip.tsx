import type { ComponentPropsWithRef } from "react";

export type StatusChipTone =
  "neutral" | "success" | "warning" | "danger" | "info";
export type StatusChipProps = ComponentPropsWithRef<"span"> & {
  tone?: StatusChipTone;
};

export function StatusChip({
  tone = "neutral",
  className = "",
  ...props
}: StatusChipProps) {
  return (
    <span
      {...props}
      className={`pancake-status-chip pancake-tone-${tone} ${className}`}
    />
  );
}
