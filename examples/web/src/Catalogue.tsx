import { useState, type CSSProperties, type FormEvent } from "react";
import {
  Avatar,
  AvatarGroup,
  BannerToast,
  BottomNavigation,
  Button,
  EmptyState,
  Inline,
  SectionHeader,
  SegmentedControl,
  Stack,
  StatusChip,
  StepProgress,
  Surface,
  Text,
} from "pancake-ui";

const people = [
  { id: "alex", name: "Alex Morgan" },
  { id: "sam", name: "Sam Rivera" },
  { id: "jo", name: "Jo Chen" },
];
export function Catalogue() {
  const [notice, setNotice] = useState(false);
  const [period, setPeriod] = useState("week");
  const [summary, setSummary] = useState("");
  const [avatarSrc, setAvatarSrc] = useState<string>();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSummary(`${data.get("period")} / ${data.get("visibility")}`);
  }
  return (
    <Stack gap="space24" className="catalogue">
      <Surface id="people">
        <Stack>
          <SectionHeader
            title="People and identity"
            description="Useful names, even when a photo is missing."
            action={<StatusChip tone="success">Available</StatusChip>}
          />
          <Inline>
            <Avatar name="Taylor Brooks" size={64} src={avatarSrc} />
            <Button
              variant="secondary"
              onClick={() => setAvatarSrc("/missing-avatar.png")}
            >
              Try missing photo
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                setAvatarSrc(
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23384540"/%3E%3C/svg%3E',
                )
              }
            >
              Load photo
            </Button>
          </Inline>
          <AvatarGroup aria-label="Project team" items={people} max={2} />
        </Stack>
      </Surface>
      <Surface id="updates">
        <Stack>
          <SectionHeader title="Feedback that fits" />
          <Inline>
            <StatusChip>Draft</StatusChip>
            <StatusChip tone="warning">Pending</StatusChip>
            <StatusChip tone="danger">Cancelled</StatusChip>
            <StatusChip tone="info">New</StatusChip>
          </Inline>
          <Button onClick={() => setNotice(true)}>Show notification</Button>
          {notice && (
            <BannerToast
              title="Changes saved"
              tone="success"
              onDismiss={() => setNotice(false)}
            >
              Your preferences are up to date.
            </BannerToast>
          )}
          <EmptyState
            title="No updates yet"
            description="New activity will appear here."
            action={
              <Button variant="secondary" onClick={() => setNotice(true)}>
                Check for updates
              </Button>
            }
          />
        </Stack>
      </Surface>
      <Surface id="preferences">
        <Stack>
          <SectionHeader title="Selection and progress" />
          <StepProgress
            steps={["Details", "Preferences", "Review"]}
            currentStep={1}
          />
          <form
            aria-label="Display preferences"
            onSubmit={submit}
            onReset={() => {
              setPeriod("week");
              setSummary("");
            }}
          >
            <SegmentedControl
              label="Period"
              name="period"
              options={[
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
                { value: "year", label: "Year", disabled: true },
              ]}
              value={period}
              onValueChange={setPeriod}
            />
            <SegmentedControl
              label="Visibility"
              name="visibility"
              options={[
                { value: "private", label: "Private" },
                { value: "public", label: "Public" },
              ]}
              defaultValue="private"
              required
            />
            <SegmentedControl
              label="Locked selection"
              name="locked"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
              defaultValue="yes"
              disabled
            />
            <Inline>
              <Button type="submit">Apply display</Button>
              <Button type="reset" variant="secondary">
                Reset display
              </Button>
            </Inline>
            <output aria-label="Display summary">{summary}</output>
          </form>
        </Stack>
      </Surface>
      <Surface>
        <Stack
          aria-label="Custom theme"
          gap="space24"
          style={
            {
              "--spacing-pancake-24": "30px",
              "--color-pancake-ink": "rgb(56, 69, 64)",
            } as CSSProperties
          }
        >
          <Text as="h2" variant="heading">
            Themeable layout
          </Text>
          <Text>Typography and spacing follow the local theme.</Text>
        </Stack>
      </Surface>
      <BottomNavigation
        aria-label="Catalogue navigation"
        activeId="people"
        items={[
          { id: "people", label: "People", href: "#people" },
          { id: "updates", label: "Updates", href: "#updates" },
          { id: "preferences", label: "Preferences", href: "#preferences" },
        ]}
      />
    </Stack>
  );
}
