import { Button, ButtonLink, IconButton, Tooltip } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: {
    content: "Download a copy; the original stays unchanged.",
    children: <Button>Export project</Button>,
  },
  argTypes: { children: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "Hover or focus the trigger to reveal a supplementary text description. Escape dismisses it. Keep essential instructions visible; tooltip content is noninteractive and touch activation keeps the trigger's normal action.",
      },
    },
  },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const IconTrigger: Story = {
  args: {
    content: "Create a project using the current defaults.",
    children: <IconButton label="Add project">+</IconButton>,
  },
};
export const LinkTrigger: Story = {
  args: {
    content: "Read guidance on sharing a project.",
    children: (
      <ButtonLink href="#sharing-guide" variant="secondary">
        Sharing guide
      </ButtonLink>
    ),
  },
};
export const LongerDescription: Story = {
  args: {
    content:
      "Export the current project and its supporting information. Your team's original project stays unchanged.",
  },
};
