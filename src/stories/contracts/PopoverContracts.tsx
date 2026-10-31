import { StrictMode, useRef, useState } from "react";
import { Button, Checkbox, Popover, Stack, Text, TextField } from "../../index";

export function PopoverContracts() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [changes, setChanges] = useState("");
  const [toggles, setToggles] = useState(0);
  const [before, setBefore] = useState(0);
  const [cancel, setCancel] = useState(false);
  const [submissions, setSubmissions] = useState(0);
  const [outside, setOutside] = useState(0);
  return (
    <Stack>
      <Checkbox
        label="Cancel popover opening"
        checked={cancel}
        onCheckedChange={setCancel}
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((count) => count + 1);
        }}
      >
        <Button popoverTarget="contract-popover">Open contract popover</Button>
        <StrictMode>
          <Popover
            id="contract-popover"
            label="Contract details"
            aria-describedby="popover-guidance"
            className="consumer-popover"
            style={{ borderRadius: 0 }}
            ref={(node) => {
              panelRef.current = node;
              if (node) node.dataset.refReady = "true";
            }}
            onBeforeToggle={(event) => {
              setBefore((count) => count + 1);
              if (cancel && event.newState === "open") event.preventDefault();
            }}
            onToggle={() => setToggles((count) => count + 1)}
            onOpenChange={(value) =>
              setChanges((events) => `${events}${String(value)},`)
            }
          >
            <Stack>
              <TextField label="Popover draft" defaultValue="Original draft" />
              <Button popoverTarget="nested-popover">
                Open nested popover
              </Button>
              <Popover id="nested-popover" label="Nested details">
                <Button
                  popoverTarget="nested-popover"
                  popoverTargetAction="hide"
                >
                  Close nested popover
                </Button>
              </Popover>
              <Button
                popoverTarget="contract-popover"
                popoverTargetAction="hide"
              >
                Close contract popover
              </Button>
            </Stack>
          </Popover>
        </StrictMode>
        <Button onClick={() => setOutside((count) => count + 1)}>
          Popover outside action
        </Button>
        <Button disabled popoverTarget="contract-popover">
          Disabled popover trigger
        </Button>
      </form>
      <span id="popover-guidance">Supplementary project details</span>
      <Button popoverTarget="sibling-popover">Open sibling popover</Button>
      <Popover id="sibling-popover" label="Sibling details">
        Independent sibling content
      </Popover>
      <Button
        onClick={(event) => {
          panelRef.current?.showPopover({ source: event.currentTarget });
          panelRef.current?.hidePopover();
          panelRef.current?.showPopover({ source: event.currentTarget });
        }}
      >
        Cycle popover through ref
      </Button>
      <Button
        onClick={(event) => {
          panelRef.current?.showPopover({ source: event.currentTarget });
          panelRef.current?.hidePopover();
        }}
      >
        Open and close popover through ref
      </Button>
      <Button
        popoverTarget="edge-popover"
        style={{ position: "fixed", right: 16, bottom: 16 }}
      >
        Open edge popover
      </Button>
      <Popover id="edge-popover" label="Long edge details">
        <Stack>
          {Array.from({ length: 20 }, (_, index) => (
            <Text as="p" key={index}>
              Long content stays readable. {"unbrokencontent".repeat(15)}
            </Text>
          ))}
          <Button popoverTarget="edge-popover" popoverTargetAction="hide">
            Close edge popover
          </Button>
        </Stack>
      </Popover>
      <output aria-label="Popover changes">{changes}</output>
      <output aria-label="Popover native toggles">{toggles}</output>
      <output aria-label="Popover before toggles">{before}</output>
      <output aria-label="Popover submissions">{submissions}</output>
      <output aria-label="Popover outside activations">{outside}</output>
    </Stack>
  );
}
