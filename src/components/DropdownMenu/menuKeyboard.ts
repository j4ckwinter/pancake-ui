import type { KeyboardEvent } from "react";

export function menuItems(panel: HTMLDivElement) {
  return Array.from(panel.querySelectorAll<HTMLElement>('[role="menuitem"]'));
}

export function menuKeyboard() {
  let query = "";
  let lastTyped = 0;
  return (
    event: KeyboardEvent<HTMLDivElement>,
    trigger: HTMLButtonElement | null,
  ) => {
    if (event.defaultPrevented) return;
    const panel = event.currentTarget;
    const items = menuItems(panel);
    const current = items.indexOf(
      panel.ownerDocument.activeElement as HTMLElement,
    );
    let next: HTMLElement | undefined;
    if (event.key === "Tab") {
      panel.hidePopover();
      trigger?.focus();
      return;
    }
    if (event.key === "ArrowDown") next = items[(current + 1) % items.length];
    else if (event.key === "ArrowUp")
      next = items[(current - 1 + items.length) % items.length];
    else if (event.key === "Home") next = items[0];
    else if (event.key === "End") next = items.at(-1);
    else if (event.key === " " && event.target instanceof HTMLAnchorElement) {
      event.preventDefault();
      event.target.click();
      return;
    } else if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      event.key !== " "
    ) {
      const now = Date.now();
      query = now - lastTyped > 500 ? event.key : query + event.key;
      lastTyped = now;
      const search = [...query].every((letter) => letter === query[0])
        ? query[0]
        : query;
      next = items
        .slice(current + 1)
        .concat(items.slice(0, current + 1))
        .find((item) =>
          item.textContent
            ?.trim()
            .toLocaleLowerCase()
            .startsWith(search.toLocaleLowerCase()),
        );
      event.preventDefault();
    }
    if (next) {
      event.preventDefault();
      next.focus();
    }
  };
}
