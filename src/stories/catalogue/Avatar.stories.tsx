import { Avatar, Inline, Text } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const portrait = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#d4edfc"/><circle cx="32" cy="24" r="12" fill="#35473f"/><path d="M10 64c0-24 44-24 44 0" fill="#35473f"/></svg>')}`;
const meta = {
  title: "Identity/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: { name: "Alex Morgan", size: 40 },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Image: Story = { args: { src: portrait } };
export const Sizes: Story = {
  render: (args) => (
    <Inline>
      {([32, 40, 48, 64] as const).map((size) => (
        <Avatar {...args} key={size} size={size} />
      ))}
    </Inline>
  ),
};
export const Decorative: Story = {
  args: { decorative: true },
  render: (args) => (
    <Inline>
      <Avatar {...args} />
      <Text>{args.name}</Text>
    </Inline>
  ),
};
export const UnicodeInitials: Story = { args: { name: "Élodie Nguyễn" } };
