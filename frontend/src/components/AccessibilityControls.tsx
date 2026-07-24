import type { FontSize } from "@geriatric-grooves/shared";
import { useAccessibility } from "../context/AccessibilityContext";
import { useProfile } from "../context/ProfileContext";
import { ToggleSwitch } from "./ui/ToggleSwitch";

// Used both during onboarding (before any account-specific data exists) and
// later from the Settings screen. Applies changes immediately to the whole
// app via AccessibilityContext, and persists them to the profile once one
// exists — so nothing is ever "buried" behind a save button.
export function AccessibilityControls() {
  const accessibility = useAccessibility();
  const { profile, updateProfile } = useProfile();

  function handleFontSize(fontSize: FontSize) {
    accessibility.setFontSize(fontSize);
    if (profile) void updateProfile({ accessibilityPrefs: { fontSize } });
  }

  function handleHighContrast(highContrast: boolean) {
    accessibility.setHighContrast(highContrast);
    if (profile) void updateProfile({ accessibilityPrefs: { highContrast } });
  }

  function handleReduceMotion(reduceMotion: boolean) {
    accessibility.setReduceMotion(reduceMotion);
    if (profile) void updateProfile({ accessibilityPrefs: { reduceMotion } });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="font-semibold" style={{ fontSize: "var(--text-body)" }}>
          Text size
        </span>
        <div className="flex gap-3">
          {(["large", "extra_large"] as const).map((size) => {
            const selected = accessibility.fontSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => handleFontSize(size)}
                aria-pressed={selected}
                className="min-h-[56px] flex-1 rounded-2xl border-3 font-semibold"
                style={{
                  border: `3px solid ${selected ? "var(--color-primary)" : "var(--color-border)"}`,
                  background: selected ? "var(--color-primary)" : "var(--color-surface)",
                  color: selected ? "var(--color-primary-contrast)" : "var(--color-fg)",
                  fontSize: size === "large" ? "1.25rem" : "1.5rem",
                }}
              >
                {size === "large" ? "Large" : "Extra Large"}
              </button>
            );
          })}
        </div>
      </div>

      <ToggleSwitch
        checked={accessibility.highContrast}
        onChange={handleHighContrast}
        label="High contrast"
        description="Stronger colors and darker text, easier to read in bright light."
      />

      <ToggleSwitch
        checked={accessibility.reduceMotion}
        onChange={handleReduceMotion}
        label="Reduce motion"
        description="Turns off animations and transitions."
      />
    </div>
  );
}
