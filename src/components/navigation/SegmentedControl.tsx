import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

export type SegmentOption = Readonly<{
  value: string;
  label: string;
  disabled?: boolean;
}>;
export type SegmentedControlProps = Omit<
  ComponentPropsWithRef<"fieldset">,
  "children" | "onChange"
> & {
  label: ReactNode;
  options: readonly SegmentOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
};
export function SegmentedControl({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  required,
  className = "",
  ...props
}: SegmentedControlProps) {
  const generatedName = useId();
  return (
    <fieldset
      {...props}
      disabled={disabled}
      className={`pancake-segmented-control ${className}`}
    >
      <legend>{label}</legend>
      <div className="pancake-segments">
        {options.map((option) => (
          <label key={option.value} className="pancake-segment">
            <input
              type="radio"
              form={props.form}
              name={name ?? generatedName}
              value={option.value}
              disabled={option.disabled}
              required={required}
              checked={value === undefined ? undefined : value === option.value}
              defaultChecked={
                value === undefined ? defaultValue === option.value : undefined
              }
              onChange={(event) => {
                if (event.currentTarget.checked) onValueChange?.(option.value);
              }}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
