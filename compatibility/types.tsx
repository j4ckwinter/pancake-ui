import { createRef } from "react";
import {
  Button,
  Checkbox,
  TextField,
  Textarea,
  Select,
  Stack,
  Inline,
  Text,
  Surface,
  Avatar,
  AvatarGroup,
  StatusChip,
  BannerToast,
  EmptyState,
  AppHeader,
  SectionHeader,
  BottomNavigation,
  SegmentedControl,
  StepProgress,
  type CheckboxProps,
  type SegmentedControlProps,
} from "pancake-ui";

const buttonRef = createRef<HTMLButtonElement>();
const inputRef = createRef<HTMLInputElement>();
const valid = (
  <Surface>
    <Stack gap="space16">
      <Inline>
        <Button
          ref={buttonRef}
          type="submit"
          variant="secondary"
          onClick={(event) => event.currentTarget.focus()}
        >
          Save
        </Button>
        <TextField
          ref={inputRef}
          label="Name"
          name="name"
          required
          type="email"
          value="Alex"
          onChange={(event) => event.currentTarget.select()}
        />
        <Checkbox
          ref={inputRef}
          label="Updates"
          onCheckedChange={(checked: boolean) => checked.valueOf()}
        />
        <Text as="h2" variant="heading">
          Title
        </Text>
        <Avatar name="Alex" size={40} />
        <AvatarGroup items={[{ id: "alex", name: "Alex" }]} />
        <StatusChip tone="success">Ready</StatusChip>
        <BannerToast title="Saved" onDismiss={() => {}} />
        <EmptyState title="No items" action={<Button>Create</Button>} />
        <AppHeader title="Workspace" />
        <SectionHeader title="Projects" headingLevel={2} />
        <BottomNavigation items={[{ id: "home", label: "Home", href: "/" }]} />
        <SegmentedControl
          label="Period"
          options={[{ value: "week", label: "Week" }]}
          value="week"
          onValueChange={(value: string) => value.toUpperCase()}
        />
        <StepProgress steps={["First"]} currentStep={0} />
      </Inline>
    </Stack>
  </Surface>
);
void valid;

// @ts-expect-error A visible field label is required by the public API.
<TextField name="name" />;
// @ts-expect-error A visible checkbox label is required by the public API.
<Checkbox />;
// @ts-expect-error Button variants are a closed set.
<Button variant="tertiary" />;
// @ts-expect-error Native button type must retain its HTML union.
<Button type="link" />;
// @ts-expect-error Button refs target a button, not an input.
<Button ref={inputRef} />;
// @ts-expect-error Text field refs target an input, not a button.
<TextField label="Name" ref={buttonRef} />;
// @ts-expect-error Checkbox change callbacks receive a boolean.
const wrongCheckbox: CheckboxProps["onCheckedChange"] = (value: string) =>
  value.toUpperCase();
// @ts-expect-error Segmented callbacks receive the string option value.
const wrongSegment: SegmentedControlProps["onValueChange"] = (value: number) =>
  value.toFixed();
void wrongCheckbox;
void wrongSegment;
// @ts-expect-error Unsupported text input types must be rejected.
<TextField label="Date" type="date" />;
// @ts-expect-error Layout spacing is constrained to shared token names.
<Stack gap="13px" />;
// @ts-expect-error Typography variants are shared token roles.
<Text variant="giant" />;
// @ts-expect-error Avatar sizes are constrained to the supported geometry.
<Avatar name="Alex" size={13} />;
// @ts-expect-error Navigation requires destinations, not just labels.
<BottomNavigation items={[{ id: "home", label: "Home" }]} />;

const textareaRef = createRef<HTMLTextAreaElement>();
const selectRef = createRef<HTMLSelectElement>();
<Textarea
  label="Details"
  ref={textareaRef}
  rows={4}
  name="details"
  onChange={(event) => event.currentTarget.select()}
/>;
<Select
  label="Visibility"
  ref={selectRef}
  name="visibility"
  defaultValue="team"
  onChange={(event) => event.currentTarget.value.toUpperCase()}
>
  <option value="team">Team</option>
</Select>;
// @ts-expect-error Textarea requires a visible label.
<Textarea />;
// @ts-expect-error Select requires a visible label.
<Select />;
// @ts-expect-error Textarea refs target textarea elements.
<Textarea label="Details" ref={inputRef} />;
// @ts-expect-error Select refs target select elements.
<Select label="Visibility" ref={inputRef} />;

// @ts-expect-error Select is a single-choice control.
<Select label="Choice" multiple />;

// @ts-expect-error A single Select accepts only one controlled value.
<Select label="Choice" value={["one"]} />;
// @ts-expect-error A single Select accepts only one default value.
<Select label="Choice" defaultValue={["one"]} />;
