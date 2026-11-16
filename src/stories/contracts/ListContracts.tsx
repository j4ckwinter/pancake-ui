import { useState } from "react";
import {
  Avatar,
  Button,
  DialogActions,
  List,
  ListItem,
  Surface,
} from "../../index";
import { markRef } from "./markRef";

export function ListContracts() {
  const [removals, setRemovals] = useState(0);
  const [actions, setActions] = useState("");
  return (
    <Surface>
      <List
        ref={markRef}
        data-contract="List"
        aria-label="Contract people"
        className="consumer-list"
        style={{ borderRadius: 0 }}
      >
        <ListItem
          ref={markRef}
          data-contract="ListItem"
          className="consumer-list-item"
          title="ada@example.com"
          description="Owner"
          leading={<Avatar name="Ada Lovelace" size={32} decorative />}
          trailing={
            <Button
              size={32}
              variant="ghost"
              onClick={() => setRemovals((count) => count + 1)}
            >
              Remove ada@example.com
            </Button>
          }
        />
        <ListItem
          title={`${"unbrokenaddress".repeat(12)}@example.com`}
          trailing="Member"
        />
      </List>
      <output aria-label="List removals">{removals}</output>
      <DialogActions
        ref={markRef}
        data-contract="DialogActions"
        className="consumer-actions"
        style={{ borderRadius: 0 }}
      >
        <Button
          variant="ghost"
          onClick={() => setActions((value) => `${value}cancel,`)}
        >
          Cancel contract action
        </Button>
        <Button onClick={() => setActions((value) => `${value}confirm,`)}>
          Confirm contract action
        </Button>
      </DialogActions>
      <output aria-label="Dialog actions pressed">{actions}</output>
    </Surface>
  );
}
