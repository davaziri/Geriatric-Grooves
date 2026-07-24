import type {
  AccessibilityPrefs,
  CompleteExerciseResult,
  DailyRoutine,
  Difficulty,
  Equipment,
  EnvironmentTag,
  Exercise,
  ExerciseFilters,
  PushSubscriptionPayload,
  RecentSessionDates,
  ScanConfirmPayload,
  ScanDetectionResult,
  TodaySessionStatus,
  UserProfile,
} from "@geriatric-grooves/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body.error ?? "Something went wrong. Please try again.", res.status);
  }
  return body as T;
}

export interface ProfileUpdatePayload {
  mobilityLevel?: Difficulty;
  equipmentOwned?: Equipment[];
  knownEnvironmentFeatures?: EnvironmentTag[];
  accessibilityPrefs?: Partial<AccessibilityPrefs>;
  onboardingCompleted?: boolean;
}

export const api = {
  requestMagicLink: (email: string) =>
    request<{ message: string; devMagicLink?: string }>("/api/auth/request-link", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  verifyMagicLink: (token: string) =>
    request<{ profile: UserProfile }>(`/api/auth/verify?token=${encodeURIComponent(token)}`),

  signOut: () => request<{ ok: true }>("/api/auth/sign-out", { method: "POST" }),

  getProfile: () => request<{ profile: UserProfile }>("/api/profile/me"),

  updateProfile: (patch: ProfileUpdatePayload) =>
    request<{ profile: UserProfile }>("/api/profile/me", {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),

  getExercises: (filters: ExerciseFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.difficulty) params.set("difficulty", String(filters.difficulty));
    if (filters.equipment) params.set("equipment", filters.equipment);
    const query = params.toString();
    return request<{ exercises: Exercise[] }>(`/api/exercises${query ? `?${query}` : ""}`);
  },

  getExercise: (id: string) => request<{ exercise: Exercise }>(`/api/exercises/${encodeURIComponent(id)}`),

  getTodayRoutine: () => request<DailyRoutine>("/api/routine/today"),

  getTodaySessionStatus: () => request<TodaySessionStatus>("/api/sessions/today"),

  getRecentSessionDates: (days = 35) => request<RecentSessionDates>(`/api/sessions/recent?days=${days}`),

  completeExercise: (exerciseId: string) =>
    request<CompleteExerciseResult>("/api/sessions/complete-exercise", {
      method: "POST",
      body: JSON.stringify({ exerciseId }),
    }),

  getVapidPublicKey: () => request<{ publicKey: string | null }>("/api/push/vapid-public-key"),

  subscribeToPush: (subscription: PushSubscriptionPayload, reminderTime: string) =>
    request<{ profile: UserProfile }>("/api/push/subscribe", {
      method: "POST",
      body: JSON.stringify({ subscription, reminderTime }),
    }),

  unsubscribeFromPush: (endpoint: string) =>
    request<{ profile: UserProfile }>("/api/push/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ endpoint }),
    }),

  updateReminderTime: (reminderTime: string) =>
    request<{ profile: UserProfile }>("/api/push/reminder-time", {
      method: "PATCH",
      body: JSON.stringify({ reminderTime }),
    }),

  analyzeScan: (imageDataUrl: string) =>
    request<{ detection: ScanDetectionResult }>("/api/scan/analyze", {
      method: "POST",
      body: JSON.stringify({ imageDataUrl }),
    }),

  confirmScan: (payload: ScanConfirmPayload) =>
    request<{ profile: UserProfile }>("/api/scan/confirm", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
