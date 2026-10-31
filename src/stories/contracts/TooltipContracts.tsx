import { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  IconButton,
  Stack,
  Tooltip,
} from "../../index";

export function TooltipContracts() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actions, setActions] = useState(0);
  const [submissions, setSubmissions] = useState(0);
  const [changes, setChanges] = useState("");
  const [cancel, setCancel] = useState(false);
  const [mounted, setMounted] = useState(true);
  return (
    <Stack>
      <Checkbox
        label="Cancel tooltip opening"
        checked={cancel}
        onCheckedChange={setCancel}
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((value) => value + 1);
        }}
      >
        <Button>Before tooltip</Button>
        {mounted && (
          <Tooltip
            content="Supplementary contract description"
            className="consumer-tooltip"
            style={{ borderRadius: 0 }}
            ref={(node) => {
              if (node)
                node.dataset.refReady = String(node instanceof HTMLSpanElement);
            }}
            onBeforeToggle={(event) => {
              if (cancel && event.newState === "open") event.preventDefault();
            }}
            onOpenChange={(open) =>
              setChanges((previous) => `${previous}${String(open)},`)
            }
          >
            <Button
              aria-describedby="tooltip-existing"
              className="consumer-tooltip-trigger"
              style={{ borderRadius: 0 }}
              ref={(node) => {
                if (node)
                  node.dataset.refReady = String(
                    node instanceof HTMLButtonElement,
                  );
              }}
              onClick={() => setActions((value) => value + 1)}
            >
              Contract tooltip
            </Button>
          </Tooltip>
        )}
        <Button>After tooltip</Button>
        <Tooltip content="Submit this form">
          <Button type="submit">Tooltip submit</Button>
        </Tooltip>
      </form>
      <span id="tooltip-existing">Existing guidance</span>
      <Tooltip content="View tooltip documentation">
        <a href="#tooltip-existing">Tooltip link</a>
      </Tooltip>
      <Tooltip content="This action is unavailable">
        <Button disabled onClick={() => setActions((value) => value + 100)}>
          Disabled tooltip action
        </Button>
      </Tooltip>
      <Tooltip content="Delete the selected draft">
        <IconButton
          label="Tooltip icon action"
          onClick={() => setActions((value) => value + 1)}
        >
          ×
        </IconButton>
      </Tooltip>
      <Tooltip content={`Long tooltip ${"unbrokencontent".repeat(35)}`}>
        <Button>Long tooltip trigger</Button>
      </Tooltip>
      <Button onClick={() => setMounted((value) => !value)}>
        Toggle tooltip mount
      </Button>
      <Button onClick={() => setDialogOpen(true)}>Open tooltip dialog</Button>
      <Dialog
        title="Tooltip dialog"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <Tooltip content="Description inside a modal">
          <Button>Modal tooltip trigger</Button>
        </Tooltip>
      </Dialog>
      <output aria-label="Tooltip actions">{actions}</output>
      <output aria-label="Tooltip submissions">{submissions}</output>
      <output aria-label="Tooltip changes">{changes}</output>
    </Stack>
  );
}
