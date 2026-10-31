import { useRef, useState, type FormEvent } from "react";
import { Button, Select, Stack, Surface, Textarea } from "../../index";

export function FieldsContracts() {
  const [notes, setNotes] = useState("Initial notes");
  const [colour, setColour] = useState("red");
  const [noteChanges, setNoteChanges] = useState(0);
  const [colourChanges, setColourChanges] = useState(0);
  const [invalid, setInvalid] = useState(false);
  const [submitted, setSubmitted] = useState("");
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const colourRef = useRef<HTMLSelectElement>(null);
  const options = (
    <>
      <option value="">Choose a colour</option>
      <optgroup label="Available colours">
        <option value="red">Red</option>
        <option value="green" disabled>
          Unavailable green
        </option>
        <option value="blue">Blue</option>
      </optgroup>
    </>
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(
      JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
    );
  }
  return (
    <Surface>
      <form
        onSubmit={submit}
        onReset={() => {
          setTimeout(() => {
            setNotes("Initial notes");
            setColour("red");
            setSubmitted("");
            if (notesRef.current) notesRef.current.value = "Initial notes";
            if (colourRef.current) colourRef.current.value = "red";
          }, 0);
        }}
      >
        <Stack>
          <Textarea
            label="Controlled notes"
            name="notes"
            ref={notesRef}
            value={notes}
            onChange={(event) => {
              setNotes(event.currentTarget.value);
              setNoteChanges((count) => count + 1);
            }}
            required
            helperText="Describe the work"
            error={invalid ? "Notes need attention" : undefined}
            aria-describedby="fields-guidance"
            className="consumer-notes"
            style={{ borderRadius: 0 }}
          />
          <output aria-label="Notes change count">{noteChanges}</output>
          <Textarea
            label="Uncontrolled notes"
            name="draft"
            defaultValue="Original draft"
            rows={2}
          />
          <Textarea
            label="Disabled notes"
            name="disabledNotes"
            defaultValue="Locked notes"
            disabled
          />
          <Textarea
            label="Read only notes"
            name="readonlyNotes"
            defaultValue="Fixed notes"
            readOnly
          />
          <Button onClick={() => notesRef.current?.focus()}>
            Focus notes ref
          </Button>
          <Select
            label="Controlled colour"
            name="colour"
            ref={colourRef}
            value={colour}
            onChange={(event) => {
              setColour(event.currentTarget.value);
              setColourChanges((count) => count + 1);
            }}
            required
            helperText="Choose the colour"
            error={invalid ? "Colour needs attention" : undefined}
            aria-describedby="fields-guidance"
            className="consumer-select"
            style={{ borderRadius: 0 }}
          >
            {options}
          </Select>
          <output aria-label="Colour change count">{colourChanges}</output>
          <Select
            label="Uncontrolled colour"
            name="draftColour"
            defaultValue="red"
          >
            {options}
          </Select>
          <Select
            label="Disabled colour"
            name="disabledColour"
            defaultValue="red"
            disabled
          >
            {options}
          </Select>
          <Button onClick={() => colourRef.current?.focus()}>
            Focus colour ref
          </Button>
          <span id="fields-guidance">Shared field guidance</span>
          <Button onClick={() => setInvalid((value) => !value)}>
            Toggle field errors
          </Button>
          <Button type="submit">Submit fields</Button>
          <Button type="reset">Reset fields</Button>
          <output aria-label="Submitted fields">{submitted}</output>
        </Stack>
      </form>
    </Surface>
  );
}
