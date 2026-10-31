import { useState } from "react";
import {
  BannerToast,
  Button,
  Stack,
  Text,
  type BannerToastProps,
} from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Feedback/BannerToast",
  component: BannerToast,
  tags: ["autodocs"],
  args: {
    title: "Changes saved",
    children: "Your team can now see the updated project.",
    tone: "success",
  },
} satisfies Meta<typeof BannerToast>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Warning: Story = {
  args: {
    tone: "warning",
    title: "Review your changes",
    children: "Some details need attention before you continue.",
  },
};
export const Error: Story = {
  args: {
    tone: "error",
    title: "Changes could not be saved",
    children: "Check the highlighted fields and try again.",
  },
};
export const Information: Story = {
  args: {
    tone: "info",
    title: "A new version is available",
    children: "You can continue working while your team reviews it.",
  },
};
function DismissibleBanner(args: BannerToastProps) {
  const [visible, setVisible] = useState(true);
  return (
    <Stack>
      {visible ? (
        <BannerToast
          {...args}
          onDismiss={() => {
            args.onDismiss?.();
            setVisible(false);
          }}
        />
      ) : (
        <Text as="p">Notification dismissed.</Text>
      )}
      <Button onClick={() => setVisible(true)} disabled={visible}>
        Show notification again
      </Button>
    </Stack>
  );
}
export const Dismissible: Story = {
  render: (args) => <DismissibleBanner {...args} />,
};
