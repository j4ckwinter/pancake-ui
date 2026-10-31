import { useArgs } from "storybook/preview-api";
import { Tabs, type TabsProps } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: {
    label: "Project sections",
    items: [
      {
        value: "overview",
        label: "Overview",
        content: "Project information and supporting details.",
      },
      {
        value: "activity",
        label: "Activity",
        content: "Recent changes and updates from your team.",
      },
      {
        value: "settings",
        label: "Settings",
        content: "Project settings.",
        disabled: true,
      },
    ],
  },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Vertical: Story = { args: { orientation: "vertical" } };
export const ManualActivation: Story = {
  args: { activation: "manual" },
  parameters: {
    docs: {
      description: {
        story: "Arrow keys move focus; Enter or Space selects the focused tab.",
      },
    },
  },
};
export const InitiallySelected: Story = { args: { defaultValue: "activity" } };
export const Controlled: Story = {
  args: { value: "overview" },
  render: function Render(args) {
    const [, updateArgs] = useArgs<TabsProps>();
    return (
      <Tabs
        {...args}
        onValueChange={(value) => {
          args.onValueChange?.(value);
          updateArgs({ value });
        }}
      />
    );
  },
};
