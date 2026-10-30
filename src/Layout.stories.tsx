import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Inline, Text } from "./layout";
import { Surface } from "./Surface";
import { typography } from "./tokens";
const meta = {
  title: "Foundations/Layout",
  component: Stack,
  tags: ["autodocs"],
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Composition: Story = {
  render: () => (
    <Surface>
      <Stack>
        <Text as="h2" variant="title">
          A flexible foundation
        </Text>
        <Inline>
          <Text>Wraps on narrow screens.</Text>
          <Text color="muted">Uses shared spacing tokens.</Text>
        </Inline>
      </Stack>
    </Surface>
  ),
};
export const Typography: Story = {
  render: () => (
    <Stack>
      {(Object.keys(typography) as (keyof typeof typography)[]).map(
        (variant) => (
          <Text key={variant} variant={variant}>
            {variant}: A familiar starting point.
          </Text>
        ),
      )}
    </Stack>
  ),
};
