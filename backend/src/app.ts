import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { exercisesRouter } from "./routes/exercises.js";
import { routineRouter } from "./routes/routine.js";
import { sessionsRouter } from "./routes/sessions.js";
import { pushRouter } from "./routes/push.js";
import { scanRouter } from "./routes/scan.js";
import { attachSession } from "./middleware/session.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
      credentials: true,
    }),
  );
  // Scan photos arrive as base64 data URLs, which run well past the 100kb
  // default body limit even after client-side resizing.
  app.use(express.json({ limit: "10mb" }));
  app.use(cookieParser());
  app.use(attachSession);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/exercises", exercisesRouter);
  app.use("/api/routine", routineRouter);
  app.use("/api/sessions", sessionsRouter);
  app.use("/api/push", pushRouter);
  app.use("/api/scan", scanRouter);

  return app;
}
