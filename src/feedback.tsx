import type { ComponentPropsWithRef, ReactNode } from "react";

export type StatusChipTone =
  "neutral" | "success" | "warning" | "danger" | "info";
export type StatusChipProps = ComponentPropsWithRef<"span"> & {
  tone?: StatusChipTone;
};

export function StatusChip({
  tone = "neutral",
  className = "",
  ...props
}: StatusChipProps) {
  return (
    <span
      {...props}
      className={`pancake-status-chip pancake-tone-${tone} ${className}`}
    />
  );
}

export type BannerToastProps = Omit<
  ComponentPropsWithRef<"div">,
  "title" | "role" | "aria-live"
> & {
  title: ReactNode;
  tone?: "success" | "warning" | "error" | "info";
  onDismiss?: () => void;
  dismissLabel?: string;
};

export function BannerToast({
  title,
  children,
  tone = "info",
  onDismiss,
  dismissLabel = "Dismiss notification",
  className = "",
  ...props
}: BannerToastProps) {
  return (
    <div
      {...props}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      className={`pancake-banner pancake-tone-${tone === "error" ? "danger" : tone} ${className}`}
    >
      <div className="pancake-banner-copy">
        <strong className="pancake-banner-title">{title}</strong>
        {children && (
          <div className="pancake-banner-description">{children}</div>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="pancake-banner-dismiss"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}

export type EmptyStateProps = Omit<
  ComponentPropsWithRef<"div">,
  "title" | "children"
> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
  ...props
}: EmptyStateProps) {
  return (
    <div {...props} className={`pancake-empty-state ${className}`}>
      {icon && (
        <div className="pancake-empty-icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="pancake-empty-title">{title}</h3>
      {description && (
        <div className="pancake-empty-description">{description}</div>
      )}
      {action && <div className="pancake-empty-action">{action}</div>}
    </div>
  );
}
