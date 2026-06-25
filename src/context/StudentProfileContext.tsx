"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { isAuthenticatedProfile } from "@/lib/accounts";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import type { StudentProfile, WizardStep } from "@/types";

interface StudentProfileContextValue {
  profile: StudentProfile;
  setProfile: ReturnType<typeof useStudentProfile>["setProfile"];
  resetProfile: ReturnType<typeof useStudentProfile>["resetProfile"];
  login: ReturnType<typeof useStudentProfile>["login"];
  isLoaded: boolean;
  isAuthenticated: boolean;
  goToStep: (step: WizardStep) => void;
}

const StudentProfileContext = createContext<StudentProfileContextValue | null>(
  null,
);

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  const { profile, setProfile, resetProfile, login, isLoaded } =
    useStudentProfile();

  const isAuthenticated = useMemo(
    () => isAuthenticatedProfile(profile),
    [profile],
  );

  const goToStep = (step: WizardStep) => {
    setProfile((previous) => ({ ...previous, wizardStep: step }));
  };

  return (
    <StudentProfileContext.Provider
      value={{
        profile,
        setProfile,
        resetProfile,
        login,
        isLoaded,
        isAuthenticated,
        goToStep,
      }}
    >
      {children}
    </StudentProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(StudentProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within StudentProfileProvider");
  }

  return context;
}

export function useOptionalProfile() {
  return useContext(StudentProfileContext);
}
