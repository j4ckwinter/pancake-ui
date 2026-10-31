import { useRef, type ComponentPropsWithRef } from "react";

export type PopoverProps = Omit<
  ComponentPropsWithRef<"div">,
  "id" | "popover" | "role" | "aria-label"
> & {
  id: string;
  label: string;
  onOpenChange?: (open: boolean) => void;
};

export function Popover({
  label,
  onOpenChange,
  onToggle,
  className = "",
  ...props
}: PopoverProps) {
  const reportedOpen = useRef(false);
  return (
    <div
      {...props}
      popover="auto"
      role="region"
      aria-label={label}
      className={`pancake-popover ${className}`}
      onToggle={(event) => {
        const open = event.currentTarget.matches(":popover-open");
        if (open !== reportedOpen.current) {
          reportedOpen.current = open;
          onOpenChange?.(open);
        }
        onToggle?.(event);
      }}
    />
  );
}
