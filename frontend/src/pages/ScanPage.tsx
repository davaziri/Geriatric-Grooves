import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ScanDetectionResult } from "@geriatric-grooves/shared";
import { api, ApiError } from "../api/client";
import { useProfile } from "../context/ProfileContext";
import { captureFrameAsDataUrl } from "../utils/cameraCapture";
import { SCAN_DETECTION_KEYS, SCAN_DETECTION_LABELS } from "../utils/scanLabels";
import { BackButton } from "../components/ui/BackButton";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { SelectableChip } from "../components/ui/SelectableChip";
import { ToggleSwitch } from "../components/ui/ToggleSwitch";

const CONSENT_STORAGE_KEY = "gg_scan_consent_seen";

type ScanStep = "consent" | "camera" | "preview" | "analyzing" | "confirm" | "saving";

function hasSeenConsent(): boolean {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function ScanPage() {
  const navigate = useNavigate();
  const { applyProfile } = useProfile();

  const [step, setStep] = useState<ScanStep>(() => (hasSeenConsent() ? "camera" : "consent"));
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detection, setDetection] = useState<ScanDetectionResult | null>(null);
  const [savePhoto, setSavePhoto] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (step !== "camera") return;
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCameraError("We couldn't access your camera. You can still browse the library directly.");
        }
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [step]);

  function handleAcceptConsent() {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "true");
    } catch {
      // Ignore storage failures — the consent screen will just show again next time.
    }
    setStep("camera");
  }

  function handleCapture() {
    if (!videoRef.current) return;
    const dataUrl = captureFrameAsDataUrl(videoRef.current);
    setCapturedImage(dataUrl);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStep("preview");
  }

  function handleRetake() {
    setCapturedImage(null);
    setActionError(null);
    setStep("camera");
  }

  async function handleUsePhoto() {
    if (!capturedImage) return;
    setActionError(null);
    setStep("analyzing");
    try {
      const result = await api.analyzeScan(capturedImage);
      setDetection(result.detection);
      setStep("confirm");
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : "We couldn't analyze that photo. Please try again.");
      setStep("preview");
    }
  }

  function toggleDetectionKey(key: keyof ScanDetectionResult) {
    setDetection((prev) => (prev ? { ...prev, [key]: !prev[key] } : prev));
  }

  async function handleConfirm() {
    if (!detection) return;
    setActionError(null);
    setStep("saving");
    try {
      const result = await api.confirmScan({
        detection,
        savePhoto,
        imageDataUrl: savePhoto ? (capturedImage ?? undefined) : undefined,
      });
      applyProfile(result.profile);
      navigate("/home", { replace: true });
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : "We couldn't save that. Please try again.");
      setStep("confirm");
    }
  }

  if (step === "consent") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-10">
        <BackButton />
        <div className="flex flex-col items-center gap-3 text-center">
          <span aria-hidden="true" style={{ fontSize: "3rem" }}>
            📷
          </span>
          <h1 className="font-bold" style={{ fontSize: "var(--text-xl)" }}>
            Scan my space
          </h1>
        </div>
        <Card className="flex flex-col gap-3">
          <p style={{ fontSize: "var(--text-body)" }}>
            We'll ask to use your camera to take one photo of your space. That photo is sent to an
            AI service to look for things like a staircase, a chair, or a resistance band — then we
            suggest exercises that match what you actually have on hand.
          </p>
          <p style={{ fontSize: "var(--text-body)" }}>
            We don't keep the photo afterward unless you choose to save it. You'll see exactly what
            we found before anything changes, and you can fix anything we got wrong.
          </p>
        </Card>
        <Button onClick={handleAcceptConsent}>Continue</Button>
      </main>
    );
  }

  if (step === "camera") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-6 py-10">
        <BackButton />
        <h1 className="font-bold" style={{ fontSize: "var(--text-xl)" }}>
          Scan my space
        </h1>
        {cameraError ? (
          <Card className="flex flex-col gap-3">
            <p style={{ fontSize: "var(--text-body)", color: "var(--color-caution-fg)" }}>{cameraError}</p>
            <Button variant="secondary" onClick={() => navigate("/library")}>
              Browse the library instead
            </Button>
          </Card>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl border-2" style={{ borderColor: "var(--color-border)" }}>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video ref={videoRef} autoPlay playsInline muted className="w-full" />
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
              Point your camera at the space where you'll be exercising, then take a photo.
            </p>
            <Button onClick={handleCapture}>Take photo</Button>
          </>
        )}
      </main>
    );
  }

  if (step === "preview" && capturedImage) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-6 py-10">
        <BackButton />
        <h1 className="font-bold" style={{ fontSize: "var(--text-xl)" }}>
          Look good?
        </h1>
        <img
          src={capturedImage}
          alt="Preview of your captured space"
          className="rounded-2xl border-2"
          style={{ borderColor: "var(--color-border)" }}
        />
        {actionError ? (
          <p role="alert" style={{ fontSize: "var(--text-sm)", color: "var(--color-caution-fg)" }}>
            {actionError}
          </p>
        ) : null}
        <Button onClick={handleUsePhoto}>Use this photo</Button>
        <Button variant="secondary" onClick={handleRetake}>
          Retake
        </Button>
      </main>
    );
  }

  if (step === "analyzing" || step === "saving") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 py-10 text-center">
        <p style={{ fontSize: "var(--text-body)" }}>
          {step === "analyzing" ? "Looking at your space..." : "Saving..."}
        </p>
      </main>
    );
  }

  if (step === "confirm" && detection) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-6 py-10">
        <BackButton />
        <div className="flex flex-col gap-1">
          <h1 className="font-bold" style={{ fontSize: "var(--text-xl)" }}>
            Here's what we found
          </h1>
          <p style={{ fontSize: "var(--text-body)", color: "var(--color-fg-muted)" }}>
            Tap anything we got wrong to fix it.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {SCAN_DETECTION_KEYS.map((key) => (
            <SelectableChip key={key} selected={detection[key]} onToggle={() => toggleDetectionKey(key)}>
              {SCAN_DETECTION_LABELS[key]}
            </SelectableChip>
          ))}
        </div>

        <ToggleSwitch
          checked={savePhoto}
          onChange={setSavePhoto}
          label="Save this photo"
          description="Off by default. Turn this on if you'd like us to keep it for later."
        />

        {actionError ? (
          <p role="alert" style={{ fontSize: "var(--text-sm)", color: "var(--color-caution-fg)" }}>
            {actionError}
          </p>
        ) : null}

        <Button onClick={handleConfirm}>Looks good</Button>
      </main>
    );
  }

  return null;
}
