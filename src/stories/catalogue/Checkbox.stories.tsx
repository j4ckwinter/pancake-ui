import { useArgs } from "storybook/preview-api";
import { Checkbox, type CheckboxProps } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { label: "Send me updates" },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
};
export const LongLabel: Story = {
  args: {
    label: "Automatically include detailed summaries of every project I follow",
  },
};
export const Controlled: Story = {
  args: { checked: false },
  render: function Render(args) {
    const [, updateArgs] = useArgs<CheckboxProps>();
    return (
      <Checkbox
        {...args}
        defaultChecked={undefined}
        onCheckedChange={(checked) => {
          args.onCheckedChange?.(checked);
          updateArgs({ checked });
        }}
      />
    );
  },
};
