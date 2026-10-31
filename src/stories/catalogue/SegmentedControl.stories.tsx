import { useState } from "react";
import {
  SegmentedControl,
  Stack,
  Text,
  type SegmentedControlProps,
} from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Forms/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  args: {
    label: "Summary period",
    defaultValue: "week",
    options: [
      { value: "week", label: "Week" },
      { value: "month", label: "Month" },
      { value: "year", label: "Year" },
    ],
  },
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const DisabledOption: Story = {
  args: {
    options: [
      { value: "week", label: "Week" },
      { value: "month", label: "Month" },
      { value: "year", label: "Year", disabled: true },
    ],
  },
};
export const LongLabels: Story = {
  args: {
    label: "Notification summary",
    options: [
      { value: "week", label: "Every week" },
      { value: "month", label: "Every calendar month" },
      { value: "year", label: "Every year" },
    ],
    style: { maxWidth: 360 },
  },
};
function ControlledSelection(args: SegmentedControlProps) {
  const [value, setValue] = useState("week");
  return (
    <Stack>
      <SegmentedControl
        {...args}
        value={value}
        defaultValue={undefined}
        onValueChange={(next) => {
          setValue(next);
          args.onValueChange?.(next);
        }}
      />
      <Text as="p" role="status">
        Selected period: {value}
      </Text>
    </Stack>
  );
}
export const Controlled: Story = {
  render: (args) => <ControlledSelection {...args} />,
  argTypes: { value: { control: false }, defaultValue: { control: false } },
};
