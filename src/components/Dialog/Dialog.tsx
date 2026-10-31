import {
  useLayoutEffect,
  useId,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import { IconButton } from "../Button/IconButton";
import { Inline } from "../layout/Inline";
import { Stack } from "../layout/Stack";
import { Text } from "../layout/Text";

export type DialogProps = Omit<
  ComponentPropsWithRef<"dialog">,
  "open" | "title" | "role" | "aria-label" | "aria-labelledby" | "aria-modal"
> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  closeLabel?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  closeLabel = "Close dialog",
  children,
  ref,
  className = "",
  onCancel,
  onClose,
  "aria-describedby": describedBy,
  ...props
}: DialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  useImperativeHandle(ref, () => dialog.current as HTMLDialogElement, []);
  useLayoutEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    else if (!open && node.open) node.close();
    return () => {
      if (node.open) node.close();
    };
  }, [open]);
  return (
    <dialog
      {...props}
      ref={dialog}
      className={`pancake-dialog ${className}`}
      aria-labelledby={`${id}-title`}
      aria-describedby={
        [describedBy, description ? `${id}-description` : undefined]
          .filter(Boolean)
          .join(" ") || undefined
      }
      onCancel={(event) => {
        onCancel?.(event);
        const cancelled = event.defaultPrevented;
        event.preventDefault();
        if (!cancelled) onOpenChange(false);
      }}
      onClose={(event) => {
        onClose?.(event);
        // Native close events are queued; a reopened dialog must stay open.
        if (open && !event.currentTarget.open) onOpenChange(false);
      }}
    >
      <Stack>
        <Inline justify="space-between" align="start" wrap={false}>
          <Text id={`${id}-title`} as="h2" variant="heading">
            {title}
          </Text>
          <IconButton
            label={closeLabel}
            variant="ghost"
            size={40}
            onClick={() => onOpenChange(false)}
          >
            ×
          </IconButton>
        </Inline>
        {description && (
          <Text id={`${id}-description`} as="p" color="muted">
            {description}
          </Text>
        )}
        {children}
      </Stack>
    </dialog>
  );
}
