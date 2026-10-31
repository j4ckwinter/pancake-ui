import { useState } from "react";
import { Progress, Button, Stack, type ProgressProps } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Feedback/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: { label: "Uploading documents", value: 45, max: 100 },
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Indeterminate: Story = {
  args: { label: "Preparing documents", value: undefined },
};
export const Complete: Story = {
  args: { label: "Upload complete", value: 100 },
};
export const CustomMaximum: Story = {
  args: { label: "Files processed", value: 3, max: 8 },
};
function UpdatingProgress(args: ProgressProps) {
  const [value, setValue] = useState(0);
  return (
    <Stack>
      <Progress {...args} value={value} max={100} />
      <Button
        onClick={() =>
          setValue((previous) =>
            previous === 100 ? 0 : Math.min(100, previous + 25),
          )
        }
      >
        {value === 100 ? "Restart example" : "Process next batch"}
      </Button>
    </Stack>
  );
}
export const Updating: Story = {
  render: (args) => <UpdatingProgress {...args} />,
  argTypes: { value: { control: false }, max: { control: false } },
};
