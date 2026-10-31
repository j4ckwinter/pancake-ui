import { useEffect, useRef, type FocusEvent, type PointerEvent } from "react";

export function useTooltip() {
  const anchor = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLSpanElement>(null);
  const focused = useRef(false);
  const hovered = useRef(false);
  const dismissed = useRef(false);
  const touch = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clear = () => clearTimeout(timer.current);
  const hide = () => {
    clear();
    if (panel.current?.matches(":popover-open")) panel.current.hidePopover();
  };
  const show = () => {
    clear();
    if (!dismissed.current && !touch.current && anchor.current && panel.current)
      panel.current.showPopover({ source: anchor.current });
  };
  const leave = () => {
    clear();
    if (!focused.current && !hovered.current) {
      dismissed.current = false;
      timer.current = setTimeout(hide, 150);
    }
  };
  useEffect(() => {
    const document = anchor.current!.ownerDocument;
    const keydown = (event: KeyboardEvent) => {
      touch.current = false;
      if (event.key === "Escape" && panel.current?.matches(":popover-open")) {
        event.preventDefault();
        event.stopPropagation();
        dismissed.current = true;
        panel.current.hidePopover();
      }
    };
    document.addEventListener("keydown", keydown, true);
    return () => {
      clearTimeout(timer.current);
      document.removeEventListener("keydown", keydown, true);
    };
  }, []);
  return {
    anchor,
    panel,
    handlers: {
      onFocus: (event: FocusEvent<HTMLSpanElement>) => {
        focused.current = true;
        if (!event.defaultPrevented) show();
      },
      onBlur: (event: FocusEvent<HTMLSpanElement>) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        focused.current = false;
        touch.current = false;
        leave();
      },
      onPointerEnter: (event: PointerEvent<HTMLSpanElement>) => {
        if (event.pointerType === "touch") return;
        hovered.current = true;
        touch.current = false;
        show();
      },
      onPointerLeave: (event: PointerEvent<HTMLSpanElement>) => {
        if (event.pointerType === "touch") return;
        hovered.current = false;
        leave();
      },
      onPointerDown: (event: PointerEvent<HTMLSpanElement>) => {
        if (event.pointerType === "touch") {
          touch.current = true;
          hovered.current = false;
          hide();
        }
      },
    },
  };
}
