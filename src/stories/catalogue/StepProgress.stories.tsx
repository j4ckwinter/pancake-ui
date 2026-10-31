import { useState } from "react";
import {
  StepProgress,
  Button,
  Inline,
  Stack,
  type StepProgressProps,
} from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Navigation/StepProgress",
  component: StepProgress,
  tags: ["autodocs"],
  args: {
    steps: ["Account details", "Preferences", "Review and finish"],
    currentStep: 1,
    "aria-label": "Account setup progress",
  },
  argTypes: {
    currentStep: { control: { type: "number", min: 0, max: 3, step: 1 } },
  },
} satisfies Meta<typeof StepProgress>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const FirstStep: Story = { args: { currentStep: 0 } };
export const Complete: Story = { args: { currentStep: 3 } };
export const LongLabels: Story = {
  args: {
    steps: [
      "Enter your account information",
      "Choose your communication preferences",
      "Review and confirm your settings",
    ],
    style: { maxWidth: 360 },
  },
};
function ProgressExample(args: StepProgressProps) {
  const [step, setStep] = useState(0);
  const current = Math.min(step, args.steps.length);
  return (
    <Stack>
      <StepProgress {...args} currentStep={current} />
      <Inline>
        <Button
          variant="secondary"
          disabled={current === 0}
          onClick={() => setStep(current - 1)}
        >
          Previous step
        </Button>
        <Button
          disabled={current === args.steps.length}
          onClick={() => setStep(current + 1)}
        >
          Next step
        </Button>
      </Inline>
    </Stack>
  );
}
export const Interactive: Story = {
  render: (args) => <ProgressExample {...args} />,
  argTypes: { currentStep: { control: false } },
};
