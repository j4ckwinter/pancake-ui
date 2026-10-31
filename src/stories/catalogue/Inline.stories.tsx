import { Inline, StatusChip, Text } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Layout/Inline",
  component: Inline,
  tags: ["autodocs"],
  args: {
    gap: "space12",
    children: (
      <>
        <StatusChip>Draft</StatusChip>
        <StatusChip tone="success">Ready</StatusChip>
        <StatusChip tone="warning">Review required</StatusChip>
      </>
    ),
  },
} satisfies Meta<typeof Inline>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Wrapping: Story = {
  args: { style: { maxWidth: 220 }, wrap: true },
};
export const SpacedApart: Story = {
  args: {
    justify: "space-between",
    children: (
      <>
        <Text>Project status</Text>
        <StatusChip tone="success">Ready</StatusChip>
      </>
    ),
  },
};
export const VerticalAlignment: Story = {
  args: {
    align: "start",
    children: (
      <>
        <Text as="p">A short label</Text>
        <Text as="p">
          A longer description
          <br />
          that spans two lines.
        </Text>
      </>
    ),
  },
};
