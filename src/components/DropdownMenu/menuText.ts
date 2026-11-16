import type { DropdownMenuItem } from "./menuItem";

export const menuTextId = (menuId: string, index: number) =>
  `${menuId}-text-${index}`;

export function menuDescription(
  menuId: string,
  items: readonly DropdownMenuItem[],
  describedBy: string | undefined,
) {
  const textIds = items.flatMap((item, index) =>
    item.type === "text" ? [menuTextId(menuId, index)] : [],
  );
  return [describedBy, ...textIds].filter(Boolean).join(" ") || undefined;
}
