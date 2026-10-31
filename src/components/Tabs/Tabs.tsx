import {
  useId,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";

export type TabItem = Readonly<{
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}>;

export type TabsProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "defaultValue"
> & {
  label: string;
  items: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  activation?: "automatic" | "manual";
};

export function Tabs({
  label,
  items,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  activation = "automatic",
  className = "",
  ...props
}: TabsProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focusedValue, setFocusedValue] = useState<string>();
  const enabled = items.filter((item) => !item.disabled);
  const requested = value ?? internalValue;
  const selected =
    enabled.find((item) => item.value === requested)?.value ??
    enabled[0]?.value;
  const tabStop =
    enabled.find((item) => item.value === focusedValue)?.value ?? selected;
  const select = (next: string) => {
    if (next === selected) return;
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };
  return (
    <div {...props} className={`pancake-tabs ${className}`}>
      <div
        className={`pancake-tabs-list pancake-tabs-list--${orientation}`}
        role="tablist"
        aria-label={label}
        aria-orientation={orientation}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocusedValue(undefined);
        }}
      >
        {items.map((item, index) => (
          <button
            key={item.value}
            id={`${id}-tab-${index}`}
            className="pancake-tabs-tab"
            type="button"
            role="tab"
            aria-selected={item.value === selected}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={!item.disabled && item.value === tabStop ? 0 : -1}
            disabled={item.disabled}
            onFocus={() => setFocusedValue(item.value)}
            onClick={() => select(item.value)}
            onKeyDown={(event) => {
              const vertical = orientation === "vertical";
              const rtl =
                getComputedStyle(event.currentTarget).direction === "rtl";
              const previous = vertical
                ? "ArrowUp"
                : rtl
                  ? "ArrowRight"
                  : "ArrowLeft";
              const next = vertical
                ? "ArrowDown"
                : rtl
                  ? "ArrowLeft"
                  : "ArrowRight";
              const current = enabled.findIndex(
                (candidate) => candidate.value === item.value,
              );
              let target;
              if (event.key === "Home") target = enabled[0];
              else if (event.key === "End") target = enabled.at(-1);
              else if (event.key === next)
                target = enabled[(current + 1) % enabled.length];
              else if (event.key === previous)
                target =
                  enabled[(current - 1 + enabled.length) % enabled.length];
              if (!target) return;
              event.preventDefault();
              const targetIndex = items.indexOf(target);
              event.currentTarget.ownerDocument
                .getElementById(`${id}-tab-${targetIndex}`)
                ?.focus();
              if (activation === "automatic") select(target.value);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.value}
          id={`${id}-panel-${index}`}
          className="pancake-tabs-panel"
          role="tabpanel"
          aria-labelledby={`${id}-tab-${index}`}
          hidden={item.value !== selected}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
