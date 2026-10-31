import { useRef, useState } from "react";
import { Button, FileField, Stack, Surface } from "../../index";
import { markRef } from "./markRef";

export function FileFieldContracts() {
  const input = useRef<HTMLInputElement>(null);
  const [submissions, setSubmissions] = useState(0);
  const [changes, setChanges] = useState(0);
  const [names, setNames] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [error, setError] = useState(false);
  return (
    <Surface>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((count) => count + 1);
          setSubmitted(
            new FormData(event.currentTarget)
              .getAll("documents")
              .map((file) => (typeof file === "string" ? file : file.name))
              .join(", "),
          );
        }}
        onReset={() => {
          setNames("");
          setSubmitted("");
        }}
      >
        <Stack>
          <FileField
            ref={(node) => {
              input.current = node;
              markRef(node);
            }}
            label="Supporting documents"
            name="documents"
            accept=".txt,text/plain"
            multiple
            required
            className="consumer-file"
            style={{ borderRadius: 0 }}
            helperText="Choose text documents"
            error={error ? "Choose a different document" : undefined}
            aria-describedby="file-guidance"
            onChange={(event) => {
              setNames(
                Array.from(event.currentTarget.files ?? [])
                  .map((file) => file.name)
                  .join(", "),
              );
              setChanges((count) => count + 1);
            }}
          />
          <span id="file-guidance">
            Documents stay on this device until submitted
          </span>
          <FileField
            label="Unavailable attachment"
            name="lockedAttachment"
            disabled
          />
          <Button onClick={() => input.current?.focus()}>
            Focus document field
          </Button>
          <Button onClick={() => setError((value) => !value)}>
            Toggle document error
          </Button>
          <Button type="submit">Submit documents</Button>
          <Button type="reset">Reset documents</Button>
          <output aria-label="Document submissions">{submissions}</output>
          <output aria-label="Document changes">{changes}</output>
          <output aria-label="Selected document names">{names}</output>
          <output aria-label="Submitted documents">{submitted}</output>
        </Stack>
      </form>
    </Surface>
  );
}
