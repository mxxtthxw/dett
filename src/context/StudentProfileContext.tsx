"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import type { StudentProfile, WizardStep } from "@/types";

interface StudentProfileContextValue {
  profile: StudentProfile;
  setProfile: ReturnType<typeof useStudentProfile>["setProfile"];
  resetProfile: ReturnType<typeof useStudentProfile>["resetProfile"];
  isLoaded: boolean;
  goToStep: (step: WizardStep) => void;
}

const StudentProfileContext = createContext<StudentProfileContextValue | null>(
  null,
);

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  const { profile, setProfile, resetProfile, isLoaded } = useStudentProfile();

  const goToStep = (step: WizardStep) => {
    setProfile((previous) => ({ ...previous, wizardStep: step }));
  };

  return (
    <StudentProfileContext.Provider
      value={{ profile, setProfile, resetProfile, isLoaded, goToStep }}
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
