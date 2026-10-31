import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

export type SwitchProps = Omit<
  ComponentPropsWithRef<"input">,
  "type" | "children" | "role"
> & {
  label: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({
  label,
  onChange,
  onCheckedChange,
  id,
  className = "",
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <label className="pancake-switch-label" htmlFor={inputId}>
      <input
        {...props}
        id={inputId}
        type="checkbox"
        role="switch"
        className={`pancake-switch ${className}`}
        onChange={(event) => {
          onChange?.(event);
          onCheckedChange?.(event.currentTarget.checked);
        }}
      />
      <span>{label}</span>
    </label>
  );
}
