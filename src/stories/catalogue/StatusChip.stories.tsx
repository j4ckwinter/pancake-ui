import { StatusChip, Inline } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Feedback/StatusChip",
  component: StatusChip,
  tags: ["autodocs"],
  args: { children: "Draft", tone: "neutral" },
} satisfies Meta<typeof StatusChip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Tones: Story = {
  render: (args) => (
    <Inline>
      {(["neutral", "success", "warning", "danger", "info"] as const).map(
        (tone) => (
          <StatusChip {...args} key={tone} tone={tone}>
            {tone}
          </StatusChip>
        ),
      )}
    </Inline>
  ),
};
export const Success: Story = { args: { tone: "success", children: "Ready" } };
export const LongLabel: Story = {
  args: {
    tone: "warning",
    children: "Waiting for a project administrator to review",
    style: { maxWidth: 240 },
  },
};
