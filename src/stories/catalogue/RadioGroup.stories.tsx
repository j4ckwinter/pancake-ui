import { useArgs } from "storybook/preview-api";
import { RadioGroup, type RadioGroupProps } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  args: {
    label: "Delivery frequency",
    helperText: "Choose when to receive updates.",
    options: [
      {
        value: "daily",
        label: "Daily summary",
        description: "All updates in one message.",
      },
      {
        value: "immediate",
        label: "As changes happen",
        description: "Receive each update as it happens.",
      },
      { value: "weekly", label: "Weekly digest", disabled: true },
    ],
  },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: "daily" } };
export const Required: Story = { args: { required: true } };
export const Error: Story = {
  args: { required: true, error: "Choose a delivery frequency." },
};
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "daily" },
};
export const Controlled: Story = {
  args: { value: "daily" },
  render: function Render(args) {
    const [, updateArgs] = useArgs<RadioGroupProps>();
    return (
      <RadioGroup
        {...args}
        defaultValue={undefined}
        onValueChange={(value) => {
          args.onValueChange?.(value);
          updateArgs({ value });
        }}
      />
    );
  },
};
