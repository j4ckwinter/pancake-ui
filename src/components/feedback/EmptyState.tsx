import type { ComponentPropsWithRef, ReactNode } from "react";

export type EmptyStateProps = Omit<
  ComponentPropsWithRef<"div">,
  "title" | "children"
> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
  ...props
}: EmptyStateProps) {
  return (
    <div {...props} className={`pancake-empty-state ${className}`}>
      {icon && (
        <div className="pancake-empty-icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="pancake-empty-title">{title}</h3>
      {description && (
        <div className="pancake-empty-description">{description}</div>
      )}
      {action && <div className="pancake-empty-action">{action}</div>}
    </div>
  );
}
