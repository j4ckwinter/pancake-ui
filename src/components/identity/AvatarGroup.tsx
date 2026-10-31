import type { ComponentPropsWithRef } from "react";
import { Avatar, type AvatarSize } from "./Avatar";

export type AvatarGroupItem = { id: string; name: string; src?: string };
export type AvatarGroupProps = Omit<ComponentPropsWithRef<"ul">, "children"> & {
  items: readonly AvatarGroupItem[];
  max?: number;
  size?: AvatarSize;
};

export function AvatarGroup({
  items,
  max = 4,
  size = 40,
  className = "",
  "aria-label": label = "People",
  ...props
}: AvatarGroupProps) {
  if (!Number.isInteger(max) || max < 1)
    throw new RangeError("AvatarGroup max must be a positive integer.");
  const visible = items.slice(0, max);
  const overflow = items.slice(max);
  return (
    <ul
      {...props}
      aria-label={label}
      className={`pancake-avatar-group ${className}`}
    >
      {visible.map((item) => (
        <li key={item.id}>
          <Avatar name={item.name} src={item.src} size={size} />
        </li>
      ))}
      {overflow.length > 0 && (
        <li>
          <span
            className="pancake-avatar pancake-avatar-overflow"
            style={{
              width: `var(--spacing-pancake-${size})`,
              height: `var(--spacing-pancake-${size})`,
            }}
            role="img"
            aria-label={`${overflow.length} more: ${overflow.map((item) => item.name).join(", ")}`}
          >
            +{overflow.length}
          </span>
        </li>
      )}
    </ul>
  );
}
