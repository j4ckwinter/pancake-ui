import { createRef } from "react";
import {
  Button,
  Popover,
  FileField,
  Progress,
  LoadingIndicator,
  Tabs,
  Disclosure,
  type TabsProps,
  RadioGroup,
  Switch,
  Dialog,
  ButtonLink,
  IconButton,
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
  type RadioGroupProps,
  type SwitchProps,
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
// @ts-expect-error File selection uses FileField rather than text values.
<TextField label="Attachment" type="file" />;
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

const anchorRef = createRef<HTMLAnchorElement>();
<IconButton
  ref={buttonRef}
  label="Add item"
  onClick={(event) => event.currentTarget.focus()}
>
  +
</IconButton>;
<ButtonLink
  ref={anchorRef}
  href="/projects"
  variant="secondary"
  size={40}
  onClick={(event) => event.currentTarget.href.toUpperCase()}
>
  Projects
</ButtonLink>;
// @ts-expect-error Icon actions require a label.
<IconButton>+</IconButton>;
// @ts-expect-error Navigation requires a destination.
<ButtonLink>Projects</ButtonLink>;
// @ts-expect-error Links do not support native disabled behaviour.
<ButtonLink href="/projects" disabled>
  Projects
</ButtonLink>;
// @ts-expect-error Link refs target anchors.
<ButtonLink href="/projects" ref={buttonRef}>
  Projects
</ButtonLink>;
// @ts-expect-error Icon button refs target buttons.
<IconButton ref={anchorRef} label="Add">
  +
</IconButton>;

const dialogRef = createRef<HTMLDialogElement>();
<Dialog
  title="Review"
  open={false}
  onOpenChange={(open) => open.valueOf()}
  ref={dialogRef}
  description="Review your changes."
>
  <Button>Save</Button>
</Dialog>;
// @ts-expect-error Dialog requires a visible title.
<Dialog open={false} onOpenChange={() => {}} />;
// @ts-expect-error Controlled dialogs require an open state.
<Dialog title="Review" onOpenChange={() => {}} />;
// @ts-expect-error Controlled dialogs require a dismissal handler.
<Dialog title="Review" open={false} />;
// @ts-expect-error Dialog refs target dialog elements.
<Dialog title="Review" open={false} onOpenChange={() => {}} ref={buttonRef} />;

const fieldsetRef = createRef<HTMLFieldSetElement>();
<RadioGroup
  label="Delivery"
  ref={fieldsetRef}
  options={[{ value: "daily", label: "Daily" }]}
  value="daily"
  onValueChange={(value) => value.toUpperCase()}
/>;
<Switch
  label="Notifications"
  ref={inputRef}
  checked
  onCheckedChange={(checked) => checked.valueOf()}
/>;
// @ts-expect-error Radio groups require a visible label.
<RadioGroup options={[]} />;
// @ts-expect-error Radio callbacks receive the selected string value.
const wrongRadio: RadioGroupProps["onValueChange"] = (value: number) =>
  value.toFixed();
void wrongRadio;
// @ts-expect-error Radio group refs target fieldsets.
<RadioGroup label="Delivery" options={[]} ref={inputRef} />;
// @ts-expect-error Switches require a visible label.
<Switch />;
// @ts-expect-error Switch refs target inputs.
<Switch label="Notifications" ref={buttonRef} />;
// @ts-expect-error Switch callbacks receive a boolean state.
const wrongSwitch: SwitchProps["onCheckedChange"] = (value: string) =>
  value.toUpperCase();
void wrongSwitch;

const tabsRef = createRef<HTMLDivElement>();
const detailsRef = createRef<HTMLDetailsElement>();
<Tabs
  ref={tabsRef}
  label="Project"
  items={[{ value: "overview", label: "Overview", content: <p>Overview</p> }]}
  value="overview"
  onValueChange={(value) => value.toUpperCase()}
/>;
<Disclosure ref={detailsRef} summary="More information" defaultOpen>
  <p>Details</p>
</Disclosure>;
// @ts-expect-error Tabs require a label for the tablist.
<Tabs items={[]} />;
// @ts-expect-error Tab selection callbacks receive strings.
const wrongTabChange: TabsProps["onValueChange"] = (value: number) =>
  value.toFixed();
void wrongTabChange;
// @ts-expect-error Tab refs target their root div.
<Tabs ref={buttonRef} label="Project" items={[]} />;
// @ts-expect-error Disclosure requires a visible summary.
<Disclosure />;
// @ts-expect-error Disclosure refs target details elements.
<Disclosure ref={buttonRef} summary="Details" />;

<Disclosure
  summary="Controlled details"
  open={false}
  onOpenChange={(open) => open.valueOf()}
/>;
// @ts-expect-error Controlled Disclosure requires an update handler.
<Disclosure summary="Details" open={false} />;
// @ts-expect-error Controlled and uncontrolled initial state cannot be combined.
<Disclosure
  summary="Details"
  open={false}
  defaultOpen
  onOpenChange={() => {}}
/>;
// @ts-expect-error Native exclusive grouping belongs to uncontrolled disclosures.
<Disclosure
  summary="Details"
  open={false}
  name="group"
  onOpenChange={() => {}}
/>;

const progressRef = createRef<HTMLProgressElement>();
<Progress label="Uploading" value={25} max={100} ref={progressRef} />;
<Progress label="Preparing" />;
<LoadingIndicator label="Loading projects" ref={tabsRef} />;
// @ts-expect-error Progress requires a visible label.
<Progress value={10} />;
// @ts-expect-error Progress values are numeric.
<Progress label="Uploading" value="half" />;
// @ts-expect-error Progress refs target native progress elements.
<Progress label="Uploading" ref={buttonRef} />;
// @ts-expect-error Loading indicators require visible status text.
<LoadingIndicator />;
// @ts-expect-error Loading indicator refs target div elements.
<LoadingIndicator label="Loading" ref={buttonRef} />;

<TextField
  label="Quantity"
  type="number"
  min={0}
  max={10}
  step={0.5}
  onChange={(event) => event.currentTarget.valueAsNumber.toFixed()}
/>;
<TextField
  label="Date"
  type="date"
  min="2026-01-01"
  defaultValue="2026-11-15"
/>;
<TextField label="Time" type="time" defaultValue="09:30" />;
<TextField
  label="Appointment"
  type="datetime-local"
  defaultValue="2026-11-15T09:30"
/>;
<FileField
  label="Documents"
  ref={inputRef}
  multiple
  accept=".pdf"
  onChange={(event) => event.currentTarget.files?.item(0)}
/>;
// @ts-expect-error File fields require a visible label.
<FileField />;
// @ts-expect-error Browsers do not permit controlled file selections.
<FileField label="Documents" value="report.pdf" />;
// @ts-expect-error Browsers do not permit initial file selections.
<FileField label="Documents" defaultValue="report.pdf" />;
// @ts-expect-error File fields retain native file-input semantics.
<FileField label="Documents" type="text" />;
// @ts-expect-error File fields target native input refs.
<FileField label="Documents" ref={buttonRef} />;

// @ts-expect-error Native file inputs do not support read-only state.
<FileField label="Documents" readOnly />;

<Button popoverTarget="typed-popover">Open filters</Button>;
<Popover
  id="typed-popover"
  label="Filters"
  ref={tabsRef}
  onOpenChange={(open) => open.valueOf()}
>
  <Button popoverTarget="typed-popover" popoverTargetAction="hide">
    Done
  </Button>
</Popover>;
// @ts-expect-error Popovers require a stable native target id.
<Popover label="Filters" />;
// @ts-expect-error Popovers require an accessible region label.
<Popover id="missing-label" />;
// @ts-expect-error Popovers retain native automatic dismissal.
<Popover id="manual-popover" label="Filters" popover="manual" />;
// @ts-expect-error Popover visibility is browser-owned, not a controlled open prop.
<Popover id="controlled-popover" label="Filters" open />;
// @ts-expect-error Popover refs target div elements.
<Popover id="wrong-ref" label="Filters" ref={buttonRef} />;
