import type { Difficulty } from "@geriatric-grooves/shared";
import { RadioCard } from "../../components/ui/RadioCard";

const MOBILITY_OPTIONS: { level: Difficulty; title: string; description: string }[] = [
  {
    level: 1,
    title: "I move carefully and slowly",
    description: "I often use a cane, walker, or furniture for support to get around.",
  },
  {
    level: 2,
    title: "I get around on my own, but it's tough sometimes",
    description: "Stairs, standing up, or longer walks can be difficult.",
  },
  {
    level: 3,
    title: "I'm generally steady on my feet",
    description: "I get tired or sore sometimes, or I'm cautious about my balance.",
  },
  {
    level: 4,
    title: "I'm active most days",
    description: "I'm comfortable with most movement, without much difficulty.",
  },
  {
    level: 5,
    title: "I move freely and confidently",
    description: "I'm looking for a good challenge.",
  },
];

interface MobilityStepProps {
  value: Difficulty | null;
  onChange: (level: Difficulty) => void;
}

export function MobilityStep({ value, onChange }: MobilityStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-bold" style={{ fontSize: "var(--text-lg)" }}>
          How would you describe your movement day-to-day?
        </h2>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          There's no wrong answer — this just helps us pick exercises that feel right for you.
          You can change this anytime.
        </p>
      </div>
      <div role="radiogroup" aria-label="Mobility level" className="flex flex-col gap-3">
        {MOBILITY_OPTIONS.map((option) => (
          <RadioCard
            key={option.level}
            selected={value === option.level}
            onSelect={() => onChange(option.level)}
            title={option.title}
            description={option.description}
          />
        ))}
      </div>
    </div>
  );
}
