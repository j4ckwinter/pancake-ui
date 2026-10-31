import type { ComponentPropsWithRef, ReactNode } from "react";

type HeaderContent = {
  title: ReactNode;
  description?: ReactNode;
};
export type AppHeaderProps = Omit<
  ComponentPropsWithRef<"header">,
  "title" | "children"
> &
  HeaderContent & {
    leading?: ReactNode;
    trailing?: ReactNode;
  };
export function AppHeader({
  title,
  description,
  leading,
  trailing,
  className = "",
  ...props
}: AppHeaderProps) {
  return (
    <header {...props} className={`pancake-app-header ${className}`}>
      {leading && <div className="pancake-header-action">{leading}</div>}
      <div className="pancake-header-copy">
        <h1 className="pancake-app-title">{title}</h1>
        {description && (
          <p className="pancake-header-description">{description}</p>
        )}
      </div>
      {trailing && <div className="pancake-header-action">{trailing}</div>}
    </header>
  );
}
