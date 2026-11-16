import type { KeyboardEvent, MouseEvent, RefObject } from "react";
import type { ButtonProps } from "../Button/Button";
import { menuItems } from "./menuKeyboard";

export function useMenuTrigger(
  panel: RefObject<HTMLDivElement | null>,
  triggerProps: Pick<ButtonProps, "onClick" | "onKeyDown">,
) {
  return {
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      triggerProps.onClick?.(event);
      if (event.defaultPrevented || !panel.current) return;
      event.preventDefault();
      if (panel.current.matches(":popover-open")) panel.current.hidePopover();
      else {
        event.currentTarget.focus();
        panel.current.showPopover({ source: event.currentTarget });
        if (panel.current.matches(":popover-open"))
          menuItems(panel.current)[0]?.focus();
      }
    },
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      triggerProps.onKeyDown?.(event);
      if (
        event.defaultPrevented ||
        !["ArrowDown", "ArrowUp"].includes(event.key)
      )
        return;
      event.preventDefault();
      panel.current?.showPopover({ source: event.currentTarget });
      if (panel.current?.matches(":popover-open")) {
        const targets = menuItems(panel.current);
        (event.key === "ArrowUp" ? targets.at(-1) : targets[0])?.focus();
      }
    },
  };
}
