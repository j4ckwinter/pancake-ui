import type { ComponentPropsWithRef, ReactNode } from "react";

export type NavigationItem = Readonly<{
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
}>;
export type BottomNavigationProps = Omit<
  ComponentPropsWithRef<"nav">,
  "children"
> & {
  items: readonly NavigationItem[];
  activeId?: string;
};
export function BottomNavigation({
  items,
  activeId,
  className = "",
  "aria-label": label = "Main navigation",
  ...props
}: BottomNavigationProps) {
  return (
    <nav
      {...props}
      aria-label={label}
      className={`pancake-bottom-navigation ${className}`}
    >
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-current={item.id === activeId ? "page" : undefined}
            >
              {item.icon && <span aria-hidden="true">{item.icon}</span>}
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
