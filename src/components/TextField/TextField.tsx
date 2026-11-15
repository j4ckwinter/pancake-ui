import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { fieldDescription } from "./field.shared";

export type TextFieldProps = Omit<
  ComponentPropsWithRef<"input">,
  "type" | "children"
> & {
  label: ReactNode;
  type?:
    | "text"
    | "email"
    | "password"
    | "search"
    | "tel"
    | "url"
    | "number"
    | "date"
    | "time"
    | "datetime-local";
  helperText?: string;
  error?: string;
};

export function TextField({
  label,
  type = "text",
  helperText,
  error,
  id,
  className = "",
  required,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: TextFieldProps) {
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
        type={type}
        required={required}
        aria-invalid={description.invalid}
        aria-describedby={description.describedBy}
        className={`pancake-field-input ${className}`}
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
