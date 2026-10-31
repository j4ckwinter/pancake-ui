import { useArgs } from "storybook/preview-api";
import {
  Button,
  Dialog,
  Stack,
  TextField,
  type DialogProps,
} from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  args: {
    title: "Review project changes",
    description: "Check your changes before saving.",
    open: false,
    onOpenChange: () => {},
    children: "Your changes will be visible to everyone on the project.",
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<DialogProps>();
    return (
      <>
        <Button onClick={() => updateArgs({ open: true })}>Open dialog</Button>
        <Dialog
          {...args}
          onOpenChange={(open) => {
            args.onOpenChange(open);
            updateArgs({ open });
          }}
        />
      </>
    );
  },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const FormContent: Story = {
  args: {
    title: "Rename project",
    description: "Update the name shown to your team.",
    children: (
      <form method="dialog">
        <Stack>
          <TextField
            label="Project name"
            defaultValue="Shared workspace"
            required
          />
          <Button type="submit">Save name</Button>
        </Stack>
      </form>
    ),
  },
};
export const LongContent: Story = {
  args: {
    title: "Review supporting information",
    children: (
      <Stack>
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index}>
            Section {index + 1}: Review the project details, supporting
            documents and decisions before continuing.
          </p>
        ))}
      </Stack>
    ),
  },
};
export const LocalizedClose: Story = {
  args: { closeLabel: "Dismiss project review" },
};
