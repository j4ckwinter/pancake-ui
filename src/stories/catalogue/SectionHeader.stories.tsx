import { SectionHeader, ButtonLink } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Navigation/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
  args: {
    title: "Recent activity",
    description: "Updates from the projects you follow.",
  },
} satisfies Meta<typeof SectionHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithAction: Story = {
  args: {
    action: (
      <ButtonLink href="#activity" variant="secondary" size={40}>
        View all
      </ButtonLink>
    ),
  },
};
export const NestedHeading: Story = {
  args: { headingLevel: 3, title: "Project milestones" },
};
export const LongContent: Story = {
  args: {
    title: "Recent updates from every project in your workspace",
    description:
      "This longer description wraps without requiring an application-specific text style.",
    style: { maxWidth: 360 },
  },
};
