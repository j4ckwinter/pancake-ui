import { useId } from "react";
import {
  Button,
  Checkbox,
  Popover,
  Stack,
  type PopoverProps,
} from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
function PopoverExample(args: PopoverProps) {
  const generatedId = useId();
  const id = `${args.id}-${generatedId}`;
  return (
    <>
      <Button popoverTarget={id}>Open details</Button>
      <Popover {...args} id={id}>
        <Stack>
          {args.children}
          <Button popoverTarget={id} popoverTargetAction="hide">
            Done
          </Button>
        </Stack>
      </Popover>
    </>
  );
}
const meta = {
  title: "Overlays/Popover",
  component: Popover,
  tags: ["autodocs"],
  args: {
    id: "catalogue-popover",
    label: "Project details",
    children: "Supporting information without leaving the current page.",
  },
  render: (args) => <PopoverExample {...args} />,
  parameters: {
    docs: {
      description: {
        component:
          "A named nonmodal region. A native popoverTarget button supplies its anchor; Escape and outside clicks dismiss it. This example appends a generated suffix to avoid duplicate IDs when multiple examples appear in Docs.",
      },
    },
  },
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const InteractiveContent: Story = {
  args: {
    label: "Project filters",
    children: (
      <>
        <p>Choose which projects to include.</p>
        <Checkbox label="Include archived projects" />
      </>
    ),
  },
};
export const LongContent: Story = {
  args: {
    label: "Supporting project information",
    children: (
      <Stack>
        {Array.from({ length: 8 }, (_, index) => (
          <p key={index}>
            Detail {index + 1}: Read supporting information while the rest of
            the page stays available.
          </p>
        ))}
      </Stack>
    ),
  },
};
