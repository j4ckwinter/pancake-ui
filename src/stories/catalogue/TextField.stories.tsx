import { TextField } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Forms/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: {
    label: "Your name",
    placeholder: "Alex",
    helperText: "How should we address you?",
  },
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Required: Story = { args: { required: true } };
export const Error: Story = { args: { error: "Enter your name to continue." } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "Alex" },
};
export const Password: Story = {
  args: {
    label: "Password",
    type: "password",
    helperText: "Use your account password.",
  },
};
