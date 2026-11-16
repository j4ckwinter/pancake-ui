import type { ComponentPropsWithRef, ReactNode } from "react";

export type ListItemProps = Omit<
  ComponentPropsWithRef<"li">,
  "title" | "children"
> & {
  title: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function ListItem({
  title,
  description,
  leading,
  trailing,
  className = "",
  ...props
}: ListItemProps) {
  return (
    <li {...props} className={`pancake-list-item ${className}`}>
      {leading && <span className="pancake-list-item-leading">{leading}</span>}
      <span className="pancake-list-item-text">
        <span className="pancake-list-item-title">{title}</span>
        {description && (
          <span className="pancake-list-item-description">{description}</span>
        )}
      </span>
      {trailing && (
        <span className="pancake-list-item-trailing">{trailing}</span>
      )}
    </li>
  );
}
