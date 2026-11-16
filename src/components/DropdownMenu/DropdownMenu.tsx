import {
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import { Button, type ButtonProps } from "../Button/Button";
import { IconButton } from "../Button/IconButton";
import { MenuChoice } from "./MenuChoice";
import type { DropdownMenuItem } from "./menuItem";
import { menuDescription, menuTextId } from "./menuText";
import { menuItems, menuKeyboard } from "./menuKeyboard";
import { useMenuTrigger } from "./useMenuTrigger";

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
  "aria-describedby": consumerDescribedBy,
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
    const node = panel.current;
    if (!node?.matches(":popover-open")) return;
    if (!hasChoices) node.hidePopover();
    else if (
      focusedId.current !== undefined &&
      !items.some((item) => item.id === focusedId.current && isChoice(item))
    )
      menuItems(node)[0]?.focus();
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
      {icon !== undefined ? (
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
        aria-describedby={menuDescription(id, items, consumerDescribedBy)}
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
        {items.map((item, index) => {
          if (item.type === "text")
            return (
              <div
                key={item.id}
                id={menuTextId(id, index)}
                className="pancake-dropdown-menu-text"
              >
                {item.label}
              </div>
            );
          return (
            <MenuChoice
              key={item.id}
              item={item}
              onFocus={() => {
                focusedId.current = item.id;
              }}
              onChosen={() => {
                panel.current?.hidePopover();
                trigger.current?.focus();
              }}
            />
          );
        })}
      </div>
    </>
  );
}
