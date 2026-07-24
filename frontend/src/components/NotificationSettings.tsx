import { useEffect, useState } from "react";
import type { PushSubscriptionPayload } from "@geriatric-grooves/shared";
import { DEFAULT_REMINDER_TIME } from "@geriatric-grooves/shared";
import { api } from "../api/client";
import { useProfile } from "../context/ProfileContext";
import { isPushSupported, urlBase64ToUint8Array } from "../utils/pushUtils";
import { ToggleSwitch } from "./ui/ToggleSwitch";

type PermissionState = NotificationPermission | "unsupported";

export function NotificationSettings() {
  const { profile, applyProfile } = useProfile();
  const [permission, setPermission] = useState<PermissionState>("default");
  const [reminderTime, setReminderTime] = useState(profile?.reminderTime ?? DEFAULT_REMINDER_TIME);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPermission(isPushSupported() ? Notification.permission : "unsupported");
  }, []);

  if (!profile) return null;

  async function handleToggle(next: boolean) {
    setError(null);
    if (!next) {
      await handleDisable();
      return;
    }
    await handleEnable();
  }

  async function handleEnable() {
    setBusy(true);
    try {
      let currentPermission = Notification.permission;
      if (currentPermission === "default") {
        currentPermission = await Notification.requestPermission();
        setPermission(currentPermission);
      }
      if (currentPermission !== "granted") {
        setBusy(false);
        return;
      }

      const { publicKey } = await api.getVapidPublicKey();
      if (!publicKey) {
        setError("Reminders aren't set up on the server yet.");
        setBusy(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const result = await api.subscribeToPush(subscription.toJSON() as PushSubscriptionPayload, reminderTime);
      applyProfile(result.profile);
    } catch {
      setError("We couldn't turn on reminders. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDisable() {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const result = await api.unsubscribeFromPush(subscription.endpoint);
        await subscription.unsubscribe();
        applyProfile(result.profile);
      }
    } catch {
      setError("We couldn't turn off reminders. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleTimeChange(nextTime: string) {
    setReminderTime(nextTime);
    try {
      const result = await api.updateReminderTime(nextTime);
      applyProfile(result.profile);
    } catch {
      setError("We couldn't save that time. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="font-semibold" style={{ fontSize: "var(--text-body)" }}>
          Reminder time
        </span>
        <input
          type="time"
          value={reminderTime}
          onChange={(event) => handleTimeChange(event.target.value)}
          className="min-h-[56px] rounded-2xl border-2 px-4"
          style={{
            fontSize: "var(--text-body)",
            borderColor: "var(--color-border)",
            background: "var(--color-surface)",
            color: "var(--color-fg)",
          }}
        />
      </div>

      {permission === "unsupported" ? (
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Notifications aren't available in this browser. We'll show a reminder here in the app
          instead when you open it around your chosen time.
        </p>
      ) : permission === "denied" ? (
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Notifications are turned off in your browser or device settings. You can turn them back
          on there anytime. Until then, we'll show a reminder here in the app when you open it.
        </p>
      ) : (
        <ToggleSwitch
          checked={profile.notificationsEnabled}
          onChange={handleToggle}
          label="Send me a daily reminder"
          description="A gentle nudge at your chosen time — never urgent, and easy to turn off."
        />
      )}

      {busy ? (
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>Saving...</p>
      ) : null}

      {error ? (
        <p role="alert" style={{ fontSize: "var(--text-sm)", color: "var(--color-caution-fg)" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
