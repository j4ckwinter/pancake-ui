import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { fieldDescription } from "../TextField/field.shared";
import { Icon } from "../icons/Icon";

export type SelectProps = Omit<
  ComponentPropsWithRef<"select">,
  "multiple" | "size" | "value" | "defaultValue"
> & {
  label: ReactNode;
  value?: string | number;
  defaultValue?: string | number;
  helperText?: string;
  error?: string;
};

export function Select({
  label,
  helperText,
  error,
  id,
  className = "",
  required,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const description = fieldDescription({
    generatedId,
    error,
    helperText,
    describedBy,
    invalid,
  });
  return (
    <div className="pancake-field">
      <label className="pancake-field-label" htmlFor={inputId}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <div className="pancake-select-control">
        <select
          {...props}
          id={inputId}
          required={required}
          aria-invalid={description.invalid}
          aria-describedby={description.describedBy}
          className={`pancake-field-input pancake-select ${className}`}
        />
        <span className="pancake-select-chevron" aria-hidden="true">
          <Icon name="chevronDown" />
        </span>
      </div>
      {description.text && (
        <p
          id={description.id}
          className="pancake-field-description"
          aria-live={description.live}
        >
          {description.text}
        </p>
      )}
    </div>
  );
}
