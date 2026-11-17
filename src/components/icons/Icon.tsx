const paths = {
  check: "m3.5 8.5 3 3 6-7",
  chevronDown: "m4 6 4 4 4-4",
  close: "M4 4l8 8M12 4l-8 8",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className="pancake-icon"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
