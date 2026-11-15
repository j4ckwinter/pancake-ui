import type { ComponentPropsWithRef } from "react";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: 32 | 36 | 40;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = 36,
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
