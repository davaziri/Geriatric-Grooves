import { useEffect, useState } from "react";
import { STREAK_MILESTONES } from "@geriatric-grooves/shared";
import { api } from "../api/client";
import { useProfile } from "../context/ProfileContext";
import { Card } from "../components/ui/Card";
import { AvatarBadge } from "../components/AvatarBadge";
import { ProgressCalendar } from "../components/ProgressCalendar";

export function ProgressPage() {
  const { profile } = useProfile();
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getRecentSessionDates(31)
      .then((result) => {
        if (!cancelled) setCompletedDates(new Set(result.dates));
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load your recent activity.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!profile) return null;

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10">
      <h1 className="font-bold" style={{ fontSize: "var(--text-xl)" }}>
        Your Progress
      </h1>

      <Card className="flex flex-col items-center gap-3">
        <AvatarBadge unlockedCosmetics={profile.unlockedCosmetics} />
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="font-semibold" style={{ fontSize: "var(--text-lg)" }}>
            {profile.streakCount === 0 ? "Ready when you are" : `${profile.streakCount}-day streak`}
          </p>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
            Best streak so far: {profile.longestStreak} {profile.longestStreak === 1 ? "day" : "days"}
          </p>
        </div>
      </Card>

      <Card className="flex flex-col gap-2">
        <p style={{ fontSize: "var(--text-body)" }}>
          <span className="font-semibold">{profile.xpTotal}</span> total points earned
        </p>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          {profile.streakFreezesAvailable} streak {profile.streakFreezesAvailable === 1 ? "freeze" : "freezes"}{" "}
          available this month. If you miss a day, we'll use one automatically to protect your
          streak.
        </p>
      </Card>

      <Card className="flex flex-col gap-3">
        {error ? (
          <p role="alert" style={{ fontSize: "var(--text-sm)", color: "var(--color-caution-fg)" }}>
            {error}
          </p>
        ) : (
          <ProgressCalendar completedDates={completedDates} />
        )}
      </Card>

      <Card className="flex flex-col gap-3">
        <span className="font-semibold" style={{ fontSize: "var(--text-body)" }}>
          Milestones
        </span>
        <div className="flex flex-col gap-2">
          {STREAK_MILESTONES.map((milestone) => {
            const unlocked = profile.unlockedCosmetics.includes(milestone.cosmeticId);
            return (
              <div
                key={milestone.cosmeticId}
                className="flex items-center gap-3 rounded-xl border-2 px-4 py-3"
                style={{
                  borderColor: unlocked ? "var(--color-primary)" : "var(--color-border)",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: "1.5rem", opacity: unlocked ? 1 : 0.35 }}>
                  {milestone.emoji}
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold" style={{ fontSize: "var(--text-body)" }}>
                    {milestone.name}
                  </span>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
                    {unlocked ? "Unlocked" : `Reach a ${milestone.days}-day streak`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </main>
  );
}
