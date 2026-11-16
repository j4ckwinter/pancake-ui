import { useArgs } from "storybook/preview-api";
import { Button, Dialog, DialogActions, Text } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Overlays/DialogActions",
  component: DialogActions,
  tags: ["autodocs"],
  render: (args) => (
    <DialogActions {...args}>
      <Button variant="ghost">Cancel</Button>
      <Button>Save changes</Button>
    </DialogActions>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "The row of buttons at the end of a dialog. Buttons sit at the end of the row in source order, so put the main action last.",
      },
    },
  },
} satisfies Meta<typeof DialogActions>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const SingleAction: Story = {
  render: (args) => (
    <DialogActions {...args}>
      <Button variant="secondary">Check again</Button>
    </DialogActions>
  ),
};
export const Destructive: Story = {
  render: (args) => (
    <DialogActions {...args}>
      <Button variant="ghost">Keep chat</Button>
      <Button variant="destructive">Delete chat</Button>
    </DialogActions>
  ),
};
export const InDialog: Story = {
  render: function Render(args) {
    const [{ open = false }, updateArgs] = useArgs<{ open?: boolean }>();
    return (
      <>
        <Button onClick={() => updateArgs({ open: true })}>Rename chat</Button>
        <Dialog
          open={open}
          onOpenChange={(next) => updateArgs({ open: next })}
          title="Rename chat"
        >
          <Text as="p">The new name shows in the sidebar.</Text>
          <DialogActions {...args}>
            <Button variant="ghost" onClick={() => updateArgs({ open: false })}>
              Cancel
            </Button>
            <Button onClick={() => updateArgs({ open: false })}>Rename</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};
