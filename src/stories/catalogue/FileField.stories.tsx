import { useState } from "react";
import { FileField, Stack, type FileFieldProps } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Forms/FileField",
  component: FileField,
  tags: ["autodocs"],
  args: {
    label: "Supporting documents",
    helperText: "Choose a document to attach.",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A native uncontrolled file input. Applications own validation and upload transport; accept is a picker hint, not validation.",
      },
    },
  },
} satisfies Meta<typeof FileField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Multiple: Story = {
  args: { multiple: true, helperText: "Choose one or more documents." },
};
export const Images: Story = {
  args: {
    label: "Cover image",
    accept: "image/*",
    helperText: "Choose an image file.",
  },
};
export const Required: Story = { args: { required: true } };
export const Error: Story = {
  args: { required: true, error: "Choose a document before continuing." },
};
export const Disabled: Story = { args: { disabled: true } };
function SelectionExample(args: FileFieldProps) {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <Stack>
      <FileField
        {...args}
        onChange={(event) => {
          args.onChange?.(event);
          setFiles(
            Array.from(event.currentTarget.files ?? [], (file) => file.name),
          );
        }}
      />
      <output aria-live="polite">
        {files.length ? files.join(", ") : "No files selected"}
      </output>
    </Stack>
  );
}
export const SelectionFeedback: Story = {
  args: { multiple: true },
  render: (args) => <SelectionExample {...args} />,
};
