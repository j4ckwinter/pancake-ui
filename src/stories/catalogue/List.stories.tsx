import { Avatar, Button, List, ListItem, StatusChip } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Data/List",
  component: List,
  tags: ["autodocs"],
  args: { "aria-label": "Team members" },
  render: (args) => (
    <List {...args}>
      <ListItem
        title="ada@example.com"
        description="Owner"
        leading={<Avatar name="Ada Lovelace" size={32} decorative />}
      />
      <ListItem
        title="grace@example.com"
        description="Member"
        leading={<Avatar name="Grace Hopper" size={32} decorative />}
        trailing={
          <Button size={32} variant="ghost">
            Remove
          </Button>
        }
      />
    </List>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "A plain list of rows for settings, people and status screens. Name it with `aria-label` when the heading above it does not.",
      },
    },
  },
} satisfies Meta<typeof List>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Values: Story = {
  args: { "aria-label": "Service status" },
  render: (args) => (
    <List {...args}>
      <ListItem
        title="Model server"
        trailing={<StatusChip tone="success">Ready</StatusChip>}
      />
      <ListItem title="Reply in progress" trailing="No" />
      <ListItem title="Commit" trailing="a83b9cc" />
    </List>
  ),
};
export const LongContent: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem
        title={"a-very-long-address-without-breaks".repeat(4) + "@example.com"}
        description="Signed in 16 Nov 2026, 09:14 · expires 16 Dec 2026"
        trailing={
          <Button size={32} variant="secondary">
            Sign out
          </Button>
        }
      />
    </List>
  ),
};
