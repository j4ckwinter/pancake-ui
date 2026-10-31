import { useRef, useState } from "react";
import { Button, RadioGroup, Stack, Surface, Switch } from "../../index";

const options = [
  { value: "email", label: "Email", description: "Delivered to your inbox" },
  { value: "phone", label: "Phone", disabled: true },
  { value: "post", label: "Post" },
] as const;

export function SelectionContracts() {
  const [channel, setChannel] = useState("email");
  const [enabled, setEnabled] = useState(false);
  const [changes, setChanges] = useState(0);
  const [events, setEvents] = useState("");
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState("");
  const groupRef = useRef<HTMLFieldSetElement>(null);
  const switchRef = useRef<HTMLInputElement>(null);
  return (
    <Surface>
      <form
        id="selection-form"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(
            JSON.stringify(
              Object.fromEntries(new FormData(event.currentTarget)),
            ),
          );
        }}
        onReset={() => {
          setChannel("email");
          setEnabled(false);
        }}
      >
        <Stack>
          <RadioGroup
            label="Controlled contact"
            name="contact"
            options={options}
            value={channel}
            onValueChange={(value) => {
              setChannel(value);
              setChanges((count) => count + 1);
            }}
            ref={groupRef}
            required
            helperText="Choose a contact method"
            error={error ? "Check your contact choice" : undefined}
            aria-describedby="selection-help"
            className="consumer-radio"
            style={{ padding: 4 }}
          />
          <output aria-label="Contact changes">{changes}</output>
          <RadioGroup
            label="Uncontrolled contact"
            name="draftContact"
            options={options}
            defaultValue="email"
          />
          <RadioGroup
            label="Disabled contact"
            name="disabledContact"
            options={options}
            defaultValue="email"
            disabled
          />
          <Switch
            label="Controlled notifications"
            name="notifications"
            value="yes"
            checked={enabled}
            onChange={() => setEvents((value) => `${value}native,`)}
            onCheckedChange={(value) => {
              setEnabled(value);
              setEvents((events) => `${events}checked,`);
            }}
            ref={switchRef}
            className="consumer-switch"
            style={{ borderRadius: 0 }}
          />
          <output aria-label="Notification events">{events}</output>
          <Switch
            label="Uncontrolled notifications"
            name="draftNotifications"
            value="yes"
            defaultChecked
          />
          <Switch
            label="Disabled notifications"
            name="disabledNotifications"
            disabled
          />
          <span id="selection-help">Shared selection guidance</span>
          <Button
            onClick={() =>
              groupRef.current?.setAttribute("data-ref-ready", "true")
            }
          >
            Inspect contact ref
          </Button>
          <Button onClick={() => switchRef.current?.focus()}>
            Focus notification ref
          </Button>
          <Button onClick={() => setError((value) => !value)}>
            Toggle contact error
          </Button>
          <Button type="submit">Submit selections</Button>
          <Button type="reset">Reset selections</Button>
          <output aria-label="Submitted selections">{submitted}</output>
        </Stack>
      </form>
      <RadioGroup
        label="External contact"
        form="selection-form"
        name="externalContact"
        options={options}
        defaultValue="post"
      />
      <Switch
        label="External notifications"
        form="selection-form"
        name="externalNotifications"
        value="yes"
        defaultChecked
      />
      <form>
        <RadioGroup label="Required contact" options={options} required />
        <Switch label="Required notifications" required />
      </form>
    </Surface>
  );
}
