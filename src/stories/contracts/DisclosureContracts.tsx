import { useRef, useState } from "react";
import { Button, Checkbox, Disclosure, Stack, TextField } from "../../index";

export function DisclosureContracts() {
  const [open, setOpen] = useState(false);
  const [accept, setAccept] = useState(true);
  const [requests, setRequests] = useState("");
  const [changes, setChanges] = useState("");
  const [toggles, setToggles] = useState(0);
  const [submissions, setSubmissions] = useState(0);
  const [initialChanges, setInitialChanges] = useState(0);
  const [initialToggles, setInitialToggles] = useState(0);
  const [groupChanges, setGroupChanges] = useState("");
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <Stack gap="space16">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((count) => count + 1);
        }}
      >
        <Button
          type="button"
          onClick={() => ref.current?.querySelector("summary")?.focus()}
        >
          Focus disclosure ref
        </Button>
        <Disclosure
          summary="Saved preferences"
          ref={ref}
          className="consumer-disclosure"
          style={{ borderRadius: 0 }}
          onOpenChange={(value) =>
            setChanges((events) => `${events}${String(value)},`)
          }
          onToggle={() => setToggles((count) => count + 1)}
        >
          <TextField label="Persistent draft" defaultValue="Original" />
        </Disclosure>
        <output aria-label="Disclosure submissions">{submissions}</output>
      </form>
      <Disclosure
        summary="Initially expanded help"
        defaultOpen
        onOpenChange={() => setInitialChanges((count) => count + 1)}
        onToggle={() => setInitialToggles((count) => count + 1)}
      >
        Initial help content
      </Disclosure>
      <Disclosure summary="Independent help">
        Independent help content
      </Disclosure>
      <Disclosure
        summary="Controlled help"
        open={open}
        onOpenChange={(value) => {
          setRequests((events) => `${events}${String(value)},`);
          if (accept) setOpen(value);
        }}
      >
        Controlled help content
      </Disclosure>
      <Disclosure
        summary="Grouped first"
        name="contract-disclosures"
        onOpenChange={(value) =>
          setGroupChanges((events) => `${events}first:${String(value)},`)
        }
      >
        First grouped content
      </Disclosure>
      <Disclosure
        summary="Grouped second"
        name="contract-disclosures"
        onOpenChange={(value) =>
          setGroupChanges((events) => `${events}second:${String(value)},`)
        }
      >
        Second grouped content
      </Disclosure>
      <Checkbox
        label="Accept disclosure changes"
        checked={accept}
        onChange={(event) => setAccept(event.currentTarget.checked)}
      />
      <Button onClick={() => setOpen((value) => !value)}>
        Change disclosure prop
      </Button>
      <output aria-label="Disclosure requests">{requests}</output>
      <output aria-label="Disclosure changes">{changes}</output>
      <output aria-label="Disclosure native toggles">{toggles}</output>
      <output aria-label="Disclosure group changes">{groupChanges}</output>
      <output aria-label="Disclosure initial toggles">{initialToggles}</output>
      <output aria-label="Disclosure initial changes">{initialChanges}</output>
    </Stack>
  );
}
