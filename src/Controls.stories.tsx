import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Controls",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Continue" },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Button>Continue</Button>
      <Button variant="secondary">Back</Button>
      <Button variant="destructive">Delete game</Button>
      <Button variant="ghost">Cancel</Button>
      <Button size={40}>Compact</Button>
    </div>
  ),
};
export const Loading: Story = {
  args: { loading: true, children: "Save changes" },
};
export const Disabled: Story = { args: { disabled: true } };
export const Checkboxes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Checkbox label="Send me reminders" name="reminders" />
      <Checkbox label="Show my profile" defaultChecked />
      <Checkbox label="Unavailable option" disabled />
      <Checkbox label="Enabled by your administrator" disabled defaultChecked />
    </div>
  ),
};

function ControlledCheckboxExample() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="Remember my choice"
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}
export const ControlledCheckbox: Story = {
  render: () => <ControlledCheckboxExample />,
};
