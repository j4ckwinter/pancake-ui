import { useArgs } from "storybook/preview-api";
import { Pagination, type PaginationProps } from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: {
    label: "Project pages",
    page: 2,
    pageCount: 12,
    onPageChange: () => {},
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<PaginationProps>();
    if (args.getPageHref) return <Pagination {...args} />;
    return (
      <Pagination
        {...args}
        onPageChange={(page) => {
          args.onPageChange?.(page);
          updateArgs({ page });
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        component:
          "Use controlled buttons for local page state or getPageHref for native link navigation. The application owns data fetching and result focus. This canvas keeps the current page synchronized with Controls.",
      },
    },
  },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const FirstPage: Story = { args: { page: 1 } };
export const LastPage: Story = { args: { page: 12 } };
export const Empty: Story = { args: { page: 1, pageCount: 0 } };
export const SinglePage: Story = { args: { page: 1, pageCount: 1 } };
export const NativeLinks: Story = {
  args: {
    page: 1,
    onPageChange: undefined,
    getPageHref: (page) => `#project-page-${page}`,
  },
};
export const Localized: Story = {
  args: {
    labels: {
      previous: "Précédent",
      next: "Suivant",
      page: (page) => `Page ${page}`,
    },
  },
};
