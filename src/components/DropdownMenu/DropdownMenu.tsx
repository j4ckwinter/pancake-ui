import {
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Button, type ButtonProps } from "../Button/Button";
import { IconButton } from "../Button/IconButton";
import { menuItems, menuKeyboard } from "./menuKeyboard";
import { useMenuTrigger } from "./useMenuTrigger";

type MenuItemBase = Readonly<{ id: string; label: string; disabled?: boolean }>;
export type DropdownMenuItem =
  | Readonly<{ type: "text"; id: string; label: string }>
  | (MenuItemBase &
      (
        | { type: "action"; onSelect: () => void; href?: never }
        | ({
            type: "link";
            href: string;
            onSelect?: never;
            download?: string | boolean;
          } & Pick<ComponentPropsWithRef<"a">, "target" | "rel">)
      ));
export type DropdownMenuProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "id" | "popover" | "role" | "aria-label"
> & {
  label: string;
  icon?: ReactNode;
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

const currentTime = () => Date.now();
const isChoice = (item: DropdownMenuItem) => item.type !== "text";

export function DropdownMenu({
  label,
  icon,
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
  const keyboard = useRef(menuKeyboard(currentTime));
  const focusedId = useRef<string | undefined>(undefined);
  const hasChoices = items.some(isChoice);
  useLayoutEffect(() => {
    if (
      panel.current?.matches(":popover-open") &&
      focusedId.current !== undefined &&
      !items.some((item) => item.id === focusedId.current)
    ) {
      menuItems(panel.current)[0]?.focus();
      if (!hasChoices) panel.current.hidePopover();
    }
  }, [items, hasChoices]);
  useImperativeHandle(ref, () => panel.current!, []);
  useImperativeHandle(triggerProps.ref, () => trigger.current!, []);
  const { onClick, onKeyDown: onTriggerKeyDown } = useMenuTrigger(
    panel,
    triggerProps,
  );
  const triggerAttributes = {
    ...triggerProps,
    ref: trigger,
    type: "button" as const,
    disabled: triggerProps.disabled || !hasChoices,
    popoverTarget: id,
    "aria-haspopup": "menu" as const,
    "aria-expanded": open,
    "aria-controls": id,
    onClick,
    onKeyDown: onTriggerKeyDown,
  };
  return (
    <>
      {icon ? (
        <IconButton {...triggerAttributes} label={label}>
          {icon}
        </IconButton>
      ) : (
        <Button {...triggerAttributes}>{label}</Button>
      )}
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
          if (!visible) keyboard.current = menuKeyboard(currentTime);
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
          if (item.type === "text")
            return (
              <div key={item.id} className="pancake-dropdown-menu-text">
                {item.label}
              </div>
            );
          const shared = {
            role: "menuitem",
            tabIndex: -1,
            "aria-disabled": item.disabled || undefined,
            className: "pancake-dropdown-menu-item",
            onFocus: () => {
              focusedId.current = item.id;
            },
            onClick: (event: MouseEvent<HTMLElement>) => {
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
