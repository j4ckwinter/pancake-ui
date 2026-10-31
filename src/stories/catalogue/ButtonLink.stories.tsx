import { ButtonLink } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Actions/ButtonLink",
  component: ButtonLink,
  tags: ["autodocs"],
  args: { href: "#destination", children: "View details" },
  parameters: {
    docs: {
      description: {
        component:
          "A native anchor with button styling. Use for navigation; disabled and loading states belong to buttons rather than links.",
      },
    },
  },
} satisfies Meta<typeof ButtonLink>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Compact: Story = { args: { size: 40 } };
export const LongLabel: Story = {
  args: {
    children: "Read the complete project details and supporting information",
  },
};
