import { useArgs } from "storybook/preview-api";
import { Select, type SelectProps } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Forms/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    label: "Project visibility",
    helperText: "Choose who can view this project.",
    defaultValue: "team",
    children: (
      <>
        <option value="">Choose visibility</option>
        <option value="team">My team</option>
        <option value="organisation">My organisation</option>
        <option value="public" disabled>
          Public — unavailable
        </option>
      </>
    ),
  },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Required: Story = { args: { required: true, defaultValue: "" } };
export const Error: Story = {
  args: {
    required: true,
    defaultValue: "",
    error: "Choose a visibility level.",
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const GroupedOptions: Story = {
  args: {
    label: "Destination",
    defaultValue: "design",
    children: (
      <>
        <optgroup label="Teams">
          <option value="design">Design</option>
          <option value="engineering">Engineering</option>
        </optgroup>
        <optgroup label="Personal">
          <option value="drafts">My drafts</option>
        </optgroup>
      </>
    ),
  },
};
export const Controlled: Story = {
  args: { value: "team", defaultValue: undefined },
  render: function Render(args) {
    const [, updateArgs] = useArgs<SelectProps>();
    return (
      <Select
        {...args}
        onChange={(event) => {
          args.onChange?.(event);
          updateArgs({ value: event.currentTarget.value });
        }}
      />
    );
  },
};
