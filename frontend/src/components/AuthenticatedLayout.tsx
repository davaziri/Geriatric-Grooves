import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { BottomNav } from "./ui/BottomNav";

export function AuthenticatedLayout() {
  const { status, profile } = useProfile();

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

  if (!profile.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
}
