import { useState } from "react";
import { DropdownMenu, Stack, type DropdownMenuProps } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
function MenuExample(args: DropdownMenuProps) {
  const [selection, setSelection] = useState("No action selected");
  const items = args.items.map((item) =>
    item.type === "action"
      ? {
          ...item,
          onSelect: () => {
            item.onSelect();
            setSelection(`${item.label} selected`);
          },
        }
      : item,
  );
  return (
    <Stack>
      <DropdownMenu {...args} items={items} />
      <output aria-live="polite">{selection}</output>
    </Stack>
  );
}
const meta = {
  title: "Overlays/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  args: {
    label: "Project actions",
    items: [
      {
        id: "duplicate",
        type: "action",
        label: "Duplicate project",
        onSelect: () => {},
      },
      {
        id: "archive",
        type: "action",
        label: "Archive project",
        onSelect: () => {},
      },
      {
        id: "delete",
        type: "action",
        label: "Delete project",
        disabled: true,
        onSelect: () => {},
      },
      {
        id: "details",
        type: "link",
        label: "View project details",
        href: "#project-details",
      },
    ],
  },
  render: (args) => <MenuExample {...args} />,
  parameters: {
    docs: {
      description: {
        component:
          "Use Arrow keys, Home/End and typeahead to navigate. Disabled items remain focusable for discovery. Actions close the menu before their callback; links retain native navigation.",
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { triggerProps: { disabled: true } } };
export const Empty: Story = { args: { items: [] } };
export const LongLabels: Story = {
  args: {
    items: [
      {
        id: "archive",
        type: "action",
        label:
          "Archive this project and preserve its complete activity history",
        onSelect: () => {},
      },
      {
        id: "details",
        type: "link",
        label: "Read all supporting project details and documentation",
        href: "#project-details",
      },
    ],
  },
};
