import type { AriaAttributes } from "react";

type FieldDescriptionInput = {
  generatedId: string;
  error?: string;
  helperText?: string;
  describedBy?: string;
  invalid?: AriaAttributes["aria-invalid"];
};

export function fieldDescription({
  generatedId,
  error,
  helperText,
  describedBy,
  invalid,
}: FieldDescriptionInput) {
  const id = `${generatedId}-description`;
  const text = error || helperText;
  return {
    id,
    text,
    describedBy:
      [describedBy, text ? id : undefined].filter(Boolean).join(" ") ||
      undefined,
    invalid: error ? true : invalid,
    live: error ? "assertive" : "polite",
  } as const;
}
