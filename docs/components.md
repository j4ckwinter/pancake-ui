# Component reference

For interactive examples, run `npm run storybook` from the repository. [Back to the README](../README.md).

## Controls

```tsx
import { Button, Checkbox, TextField } from "pancake-ui";

<form onSubmit={handleSubmit}>
  <TextField
    label="Your name"
    name="name"
    required
    helperText="Your display name."
  />
  <Checkbox label="Send updates" name="updates" value="yes" />
  <Button type="submit">Save preferences</Button>
</form>;
```

`Button` defaults to `type="button"` to prevent accidental form submission. Its `variant` is `primary`, `secondary`, `destructive`, or `ghost`; `size` is 40 or 48. `loading` sets `aria-busy` and disables activation while preserving the label. All variants support disabled/loading states and both sizes.

`TextField` requires a visible `label`; supports text, email, password, search, tel, and URL inputs; and uses ordinary `value`/`defaultValue` and `onChange` props. `helperText` and `error` link to the input's accessible description. An error sets `aria-invalid`; application validation remains the caller's responsibility. `className` and `ref` target the input. Password visibility toggles and explicit search-clear actions are not built in.

`Checkbox` requires a visible `label`. Use `checked` and `onCheckedChange` for controlled state, or `defaultChecked` for uncontrolled state. Native `onChange` remains available and runs before `onCheckedChange`. Native form reset applies to uncontrolled inputs; controlled state must be reset by the application. `className` and `ref` target the checkbox input.

The sample form verifies submission, required fields, custom errors, keyboard focus, controlled and uncontrolled checkboxes, and loading/disabled states. Form controls use olive border and focus tokens, with a warm error border.

## Reusable catalogue

| Area                    | Components                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| Layout and typography   | `Stack`, `Inline`, `Text`, `Surface`                                                                   |
| Actions                 | `Button`, `ButtonLink`, `IconButton`                                                                   |
| Forms                   | `TextField`, `Textarea`, `Select`, `FileField`, `Checkbox`, `RadioGroup`, `Switch`, `SegmentedControl` |
| Navigation              | `AppHeader`, `SectionHeader`, `BottomNavigation`, `Tabs`, `Pagination`                                 |
| Overlays and disclosure | `Dialog`, `Popover`, `DropdownMenu`, `Tooltip`, `Disclosure`                                           |
| Data and identity       | `Table`, `Avatar`, `AvatarGroup`                                                                       |
| Feedback and progress   | `StatusChip`, `BannerToast`, `EmptyState`, `Progress`, `LoadingIndicator`, `StepProgress`              |

`Stack` and `Inline` accept spacing token names (`gap="space24"`), alignment, padding, and native div props. Inline wraps by default. `Text` accepts a typography `variant`, colour token, and an `as` tag for semantic headings or paragraphs. Layout and text reference CSS variables so local themes apply.

`Avatar` requires a name, accepts an optional image `src`, and falls back to initials after a failed image. Changing `src` retries the image. Use `decorative` when adjacent text already supplies the name. `AvatarGroup` accepts `{ id, name, src? }` items and a positive integer `max`; hidden identities are named on the overflow indicator.

`StatusChip` tones are neutral, success, warning, danger, and info. `BannerToast` accepts a title, children, an optional `onDismiss`, and success/warning/error/info tones. Error notifications use an alert; other tones use a polite status. Applications own notification timing and dismissal state. `EmptyState` accepts title, description, optional decorative icon, and action content.

`AppHeader` provides title, description, and leading/trailing slots. `SectionHeader` provides title, description, action, and heading levels 2–4. `BottomNavigation` takes `{ id, label, href, icon? }` items and `activeId`; navigation and active-route state remain with the application. It is in normal document flow rather than fixed to the viewport.

`SegmentedControl` is a labelled selection field, not a tab-panel widget. It accepts `{ value, label, disabled? }` options, native `name`, `disabled`, `required`, and `form` props, plus either `value`/`onValueChange` or `defaultValue`. Native radio keyboard navigation and uncontrolled form reset apply. Controlled selections must be reset by the caller. Use unique values per group and an explicit name for submitted data.

`StepProgress` takes a non-empty list of step labels and zero-based `currentStep`. A value equal to `steps.length` marks all steps complete. The current item exposes `aria-current="step"`.

The example verifies avatar image recovery, notification dismissal, navigation links, selection keyboard behaviour and form reset, progress semantics, and local theme overrides. Product-specific screens, workflows, and branded artwork belong in consuming apps.

## Textarea and Select

`Textarea` and `Select` provide labelled multiline and native selection controls with `helperText`, `error`, native form props, and refs to their controls. Supply `option` and `optgroup` children to `Select`. Like `TextField`, their `className` and `style` props target the control.

`Select` accepts one scalar value, not `multiple` or listbox `size`. Uncontrolled controls use native form reset. For controlled forms, the app owns reset: restore state and reapply a select’s value after the native reset completes, including when the initial state has not changed. The contract fixture demonstrates this ordering.

## IconButton and ButtonLink

`IconButton` requires a `label` for its accessible name and renders decorative icon children. It shares Button variants, sizes, loading/disabled states and native button props. `ButtonLink` shares button styling but renders a native anchor with a required `href`; it supports anchor refs and link props, without fake disabled or loading states.

## Dialog

`Dialog` is a controlled native modal. Pass `open`, `onOpenChange` and a visible `title`; an optional `description` is associated with the dialog. It uses `showModal()` after mounting, so server markup is stable and the modal opens after hydration. The browser owns modal focus containment and background inertness. Escape and the built-in close button request dismissal through `onOpenChange(false)`; the app must update `open`. Backdrop clicks do not dismiss it. Set `closeLabel` to localise the close button. Native refs, classes and styles target the dialog element.

```tsx
const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>Review changes</Button>
  <Dialog open={open} onOpenChange={setOpen} title="Review changes">
    <Text as="p">Check your changes before saving.</Text>
    <Button onClick={() => setOpen(false)}>Done</Button>
  </Dialog>
</>;
```

## RadioGroup and Switch

`RadioGroup` provides labelled native radio choices with optional option descriptions, group guidance/errors and disabled options. Use unique option values and `value`/`onValueChange` or `defaultValue`. `Switch` provides a labelled native checkbox with switch semantics and `onCheckedChange`; applications own the setting it changes. Native form props and consumer styling remain supported.

## Tabs

`Tabs` takes a labelled `items` array with unique `value` identifiers, visible `label` content and panel `content`. It supports `value`/`onValueChange` or `defaultValue`, horizontal/vertical orientation, and automatic or manual activation. Arrow keys, Home and End move between enabled tabs; manual activation uses Enter or Space. Horizontal arrows follow inherited text direction. Invalid or disabled selections fall back to the first enabled item without emitting a change callback. Panels stay mounted when hidden so child state survives selection changes. Keep tab labels noninteractive; refs and consumer styling target the root div.

## Disclosure

`Disclosure` uses native `details` and `summary`. Supply a concise, noninteractive `summary` and content children. Use `defaultOpen` for uncontrolled state, or `open` with `onOpenChange` for controlled state. Uncontrolled disclosures may share a native `name` to form an exclusive accordion group; controlled disclosures must be coordinated by the application and cannot use `name`. Native `onToggle` is forwarded, while `onOpenChange` reports state changes/requests without treating initial open state as a user change. Refs and consumer styling target the details element.

## Progress and LoadingIndicator

`Progress` shows a task's completion using a native progress element. Supply a visible `label` and numeric `value`; `max` defaults to 100. Omit `value` for indeterminate progress. Native progress semantics handle the range; this is task completion, not a measurement meter. Refs, native props, `className` and `style` target the progress element.

`LoadingIndicator` shows a visible `label` in a polite status region. Keep the component mounted while changing its label so assistive technology can observe updates. The decorative marker is static, so loading does not depend on motion. Applications own requests, cancellation and the affected region's `aria-busy` state. Automated tests verify markup and updates; they do not prove announcements in every screen reader.

## Numeric and temporal fields

`TextField` also supports native `number`, `date`, `time` and `datetime-local` controls. Pass native `min`, `max`, `step` and `required` constraints. Change events retain browser string values; read `event.currentTarget.valueAsNumber` for numeric conversion (empty input yields `NaN`). Dates use `YYYY-MM-DD`, times use `HH:mm` and local date-times use `YYYY-MM-DDTHH:mm`; `datetime-local` does not supply a time zone. Native picker presentation follows the browser and operating system.

## FileField

`FileField` provides a labelled native file input with the same helper/error treatment as other fields. Use `accept`, `multiple`, `required` and `onChange`; selected files are available through `event.currentTarget.files`, refs or native `FormData`. File selection is uncontrolled: `value`, `defaultValue` and `readOnly` are deliberately excluded. Native form reset clears the selection. `accept` is a picker hint, not validation; applications own file validation and upload transport. Consumer `className`, `style` and refs target the input.

## Popover

`Popover` provides a named, nonmodal contextual region in the browser's top layer. Give it a unique, stable `id` and `label`, and point an ordinary `Button` at that id with `popoverTarget`. A close button uses the same target and `popoverTargetAction="hide"`. Native invocation supplies the positioning anchor. The panel chooses the side with more space, limits its size to the available viewport area and scrolls long content.

```tsx
<>
  <Button popoverTarget="project-filters">Filters</Button>
  <Popover id="project-filters" label="Project filters">
    <Stack>
      <Checkbox label="Include archived projects" />
      <Button popoverTarget="project-filters" popoverTargetAction="hide">
        Done
      </Button>
    </Stack>
  </Popover>
</>
```

The browser owns visibility, outside-click dismissal, Escape, sibling/nested popovers and focus navigation. `onOpenChange` observes settled visibility changes; native toggle events may coalesce. There is no controlled `open` or `defaultOpen` prop. `onBeforeToggle` can cancel opening; native closing cannot be cancelled. Refs target the panel div and expose native popover methods; programmatic opening needs a source element to retain an anchor (`ref.current?.showPopover({ source: trigger })`). Children stay mounted while hidden. Consumer styles and native events are preserved. A popover is not a modal dialog or a menu: its contents use ordinary keyboard navigation, and background controls remain usable.

## DropdownMenu

`DropdownMenu` combines a labelled button with a native anchored action menu. Provide a visible `label` and `items` with unique `id` values. Action items use `{ type: "action", id, label, onSelect }`; link items use `{ type: "link", id, label, href }` and support native `target`, `rel` and `download`. Item labels are strings for keyboard typeahead. Disabled items remain keyboard-focusable for discovery but cannot activate; disabled links have no destination.

Enter, Space or ArrowDown opens at the first item; ArrowUp opens at the last. Arrow keys wrap, Home/End reach the edges, and typing searches labels. Escape returns focus to the trigger; Tab/Shift+Tab closes and leaves the composite. Action selection closes the menu and restores trigger focus before calling `onSelect`, so the action can move focus into a new dialog. Browser-owned visibility follows the same native dismissal model as Popover; `onOpenChange` observes settled changes.

Native panel props, `className`, `style` and refs target the menu div. Use `triggerProps` for button styling, native handlers and a button ref; behavior-owned trigger attributes remain managed by the component. Empty menus disable their trigger. This component provides a single-level action/link menu; selection fields and hierarchical navigation use different interaction patterns.

## Tooltip

`Tooltip` adds a supplementary, noninteractive description to one existing focusable element. Pass plain-text `content` and a single inline child that forwards `aria-describedby` to its focusable DOM element, such as `Button`, `IconButton`, `ButtonLink`, or a native button/link. The child's existing descriptions, ref, styling and actions remain intact.

```tsx
<Tooltip content="Download a copy; the original stays unchanged.">
  <Button onClick={downloadProject}>Export project</Button>
</Tooltip>
```

Keyboard focus or pointer hover displays the tooltip without moving focus. The pointer can move onto the description; Escape dismisses it. Leaving both focus and hover closes it. Touch activation retains the child's normal action and does not introduce a hover-only interaction. Keep essential instructions visible in the page: touch users and keyboard users of natively disabled controls cannot depend on a tooltip. Use Popover for interactive contextual content. Custom child components must forward the description to their actual focus target; fragments, block-root components such as `TextField`, and multiple focus targets are unsupported. The wrapper is a span, so its child must be valid phrasing content.

Tooltip refs and native props target the tooltip span; child refs still target the original child. `onOpenChange` observes settled native visibility changes. Consumer `className` and `style` override the description panel.

## Table

`Table` renders a native table with a required visible `caption` and a labelled, keyboard-focusable scroll region. Supply native `thead`, `tbody`, `tfoot`, `tr`, `th` and `td` children. Mark column headers with `scope="col"` and row headers with `scope="row"`; use native `colSpan`, `rowSpan`, `id` and `headers` for grouped headers. Cells have a 112px minimum content width plus padding to keep text and embedded controls readable. The wrapper contains horizontal overflow on narrow screens and retains ordinary keyboard navigation for controls inside cells. Table refs, native props, `className` and `style` target the table itself.

```tsx
<Table caption="Project overview">
  <thead>
    <tr>
      <th scope="col">Project</th>
      <th scope="col">Owner</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Component library</th>
      <td>Alex Morgan</td>
    </tr>
  </tbody>
</Table>
```

Applications own row data, empty/loading rows, selection and sorting. A sortable header can contain a `Button` and expose `aria-sort` on its `th`. Table does not add spreadsheet-style arrow navigation or virtualise rows.

## Pagination

`Pagination` takes a navigation `label`, one-based `page` and `pageCount`. For local state, supply `onPageChange`; for URL navigation, supply `getPageHref`. Link mode renders real anchors and preserves browser navigation, including opening another tab. Button mode is controlled: requests only become the current page when the application updates `page`. It does not fetch data or move focus into results.

```tsx
<Pagination label="Project pages" page={page} pageCount={12} onPageChange={setPage} />
<Pagination label="Archive pages" page={page} pageCount={12} getPageHref={(value) => `/archive?page=${value}`} />
```

The current page has `aria-current="page"`; unavailable Previous/Next controls cannot activate. Page numbers stay bounded around the current page, with first/last pages and noninteractive ellipses for gaps. Zero pages has no numbered controls. Counts are truncated and clamped to nonnegative safe integers; invalid counts become zero and the displayed page clamps to the available range without emitting callbacks. Use `labels.previous`, `labels.next` and `labels.page` to localise control text/names. Native refs, props and consumer styling target the navigation element.
