import { StrictMode, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  Stack,
  Surface,
  Text,
  TextField,
} from "../../index";

export function DialogContracts() {
  const [open, setOpen] = useState(false);
  const [longContent, setLongContent] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [requests, setRequests] = useState(0);
  const [background, setBackground] = useState(0);
  const [preventEscape, setPreventEscape] = useState(false);
  const [returnValue, setReturnValue] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <Surface>
      <Stack>
        <Button
          onClick={() => {
            setMounted(true);
            setLongContent(false);
            setOpen(true);
          }}
        >
          Open contract dialog
        </Button>
        <Button onClick={() => setBackground((count) => count + 1)}>
          Dialog background action
        </Button>
        <Button
          onClick={() => {
            setLongContent(true);
            setMounted(true);
            setOpen(true);
          }}
        >
          Open long contract dialog
        </Button>
        <output aria-label="Dialog close requests">{requests}</output>
        <output aria-label="Dialog background activations">{background}</output>
        <output aria-label="Dialog native return value">{returnValue}</output>
        <output aria-label="Dialog mounted state">{String(mounted)}</output>
        <span id="dialog-guidance">Shared dialog guidance</span>
        <StrictMode>
          {mounted && (
            <Dialog
              open={open}
              onOpenChange={(next) => {
                setRequests((count) => count + 1);
                setOpen(next);
              }}
              title="Edit contract project"
              description="Changes remain local until you apply them."
              closeLabel="Close contract dialog"
              aria-describedby="dialog-guidance"
              className="consumer-dialog"
              style={{ borderRadius: 0 }}
              ref={(node) => {
                dialogRef.current = node;
                if (node) node.dataset.refReady = "true";
              }}
              onCancel={(event) => {
                if (preventEscape) event.preventDefault();
              }}
              onClose={(event) =>
                setReturnValue(event.currentTarget.returnValue)
              }
            >
              <TextField
                label="Dialog project title"
                defaultValue="Initial dialog title"
              />
              <Checkbox
                label="Prevent dialog Escape"
                checked={preventEscape}
                onCheckedChange={setPreventEscape}
              />
              <Button onClick={() => setOpen(false)}>
                Apply dialog changes
              </Button>
              <Button
                onClick={() => {
                  dialogRef.current?.close();
                  dialogRef.current?.showModal();
                }}
              >
                Reopen dialog before close event
              </Button>
              <Button onClick={() => setMounted(false)}>
                Unmount contract dialog
              </Button>
              {longContent && (
                <Stack>
                  {Array.from({ length: 12 }, (_, index) => (
                    <Text as="p" key={index}>
                      This longer explanation must remain readable on a narrow
                      screen while the final action stays reachable.{" "}
                      {"longcontent".repeat(20)}
                    </Text>
                  ))}
                </Stack>
              )}
              <form method="dialog">
                <Button type="submit" value="confirmed">
                  Confirm native dialog form
                </Button>
              </form>
            </Dialog>
          )}
        </StrictMode>
      </Stack>
    </Surface>
  );
}
