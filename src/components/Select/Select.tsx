import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

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
  const descriptionId = `${generatedId}-description`;
  const description = error || helperText;
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
          aria-invalid={error ? true : invalid}
          aria-describedby={
            [describedBy, description ? descriptionId : undefined]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={`pancake-field-input pancake-select ${className}`}
        />
        <span className="pancake-select-chevron" aria-hidden="true">
          ⌄
        </span>
      </div>
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
