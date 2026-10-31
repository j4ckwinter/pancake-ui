import { useRef, useState } from "react";
import { Button, ButtonLink, IconButton, Stack, Surface } from "../../index";

export function ActionContracts() {
  const [activations, setActivations] = useState(0);
  const [submissions, setSubmissions] = useState(0);
  const [submittedIntent, setSubmittedIntent] = useState("");
  const [prevented, setPrevented] = useState(0);
  const iconRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const icon = (
    <span role="img" aria-label="Decorative icon name">
      +
    </span>
  );
  const activate = () => setActivations((count) => count + 1);
  return (
    <Surface>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((count) => count + 1);
          const submitter =
            event.nativeEvent instanceof SubmitEvent
              ? event.nativeEvent.submitter
              : undefined;
          const intent = new FormData(event.currentTarget, submitter).get(
            "intent",
          );
          setSubmittedIntent(typeof intent === "string" ? intent : "");
        }}
      >
        <Stack>
          <Button onClick={() => iconRef.current?.focus()}>
            Focus icon ref
          </Button>
          <IconButton
            label="Add item"
            ref={iconRef}
            onClick={activate}
            className="consumer-icon"
            style={{ borderRadius: 0 }}
          >
            {icon}
          </IconButton>
          <IconButton label="Unavailable icon" disabled onClick={activate}>
            {icon}
          </IconButton>
          <IconButton label="Loading icon" loading onClick={activate}>
            {icon}
          </IconButton>
          <IconButton
            label="Submit icon"
            type="submit"
            name="intent"
            value="save"
          >
            ✓
          </IconButton>
          <output aria-label="Icon activation count">{activations}</output>
          <output aria-label="Icon form submissions">{submissions}</output>
          <output aria-label="Submitted icon intent">{submittedIntent}</output>
          <Button onClick={() => linkRef.current?.focus()}>
            Focus link ref
          </Button>
          <ButtonLink
            href="#action-details"
            ref={linkRef}
            className="consumer-link"
            style={{ borderRadius: 0 }}
          >
            Open action details
          </ButtonLink>
          <ButtonLink
            href="#prevented-action"
            onClick={(event) => {
              event.preventDefault();
              setPrevented((count) => count + 1);
            }}
          >
            Prevent navigation
          </ButtonLink>
          <ButtonLink
            href="/document.pdf"
            download="document.pdf"
            target="_blank"
            rel="noopener"
          >
            Download document
          </ButtonLink>
          <output aria-label="Prevented navigation count">{prevented}</output>
        </Stack>
      </form>
    </Surface>
  );
}
