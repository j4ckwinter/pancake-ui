import {
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";

type DisclosureState =
  | {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      defaultOpen?: never;
      name?: never;
    }
  | {
      open?: never;
      defaultOpen?: boolean;
      onOpenChange?: (open: boolean) => void;
      name?: string;
    };

export type DisclosureProps = Omit<
  ComponentPropsWithRef<"details">,
  "open" | "name" | "defaultOpen"
> & {
  summary: ReactNode;
} & DisclosureState;

export function Disclosure({
  summary,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  onToggle,
  onClick,
  className = "",
  ...props
}: DisclosureProps) {
  const [initialOpen] = useState(defaultOpen);
  const lastOpen = useRef(initialOpen);
  return (
    <details
      {...props}
      open={open ?? initialOpen}
      className={`pancake-disclosure ${className}`}
      onClick={(event) => {
        onClick?.(event);
        const target = event.target;
        if (
          open === undefined ||
          event.defaultPrevented ||
          event.button !== 0 ||
          !(target instanceof Element) ||
          target.closest("summary") !== event.currentTarget.firstElementChild ||
          target.closest(
            "a, button, input, select, textarea, [contenteditable]",
          )
        ) {
          return;
        }
        event.preventDefault();
        onOpenChange?.(!open);
      }}
      onToggle={(event) => {
        const nextOpen = event.currentTarget.open;
        if (open !== undefined) {
          event.currentTarget.open = open;
        } else if (nextOpen !== lastOpen.current) {
          lastOpen.current = nextOpen;
          onOpenChange?.(nextOpen);
        }
        onToggle?.(event);
      }}
    >
      <summary className="pancake-disclosure-summary">{summary}</summary>
      <div className="pancake-disclosure-content">{children}</div>
    </details>
  );
}
