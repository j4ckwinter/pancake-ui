import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

export type CheckboxProps = Omit<
  ComponentPropsWithRef<"input">,
  "type" | "children"
> & {
  label: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({
  label,
  onCheckedChange,
  onChange,
  id,
  className = "",
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <label className="pancake-checkbox-label" htmlFor={inputId}>
      <input
        {...props}
        id={inputId}
        type="checkbox"
        className={`pancake-checkbox ${className}`}
        onChange={(event) => {
          onChange?.(event);
          onCheckedChange?.(event.currentTarget.checked);
        }}
      />
      <span>{label}</span>
    </label>
  );
}
