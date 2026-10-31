import { Stack, Surface, Text } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  args: {
    gap: "space16",
    children: (
      <>
        <Surface>
          <Text>First item</Text>
        </Surface>
        <Surface>
          <Text>Second item</Text>
        </Surface>
        <Surface>
          <Text>Third item</Text>
        </Surface>
      </>
    ),
  },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: { gap: "space8" } };
export const Padded: Story = {
  args: {
    padding: "space24",
    style: { background: "var(--color-pancake-canvas)" },
  },
};
export const Centered: Story = { args: { align: "center" } };
