import {
  AppHeader,
  Avatar,
  AvatarGroup,
  BannerToast,
  BottomNavigation,
  Button,
  Checkbox,
  EmptyState,
  Inline,
  SectionHeader,
  SegmentedControl,
  Stack,
  StatusChip,
  StepProgress,
  Surface,
  Text,
  TextField,
  Textarea,
  Select,
} from "../../index";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Comparison",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Catalogue: Story = {
  render: () => (
    <main
      data-testid="comparison"
      style={{
        boxSizing: "border-box",
        maxWidth: 960,
        margin: "0 auto",
        padding: "var(--spacing-pancake-24)",
        background: "var(--color-pancake-canvas)",
        fontFamily: "var(--font-pancake)",
      }}
    >
      <Stack data-component="Stack" gap="space24">
        <AppHeader
          data-component="AppHeader"
          title="Component comparison"
          description="Shared spacing, typography, and interaction states."
        />
        <Surface data-component="Surface">
          <Stack>
            <SectionHeader
              data-component="SectionHeader"
              title="Actions and typography"
              description="Default, compact, disabled, and loading actions."
            />
            <Inline data-component="Inline">
              <Button data-component="Button">Continue</Button>
              <Button variant="secondary">Back</Button>
              <Button variant="destructive">Remove</Button>
              <Button variant="ghost">Cancel</Button>
              <Button size={40}>Compact</Button>
              <Button disabled>Unavailable</Button>
              <Button loading>Saving changes</Button>
            </Inline>
            <Text data-component="Text" as="p" variant="body">
              Body text gives the actions context without competing with the
              heading. Longer content wraps within the same spacing system.
            </Text>
            <Text as="p" variant="caption" color="muted">
              Supporting text uses the caption role.
            </Text>
          </Stack>
        </Surface>
        <Surface>
          <Stack data-testid="comparison-fields">
            <SectionHeader title="Fields and selections" />
            <TextField
              data-component="TextField"
              label="Project name"
              defaultValue="Shared component library"
              helperText="Choose a name your team will recognise."
            />
            <TextField
              label="A longer project description label that wraps on narrow screens"
              defaultValue="Too short"
              error="Add a little more detail so your teammates can identify this project."
            />
            <TextField
              label="Managed by your organisation"
              defaultValue="Unavailable while your account is being updated"
              disabled
            />
            <Checkbox data-component="Checkbox" label="Send me updates" />
            <Checkbox
              label="Include a detailed weekly summary of changes from every project I follow"
              defaultChecked
            />
            <Checkbox
              label="Notifications unavailable"
              disabled
              defaultChecked
            />
            <SegmentedControl
              data-component="SegmentedControl"
              label="Summary period"
              name="comparison-period"
              defaultValue="week"
              options={[
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
                { value: "year", label: "Year", disabled: true },
              ]}
            />
          </Stack>
        </Surface>
        <Surface>
          <Stack>
            <SectionHeader title="People and status" />
            <Inline>
              <Avatar data-component="Avatar" name="Alex Morgan" size={48} />
              <Avatar name="Sam Rivera" size={32} />
              <AvatarGroup
                data-component="AvatarGroup"
                aria-label="Project team"
                max={2}
                items={[
                  { id: "alex", name: "Alex Morgan" },
                  { id: "sam", name: "Sam Rivera" },
                  { id: "jo", name: "Jo Chen" },
                ]}
              />
            </Inline>
            <Inline>
              <StatusChip data-component="StatusChip">Draft</StatusChip>
              <StatusChip tone="success">Ready</StatusChip>
              <StatusChip tone="warning">Pending review</StatusChip>
              <StatusChip tone="danger">Needs attention</StatusChip>
              <StatusChip tone="info">New</StatusChip>
            </Inline>
          </Stack>
        </Surface>
        <Surface>
          <Stack>
            <SectionHeader title="Feedback and empty states" />
            <BannerToast
              data-component="BannerToast"
              title="Changes saved"
              onDismiss={() => {}}
            >
              Everyone on the team can now see the updated project details.
            </BannerToast>
            <BannerToast tone="error" title="Some changes could not be saved">
              Review the highlighted fields and try again when you are ready.
            </BannerToast>
            <EmptyState
              data-component="EmptyState"
              title="No updates yet"
              description="Updates from your projects will appear here. Follow a project to keep track of the latest changes from your team."
              action={<Button variant="secondary">Find a project</Button>}
            />
          </Stack>
        </Surface>
        <Surface>
          <Stack>
            <SectionHeader title="Navigation and progress" />
            <StepProgress
              data-component="StepProgress"
              steps={["Account details", "Preferences", "Review and finish"]}
              currentStep={1}
            />
            <BottomNavigation
              data-component="BottomNavigation"
              aria-label="Comparison navigation"
              activeId="projects"
              items={[
                { id: "home", label: "Home", href: "#home" },
                { id: "projects", label: "Projects", href: "#projects" },
                {
                  id: "settings",
                  label: "Account settings",
                  href: "#settings",
                },
              ]}
            />
          </Stack>
        </Surface>
        <Surface>
          <Stack>
            <SectionHeader title="Long answers and choices" />
            <Textarea
              data-component="Textarea"
              label="Project description"
              defaultValue="A shared place for the team to plan and review their work."
              helperText="Include the details your teammates need."
            />
            <Textarea
              label="A longer description label that wraps naturally on a narrow screen"
              error="Add a description before continuing."
              required
            />
            <Textarea
              label="Archived description"
              defaultValue="This project is archived."
              disabled
            />
            <Select
              data-component="Select"
              label="Project visibility"
              defaultValue="team"
              helperText="Choose who can see this project."
            >
              <option value="private">Only me</option>
              <option value="team">My team</option>
              <option value="public">Everyone</option>
            </Select>
            <Select
              label="A longer selection label that wraps naturally on a narrow screen"
              defaultValue=""
              error="Choose a category."
              required
            >
              <option value="">Choose a category</option>
              <option value="work">Work</option>
            </Select>
            <Select label="Managed visibility" defaultValue="team" disabled>
              <option value="team">My team</option>
            </Select>
          </Stack>
        </Surface>
      </Stack>
    </main>
  ),
};
