import type { ComponentPropsWithRef, ReactNode } from "react";

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
