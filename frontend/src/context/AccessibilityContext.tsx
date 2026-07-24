import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AccessibilityPrefs, FontSize } from "@geriatric-grooves/shared";

const STORAGE_KEY = "gg_accessibility_prefs";

function loadInitial(): AccessibilityPrefs {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AccessibilityPrefs;
  } catch {
    // Corrupt or inaccessible storage — fall through to defaults.
  }
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  return { fontSize: "large", highContrast: false, reduceMotion: prefersReduced };
}

interface AccessibilityContextValue extends AccessibilityPrefs {
  setFontSize: (size: FontSize) => void;
  setHighContrast: (value: boolean) => void;
  setReduceMotion: (value: boolean) => void;
  /** Replaces all prefs at once, e.g. when hydrating from the server profile. */
  setAll: (prefs: AccessibilityPrefs) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

// Mounted above auth/routing so the font-size and contrast controls work
// even on the sign-in screen, before an account exists.
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(loadInitial);

  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", prefs.fontSize);
    document.documentElement.setAttribute("data-contrast", prefs.highContrast ? "high" : "standard");
    document.documentElement.setAttribute("data-reduce-motion", String(prefs.reduceMotion));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  // Stable function identities are essential here: consumers (like
  // ProfileContext) depend on these in useCallback/useEffect dependency
  // arrays. Recreating them on every render previously caused an infinite
  // fetch loop (setAll -> setPrefs -> re-render -> new setAll -> effect
  // re-fires -> refetch -> setAll -> ...).
  const setFontSize = useCallback((fontSize: FontSize) => setPrefs((prev) => ({ ...prev, fontSize })), []);
  const setHighContrast = useCallback((highContrast: boolean) => setPrefs((prev) => ({ ...prev, highContrast })), []);
  const setReduceMotion = useCallback((reduceMotion: boolean) => setPrefs((prev) => ({ ...prev, reduceMotion })), []);
  const setAll = useCallback((next: AccessibilityPrefs) => setPrefs(next), []);

  const value = useMemo(
    () => ({ ...prefs, setFontSize, setHighContrast, setReduceMotion, setAll }),
    [prefs, setFontSize, setHighContrast, setReduceMotion, setAll],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
}
