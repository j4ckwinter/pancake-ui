import { useArgs } from "storybook/preview-api";
import { Disclosure, Stack, type DisclosureProps } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Content/Disclosure",
  component: Disclosure,
  tags: ["autodocs"],
  args: {
    summary: "What happens when I archive a project?",
    children: "Archived projects keep their history and can be restored later.",
  },
} satisfies Meta<typeof Disclosure>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const InitiallyOpen: Story = { args: { defaultOpen: true } };
export const LongSummary: Story = {
  args: {
    summary:
      "A longer explanation of how project permissions and access work across your organisation",
    defaultOpen: true,
  },
};
export const ExclusiveGroup: Story = {
  render: (args) => (
    <Stack>
      <Disclosure {...args} open={undefined} name="catalogue-disclosures" />
      <Disclosure
        summary="Who can restore an archived project?"
        name="catalogue-disclosures"
      >
        Project owners can restore archived projects.
      </Disclosure>
    </Stack>
  ),
};
export const Controlled: Story = {
  args: { open: false, onOpenChange: () => {} },
  render: function Render(args) {
    const [, updateArgs] = useArgs<DisclosureProps>();
    return (
      <Disclosure
        {...args}
        name={undefined}
        defaultOpen={undefined}
        open={args.open ?? false}
        onOpenChange={(open) => {
          args.onOpenChange?.(open);
          updateArgs({ open });
        }}
      />
    );
  },
};
