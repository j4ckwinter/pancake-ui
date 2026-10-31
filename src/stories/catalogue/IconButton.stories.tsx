import { IconButton } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Actions/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { label: "Add item", children: "+" },
  parameters: {
    docs: {
      description: {
        component:
          "An icon-only button requires a meaningful label. Icon children are decorative; native button props and refs are preserved.",
      },
    },
  },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: { size: 40 } };
export const Destructive: Story = {
  args: { variant: "destructive", label: "Remove item", children: "×" },
};
export const Loading: Story = { args: { loading: true, label: "Adding item" } };
export const Disabled: Story = { args: { disabled: true } };
