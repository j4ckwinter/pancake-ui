import {
  Button,
  AppHeader,
  BottomNavigation,
  SectionHeader,
  SegmentedControl,
  StepProgress,
} from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
const meta = {
  title: "Navigation/Catalogue",
  component: SectionHeader,
  tags: ["autodocs"],
  args: { title: "Your projects" },
} satisfies Meta<typeof SectionHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Section: Story = {
  args: {
    description: "A place for your latest work.",
    action: <Button size={40}>View all</Button>,
  },
};
export const Header: Story = {
  render: () => (
    <AppHeader
      title="Workspace"
      description="Welcome back, Alex."
      trailing={<Button>New project</Button>}
    />
  ),
};
export const Navigation: Story = {
  render: () => (
    <BottomNavigation
      activeId="home"
      items={[
        { id: "home", label: "Home", href: "#home" },
        { id: "projects", label: "Projects", href: "#projects" },
        { id: "profile", label: "Profile", href: "#profile" },
      ]}
    />
  ),
};
function SelectionExample() {
  const [value, setValue] = useState("week");
  return (
    <SegmentedControl
      label="Time period"
      name="period"
      value={value}
      onValueChange={setValue}
      options={[
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
        { value: "year", label: "Year", disabled: true },
      ]}
    />
  );
}
export const Segmented: Story = { render: () => <SelectionExample /> };
export const Uncontrolled: Story = {
  render: () => (
    <form>
      <SegmentedControl
        label="Visibility"
        name="visibility"
        defaultValue="private"
        options={[
          { value: "private", label: "Private" },
          { value: "public", label: "Public" },
        ]}
      />
      <Button type="reset">Reset selection</Button>
    </form>
  ),
};
export const Progress: Story = {
  render: () => (
    <StepProgress steps={["Account", "Preferences", "Ready"]} currentStep={1} />
  ),
};
export const Complete: Story = {
  render: () => (
    <StepProgress steps={["Account", "Preferences", "Ready"]} currentStep={3} />
  ),
};
