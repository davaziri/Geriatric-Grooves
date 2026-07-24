import type { Equipment, EnvironmentTag } from "@geriatric-grooves/shared";
import { SelectableChip } from "../../components/ui/SelectableChip";

const EQUIPMENT_CHOICES: { value: Exclude<Equipment, "none">; label: string }[] = [
  { value: "chair", label: "A sturdy chair" },
  { value: "resistance_band", label: "A resistance band" },
  { value: "wall", label: "Open wall space" },
  { value: "stairs", label: "A staircase" },
  { value: "light_weights", label: "Light hand weights (or full water bottles)" },
];

const ENVIRONMENT_CHOICES: { value: EnvironmentTag; label: string }[] = [
  { value: "open_floor", label: "Open floor space to move around" },
  { value: "has_railing", label: "A railing or sturdy handrail" },
  { value: "has_stairs", label: "A staircase I feel okay using" },
  { value: "has_chair", label: "A chair nearby while I exercise" },
  { value: "small_space", label: "My space is fairly small or tight" },
];

interface EquipmentStepProps {
  equipmentOwned: Equipment[];
  onEquipmentChange: (next: Equipment[]) => void;
  environmentFeatures: EnvironmentTag[];
  onEnvironmentChange: (next: EnvironmentTag[]) => void;
}

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function EquipmentStep({
  equipmentOwned,
  onEquipmentChange,
  environmentFeatures,
  onEnvironmentChange,
}: EquipmentStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold" style={{ fontSize: "var(--text-lg)" }}>
            What do you have on hand?
          </h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
            Check anything you have available. Don't worry if you check nothing — we'll always
            include exercises that need no equipment at all.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {EQUIPMENT_CHOICES.map((choice) => (
            <SelectableChip
              key={choice.value}
              selected={equipmentOwned.includes(choice.value)}
              onToggle={() => onEquipmentChange(toggleValue(equipmentOwned, choice.value))}
            >
              {choice.label}
            </SelectableChip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold" style={{ fontSize: "var(--text-lg)" }}>
            Tell us about your space
          </h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
            This helps us suggest exercises that fit where you'll actually be doing them.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {ENVIRONMENT_CHOICES.map((choice) => (
            <SelectableChip
              key={choice.value}
              selected={environmentFeatures.includes(choice.value)}
              onToggle={() => onEnvironmentChange(toggleValue(environmentFeatures, choice.value))}
            >
              {choice.label}
            </SelectableChip>
          ))}
        </div>
      </div>
    </div>
  );
}
