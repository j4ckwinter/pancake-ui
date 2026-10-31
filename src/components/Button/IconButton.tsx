import type { ReactNode } from "react";
import { Button, type ButtonProps } from "./Button";

export type IconButtonProps = Omit<
  ButtonProps,
  "aria-label" | "aria-labelledby" | "children"
> & {
  label: string;
  children: ReactNode;
};

export function IconButton({
  label,
  children,
  loading = false,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <Button
      {...props}
      loading={loading}
      aria-label={label}
      className={`pancake-icon-button ${className}`}
    >
      {!loading && (
        <span className="pancake-icon-button-icon" aria-hidden="true">
          {children}
        </span>
      )}
    </Button>
  );
}
