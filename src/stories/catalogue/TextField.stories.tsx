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

export const Number: Story = {
  args: {
    label: "Quantity",
    type: "number",
    min: 1,
    max: 100,
    step: 1,
    defaultValue: 4,
    helperText: "Choose between 1 and 100.",
    placeholder: undefined,
  },
};
export const Date: Story = {
  args: {
    label: "Due date",
    type: "date",
    defaultValue: "2026-11-15",
    helperText: "A calendar date without a time zone.",
    placeholder: undefined,
  },
};
export const Time: Story = {
  args: {
    label: "Start time",
    type: "time",
    defaultValue: "09:30",
    helperText: "Use your local time.",
    placeholder: undefined,
  },
};
export const LocalDateTime: Story = {
  args: {
    label: "Appointment",
    type: "datetime-local",
    defaultValue: "2026-11-15T09:30",
    helperText: "The application owns the time zone.",
    placeholder: undefined,
  },
};
export const Email: Story = {
  args: {
    label: "Email address",
    type: "email",
    placeholder: "alex@example.com",
    helperText: "Where should we send updates?",
  },
};
