import type { ComponentPropsWithRef, ReactNode } from "react";
import { Button } from "../Button/Button";
import { ButtonLink } from "../Button/ButtonLink";
import { paginationPages } from "./paginationPages";

type PaginationMode =
  | {
      onPageChange: (page: number) => void;
      getPageHref?: never;
      linkProps?: never;
    }
  | {
      getPageHref: (page: number) => string;
      onPageChange?: never;
      linkProps?: Pick<ComponentPropsWithRef<"a">, "target" | "rel">;
    };

export type PaginationProps = Omit<
  ComponentPropsWithRef<"nav">,
  "children" | "role" | "aria-label"
> &
  PaginationMode & {
    label: string;
    page: number;
    pageCount: number;
    labels?: {
      previous?: string;
      next?: string;
      page?: (page: number) => string;
    };
  };

export function Pagination({
  label,
  page,
  pageCount,
  labels = {},
  getPageHref,
  onPageChange,
  linkProps,
  className = "",
  ...props
}: PaginationProps) {
  const { count, current, pages } = paginationPages(page, pageCount);
  const pageLabel = labels.page ?? ((value: number) => `Page ${value}`);
  const previous = labels.previous ?? "Previous";
  const next = labels.next ?? "Next";
  const control = (
    value: number,
    text: ReactNode,
    name: string,
    disabled = false,
    numbered = false,
  ) => {
    const active = numbered && value === current;
    if (getPageHref) {
      return disabled ? (
        <span
          className="pancake-button pancake-button--secondary pancake-button--40 pancake-pagination-control pancake-pagination-unavailable"
          aria-disabled="true"
        >
          {text}
        </span>
      ) : (
        <ButtonLink
          target={linkProps?.target}
          rel={linkProps?.rel}
          href={getPageHref(value)}
          size={40}
          variant={active ? "primary" : "secondary"}
          className="pancake-pagination-control"
          aria-label={name}
          aria-current={active ? "page" : undefined}
        >
          {text}
        </ButtonLink>
      );
    }
    return (
      <Button
        type="button"
        size={40}
        variant={active ? "primary" : "secondary"}
        className="pancake-pagination-control"
        disabled={disabled}
        aria-label={name}
        aria-current={active ? "page" : undefined}
        onClick={() => {
          if (value !== current) onPageChange?.(value);
        }}
      >
        {text}
      </Button>
    );
  };
  return (
    <nav
      {...props}
      aria-label={label}
      className={`pancake-pagination ${className}`}
    >
      <ul className="pancake-pagination-list">
        <li>{control(current - 1, previous, previous, current <= 1)}</li>
        {pages.flatMap((value, index) => [
          ...(index > 0 && value - pages[index - 1] > 1
            ? [
                <li
                  key={`gap-${value}`}
                  aria-hidden="true"
                  className="pancake-pagination-gap"
                >
                  …
                </li>,
              ]
            : []),
          <li key={value}>
            {control(value, value, pageLabel(value), false, true)}
          </li>,
        ])}
        <li>{control(current + 1, next, next, current >= count)}</li>
      </ul>
    </nav>
  );
}
