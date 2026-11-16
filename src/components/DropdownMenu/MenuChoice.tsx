import { useId, type MouseEvent } from "react";
import type { DropdownMenuItem } from "./menuItem";

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
  const id = useId();
  const radio = item.type === "radio";
  const shared = {
    role: radio ? "menuitemradio" : "menuitem",
    "aria-checked": radio ? item.checked : undefined,
    tabIndex: -1,
    "aria-disabled": item.disabled || undefined,
    "aria-labelledby": `${id}-label`,
    "aria-describedby": item.description ? `${id}-description` : undefined,
    className: "pancake-dropdown-menu-item",
    onFocus,
    onClick: (event: MouseEvent<HTMLElement>) => {
      if (item.disabled) {
        event.preventDefault();
        return;
      }
      onChosen();
      if (item.type !== "link") item.onSelect();
    },
  };
  const content = (
    <>
      <span className="pancake-dropdown-menu-item-text">
        <span id={`${id}-label`}>{item.label}</span>
        {item.description && (
          <span
            id={`${id}-description`}
            className="pancake-dropdown-menu-item-description"
          >
            {item.description}
          </span>
        )}
      </span>
      {radio && (
        <span className="pancake-dropdown-menu-check" aria-hidden="true">
          {item.checked && (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path d="m3.5 8.5 3 3 6-7" />
            </svg>
          )}
        </span>
      )}
    </>
  );
  return item.type === "link" ? (
    <a
      {...shared}
      href={item.disabled ? undefined : item.href}
      target={item.target}
      rel={item.rel}
      download={item.download}
    >
      {content}
    </a>
  ) : (
    <button {...shared} type="button">
      {content}
    </button>
  );
}
