import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

type HeaderContent = {
  title: ReactNode;
  description?: ReactNode;
};
export type SectionHeaderProps = Omit<
  ComponentPropsWithRef<"div">,
  "title" | "children"
> &
  HeaderContent & {
    action?: ReactNode;
    headingLevel?: 2 | 3 | 4;
  };
export function SectionHeader({
  title,
  description,
  action,
  headingLevel = 2,
  className = "",
  ...props
}: SectionHeaderProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  return (
    <div {...props} className={`pancake-section-header ${className}`}>
      <div className="pancake-header-copy">
        <Heading className="pancake-section-title">{title}</Heading>
        {description && (
          <p className="pancake-header-description">{description}</p>
        )}
      </div>
      {action && <div className="pancake-header-action">{action}</div>}
    </div>
  );
}

export type AppHeaderProps = Omit<
  ComponentPropsWithRef<"header">,
  "title" | "children"
> &
  HeaderContent & {
    leading?: ReactNode;
    trailing?: ReactNode;
  };
export function AppHeader({
  title,
  description,
  leading,
  trailing,
  className = "",
  ...props
}: AppHeaderProps) {
  return (
    <header {...props} className={`pancake-app-header ${className}`}>
      {leading && <div className="pancake-header-action">{leading}</div>}
      <div className="pancake-header-copy">
        <h1 className="pancake-app-title">{title}</h1>
        {description && (
          <p className="pancake-header-description">{description}</p>
        )}
      </div>
      {trailing && <div className="pancake-header-action">{trailing}</div>}
    </header>
  );
}

export type NavigationItem = Readonly<{
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
}>;
export type BottomNavigationProps = Omit<
  ComponentPropsWithRef<"nav">,
  "children"
> & {
  items: readonly NavigationItem[];
  activeId?: string;
};
export function BottomNavigation({
  items,
  activeId,
  className = "",
  "aria-label": label = "Main navigation",
  ...props
}: BottomNavigationProps) {
  return (
    <nav
      {...props}
      aria-label={label}
      className={`pancake-bottom-navigation ${className}`}
    >
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-current={item.id === activeId ? "page" : undefined}
            >
              {item.icon && <span aria-hidden="true">{item.icon}</span>}
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export type SegmentOption = Readonly<{
  value: string;
  label: string;
  disabled?: boolean;
}>;
export type SegmentedControlProps = Omit<
  ComponentPropsWithRef<"fieldset">,
  "children" | "onChange"
> & {
  label: ReactNode;
  options: readonly SegmentOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
};
export function SegmentedControl({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  required,
  className = "",
  ...props
}: SegmentedControlProps) {
  const generatedName = useId();
  return (
    <fieldset
      {...props}
      disabled={disabled}
      className={`pancake-segmented-control ${className}`}
    >
      <legend>{label}</legend>
      <div className="pancake-segments">
        {options.map((option) => (
          <label key={option.value} className="pancake-segment">
            <input
              type="radio"
              form={props.form}
              name={name ?? generatedName}
              value={option.value}
              disabled={option.disabled}
              required={required}
              checked={value === undefined ? undefined : value === option.value}
              defaultChecked={
                value === undefined ? defaultValue === option.value : undefined
              }
              onChange={(event) => {
                if (event.currentTarget.checked) onValueChange?.(option.value);
              }}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

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
