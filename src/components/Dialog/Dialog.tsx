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
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
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
      aria-labelledby={titleId}
      aria-describedby={
        [describedBy, description ? descriptionId : undefined]
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
        const reopenedBeforeQueuedClose = event.currentTarget.open;
        if (open && !reopenedBeforeQueuedClose) onOpenChange(false);
      }}
    >
      <Stack>
        <Inline justify="space-between" align="start" wrap={false}>
          <Text id={titleId} as="h2" variant="heading">
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
          <Text id={descriptionId} as="p" color="muted">
            {description}
          </Text>
        )}
        {children}
      </Stack>
    </dialog>
  );
}
