import { useRef, useState } from "react";
import { Button, Stack, Surface, TextField } from "../../index";

export function NativeFieldsContracts() {
  const [quantity, setQuantity] = useState("2");
  const [changes, setChanges] = useState(0);
  const [numericValue, setNumericValue] = useState("2");
  const [invalid, setInvalid] = useState(false);
  const [submitted, setSubmitted] = useState("");
  const quantityRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  return (
    <Surface>
      <form
        aria-label="Native fields form"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(
            JSON.stringify(
              Object.fromEntries(new FormData(event.currentTarget)),
            ),
          );
        }}
        onReset={() => {
          setQuantity("2");
          setNumericValue("2");
        }}
      >
        <Stack>
          <TextField
            ref={quantityRef}
            label="Native quantity"
            name="quantity"
            type="number"
            value={quantity}
            onChange={(event) => {
              setQuantity(event.currentTarget.value);
              setNumericValue(String(event.currentTarget.valueAsNumber));
              setChanges((count) => count + 1);
            }}
            min={0}
            max={10}
            step={2}
            required
            helperText="Enter an even quantity"
            error={invalid ? "Check the quantity" : undefined}
            aria-describedby="native-quantity-guidance"
            className="consumer-native-field"
            style={{ width: "90%" }}
            data-native-consumer="quantity"
          />
          <span id="native-quantity-guidance">Native quantity guidance</span>
          <output aria-label="Native quantity changes">{changes}</output>
          <output aria-label="Native numeric value">{numericValue}</output>
          <TextField
            label="Disabled native quantity"
            name="disabledQuantity"
            type="number"
            defaultValue={8}
            disabled
            onChange={() => setChanges((count) => count + 1)}
          />
          <TextField
            ref={dateRef}
            label="Native start date"
            name="startDate"
            type="date"
            defaultValue="2026-06-15"
            min="2026-06-01"
            max="2026-06-30"
            required
          />
          <TextField
            label="Native start time"
            name="startTime"
            type="time"
            defaultValue="09:00"
            min="08:00"
            max="18:00"
            step={900}
            required
          />
          <TextField
            label="Native appointment"
            name="appointment"
            type="datetime-local"
            defaultValue="2026-06-15T09:00"
            min="2026-06-01T08:00"
            max="2026-06-30T18:00"
            required
          />
          <Button onClick={() => quantityRef.current?.focus()}>
            Focus native quantity ref
          </Button>
          <Button onClick={() => dateRef.current?.focus()}>
            Focus native date ref
          </Button>
          <Button onClick={() => setInvalid((value) => !value)}>
            Toggle native quantity error
          </Button>
          <Button type="submit">Submit native fields</Button>
          <Button type="reset">Reset native fields</Button>
          <output aria-label="Native form payload">{submitted}</output>
        </Stack>
      </form>
    </Surface>
  );
}
