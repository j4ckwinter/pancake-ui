import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppHeader, Stack } from "../../index";
import { FeedbackContracts } from "./FeedbackContracts";
import { FormContracts } from "./FormContracts";
import { PresentationContracts } from "./PresentationContracts";
import { FieldsContracts } from "./FieldsContracts";
import { markRef } from "./markRef";

const meta = {
  title: "Verification/Contracts",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function ContractHarness() {
  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Stack ref={markRef} data-contract="Stack">
        <AppHeader
          ref={markRef}
          data-contract="AppHeader"
          title="Component contracts"
          description="Deterministic interaction fixtures."
        />
        <FormContracts />
        <FeedbackContracts />
        <PresentationContracts />
        <FieldsContracts />
      </Stack>
    </main>
  );
}
export const Interactive: Story = { render: () => <ContractHarness /> };
