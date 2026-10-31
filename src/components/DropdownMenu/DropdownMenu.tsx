import {
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
} from "react";
import { Button, type ButtonProps } from "../Button/Button";
import { menuItems, menuKeyboard } from "./menuKeyboard";

type MenuItemBase = Readonly<{ id: string; label: string; disabled?: boolean }>;
export type DropdownMenuItem = MenuItemBase &
  (
    | { type: "action"; onSelect: () => void; href?: never }
    | ({
        type: "link";
        href: string;
        onSelect?: never;
        download?: string | boolean;
      } & Pick<ComponentPropsWithRef<"a">, "target" | "rel">)
  );
export type DropdownMenuProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "id" | "popover" | "role" | "aria-label"
> & {
  label: string;
  items: readonly DropdownMenuItem[];
  onOpenChange?: (open: boolean) => void;
  triggerProps?: Omit<
    ButtonProps,
    | "children"
    | "type"
    | "popoverTarget"
    | "popoverTargetAction"
    | "aria-haspopup"
    | "aria-expanded"
    | "aria-controls"
  >;
};

export function DropdownMenu({
  label,
  items,
  triggerProps = {},
  onOpenChange,
  onToggle,
  onKeyDown,
  ref,
  className = "",
  ...props
}: DropdownMenuProps) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const reportedOpen = useRef(false);
  const keyboard = useRef(menuKeyboard());
  const focusedId = useRef<string | undefined>(undefined);
  useLayoutEffect(() => {
    if (
      panel.current?.matches(":popover-open") &&
      focusedId.current !== undefined &&
      !items.some((item) => item.id === focusedId.current)
    ) {
      menuItems(panel.current)[0]?.focus();
      if (!items.length) panel.current.hidePopover();
    }
  }, [items]);
  useImperativeHandle(ref, () => panel.current!, []);
  useImperativeHandle(triggerProps.ref, () => trigger.current!, []);
  return (
    <>
      <Button
        {...triggerProps}
        ref={trigger}
        type="button"
        disabled={triggerProps.disabled || items.length === 0}
        popoverTarget={id}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={(event) => {
          triggerProps.onClick?.(event);
          if (event.defaultPrevented || !panel.current) return;
          event.preventDefault();
          if (panel.current.matches(":popover-open"))
            panel.current.hidePopover();
          else {
            event.currentTarget.focus();
            panel.current.showPopover({ source: event.currentTarget });
            if (panel.current.matches(":popover-open"))
              menuItems(panel.current)[0]?.focus();
          }
        }}
        onKeyDown={(event) => {
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
        }}
      >
        {label}
      </Button>
      <div
        {...props}
        ref={panel}
        id={id}
        popover="auto"
        role="menu"
        aria-label={label}
        className={`pancake-popover pancake-dropdown-menu ${className}`}
        onToggle={(event) => {
          const visible = event.currentTarget.matches(":popover-open");
          setOpen(visible);
          if (!visible) keyboard.current = menuKeyboard();
          if (
            visible &&
            event.currentTarget.ownerDocument.activeElement === trigger.current
          )
            menuItems(event.currentTarget)[0]?.focus();
          if (visible !== reportedOpen.current) {
            reportedOpen.current = visible;
            onOpenChange?.(visible);
          }
          onToggle?.(event);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          keyboard.current(event, trigger.current);
        }}
      >
        {items.map((item) => {
          const shared = {
            role: "menuitem",
            tabIndex: -1,
            "aria-disabled": item.disabled || undefined,
            className: "pancake-dropdown-menu-item",
            onFocus: () => {
              focusedId.current = item.id;
            },
            onClick: (event: React.MouseEvent<HTMLElement>) => {
              if (item.disabled) {
                event.preventDefault();
                return;
              }
              panel.current?.hidePopover();
              trigger.current?.focus();
              if (item.type === "action") item.onSelect();
            },
          };
          return item.type === "link" ? (
            <a
              {...shared}
              key={item.id}
              href={item.disabled ? undefined : item.href}
              target={item.target}
              rel={item.rel}
              download={item.download}
            >
              {item.label}
            </a>
          ) : (
            <button {...shared} key={item.id} type="button">
              {item.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
