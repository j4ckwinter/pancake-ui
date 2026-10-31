import { createElement as h, useEffect, useRef, useState } from "react";
import {
  AppHeader,
  Avatar,
  AvatarGroup,
  BannerToast,
  BottomNavigation,
  Button,
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
  const [name, setName] = useState("Server rendered");
  const [checked, setChecked] = useState(false);
  const [period, setPeriod] = useState("week");
  const [clicks, setClicks] = useState(0);
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
