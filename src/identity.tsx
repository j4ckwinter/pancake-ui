import { useState, type ComponentPropsWithRef } from "react";

export type AvatarSize = 32 | 40 | 48 | 64;
export type AvatarProps = Omit<ComponentPropsWithRef<"span">, "children"> & {
  name: string;
  src?: string;
  size?: AvatarSize;
  decorative?: boolean;
};

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => Array.from(part)[0])
      .join("")
      .toLocaleUpperCase() || "?"
  );
}

function AvatarImage({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    initials(name)
  ) : (
    <img src={src} alt="" onError={() => setFailed(true)} />
  );
}

export function Avatar({
  name,
  src,
  size = 40,
  decorative = false,
  className = "",
  style,
  ...props
}: AvatarProps) {
  return (
    <span
      {...props}
      className={`pancake-avatar ${className}`}
      style={{
        width: `var(--spacing-pancake-${size})`,
        height: `var(--spacing-pancake-${size})`,
        ...style,
      }}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
    >
      {src ? <AvatarImage key={src} src={src} name={name} /> : initials(name)}
    </span>
  );
}

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
