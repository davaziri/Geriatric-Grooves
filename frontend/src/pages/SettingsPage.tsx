import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { AccessibilityControls } from "../components/AccessibilityControls";
import { NotificationSettings } from "../components/NotificationSettings";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function SettingsPage() {
  const { profile, signOut } = useProfile();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/sign-in", { replace: true });
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10">
      <h1 className="font-bold" style={{ fontSize: "var(--text-xl)" }}>
        Settings
      </h1>

      <Card>
        <AccessibilityControls />
      </Card>

      <Card className="flex flex-col gap-4">
        <span className="font-bold" style={{ fontSize: "var(--text-lg)" }}>
          Daily Reminder
        </span>
        <NotificationSettings />
      </Card>

      {profile ? (
        <Card className="flex flex-col gap-3">
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
            Signed in as {profile.email}
          </p>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign out
          </Button>
        </Card>
      ) : null}
    </main>
  );
}
