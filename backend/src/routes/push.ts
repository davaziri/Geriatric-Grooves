import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { requireAuth } from "../middleware/session.js";
import { toUserProfile } from "../db/mappers.js";
import { vapidPublicKey } from "../services/webPush.js";

export const pushRouter = Router();

pushRouter.get("/vapid-public-key", (_req, res) => {
  res.json({ publicKey: vapidPublicKey });
});

const REMINDER_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const subscribeSchema = z.object({
  subscription: z.object({
    endpoint: z.string().min(1),
    keys: z.object({
      p256dh: z.string().min(1),
      auth: z.string().min(1),
    }),
  }),
  reminderTime: z.string().regex(REMINDER_TIME_PATTERN, "Please choose a valid time."),
});

// Saves (or updates) this browser's push subscription and turns reminders on.
pushRouter.post("/subscribe", requireAuth, async (req, res) => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid request." });
    return;
  }
  const { subscription, reminderTime } = parsed.data;

  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: { userId: req.userId!, p256dh: subscription.keys.p256dh, auth: subscription.keys.auth },
    create: {
      userId: req.userId!,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  });

  const profile = await prisma.userProfile.update({
    where: { id: req.userId },
    data: { notificationsEnabled: true, reminderTime },
  });

  res.json({ profile: toUserProfile(profile) });
});

const unsubscribeSchema = z.object({ endpoint: z.string().min(1) });

pushRouter.post("/unsubscribe", requireAuth, async (req, res) => {
  const parsed = unsubscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing endpoint." });
    return;
  }

  await prisma.pushSubscription.deleteMany({ where: { userId: req.userId, endpoint: parsed.data.endpoint } });

  const remaining = await prisma.pushSubscription.count({ where: { userId: req.userId } });
  const profile = await prisma.userProfile.update({
    where: { id: req.userId },
    data: remaining === 0 ? { notificationsEnabled: false } : {},
  });

  res.json({ profile: toUserProfile(profile) });
});

const reminderTimeSchema = z.object({
  reminderTime: z.string().regex(REMINDER_TIME_PATTERN, "Please choose a valid time."),
});

// Lets someone change their reminder time without re-granting permission.
pushRouter.patch("/reminder-time", requireAuth, async (req, res) => {
  const parsed = reminderTimeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid request." });
    return;
  }
  const profile = await prisma.userProfile.update({
    where: { id: req.userId },
    data: { reminderTime: parsed.data.reminderTime },
  });
  res.json({ profile: toUserProfile(profile) });
});
