import { useState } from "react";
import {
  Table,
  Button,
  Checkbox,
  StatusChip,
  type TableProps,
} from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const rows = [
  { name: "Component library", owner: "Alex Morgan", status: "Ready" },
  { name: "Team workspace", owner: "Sam Rivera", status: "Review" },
];
const meta = {
  title: "Data/Table",
  component: Table,
  tags: ["autodocs"],
  args: {
    caption: "Project overview",
    children: (
      <>
        <thead>
          <tr>
            <th scope="col">Project</th>
            <th scope="col">Owner</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <th scope="row">{row.name}</th>
              <td>{row.owner}</td>
              <td>
                <StatusChip
                  tone={row.status === "Ready" ? "success" : "warning"}
                >
                  {row.status}
                </StatusChip>
              </td>
            </tr>
          ))}
        </tbody>
      </>
    ),
  },
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = {
  args: {
    caption: "Search results",
    children: (
      <>
        <thead>
          <tr>
            <th scope="col">Project</th>
            <th scope="col">Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2}>No matching projects.</td>
          </tr>
        </tbody>
      </>
    ),
  },
};
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Focus the scroll region and use the arrow keys, or scroll horizontally, to reach every column.",
      },
    },
  },
};
export const WithSelection: Story = {
  args: {
    children: (
      <>
        <thead>
          <tr>
            <th scope="col">Select</th>
            <th scope="col">Project</th>
            <th scope="col">Owner</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <Checkbox label={`Select ${row.name}`} />
              </td>
              <th scope="row">{row.name}</th>
              <td>{row.owner}</td>
            </tr>
          ))}
        </tbody>
      </>
    ),
  },
};
function SortableTable(args: TableProps) {
  const [descending, setDescending] = useState(false);
  const sorted = [...rows].sort((left, right) =>
    descending
      ? right.name.localeCompare(left.name)
      : left.name.localeCompare(right.name),
  );
  return (
    <Table {...args}>
      <thead>
        <tr>
          <th scope="col" aria-sort={descending ? "descending" : "ascending"}>
            <Button
              variant="secondary"
              size={40}
              onClick={() => setDescending((value) => !value)}
            >
              Sort project name {descending ? "↓" : "↑"}
            </Button>
          </th>
          <th scope="col">Owner</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <tr key={row.name}>
            <th scope="row">{row.name}</th>
            <td>{row.owner}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
export const Sortable: Story = {
  argTypes: { children: { control: false } },
  render: (args) => <SortableTable {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "The application owns sorting and exposes the current order on the native column header.",
      },
    },
  },
};
