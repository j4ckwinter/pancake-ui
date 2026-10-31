import { AvatarGroup } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const people = [
  { id: "alex", name: "Alex Morgan" },
  { id: "sam", name: "Sam Rivera" },
  { id: "jo", name: "Jo Lee" },
  { id: "taylor", name: "Taylor Chen" },
  { id: "robin", name: "Robin Patel" },
];
const meta = {
  title: "Identity/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  args: { items: people, max: 4, "aria-label": "Project members" },
  argTypes: { max: { control: { type: "number", min: 1, step: 1 } } },
} satisfies Meta<typeof AvatarGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithoutOverflow: Story = { args: { items: people.slice(0, 3) } };
export const Compact: Story = { args: { max: 2, size: 32 } };
export const Large: Story = { args: { size: 64 } };
