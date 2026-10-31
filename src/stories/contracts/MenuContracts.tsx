import { useState } from "react";
import {
  Button,
  Checkbox,
  DropdownMenu,
  Stack,
  type DropdownMenuItem,
} from "../../index";

export function MenuContracts() {
  const [actions, setActions] = useState(0);
  const [keys, setKeys] = useState(0);
  const [submissions, setSubmissions] = useState(0);
  const [changes, setChanges] = useState("");
  const [cancel, setCancel] = useState(false);
  const [reversed, setReversed] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [empty, setEmpty] = useState(false);
  const items: DropdownMenuItem[] = [
    {
      id: "",
      type: "action",
      label: "Alpha action",
      onSelect: () => setActions((count) => count + 1),
    },
    {
      id: "disabled",
      type: "action",
      label: "Disabled action",
      disabled: true,
      onSelect: () => setActions((count) => count + 100),
    },
    {
      id: "beta",
      type: "action",
      label: "Beta action",
      onSelect: () => setActions((count) => count + 1),
    },
    {
      id: "link",
      type: "link",
      label: "Read menu guide",
      href: "#menu-guide",
      target: "_self",
      rel: "help",
    },
    {
      id: "disabled-link",
      type: "link",
      label: "Disabled destination",
      href: "#forbidden",
      disabled: true,
    },
  ];
  const currentItems = empty
    ? []
    : items.filter((item) => !removed || item.id !== "");
  return (
    <Stack>
      <Checkbox
        label="Cancel menu opening"
        checked={cancel}
        onCheckedChange={setCancel}
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((count) => count + 1);
        }}
      >
        <Button>Before menu</Button>
        <DropdownMenu
          label="Contract menu"
          onKeyDown={() => setKeys((count) => count + 1)}
          items={reversed ? [...currentItems].reverse() : currentItems}
          ref={(node) => {
            if (node)
              node.dataset.refReady = String(node instanceof HTMLDivElement);
          }}
          className="consumer-menu"
          style={{ borderRadius: 0 }}
          aria-describedby="menu-guide"
          triggerProps={{
            ref: (node) => {
              if (node)
                node.dataset.refReady = String(
                  node instanceof HTMLButtonElement,
                );
            },
          }}
          onBeforeToggle={(event) => {
            if (cancel && event.newState === "open") event.preventDefault();
          }}
          onOpenChange={(value) =>
            setChanges((previous) => `${previous}${String(value)},`)
          }
        />
        <Button>After menu</Button>
      </form>
      <Button onClick={() => setReversed((previous) => !previous)}>
        Reverse menu items
      </Button>
      <Button onClick={() => setRemoved(true)}>Remove first menu item</Button>
      <Button onClick={() => setEmpty(true)}>Remove all menu items</Button>
      <DropdownMenu
        label="Disabled menu"
        items={items}
        triggerProps={{ disabled: true }}
      />
      <DropdownMenu label="Empty menu" items={[]} />
      <DropdownMenu
        label="Long menu"
        items={Array.from({ length: 20 }, (_, index) => ({
          type: "action",
          id: String(index),
          label: `Long action ${index} ${"unbrokencontent".repeat(12)}`,
          onSelect: () => setActions((count) => count + 1),
        }))}
      />
      <span id="menu-guide">Menu guidance</span>
      <output aria-label="Menu keys">{keys}</output>
      <output aria-label="Menu actions">{actions}</output>
      <output aria-label="Menu submissions">{submissions}</output>
      <output aria-label="Menu changes">{changes}</output>
    </Stack>
  );
}
