import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

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
  const descriptionId = `${generatedId}-description`;
  const description = error || helperText;
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
        aria-invalid={error ? true : invalid}
        aria-describedby={
          [describedBy, description ? descriptionId : undefined]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={`pancake-field-input ${className}`}
      />
      {description && (
        <p
          id={descriptionId}
          className="pancake-field-description"
          aria-live={error ? "assertive" : "polite"}
        >
          {description}
        </p>
      )}
    </div>
  );
}
