import type { ComponentPropsWithRef } from "react";

export type StepProgressProps = Omit<
  ComponentPropsWithRef<"ol">,
  "children"
> & {
  steps: readonly string[];
  currentStep: number;
};
export function StepProgress({
  steps,
  currentStep,
  className = "",
  "aria-label": label = "Progress",
  ...props
}: StepProgressProps) {
  if (
    !Number.isInteger(currentStep) ||
    currentStep < 0 ||
    currentStep > steps.length ||
    steps.length === 0
  ) {
    throw new Error(
      "StepProgress requires steps and a currentStep from 0 through steps.length (complete).",
    );
  }
  return (
    <ol
      {...props}
      aria-label={label}
      className={`pancake-step-progress ${className}`}
    >
      {steps.map((step, index) => (
        <li
          key={`${index}-${step}`}
          aria-current={currentStep === index ? "step" : undefined}
          data-complete={index < currentStep || undefined}
        >
          <span className="pancake-step-number" aria-hidden="true">
            {index < currentStep ? "✓" : index + 1}
          </span>
          <span>
            {step}
            {index < currentStep && (
              <span className="pancake-navigation-sr-only"> (complete)</span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
