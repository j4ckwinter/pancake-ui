import { AppHeader, ButtonLink, Avatar } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Navigation/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
  args: {
    title: "Your projects",
    description: "A shared place to plan and track your work.",
  },
} satisfies Meta<typeof AppHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithNavigation: Story = {
  args: {
    leading: (
      <ButtonLink href="#workspace" variant="secondary" size={40}>
        Back
      </ButtonLink>
    ),
    trailing: (
      <ButtonLink href="#account" variant="secondary" size={40}>
        Account
      </ButtonLink>
    ),
  },
};
export const WithIdentity: Story = {
  args: { trailing: <Avatar name="Alex Morgan" /> },
};
export const LongTitle: Story = {
  args: {
    title: "Projects shared across the entire organisation",
    description: "Headers should retain readable wrapping on smaller screens.",
    style: { maxWidth: 360 },
  },
};
