import { Router } from "express";
import { z } from "zod";
import { nanoid } from "nanoid";
import { prisma } from "../db/client.js";
import { createSession, setSessionCookie, clearSessionCookie, SESSION_COOKIE_NAME } from "../middleware/session.js";
import { toUserProfile } from "../db/mappers.js";
import { sendMagicLinkEmail } from "../services/email.js";

export const authRouter = Router();

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

const requestLinkSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
});

// Passwordless sign-in: emails (in dev, logs) a one-time link. No passwords,
// since this user base should never have to remember one.
authRouter.post("/request-link", async (req, res) => {
  const parsed = requestLinkSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid request." });
    return;
  }
  const { email } = parsed.data;

  await prisma.userProfile.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  const token = nanoid(32);
  await prisma.magicLinkToken.create({
    data: { email, token, expiresAt: new Date(Date.now() + TOKEN_TTL_MS) },
  });

  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";
  const magicLink = `${frontendOrigin}/auth/verify?token=${token}`;

  await sendMagicLinkEmail(email, magicLink);

  res.json({
    message: "If that address is valid, a sign-in link is on its way.",
    ...(process.env.NODE_ENV !== "production" ? { devMagicLink: magicLink } : {}),
  });
});

const verifySchema = z.object({
  token: z.string().min(1),
});

authRouter.get("/verify", async (req, res) => {
  const parsed = verifySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid token." });
    return;
  }

  const record = await prisma.magicLinkToken.findUnique({ where: { token: parsed.data.token } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    res.status(400).json({ error: "This link has expired or was already used. Request a new one." });
    return;
  }

  const profile = await prisma.userProfile.findUnique({ where: { email: record.email } });
  if (!profile) {
    res.status(400).json({ error: "We couldn't find that account. Request a new link." });
    return;
  }

  await prisma.magicLinkToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });

  const session = await createSession(profile.id);
  setSessionCookie(res, session.id, session.expiresAt);

  res.json({ profile: toUserProfile(profile) });
});

authRouter.post("/sign-out", async (req, res) => {
  const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
  if (sessionId) {
    await prisma.session.deleteMany({ where: { id: sessionId } });
  }
  clearSessionCookie(res);
  res.json({ ok: true });
});
