import { Avatar, Button, List, ListItem } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Data/ListItem",
  component: ListItem,
  tags: ["autodocs"],
  args: { title: "This device", description: "Signed in 16 Nov 2026, 09:14" },
  render: (args) => (
    <List aria-label="Example rows">
      <ListItem {...args} />
    </List>
  ),
} satisfies Meta<typeof ListItem>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const TitleOnly: Story = { args: { description: undefined } };
export const WithLeading: Story = {
  args: {
    title: "ada@example.com",
    description: "Owner",
    leading: <Avatar name="Ada Lovelace" size={32} decorative />,
  },
};
export const WithAction: Story = {
  args: {
    trailing: (
      <Button size={32} variant="secondary">
        Sign out
      </Button>
    ),
  },
};
export const WithValue: Story = {
  args: { title: "Reply in progress", description: undefined, trailing: "No" },
};
