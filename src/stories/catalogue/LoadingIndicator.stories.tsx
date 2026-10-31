import { useState } from "react";
import {
  LoadingIndicator,
  Button,
  Stack,
  Text,
  type LoadingIndicatorProps,
} from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Feedback/LoadingIndicator",
  component: LoadingIndicator,
  tags: ["autodocs"],
  args: { label: "Loading your projects…" },
} satisfies Meta<typeof LoadingIndicator>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const LongLabel: Story = {
  args: {
    label: "Preparing the latest project activity and shared documents",
    style: { maxWidth: 240 },
  },
};
function LoadingExample(args: LoadingIndicatorProps) {
  const [loading, setLoading] = useState(true);
  return (
    <Stack>
      {loading ? (
        <LoadingIndicator {...args} />
      ) : (
        <Text as="p" role="status">
          Your projects are ready.
        </Text>
      )}
      <Button onClick={() => setLoading((value) => !value)}>
        {loading ? "Finish loading" : "Load again"}
      </Button>
    </Stack>
  );
}
export const Completion: Story = {
  render: (args) => <LoadingExample {...args} />,
};
