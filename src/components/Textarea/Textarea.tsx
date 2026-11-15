import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { fieldDescription } from "../TextField/field.shared";

export type TextareaProps = Omit<
  ComponentPropsWithRef<"textarea">,
  "children"
> & {
  label: ReactNode;
  helperText?: string;
  error?: string;
};

export function Textarea({
  label,
  rows = 4,
  helperText,
  error,
  id,
  className = "",
  required,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: TextareaProps) {
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
      <textarea
        {...props}
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={description.invalid}
        aria-describedby={description.describedBy}
        className={`pancake-field-input pancake-textarea ${className}`}
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
