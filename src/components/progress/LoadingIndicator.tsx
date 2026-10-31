import type { ComponentPropsWithRef } from "react";

export type LoadingIndicatorProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "role"
> & {
  label: string;
};

export function LoadingIndicator({
  label,
  className = "",
  ...props
}: LoadingIndicatorProps) {
  return (
    <div
      aria-atomic="true"
      {...props}
      role="status"
      className={`pancake-loading-indicator ${className}`}
    >
      <span className="pancake-loading-dots" aria-hidden="true">
        <span className="pancake-loading-dot" />
        <span className="pancake-loading-dot" />
        <span className="pancake-loading-dot" />
      </span>
      <span>{label}</span>
    </div>
  );
}
