import { createElement as h, useEffect, useRef, useState } from "react";
import {
  AppHeader,
  Avatar,
  AvatarGroup,
  BannerToast,
  BottomNavigation,
  Button,
  DropdownMenu,
  Tooltip,
  Table,
  Pagination,
  Popover,
  FileField,
  Progress,
  LoadingIndicator,
  Tabs,
  Disclosure,
  RadioGroup,
  Switch,
  Dialog,
  ButtonLink,
  IconButton,
  Checkbox,
  EmptyState,
  Inline,
  SectionHeader,
  SegmentedControl,
  Stack,
  StatusChip,
  StepProgress,
  Surface,
  Text,
  TextField,
  Textarea,
  Select,
} from "pancake-ui";

export function App() {
  const [initialDialogOpen, setInitialDialogOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [delivery, setDelivery] = useState("daily");
  const [name, setName] = useState("Server rendered");
  const [checked, setChecked] = useState(false);
  const [period, setPeriod] = useState("week");
  const [clicks, setClicks] = useState(0);
  const [resultPage, setResultPage] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const input = useRef(null);
  useEffect(() => setHydrated(true), []);
  return h(
    "main",
    { "data-hydrated": hydrated ? "yes" : "no" },
    h(AppHeader, { title: "Installed package hydration" }),
    h(
      Surface,
      null,
      h(
        Stack,
        null,
        h(SectionHeader, { title: "State and identifiers" }),
        h(
          Table,
          { caption: "Hydrated records" },
          h("thead", null, h("tr", null, h("th", { scope: "col" }, "Record"))),
          h(
            "tbody",
            null,
            h("tr", null, h("td", null, `Result page ${resultPage}`)),
          ),
        ),
        h(Pagination, {
          label: "Hydrated result pages",
          page: resultPage,
          pageCount: 4,
          onPageChange: setResultPage,
        }),
        h(
          Tooltip,
          { content: "Hydrated supporting description" },
          h(
            Button,
            { onClick: () => setClicks((value) => value + 1) },
            "Hydrated tooltip action",
          ),
        ),
        h(
          Text,
          { as: "p" },
          "Rendered by Node, hydrated by the installed React version.",
        ),
        h(TextField, {
          ref: input,
          label: "Project name",
          name: "project",
          value: name,
          helperText: "Keep this description associated after hydration.",
          onChange: (event) => setName(event.target.value),
        }),
        h(Checkbox, {
          label: "Receive updates",
          checked,
          onCheckedChange: setChecked,
        }),
        h(SegmentedControl, {
          label: "Period",
          value: period,
          onValueChange: setPeriod,
          options: [
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ],
        }),
        h(
          Inline,
          null,
          h(
            Button,
            { onClick: () => setClicks((count) => count + 1) },
            "Count activation",
          ),
          h(Button, { onClick: () => input.current?.focus() }, "Focus field"),
        ),
        h(
          "output",
          { "aria-label": "Hydrated state" },
          `${name} / ${checked} / ${period} / ${clicks}`,
        ),
        h(Textarea, {
          label: "Hydrated details",
          name: "details",
          defaultValue: "Server details",
          helperText: "Additional details",
        }),
        h(
          Select,
          {
            label: "Hydrated visibility",
            name: "visibility",
            defaultValue: "team",
            helperText: "Who can see this",
          },
          h("option", { value: "team" }, "Team"),
          h("option", { value: "private" }, "Private"),
        ),
        h(
          IconButton,
          {
            label: "Hydrated icon action",
            onClick: () => setClicks((count) => count + 1),
          },
          "+",
        ),
        h(ButtonLink, { href: "#hydration-details" }, "Hydrated destination"),
        h(
          Button,
          { onClick: () => setDialogOpen(true) },
          "Open hydrated dialog",
        ),
        h(
          Dialog,
          {
            open: dialogOpen,
            onOpenChange: setDialogOpen,
            title: "Hydrated dialog",
            description: "Server and client dialog identifiers agree.",
          },
          h(Text, { as: "p" }, "Dialog content"),
        ),
        h(
          Dialog,
          {
            open: initialDialogOpen,
            onOpenChange: setInitialDialogOpen,
            title: "Initially hydrated dialog",
            description: "Opened after server markup hydration.",
          },
          h(Text, { as: "p" }, "Initial modal content"),
        ),
        h(RadioGroup, {
          label: "Hydrated delivery",
          value: delivery,
          onValueChange: setDelivery,
          helperText: "Select a delivery schedule",
          options: [
            { value: "daily", label: "Daily" },
            { value: "immediate", label: "Immediate" },
          ],
        }),
        h(Switch, {
          label: "Hydrated notifications",
          checked: notifications,
          onCheckedChange: setNotifications,
        }),
        h(
          "output",
          { "aria-label": "Hydrated selection preferences" },
          `${delivery} / ${notifications}`,
        ),
        h(Tabs, {
          label: "Hydrated project panels",
          defaultValue: "overview",
          items: [
            {
              value: "overview",
              label: "Project overview",
              content: h(Text, { as: "p" }, "Hydrated overview content"),
            },
            {
              value: "history",
              label: "Project history",
              content: h(Text, { as: "p" }, "Hydrated history content"),
            },
          ],
        }),
        h(
          Disclosure,
          { summary: "Hydrated supporting details", defaultOpen: true },
          h(Text, { as: "p" }, "Hydrated disclosure content"),
        ),
        h(Progress, { label: "Hydrated upload", value: clicks, max: 10 }),
        h(LoadingIndicator, {
          label: hydrated ? "Project status ready" : "Loading project status",
        }),
        h(TextField, {
          label: "Hydrated quantity",
          type: "number",
          defaultValue: 2,
        }),
        h(TextField, {
          label: "Hydrated date",
          type: "date",
          defaultValue: "2026-11-15",
        }),
        h(FileField, { label: "Hydrated attachment", accept: ".txt" }),
        h(
          Button,
          { popoverTarget: "hydrated-popover" },
          "Open hydrated popover",
        ),
        h(
          Popover,
          { id: "hydrated-popover", label: "Hydrated filter panel" },
          h(TextField, { label: "Hydrated filter query", defaultValue: "All" }),
          h(
            Button,
            { popoverTarget: "hydrated-popover", popoverTargetAction: "hide" },
            "Close hydrated popover",
          ),
        ),
        h(DropdownMenu, {
          label: "Hydrated actions",
          items: [
            {
              id: "count",
              type: "action",
              label: "Run hydrated action",
              onSelect: () => setClicks((count) => count + 1),
            },
            {
              id: "link",
              type: "link",
              label: "Hydrated menu link",
              href: "#menu-destination",
            },
          ],
        }),
        h(Avatar, { name: "Alex Morgan" }),
        h(AvatarGroup, { items: [{ id: "alex", name: "Alex Morgan" }] }),
        h(StatusChip, { tone: "success" }, "Ready"),
        h(
          BannerToast,
          { title: "Server and client agree" },
          "No hydration recovery should be needed.",
        ),
        h(EmptyState, {
          title: "Nothing pending",
          description: "All server output is ready.",
        }),
        h(StepProgress, { steps: ["Server", "Client"], currentStep: 1 }),
        h(BottomNavigation, {
          items: [{ id: "home", label: "Home", href: "#home" }],
          activeId: "home",
        }),
      ),
    ),
  );
}
