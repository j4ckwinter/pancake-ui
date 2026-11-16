import type { ComponentPropsWithRef } from "react";

type MenuItemBase = Readonly<{
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}>;
export type DropdownMenuItem =
  | Readonly<{
      type: "text";
      id: string;
      label: string;
      description?: never;
      disabled?: never;
      onSelect?: never;
      href?: never;
      checked?: never;
    }>
  | (MenuItemBase &
      (
        | {
            type: "action";
            onSelect: () => void;
            href?: never;
            checked?: never;
          }
        | {
            type: "radio";
            checked: boolean;
            onSelect: () => void;
            href?: never;
          }
        | ({
            type: "link";
            href: string;
            onSelect?: never;
            checked?: never;
            download?: string | boolean;
          } & Pick<ComponentPropsWithRef<"a">, "target" | "rel">)
      ));
