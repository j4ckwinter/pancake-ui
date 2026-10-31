import type { ComponentPropsWithRef, ReactNode } from "react";

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
  const Heading: "h2" | "h3" | "h4" = `h${headingLevel}`;
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
