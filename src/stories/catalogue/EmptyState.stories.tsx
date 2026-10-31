import { useState } from "react";
import {
  EmptyState,
  Button,
  Stack,
  Text,
  type EmptyStateProps,
} from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "No projects yet",
    description: "Create a project to start sharing work with your team.",
  },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithIcon: Story = { args: { icon: <span>◇</span> } };
export const NoSearchResults: Story = {
  args: {
    title: "No matching projects",
    description: "Try a different search term or remove a filter.",
  },
};
function CreateExample(args: EmptyStateProps) {
  const [created, setCreated] = useState(false);
  return (
    <Stack>
      {created ? (
        <>
          <Text as="p" role="status">
            Your first project is ready.
          </Text>
          <Button variant="secondary" onClick={() => setCreated(false)}>
            Reset example
          </Button>
        </>
      ) : (
        <EmptyState
          {...args}
          action={
            <Button onClick={() => setCreated(true)}>Create project</Button>
          }
        />
      )}
    </Stack>
  );
}
export const WithAction: Story = {
  render: (args) => <CreateExample {...args} />,
};
