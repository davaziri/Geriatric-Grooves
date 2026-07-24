import { prisma } from "../db/client.js";
import { webpush } from "./webPush.js";

// Warm, low-pressure copy that rotates by day of year so it doesn't feel
// like a repeated nag — never urgent or guilt-driven, per the product brief.
const REMINDER_MESSAGES = [
  "Ready for today's stretch? No rush — whenever works for you.",
  "A few gentle minutes today? Your routine is waiting whenever you're ready.",
  "Hi! Today's stretch is ready whenever you'd like to do it.",
];

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function currentHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function pickMessage(): string {
  const startOfYear = new Date(new Date().getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((Date.now() - startOfYear) / 86_400_000);
  return REMINDER_MESSAGES[dayOfYear % REMINDER_MESSAGES.length];
}

function isGoneError(error: unknown): boolean {
  const statusCode = (error as { statusCode?: number } | null)?.statusCode;
  return statusCode === 404 || statusCode === 410;
}

// Runs on an in-process interval — appropriate for a single-instance local
// dev server. A real deployment (multiple instances, or serverless) would
// need a proper cron/queue so reminders aren't duplicated or missed across
// restarts; noting that rather than building it out here.
export async function checkAndSendReminders(): Promise<void> {
  const nowHHMM = currentHHMM();
  const today = todayKey();

  const dueProfiles = await prisma.userProfile.findMany({
    where: {
      notificationsEnabled: true,
      reminderTime: nowHHMM,
      OR: [{ lastReminderSentDate: null }, { lastReminderSentDate: { not: today } }],
    },
    include: { pushSubscriptions: true },
  });

  for (const profile of dueProfiles) {
    const payload = JSON.stringify({ title: "Geriatric Grooves", body: pickMessage() });

    for (const subscription of profile.pushSubscriptions) {
      try {
        await webpush.sendNotification(
          { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
          payload,
        );
      } catch (error) {
        if (isGoneError(error)) {
          await prisma.pushSubscription.delete({ where: { id: subscription.id } }).catch(() => {});
        } else {
          console.error(`Failed to send reminder to ${profile.email}:`, error);
        }
      }
    }

    await prisma.userProfile.update({ where: { id: profile.id }, data: { lastReminderSentDate: today } });
  }
}

let intervalHandle: ReturnType<typeof setInterval> | null = null;

export function startReminderScheduler(): void {
  if (intervalHandle) return;
  intervalHandle = setInterval(() => {
    checkAndSendReminders().catch((error) => console.error("Reminder scheduler error:", error));
  }, 60_000);
}
