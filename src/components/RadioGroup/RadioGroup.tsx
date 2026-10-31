import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

export type RadioOption = Readonly<{
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}>;

export type RadioGroupProps = Omit<
  ComponentPropsWithRef<"fieldset">,
  "children" | "onChange"
> & {
  label: ReactNode;
  options: readonly RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  helperText?: ReactNode;
  error?: string;
};

export function RadioGroup({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  required,
  helperText,
  error,
  name,
  disabled,
  className = "",
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: RadioGroupProps) {
  const generatedId = useId();
  const descriptionId = `${generatedId}-description`;
  const description = error || helperText;
  const descriptions =
    [describedBy, description ? descriptionId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <fieldset
      {...props}
      disabled={disabled}
      aria-describedby={descriptions}
      aria-invalid={error ? true : invalid}
      className={`pancake-radio-group ${className}`}
    >
      <legend className="pancake-radio-legend">{label}</legend>
      <div className="pancake-radio-options">
        {options.map((option, index) => {
          const optionDescriptionId = `${generatedId}-option-${index}`;
          return (
            <label key={option.value} className="pancake-radio-option">
              <input
                className="pancake-radio-input"
                type="radio"
                name={name ?? generatedId}
                form={props.form}
                value={option.value}
                disabled={option.disabled}
                required={required}
                aria-labelledby={`${generatedId}-label-${index}`}
                aria-describedby={
                  option.description ? optionDescriptionId : undefined
                }
                checked={
                  value === undefined ? undefined : value === option.value
                }
                defaultChecked={
                  value === undefined
                    ? defaultValue === option.value
                    : undefined
                }
                onChange={(event) => {
                  if (event.currentTarget.checked)
                    onValueChange?.(option.value);
                }}
              />
              <span className="pancake-radio-copy">
                <span id={`${generatedId}-label-${index}`}>{option.label}</span>
                {option.description && (
                  <span
                    id={optionDescriptionId}
                    className="pancake-radio-description"
                  >
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {description && (
        <span id={descriptionId} className="pancake-radio-description">
          {description}
        </span>
      )}
    </fieldset>
  );
}
