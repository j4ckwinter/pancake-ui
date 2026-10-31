import {
  Avatar,
  AvatarGroup,
  BottomNavigation,
  StatusChip,
  StepProgress,
  Text,
} from "../../index";
import { markRef } from "./markRef";

export function PresentationContracts() {
  return (
    <>
      <BottomNavigation
        ref={markRef}
        data-contract="BottomNavigation"
        aria-label="Contract navigation"
        activeId="home"
        items={[
          { id: "home", label: "Home", href: "#home" },
          { id: "details", label: "Details", href: "#details" },
        ]}
      />
      <Text ref={markRef} data-contract="Text" as="p">
        Semantic text
      </Text>
      <Avatar ref={markRef} data-contract="Avatar" name="Alex Morgan" />
      <Avatar name="Decorative person" decorative />
      <AvatarGroup
        ref={markRef}
        data-contract="AvatarGroup"
        max={1}
        items={[
          { id: "one", name: "Sam Rivera" },
          { id: "two", name: "Jo Chen" },
        ]}
      />
      <StatusChip ref={markRef} data-contract="StatusChip" tone="success">
        Ready status
      </StatusChip>
      <StepProgress
        ref={markRef}
        data-contract="StepProgress"
        steps={["First", "Second", "Third"]}
        currentStep={1}
      />
    </>
  );
}
