import type { ComponentPropsWithRef } from "react";
export type SurfaceProps = ComponentPropsWithRef<"div">;
export function Surface({ className = "", ...props }: SurfaceProps) {
  return <div className={`pancake-surface ${className}`} {...props} />;
}
