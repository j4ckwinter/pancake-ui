import type { MouseEvent } from "react";
import type { DropdownMenuItem } from "./DropdownMenu";

export type MenuChoiceItem = Exclude<DropdownMenuItem, { type: "text" }>;

export function MenuChoice({
  item,
  onFocus,
  onChosen,
}: {
  item: MenuChoiceItem;
  onFocus: () => void;
  onChosen: () => void;
}) {
  const shared = {
    role: "menuitem",
    tabIndex: -1,
    "aria-disabled": item.disabled || undefined,
    className: "pancake-dropdown-menu-item",
    onFocus,
    onClick: (event: MouseEvent<HTMLElement>) => {
      if (item.disabled) {
        event.preventDefault();
        return;
      }
      onChosen();
      if (item.type === "action") item.onSelect();
    },
  };
  return item.type === "link" ? (
    <a
      {...shared}
      href={item.disabled ? undefined : item.href}
      target={item.target}
      rel={item.rel}
      download={item.download}
    >
      {item.label}
    </a>
  ) : (
    <button {...shared} type="button">
      {item.label}
    </button>
  );
}
