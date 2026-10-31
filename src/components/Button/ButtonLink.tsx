import type { ComponentPropsWithRef } from "react";
import type { ButtonProps } from "./Button";

export type ButtonLinkProps = Omit<ComponentPropsWithRef<"a">, "href"> & {
  href: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
};

export function ButtonLink({
  variant = "primary",
  size = 48,
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <a
      {...props}
      className={`pancake-button pancake-button--${variant} pancake-button--${size} pancake-button-link ${className}`}
    />
  );
}
