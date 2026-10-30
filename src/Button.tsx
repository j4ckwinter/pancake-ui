import type { ComponentPropsWithRef } from "react";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: 40 | 48;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = 48,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || props["aria-busy"]}
      className={`pancake-button pancake-button--${variant} pancake-button--${size} ${className}`}
    >
      {loading ? <span aria-hidden="true">•••</span> : null}
      {children}
    </button>
  );
}
