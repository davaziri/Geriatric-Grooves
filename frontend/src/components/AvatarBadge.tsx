import { BASE_AVATAR_EMOJI, STREAK_MILESTONES } from "@geriatric-grooves/shared";

interface AvatarBadgeProps {
  unlockedCosmetics: string[];
}

// Shows the highest streak-milestone reward reached so far (milestones are
// ordered ascending by days), falling back to the base seedling.
export function AvatarBadge({ unlockedCosmetics }: AvatarBadgeProps) {
  const current = [...STREAK_MILESTONES].reverse().find((m) => unlockedCosmetics.includes(m.cosmeticId));

  return (
    <div className="flex flex-col items-center gap-2">
      <span aria-hidden="true" style={{ fontSize: "4rem", lineHeight: 1 }}>
        {current?.emoji ?? BASE_AVATAR_EMOJI}
      </span>
      <span style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
        {current?.name ?? "Just getting started"}
      </span>
    </div>
  );
}
