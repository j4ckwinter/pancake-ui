import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { fieldDescription } from "../TextField/field.shared";

export type FileFieldProps = Omit<
  ComponentPropsWithRef<"input">,
  "type" | "children" | "value" | "defaultValue" | "readOnly"
> & {
  label: ReactNode;
  helperText?: string;
  error?: string;
};

export function FileField({
  label,
  helperText,
  error,
  id,
  className = "",
  required,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: FileFieldProps) {
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
      <input
        {...props}
        id={inputId}
        type="file"
        required={required}
        aria-invalid={description.invalid}
        aria-describedby={description.describedBy}
        className={`pancake-field-input pancake-file-field ${className}`}
      />
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
