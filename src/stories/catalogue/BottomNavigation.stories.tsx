import { BottomNavigation } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const items = [
  { id: "home", label: "Home", href: "#home" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "settings", label: "Settings", href: "#settings" },
];
const meta = {
  title: "Navigation/BottomNavigation",
  component: BottomNavigation,
  tags: ["autodocs"],
  args: { items, activeId: "projects", "aria-label": "Workspace navigation" },
} satisfies Meta<typeof BottomNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithIcons: Story = {
  args: {
    items: items.map((item, index) => ({
      ...item,
      icon: <span>{["⌂", "□", "⚙"][index]}</span>,
    })),
  },
};
export const NoCurrentDestination: Story = { args: { activeId: undefined } };
export const LongLabels: Story = {
  args: {
    items: [
      { id: "home", label: "Workspace overview", href: "#overview" },
      { id: "projects", label: "Shared projects", href: "#shared" },
      { id: "settings", label: "Account preferences", href: "#preferences" },
    ],
    style: { maxWidth: 360 },
  },
};
