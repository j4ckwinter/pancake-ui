import {
  cloneElement,
  useId,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithRef,
  type HTMLAttributes,
  type ReactElement,
} from "react";
import { useTooltip } from "./useTooltip";

export type TooltipProps = Omit<
  ComponentPropsWithRef<"span">,
  "children" | "content" | "id" | "popover" | "role" | "tabIndex" | "autoFocus"
> & {
  content: string;
  children: ReactElement<HTMLAttributes<HTMLElement>>;
  onOpenChange?: (open: boolean) => void;
};

export function Tooltip({
  content,
  children,
  onOpenChange,
  onToggle,
  ref,
  className = "",
  ...props
}: TooltipProps) {
  const id = useId();
  const { anchor, panel, handlers } = useTooltip();
  const reportedOpen = useRef(false);
  useImperativeHandle(ref, () => panel.current!, [panel]);
  return (
    <span
      ref={anchor}
      className="pancake-tooltip-anchor"
      onFocus={handlers.onFocus}
      onBlur={handlers.onBlur}
      onPointerEnter={handlers.onPointerEnter}
      onPointerLeave={handlers.onPointerLeave}
      onPointerDown={handlers.onPointerDown}
    >
      {cloneElement(children, {
        "aria-describedby": [children.props["aria-describedby"], id]
          .filter(Boolean)
          .join(" "),
      })}
      <span
        {...props}
        ref={panel}
        id={id}
        role="tooltip"
        popover="manual"
        className={`pancake-popover pancake-tooltip ${className}`}
        onToggle={(event) => {
          const open = event.currentTarget.matches(":popover-open");
          if (open !== reportedOpen.current) {
            reportedOpen.current = open;
            onOpenChange?.(open);
          }
          onToggle?.(event);
        }}
      >
        {content}
      </span>
    </span>
  );
}
