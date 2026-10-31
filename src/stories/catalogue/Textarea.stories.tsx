import { useArgs } from "storybook/preview-api";
import { Textarea, type TextareaProps } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    label: "Project description",
    helperText: "Describe what your team is working on.",
    placeholder: "A shared place for…",
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Required: Story = { args: { required: true } };
export const Error: Story = {
  args: {
    required: true,
    error: "Add a project description before continuing.",
  },
};
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "This project is archived." },
};
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: "A description managed by your organisation.",
  },
};
export const LongerAnswer: Story = {
  args: {
    rows: 8,
    defaultValue: "Goals\n\nDescribe the outcome, constraints and next steps.",
  },
};
export const Controlled: Story = {
  args: { value: "A shared workspace" },
  render: function Render(args) {
    const [, updateArgs] = useArgs<TextareaProps>();
    return (
      <Textarea
        {...args}
        defaultValue={undefined}
        onChange={(event) => {
          args.onChange?.(event);
          updateArgs({ value: event.currentTarget.value });
        }}
      />
    );
  },
};
