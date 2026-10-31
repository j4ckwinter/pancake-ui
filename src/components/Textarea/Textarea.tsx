import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

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
  const descriptionId = `${generatedId}-description`;
  const description = error || helperText;
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
        aria-invalid={error ? true : invalid}
        aria-describedby={
          [describedBy, description ? descriptionId : undefined]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={`pancake-field-input pancake-textarea ${className}`}
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
