import { useState } from "react";
import { Button, LoadingIndicator, Progress } from "../../index";
import { markRef } from "./markRef";

export function ProgressContracts() {
  const [value, setValue] = useState<number | undefined>(25);
  const [label, setLabel] = useState("Loading records");
  return (
    <>
      <Progress
        ref={markRef}
        data-contract="Progress"
        className="consumer-progress"
        style={{ height: 24 }}
        label="Import progress"
        value={value}
        aria-describedby="progress-description"
      />
      <p id="progress-description">Records processed</p>
      <Progress
        id="custom-progress"
        label="Bounded progress"
        value={80}
        max={40}
      />
      <Progress label="Negative progress" value={-5} />
      <Progress label="Invalid maximum progress" value={2} max={0} />
      <Button onClick={() => setValue(undefined)}>Wait for progress</Button>
      <Button onClick={() => setValue(75)}>Advance progress</Button>
      <LoadingIndicator
        ref={markRef}
        data-contract="LoadingIndicator"
        className="consumer-loading"
        style={{ padding: 12 }}
        label={label}
      />
      <Button onClick={() => setLabel("Records loaded")}>
        Complete loading
      </Button>
    </>
  );
}
