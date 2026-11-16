import type { ComponentPropsWithRef } from "react";

type MenuItemBase = Readonly<{ id: string; label: string; disabled?: boolean }>;
export type DropdownMenuItem =
  | Readonly<{
      type: "text";
      id: string;
      label: string;
      disabled?: never;
      onSelect?: never;
      href?: never;
    }>
  | (MenuItemBase &
      (
        | { type: "action"; onSelect: () => void; href?: never }
        | ({
            type: "link";
            href: string;
            onSelect?: never;
            download?: string | boolean;
          } & Pick<ComponentPropsWithRef<"a">, "target" | "rel">)
      ));
