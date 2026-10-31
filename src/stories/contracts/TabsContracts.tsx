import { useRef, useState } from "react";
import { Button, Stack, Surface, Tabs } from "../../index";

const items = [
  {
    value: "first",
    label: "First",
    content: <input aria-label="Retained tab note" defaultValue="Draft" />,
  },
  {
    value: "locked",
    label: "Locked",
    content: "Unavailable content",
    disabled: true,
  },
  { value: "last", label: "Last", content: "Last tab content" },
];

export function TabsContracts() {
  const [value, setValue] = useState("first");
  const [changes, setChanges] = useState(0);
  const [submissions, setSubmissions] = useState(0);
  const [removed, setRemoved] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [normalizations, setNormalizations] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  return (
    <Surface>
      <Stack>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmissions((count) => count + 1);
          }}
        >
          <Button>Before tabs</Button>
          <Tabs
            label="Controlled tabs"
            items={items}
            value={value}
            onValueChange={(next) => {
              setValue(next);
              setChanges((count) => count + 1);
            }}
            ref={root}
            className="consumer-tabs"
            style={{ padding: 4 }}
            data-testid="controlled-tabs"
          />
          <Button type="submit">Submit tab form</Button>
        </form>
        <output aria-label="Tab selection events">{changes}</output>
        <output aria-label="Tab form submissions">{submissions}</output>
        <Button
          onClick={() => root.current?.setAttribute("data-ref-ready", "true")}
        >
          Inspect tabs ref
        </Button>
        <Tabs
          label="Manual tabs"
          items={items}
          activation="manual"
          defaultValue="last"
        />
        <Tabs label="Vertical tabs" items={items} orientation="vertical" />
        <div dir="rtl">
          <Tabs
            label="RTL tabs"
            items={[
              ...items,
              { value: "extra", label: "Extra", content: "Extra RTL content" },
            ]}
          />
        </div>
        <Tabs
          label="Dynamic tabs"
          items={
            empty
              ? []
              : items
                  .filter((item) => !removed || item.value !== "last")
                  .map((item) => ({
                    ...item,
                    disabled: disabled || item.disabled,
                  }))
          }
          defaultValue="missing"
          onValueChange={() => setNormalizations((count) => count + 1)}
        />
        <output aria-label="Dynamic tab events">{normalizations}</output>
        <Button onClick={() => setRemoved((current) => !current)}>
          Toggle last tab
        </Button>
        <Button onClick={() => setDisabled((current) => !current)}>
          Toggle all tabs disabled
        </Button>
        <Button onClick={() => setEmpty((current) => !current)}>
          Toggle empty tabs
        </Button>
      </Stack>
    </Surface>
  );
}
