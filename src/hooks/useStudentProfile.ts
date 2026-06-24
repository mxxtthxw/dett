"use client";

import { useCallback, useEffect, useState } from "react";
import { saveAccountProfile } from "@/lib/accounts";
import {
  createEmptyStudentProfile,
  type StudentProfile,
} from "@/types";

const STORAGE_KEY = "dett_profile";

const VALID_WIZARD_STEPS = [
  "schools",
  "origin",
  "name",
  "story",
  "courses",
  "results",
] as const;

function normalizeWizardStep(step: unknown): StudentProfile["wizardStep"] {
  if (
    typeof step === "string" &&
    VALID_WIZARD_STEPS.includes(step as StudentProfile["wizardStep"])
  ) {
    return step as StudentProfile["wizardStep"];
  }

  const legacyMap: Record<string, StudentProfile["wizardStep"]> = {
    setup: "schools",
    compare: "results",
    report: "results",
  };

  if (typeof step === "string" && legacyMap[step]) {
    return legacyMap[step];
  }

  return "name";
}

function normalizeProfile(raw: Partial<StudentProfile>): StudentProfile {
  const defaults = createEmptyStudentProfile();

  return {
    ...defaults,
    ...raw,
    displayName: raw.displayName ?? defaults.displayName,
    intendedMajor: raw.intendedMajor ?? defaults.intendedMajor,
    wizardStep: normalizeWizardStep(raw.wizardStep),
    schools: raw.schools ?? defaults.schools,
    courses: raw.courses ?? defaults.courses,
    equivalencies: raw.equivalencies ?? defaults.equivalencies,
    targetSchoolIds: raw.targetSchoolIds ?? defaults.targetSchoolIds,
    username: raw.username ?? defaults.username,
    accountCreated: raw.accountCreated ?? defaults.accountCreated,
    savePromptDismissed:
      raw.savePromptDismissed ?? defaults.savePromptDismissed,
    originSchoolId: raw.originSchoolId ?? defaults.originSchoolId,
  };
}

function readProfileFromStorage(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createEmptyStudentProfile();
    }

    return normalizeProfile(JSON.parse(raw) as Partial<StudentProfile>);
  } catch {
    return createEmptyStudentProfile();
  }
}

export function useStudentProfile() {
  const [profile, setProfileState] = useState(createEmptyStudentProfile);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProfileState(readProfileFromStorage());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

    if (profile.username && profile.accountCreated) {
      saveAccountProfile(profile.username, profile);
    }
  }, [profile, isLoaded]);

  const setProfile = useCallback(
    (
      next:
        | StudentProfile
        | ((previous: StudentProfile) => StudentProfile),
    ) => {
      setProfileState(next);
    },
    [],
  );

  const resetProfile = useCallback(() => {
    setProfileState(createEmptyStudentProfile());
  }, []);

  return {
    profile,
    setProfile,
    resetProfile,
    isLoaded,
  };
}
