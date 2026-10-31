import { useId, type ComponentPropsWithRef } from "react";

export type ProgressProps = Omit<
  ComponentPropsWithRef<"progress">,
  "children" | "value" | "max"
> & {
  label: string;
  value?: number;
  max?: number;
};

/** Native progress; ref, className and style target the progress element. */
export function Progress({
  label,
  value,
  max = 100,
  id,
  className = "",
  ...props
}: ProgressProps) {
  const generatedId = useId();
  const progressId = id ?? generatedId;
  return (
    <div className="pancake-progress-field">
      <label className="pancake-progress-label" htmlFor={progressId}>
        {label}
      </label>
      <progress
        {...props}
        id={progressId}
        value={value}
        max={max}
        className={`pancake-progress ${className}`}
      />
    </div>
  );
}
