import { useState } from "react";
import { BannerToast, Button, EmptyState } from "../../index";
import { markRef } from "./markRef";

export function FeedbackContracts() {
  const [dismissals, setDismissals] = useState(0);
  const [actions, setActions] = useState(0);
  return (
    <>
      <BannerToast
        ref={markRef}
        data-contract="BannerToast"
        title="Saved notification"
        onDismiss={() => setDismissals((value) => value + 1)}
      >
        Saved successfully
      </BannerToast>
      <BannerToast tone="error" title="Error notification">
        Something needs attention
      </BannerToast>
      <output aria-label="Dismiss count">{dismissals}</output>
      <EmptyState
        ref={markRef}
        data-contract="EmptyState"
        title="No results"
        description="Try creating an item."
        icon={<span>Decorative symbol</span>}
        action={
          <Button onClick={() => setActions((value) => value + 1)}>
            Create an item
          </Button>
        }
      />
      <output aria-label="Empty action count">{actions}</output>
    </>
  );
}
