import { Routes, Route } from "react-router-dom";
import { RootRedirect } from "./pages/RootRedirect";
import { SignInPage } from "./pages/SignInPage";
import { VerifyPage } from "./pages/VerifyPage";
import { OnboardingFlow } from "./pages/onboarding/OnboardingFlow";
import { HomePage } from "./pages/HomePage";
import { ScanPage } from "./pages/ScanPage";
import { ProgressPage } from "./pages/ProgressPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ExerciseLibraryPage } from "./pages/library/ExerciseLibraryPage";
import { ExerciseDetailPage } from "./pages/library/ExerciseDetailPage";
import { AuthenticatedLayout } from "./components/AuthenticatedLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/auth/verify" element={<VerifyPage />} />
      <Route path="/onboarding" element={<OnboardingFlow />} />

      <Route element={<AuthenticatedLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/library" element={<ExerciseLibraryPage />} />
        <Route path="/library/:id" element={<ExerciseDetailPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
