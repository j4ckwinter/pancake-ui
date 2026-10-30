import { useRef, useState, type FormEvent } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  Checkbox,
  TextField,
  Surface,
  colors,
  typography,
} from "pancake-ui";
import "pancake-ui/styles.css";
import "pancake-ui/fonts.css";
import "./styles.css";

function App() {
  const [submitted, setSubmitted] = useState("");
  const [name, setName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Enter at least two characters.");
      nameRef.current?.focus();
      return;
    }
    setError("");
    const data = new FormData(event.currentTarget);
    setSubmitted(
      `Saved ${data.get("name")} · updates ${data.get("updates") ?? "off"}`,
    );
  }
  return (
    <main>
      <p className="eyebrow">PANCAKE UI / COMPONENTS</p>
      <h1>A familiar starting point.</h1>
      <p>A React and Tailwind library, growing from Padel Potato.</p>
      <Surface aria-label="Foundation preview">
        <h2>Ready for your next project</h2>
        <p>
          The installed package supplies these controls, their tokens, and the
          Inter font.
        </p>
        <form onSubmit={submit}>
          <TextField
            ref={nameRef}
            label="Your name"
            name="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            required
            helperText="At least two characters."
            error={error}
            autoComplete="name"
          />
          <Checkbox
            label="Send me updates"
            name="updates"
            value="yes"
            checked={accepted}
            onCheckedChange={setAccepted}
          />
          <div className="actions">
            <Button type="submit">Save preferences</Button>
            <Button
              variant="secondary"
              onClick={() => nameRef.current?.focus()}
            >
              Focus name
            </Button>
          </div>
          <p role="status">{submitted}</p>
        </form>
      </Surface>
      <Surface aria-label="Component states">
        <h2>Designed for everyday states</h2>
        <div className="actions">
          <Button variant="destructive">Remove</Button>
          <Button variant="ghost">Cancel</Button>
          <Button size={40}>Compact</Button>
          <Button disabled>Unavailable</Button>
          <Button loading>Saving</Button>
        </div>
        <TextField
          label="Account email"
          type="email"
          defaultValue="alex@example.com"
          readOnly
        />
        <Checkbox label="Required agreement" name="agreement" required />
        <Checkbox label="Disabled option" disabled defaultChecked />
        <div className="swatches">
          {(["accent", "canvas", "deep"] as const).map((name) => (
            <div key={name}>
              <span style={{ backgroundColor: colors[name] }} />
              {name}
            </div>
          ))}
        </div>
      </Surface>
      <p className="note" style={typography.body}>
        Stage 2 · Accessible controls for your next project.
      </p>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
