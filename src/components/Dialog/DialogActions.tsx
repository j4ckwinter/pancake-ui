import type { ComponentPropsWithRef } from "react";

export type DialogActionsProps = ComponentPropsWithRef<"div">;

export function DialogActions({
  className = "",
  ...props
}: DialogActionsProps) {
  return <div {...props} className={`pancake-dialog-actions ${className}`} />;
}
