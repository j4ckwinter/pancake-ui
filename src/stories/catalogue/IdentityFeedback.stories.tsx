import {
  Avatar,
  AvatarGroup,
  BannerToast,
  EmptyState,
  StatusChip,
  Button,
} from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = {
  title: "Components/Identity and feedback",
  component: Avatar,
  tags: ["autodocs"],
  args: { name: "Alex Morgan" },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      {([32, 40, 48, 64] as const).map((size) => (
        <Avatar key={size} name="Alex Morgan" size={size} />
      ))}
    </div>
  ),
};
export const BrokenImage: Story = { args: { src: "/missing-avatar.png" } };
export const Group: Story = {
  render: () => (
    <AvatarGroup
      max={2}
      items={[
        { id: "alex", name: "Alex Morgan" },
        { id: "sam", name: "Sam Lee" },
        { id: "jo", name: "Jo Patel" },
        { id: "kim", name: "Kim Taylor" },
      ]}
    />
  ),
};
export const Statuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {(["neutral", "success", "warning", "danger", "info"] as const).map(
        (tone) => (
          <StatusChip key={tone} tone={tone}>
            {tone}
          </StatusChip>
        ),
      )}
    </div>
  ),
};
export const Notifications: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      {(["info", "success", "warning", "error"] as const).map((tone) => (
        <BannerToast key={tone} tone={tone} title={`${tone} notification`}>
          A message from your application.
        </BannerToast>
      ))}
    </div>
  ),
};
function DismissibleExample() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <BannerToast
      title="Changes saved"
      tone="success"
      onDismiss={() => setVisible(false)}
    >
      Your preferences are up to date.
    </BannerToast>
  ) : (
    <Button onClick={() => setVisible(true)}>Show notification</Button>
  );
}
export const Dismissible: Story = { render: () => <DismissibleExample /> };
export const Empty: Story = {
  render: () => (
    <EmptyState
      title="Nothing here yet"
      description="Create your first collection to get started."
      action={<Button>Create collection</Button>}
    />
  ),
};
