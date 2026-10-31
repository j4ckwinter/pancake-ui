import { Text, Stack } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Typography/Text",
  component: Text,
  tags: ["autodocs"],
  args: {
    children: "Clear, readable text for your application.",
    variant: "body",
    as: "p",
  },
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Heading: Story = {
  args: { as: "h2", variant: "heading", children: "Project overview" },
};
export const Supporting: Story = {
  args: {
    variant: "caption",
    color: "muted",
    children: "Last updated a few moments ago.",
  },
};
export const TypeScale: Story = {
  render: (args) => (
    <Stack>
      {(
        [
          "display",
          "title",
          "section",
          "heading",
          "bodyStrong",
          "body",
          "label",
          "caption",
          "micro",
        ] as const
      ).map((variant) => (
        <Text {...args} key={variant} variant={variant}>
          {variant}: clear and consistent typography
        </Text>
      ))}
    </Stack>
  ),
};
export const LongContent: Story = {
  args: {
    children:
      "Longer paragraphs should wrap naturally while retaining the same typography role. Applications choose the semantic element independently from the visual size, so headings and supporting copy can retain meaningful document structure.",
    style: { maxWidth: 320 },
  },
};
