import { useState } from "react";
import { Button, Stack, type ButtonProps } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Actions/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Save changes" },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete draft" },
};
export const Ghost: Story = { args: { variant: "ghost" } };
export const Compact: Story = { args: { size: 40 } };
export const Loading: Story = {
  args: { loading: true, children: "Saving changes" },
};
export const Disabled: Story = { args: { disabled: true } };
function ActionExample(args: ButtonProps) {
  const [count, setCount] = useState(0);
  return (
    <Stack>
      <Button
        {...args}
        onClick={(event) => {
          args.onClick?.(event);
          setCount((value) => value + 1);
        }}
      />
      <output aria-live="polite">Saved {count} times</output>
    </Stack>
  );
}
export const WithAction: Story = {
  render: (args) => <ActionExample {...args} />,
};
