import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import type { Difficulty, Equipment, EnvironmentTag } from "@geriatric-grooves/shared";
import { useProfile } from "../../context/ProfileContext";
import { Button } from "../../components/ui/Button";
import { ProgressSteps } from "../../components/ui/ProgressSteps";
import { AccessibilityControls } from "../../components/AccessibilityControls";
import { MobilityStep } from "./MobilityStep";
import { EquipmentStep } from "./EquipmentStep";

const TOTAL_STEPS = 4;

export function OnboardingFlow() {
  const { status, profile, updateProfile } = useProfile();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [mobilityLevel, setMobilityLevel] = useState<Difficulty | null>(null);
  const [equipmentOwned, setEquipmentOwned] = useState<Equipment[]>([]);
  const [environmentFeatures, setEnvironmentFeatures] = useState<EnvironmentTag[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <p style={{ fontSize: "var(--text-body)" }}>Loading...</p>
      </main>
    );
  }
  if (status === "signed-out" || !profile) {
    return <Navigate to="/sign-in" replace />;
  }
  if (profile.onboardingCompleted) {
    return <Navigate to="/home" replace />;
  }

  async function handleFinish() {
    setSubmitting(true);
    try {
      await updateProfile({
        mobilityLevel: mobilityLevel ?? 3,
        equipmentOwned,
        knownEnvironmentFeatures: environmentFeatures,
        onboardingCompleted: true,
      });
      navigate("/home", { replace: true });
    } finally {
      setSubmitting(false);
    }
  }

  const canProceedFromMobility = step !== 2 || mobilityLevel !== null;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-6 py-10">
      <ProgressSteps step={step} total={TOTAL_STEPS} />

      <div className="flex-1">
        {step === 1 ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <span aria-hidden="true" style={{ fontSize: "3rem" }}>
              👋
            </span>
            <h1 className="font-bold" style={{ fontSize: "var(--text-xl)" }}>
              Welcome!
            </h1>
            <p style={{ fontSize: "var(--text-body)" }}>
              Let's take a few minutes to get to know what works for you. There are no wrong
              answers, and you can change any of this later.
            </p>
          </div>
        ) : null}

        {step === 2 ? <MobilityStep value={mobilityLevel} onChange={setMobilityLevel} /> : null}

        {step === 3 ? (
          <EquipmentStep
            equipmentOwned={equipmentOwned}
            onEquipmentChange={setEquipmentOwned}
            environmentFeatures={environmentFeatures}
            onEnvironmentChange={setEnvironmentFeatures}
          />
        ) : null}

        {step === 4 ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="font-bold" style={{ fontSize: "var(--text-lg)" }}>
                Make it easy to read
              </h2>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
                These settings apply everywhere in the app, and you can always change them later
                in Settings.
              </p>
            </div>
            <AccessibilityControls />
          </div>
        ) : null}
      </div>

      <div className="flex gap-3">
        {step > 1 ? (
          <Button variant="secondary" onClick={() => setStep((prev) => prev - 1)} className="flex-1">
            Back
          </Button>
        ) : null}
        {step < TOTAL_STEPS ? (
          <Button
            onClick={() => setStep((prev) => prev + 1)}
            disabled={!canProceedFromMobility}
            className="flex-1"
          >
            {step === 1 ? "Let's go" : "Next"}
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={submitting} className="flex-1">
            {submitting ? "Saving..." : "Finish"}
          </Button>
        )}
      </div>
    </main>
  );
}
