import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { UserProfile } from "@geriatric-grooves/shared";
import { api, type ProfileUpdatePayload } from "../api/client";
import { useAccessibility } from "./AccessibilityContext";

export type AuthStatus = "loading" | "signed-out" | "signed-in";

interface ProfileContextValue {
  profile: UserProfile | null;
  status: AuthStatus;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: ProfileUpdatePayload) => Promise<void>;
  /** Merges in a profile already returned by another endpoint (e.g. completing
   * an exercise returns the updated streak/XP), skipping a redundant refetch. */
  applyProfile: (profile: UserProfile) => void;
  signOut: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const { setAll } = useAccessibility();

  const refreshProfile = useCallback(async () => {
    try {
      const { profile: loaded } = await api.getProfile();
      setProfile(loaded);
      setAll(loaded.accessibilityPrefs);
      setStatus("signed-in");
    } catch {
      setProfile(null);
      setStatus("signed-out");
    }
  }, [setAll]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const updateProfile = useCallback(async (patch: ProfileUpdatePayload) => {
    const { profile: updated } = await api.updateProfile(patch);
    setProfile(updated);
  }, []);

  const signOut = useCallback(async () => {
    await api.signOut();
    setProfile(null);
    setStatus("signed-out");
  }, []);

  const applyProfile = useCallback((next: UserProfile) => {
    setProfile(next);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, status, refreshProfile, updateProfile, applyProfile, signOut }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
