import { Surface, Stack, Text, ButtonLink } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Layout/Surface",
  component: Surface,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ background: "var(--color-pancake-canvas)", padding: 24 }}>
        <Story />
      </div>
    ),
  ],
  args: { children: <Text as="p">A surface groups related content.</Text> },
} satisfies Meta<typeof Surface>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithContent: Story = {
  args: {
    children: (
      <Stack>
        <Text as="h2" variant="heading">
          Project overview
        </Text>
        <Text as="p">
          Use the shared spacing and typography inside a surface.
        </Text>
        <ButtonLink href="#surface-example" variant="secondary">
          View details
        </ButtonLink>
      </Stack>
    ),
  },
};
export const Nested: Story = {
  args: {
    children: (
      <Stack>
        <Text as="h2" variant="heading">
          Parent surface
        </Text>
        <Surface style={{ background: "var(--color-pancake-surface-muted)" }}>
          <Text as="p">A nested region with a consumer theme override.</Text>
        </Surface>
      </Stack>
    ),
  },
};
