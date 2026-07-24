interface ProgressCalendarProps {
  completedDates: Set<string>;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Uses UTC throughout (not local time) to stay consistent with the backend,
// which keys "today" and session dates off `new Date().toISOString()`.
export function ProgressCalendar({ completedDates }: ProgressCalendarProps) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const todayKey = now.toISOString().slice(0, 10);

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const leadingBlanks = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const cells: (string | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => dateKey(year, month, i + 1)),
  ];

  const monthLabel = new Date(Date.UTC(year, month, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold" style={{ fontSize: "var(--text-body)" }}>
        {monthLabel}
      </span>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((label, index) => (
          <span key={index} style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (!day) return <span key={`blank-${index}`} />;
          const isCompleted = completedDates.has(day);
          const isToday = day === todayKey;
          const dayNumber = Number(day.slice(8, 10));
          return (
            <div
              key={day}
              title={day}
              className="flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg"
              style={{
                background: isCompleted ? "var(--color-primary)" : "var(--color-surface)",
                border: isToday ? "3px solid var(--color-fg)" : "2px solid var(--color-border)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontSize: "0.8rem",
                  color: isCompleted ? "var(--color-primary-contrast)" : "var(--color-fg-muted)",
                }}
              >
                {dayNumber}
              </span>
              <span
                aria-hidden="true"
                style={{
                  fontSize: "0.65rem",
                  color: isCompleted ? "var(--color-primary-contrast)" : "transparent",
                }}
              >
                ✓
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
