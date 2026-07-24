import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Exercise } from "@geriatric-grooves/shared";
import { STREAK_MILESTONES } from "@geriatric-grooves/shared";
import { api } from "../api/client";
import { useProfile } from "../context/ProfileContext";
import { ExerciseSummaryCard } from "../components/ExerciseSummaryCard";
import { Card } from "../components/ui/Card";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";

export function HomePage() {
  const { profile, applyProfile } = useProfile();
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<string | null>(null);
  const [reminderDismissed, setReminderDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getTodayRoutine(), api.getTodaySessionStatus()])
      .then(([routine, todayStatus]) => {
        if (cancelled) return;
        setExercises(routine.exercises);
        setCompletedIds(new Set(todayStatus.exercisesCompleted));
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load today's routine. Please try again.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleComplete(exerciseId: string) {
    setCompletedIds((prev) => new Set(prev).add(exerciseId));
    try {
      const result = await api.completeExercise(exerciseId);
      applyProfile(result.profile);

      if (result.newlyUnlockedCosmetics.length > 0) {
        const milestone = STREAK_MILESTONES.find((m) => m.cosmeticId === result.newlyUnlockedCosmetics[0]);
        setCelebration(
          milestone
            ? `${milestone.emoji} You unlocked "${milestone.name}" — ${milestone.days}-day streak! Wonderful.`
            : "You unlocked something new — nice work!",
        );
      } else if (result.usedStreakFreeze) {
        setCelebration("Welcome back! We used one of your streak freezes to keep your progress safe.");
      }
    } catch {
      // Revert the optimistic checkmark if the request failed.
      setCompletedIds((prev) => {
        const next = new Set(prev);
        next.delete(exerciseId);
        return next;
      });
    }
  }

  const allDone = exercises !== null && exercises.length > 0 && completedIds.size >= exercises.length;
  const nowHHMM = `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`;
  // Shows whether or not push notifications are on — a gentle in-app nudge
  // for anyone who denied/can't get push, and a harmless extra for everyone
  // else in case they haven't seen the push yet.
  const showReminder = Boolean(profile?.reminderTime) && !allDone && nowHHMM >= (profile?.reminderTime ?? "") && !reminderDismissed;

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold" style={{ fontSize: "var(--text-xl)" }}>
          Today's Routine
        </h1>
        <p style={{ fontSize: "var(--text-body)", color: "var(--color-fg-muted)" }}>
          Picked to match what you have on hand. No rush — go at your own pace.
        </p>
      </div>

      {showReminder ? (
        <Card className="flex items-center justify-between gap-3">
          <p style={{ fontSize: "var(--text-body)" }}>
            Ready for today's stretch? Whenever works for you.
          </p>
          <button
            type="button"
            onClick={() => setReminderDismissed(true)}
            className="min-h-[44px] min-w-[44px] shrink-0 font-semibold"
            style={{ color: "var(--color-primary)", fontSize: "var(--text-sm)" }}
            aria-label="Dismiss"
          >
            Got it
          </button>
        </Card>
      ) : null}

      {celebration ? (
        <Card className="flex items-center justify-between gap-3">
          <p style={{ fontSize: "var(--text-body)" }}>{celebration}</p>
          <button
            type="button"
            onClick={() => setCelebration(null)}
            className="min-h-[44px] min-w-[44px] shrink-0 font-semibold"
            style={{ color: "var(--color-primary)", fontSize: "var(--text-sm)" }}
            aria-label="Dismiss"
          >
            Nice!
          </button>
        </Card>
      ) : null}

      {error ? (
        <p role="alert" style={{ fontSize: "var(--text-body)", color: "var(--color-caution-fg)" }}>
          {error}
        </p>
      ) : null}

      {!error && exercises === null ? (
        <p style={{ fontSize: "var(--text-body)" }}>Loading your routine...</p>
      ) : null}

      {!error && exercises && exercises.length === 0 ? (
        <p style={{ fontSize: "var(--text-body)", color: "var(--color-fg-muted)" }}>
          We couldn't find exercises matching your equipment yet. Try browsing the full library
          below.
        </p>
      ) : null}

      {exercises && exercises.length > 0 ? (
        <div className="flex flex-col gap-4">
          {exercises.map((exercise) => (
            <ExerciseSummaryCard
              key={exercise.id}
              exercise={exercise}
              completed={completedIds.has(exercise.id)}
              onComplete={() => handleComplete(exercise.id)}
            />
          ))}
        </div>
      ) : null}

      <Link
        to="/library"
        className="min-h-[56px] rounded-2xl border-2 px-6 py-3 text-center font-semibold"
        style={{
          borderColor: "var(--color-primary)",
          color: "var(--color-primary)",
          fontSize: "var(--text-body)",
        }}
      >
        Browse the full library
      </Link>

      <Link
        to="/scan"
        className="flex min-h-[56px] items-center justify-center gap-2 rounded-2xl px-6 py-3 text-center font-semibold"
        style={{
          background: "var(--color-surface)",
          border: "2px dashed var(--color-border)",
          color: "var(--color-fg)",
          fontSize: "var(--text-body)",
        }}
      >
        <span aria-hidden="true">📷</span>
        Scan my space for more ideas
      </Link>

      {profile ? (
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Signed in as {profile.email}
        </p>
      ) : null}

      <DisclaimerBanner />
    </main>
  );
}
