import { Surface, colors } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Foundations/Theme",
  component: Surface,
  tags: ["autodocs"],
} satisfies Meta<typeof Surface>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Palette: Story = {
  render: () => (
    <Surface>
      <h1>Pancake UI foundations</h1>
      <p>Default colours, customisable through CSS variables.</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
        }}
      >
        {Object.entries(colors).map(([name, value]) => (
          <div key={name}>
            <div
              style={{
                height: 64,
                background: value,
                border: "1px solid #636b6e",
                borderRadius: 12,
              }}
            />
            <p>
              {name}: {value}
            </p>
          </div>
        ))}
      </div>
    </Surface>
  ),
};
export const ThemedSurface: Story = {
  args: { children: "A reusable surface with browser-native props." },
};
