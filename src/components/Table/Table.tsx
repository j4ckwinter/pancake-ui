import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

export type TableProps = Omit<ComponentPropsWithRef<"table">, "children"> & {
  caption: string;
  children: ReactNode;
};

export function Table({
  caption,
  children,
  className = "",
  ...props
}: TableProps) {
  const captionId = useId();
  return (
    <div
      className="pancake-table-scroll"
      role="region"
      aria-labelledby={captionId}
      tabIndex={0}
    >
      <table {...props} className={`pancake-table ${className}`}>
        <caption id={captionId}>{caption}</caption>
        {children}
      </table>
    </div>
  );
}
