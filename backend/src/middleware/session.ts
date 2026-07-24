import type { NextFunction, Request, Response } from "express";
import { prisma } from "../db/client.js";

export const SESSION_COOKIE_NAME = "gg_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function createSession(userId: string): Promise<{ id: string; expiresAt: Date }> {
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    },
  });
  return session;
}

// Frontend and backend are on different hostnames (e.g. two separate
// trycloudflare.com tunnel subdomains), so the session cookie needs
// SameSite=None + Secure to survive the cross-site fetch — plain "lax"
// cookies are silently dropped by the browser in that setup.
const CROSS_SITE = process.env.COOKIE_CROSS_SITE === "true";

export function setSessionCookie(res: Response, sessionId: string, expiresAt: Date): void {
  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: CROSS_SITE ? "none" : "lax",
    secure: CROSS_SITE || process.env.NODE_ENV === "production",
    expires: expiresAt,
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE_NAME);
}

// Attaches req.userId when a valid session cookie is present; does not reject
// the request on its own so routes can decide whether auth is required.
export async function attachSession(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
  if (!sessionId) {
    next();
    return;
  }
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (session && session.expiresAt > new Date()) {
    req.userId = session.userId;
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.userId) {
    res.status(401).json({ error: "Not signed in." });
    return;
  }
  next();
}
