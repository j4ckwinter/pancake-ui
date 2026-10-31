import { useRef, useState, type FormEvent } from "react";
import {
  Button,
  Checkbox,
  Inline,
  SectionHeader,
  SegmentedControl,
  Stack,
  Surface,
  TextField,
} from "../../index";
import { markRef } from "./markRef";

export function FormContracts() {
  const [clicks, setClicks] = useState(0);
  const [submitted, setSubmitted] = useState(0);
  const [text, setText] = useState("Initial");
  const [textChanges, setTextChanges] = useState(0);
  const [checked, setChecked] = useState(false);
  const [checkEvents, setCheckEvents] = useState("");
  const [selection, setSelection] = useState("one");
  const [selectionChanges, setSelectionChanges] = useState(0);
  const [data, setData] = useState("");
  const [invalid, setInvalid] = useState(false);
  const textRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted((value) => value + 1);
    setData(
      JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
    );
  }
  const options = [
    { value: "one", label: "One" },
    { value: "three", label: "Unavailable", disabled: true },
    { value: "two", label: "Two" },
  ];
  return (
    <Surface ref={markRef} data-contract="Surface">
      <Stack>
        <SectionHeader
          ref={markRef}
          data-contract="SectionHeader"
          title="Form contracts"
          headingLevel={2}
        />
        <form
          onSubmit={submit}
          onReset={() => {
            setText("Initial");
            setChecked(false);
            setSelection("one");
          }}
        >
          <Stack>
            <Inline ref={markRef} data-contract="Inline">
              <Button
                ref={actionRef}
                data-contract="Button"
                onClick={() => setClicks((value) => value + 1)}
              >
                Count action
              </Button>
              <Button disabled onClick={() => setClicks((value) => value + 1)}>
                Disabled action
              </Button>
              <Button loading onClick={() => setClicks((value) => value + 1)}>
                Loading action
              </Button>
              <Button onClick={() => actionRef.current?.focus()}>
                Focus action ref
              </Button>
            </Inline>
            <output aria-label="Action count">{clicks}</output>
            <TextField
              ref={textRef}
              data-contract="TextField"
              label="Controlled title"
              name="title"
              value={text}
              onChange={(event) => {
                setText(event.currentTarget.value);
                setTextChanges((value) => value + 1);
              }}
              helperText="Your project title"
              error={invalid ? "Please correct this title" : undefined}
              aria-describedby="external-description"
            />
            <span id="external-description">Shared external guidance</span>
            <output aria-label="Text change count">{textChanges}</output>
            <TextField
              label="Uncontrolled title"
              name="uncontrolled"
              defaultValue="Original"
            />
            <TextField label="Disabled title" defaultValue="Locked" disabled />
            <TextField
              label="Read only title"
              defaultValue="Read only"
              readOnly
            />
            <Button onClick={() => textRef.current?.focus()}>
              Focus text ref
            </Button>
            <Button onClick={() => setInvalid((value) => !value)}>
              Toggle validation
            </Button>
            <Checkbox
              ref={checkboxRef}
              data-contract="Checkbox"
              label="Controlled agreement"
              name="agreement"
              value="yes"
              checked={checked}
              onChange={() => setCheckEvents((value) => value + "native,")}
              onCheckedChange={(value) => {
                setChecked(value);
                setCheckEvents((events) => events + "checked,");
              }}
            />
            <output aria-label="Checkbox events">{checkEvents}</output>
            <Checkbox
              label="Uncontrolled agreement"
              name="uncontrolledAgreement"
              defaultChecked
            />
            <Checkbox label="Disabled agreement" disabled />
            <Button onClick={() => checkboxRef.current?.focus()}>
              Focus checkbox ref
            </Button>
            <SegmentedControl
              ref={markRef}
              data-contract="SegmentedControl"
              label="Controlled period"
              name="period"
              options={options}
              value={selection}
              onValueChange={(value) => {
                setSelection(value);
                setSelectionChanges((count) => count + 1);
              }}
            />
            <output aria-label="Selection change count">
              {selectionChanges}
            </output>
            <SegmentedControl
              label="Uncontrolled period"
              name="uncontrolledPeriod"
              options={options}
              defaultValue="one"
            />
            <SegmentedControl
              label="Disabled period"
              options={options}
              defaultValue="one"
              disabled
            />
            <Button type="submit">Submit contracts</Button>
            <Button type="reset">Reset contracts</Button>
            <output aria-label="Submit count">{submitted}</output>
            <output aria-label="Submitted values">{data}</output>
          </Stack>
        </form>
      </Stack>
    </Surface>
  );
}
