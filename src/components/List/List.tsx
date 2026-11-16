import type { ComponentPropsWithRef } from "react";

export type ListProps = ComponentPropsWithRef<"ul">;

export function List({ className = "", ...props }: ListProps) {
  return <ul {...props} className={`pancake-list ${className}`} />;
}
