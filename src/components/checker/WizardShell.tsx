"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PRELOADED_SCHOOLS, getOriginSchoolName } from "@/data/mockData";
import { useProfile } from "@/context/StudentProfileContext";
import type { DualEnrollmentCourse, WizardStep } from "@/types";
import { SchoolSelector } from "@/components/checker/SchoolSelector";
import { CourseEntry } from "@/components/checker/CourseEntry";
import { OriginStoryStep } from "@/components/checker/OriginStoryStep";
import { StoryStep } from "@/components/checker/StoryStep";
import { ResultsTable } from "@/components/checker/ResultsTable";
import { CompareView } from "@/components/checker/CompareView";
import { AiAdvisorTab } from "@/components/checker/AiAdvisorTab";
import { ReportProgressGauge } from "@/components/checker/ReportProgressGauge";
import { RequirementTracker } from "@/components/checker/RequirementTracker";
import { PDFReport } from "@/components/checker/PDFReport";
import { SaveProgressModal } from "@/components/checker/SaveProgressModal";
import {
  RetroButton,
  RetroButtonOutline,
  retroHeadingStyle,
  stepMotion,
} from "@/components/checker/RetroButtons";

type ResultsTab = "all" | "compare" | "advisor";

function BackToStartLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-black uppercase tracking-widest text-[#4a4a4a] underline-offset-2 hover:text-[#c0392b] hover:underline"
    >
      ← Back to Start
    </button>
  );
}

export function WizardShell() {
  const { profile, setProfile, isLoaded } = useProfile();
  const [resultsTab, setResultsTab] = useState<ResultsTab>("all");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [trackerSchoolId, setTrackerSchoolId] = useState("");

  const step = profile.wizardStep;

  const setStep = (nextStep: WizardStep) => {
    setProfile((previous) => ({ ...previous, wizardStep: nextStep }));
  };

  const goToStart = () => setStep("name");

  const selectedSchools = useMemo(
    () =>
      PRELOADED_SCHOOLS.filter((school) =>
        profile.targetSchoolIds.includes(school.id),
      ),
    [profile.targetSchoolIds],
  );

  const firstSchool = selectedSchools[0]?.name ?? "your target school";
  const trackerSchool =
    selectedSchools.find((school) => school.id === trackerSchoolId) ??
    selectedSchools[0];
  const activeTrackerSchoolId = trackerSchool?.id ?? selectedSchools[0]?.id ?? "";
  const activeTrackerSchoolName = trackerSchool?.name ?? firstSchool;

  const handleSchoolsChange = (targetSchoolIds: string[]) => {
    setProfile((previous) => ({
      ...previous,
      targetSchoolIds,
      schools: PRELOADED_SCHOOLS.filter((school) =>
        targetSchoolIds.includes(school.id),
      ),
    }));
  };

  const handleNameConfirm = () => {
    setStep("schools");
  };

  const handleCoursesChange = (courses: DualEnrollmentCourse[]) => {
    setProfile((previous) => {
      const wasEmpty = previous.courses.length === 0;
      const isAdding = courses.length > previous.courses.length;

      if (
        isAdding &&
        wasEmpty &&
        !previous.username &&
        !previous.savePromptDismissed &&
        !previous.accountCreated
      ) {
        setShowSaveModal(true);
      }

      return { ...previous, courses };
    });
  };

  const handleAccountCreated = (username: string) => {
    setProfile((previous) => ({
      ...previous,
      username,
      accountCreated: true,
    }));
  };

  const handleSavePromptSkip = () => {
    setProfile((previous) => ({
      ...previous,
      savePromptDismissed: true,
    }));
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="border-4 border-[#1a1a2e] bg-white px-8 py-6 text-center shadow-[4px_4px_0px_#1a1a2e]">
          <div className="mx-auto mb-4 dett-pixel-spinner" />
          <p className="text-sm font-black uppercase tracking-widest text-[#1a1a2e]">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {showSaveModal ? (
        <SaveProgressModal
          onClose={() => setShowSaveModal(false)}
          onAccountCreated={handleAccountCreated}
          onSkip={handleSavePromptSkip}
        />
      ) : null}

      <AnimatePresence mode="wait">
        {step === "name" && (
          <motion.div key="step-name" {...stepMotion}>
            <div className="mb-8">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-[#c0392b]">
                Step 1A
              </p>
              <h1
                className="mb-2 text-3xl font-black uppercase text-[#1a1a2e] md:text-4xl"
                style={retroHeadingStyle}
              >
                Tell Us About You
              </h1>
              <p className="text-sm tracking-wide text-[#4a4a4a]">
                Let&apos;s make this personal before we get started.
              </p>
            </div>

            <div className="max-w-md space-y-6 border-4 border-[#1a1a2e] bg-white p-8 shadow-[6px_6px_0px_#1a1a2e]">
              <div>
                <label className="mb-3 block text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
                  First Name *
                </label>
                <input
                  autoFocus
                  type="text"
                  value={profile.displayName}
                  onChange={(event) =>
                    setProfile((previous) => ({
                      ...previous,
                      displayName: event.target.value,
                    }))
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      profile.displayName.trim().length > 0
                    ) {
                      handleNameConfirm();
                    }
                  }}
                  placeholder="e.g. Jordan"
                  className="w-full border-4 border-[#1a1a2e] bg-[#f5f0e8] px-4 py-3 text-lg font-black uppercase tracking-widest text-[#1a1a2e] placeholder:normal-case placeholder:tracking-normal placeholder:text-[#aaa] focus:border-[#c0392b] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-3 block text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
                  Intended Major{" "}
                  <span className="font-normal normal-case tracking-normal text-[#aaa]">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={profile.intendedMajor}
                  onChange={(event) =>
                    setProfile((previous) => ({
                      ...previous,
                      intendedMajor: event.target.value,
                    }))
                  }
                  placeholder="e.g. Computer Science"
                  className="w-full border-4 border-[#1a1a2e] bg-[#f5f0e8] px-4 py-3 text-sm font-bold text-[#1a1a2e] placeholder:font-normal placeholder:text-[#aaa] focus:border-[#c0392b] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <RetroButton
                disabled={!profile.displayName.trim()}
                onClick={handleNameConfirm}
              >
                Next <ArrowRight className="h-4 w-4" />
              </RetroButton>
            </div>
          </motion.div>
        )}

        {step === "schools" && (
          <motion.div key="step-schools" {...stepMotion}>
            <div className="mb-8">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-[#c0392b]">
                Step 1B
              </p>
              <h1
                className="mb-2 text-3xl font-black uppercase text-[#1a1a2e] md:text-4xl"
                style={retroHeadingStyle}
              >
                Where Are You Applying?
              </h1>
              <p className="text-sm tracking-wide text-[#4a4a4a]">
                Select all the colleges you&apos;re considering.
              </p>
            </div>

            <SchoolSelector
              schools={PRELOADED_SCHOOLS}
              selected={profile.targetSchoolIds}
              onChange={handleSchoolsChange}
            />

            <div className="mt-10 space-y-3">
              <BackToStartLink onClick={goToStart} />
              <div className="flex justify-between">
                <RetroButtonOutline onClick={goToStart}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </RetroButtonOutline>
                <RetroButton
                  disabled={profile.targetSchoolIds.length === 0}
                  onClick={() => setStep("origin")}
                >
                  Next <ArrowRight className="h-4 w-4" />
                </RetroButton>
              </div>
            </div>
          </motion.div>
        )}

        {step === "origin" && (
          <motion.div key="step-origin" {...stepMotion}>
            <OriginStoryStep
              studentName={profile.displayName}
              onContinue={() => setStep("story")}
              onBack={() => setStep("schools")}
              onBackToStart={goToStart}
            />
          </motion.div>
        )}

        {step === "story" && (
          <motion.div key="step-story" {...stepMotion}>
            <StoryStep
              studentName={profile.displayName}
              onContinue={() => setStep("courses")}
              onBack={() => setStep("origin")}
            />
            <div className="mt-4">
              <BackToStartLink onClick={goToStart} />
            </div>
          </motion.div>
        )}

        {step === "courses" && (
          <motion.div key="step-courses" {...stepMotion}>
            <div className="mb-8">
              <div className="mb-4 inline-block border-4 border-[#1a1a2e] bg-[#f5c842] px-5 py-2 shadow-[4px_4px_0px_#1a1a2e]">
                <p className="text-sm font-black uppercase tracking-wider text-[#1a1a2e]">
                  Hi {profile.displayName.trim()}! Let&apos;s see what classes
                  transfer to{" "}
                  <span className="text-[#c0392b]">{firstSchool}</span>
                </p>
              </div>
              <h1
                className="mb-2 text-3xl font-black uppercase text-[#1a1a2e] md:text-4xl"
                style={retroHeadingStyle}
              >
                What Are You Taking?
              </h1>
              <p className="text-sm tracking-wide text-[#4a4a4a]">
                Add your dual enrollment courses.
              </p>
              {profile.username ? (
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#4a4a4a]">
                  Saved as @{profile.username}
                </p>
              ) : null}
            </div>

            <CourseEntry
              selectedCourses={profile.courses}
              onChange={handleCoursesChange}
              originSchoolId={profile.originSchoolId}
              onOriginSchoolChange={(originSchoolId) =>
                setProfile((previous) => ({ ...previous, originSchoolId }))
              }
            />

            <div className="mt-10 space-y-3">
              <BackToStartLink onClick={goToStart} />
              <div className="flex justify-between">
                <RetroButtonOutline onClick={() => setStep("story")}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </RetroButtonOutline>
                <RetroButton
                  disabled={profile.courses.length === 0}
                  onClick={() => setStep("results")}
                >
                  See Results <ArrowRight className="h-4 w-4" />
                </RetroButton>
              </div>
            </div>
          </motion.div>
        )}

        {step === "results" && (
          <motion.div key="step-results" {...stepMotion}>
            <div className="mb-6">
              <div className="mb-4 inline-block border-4 border-[#1a1a2e] bg-[#1a1a2e] px-5 py-2">
                <p className="text-sm font-black uppercase tracking-wider text-[#f5c842]">
                  {profile.displayName.trim()}&apos;s Transfer Report
                  {profile.intendedMajor ? (
                    <span className="ml-2 text-[#f5c842]/60">
                      · {profile.intendedMajor}
                    </span>
                  ) : null}
                </p>
              </div>
              <h1
                className="mb-2 text-3xl font-black uppercase text-[#1a1a2e] md:text-4xl"
                style={retroHeadingStyle}
              >
                Your Transfer Results
              </h1>
              <p className="text-sm text-[#4a4a4a]">
                Here&apos;s how your courses transfer to each of your target
                schools.
              </p>
            </div>

            <ReportProgressGauge
              selectedCourses={profile.courses}
              intendedMajor={profile.intendedMajor}
              targetSchoolId={activeTrackerSchoolId}
              targetSchoolName={activeTrackerSchoolName}
              originSchoolId={profile.originSchoolId}
            />

            <RequirementTracker
              selectedSchools={selectedSchools}
              selectedCourses={profile.courses}
              intendedMajor={profile.intendedMajor}
              originSchoolName={getOriginSchoolName(profile.originSchoolId)}
              originSchoolId={profile.originSchoolId}
              targetSchoolId={activeTrackerSchoolId}
              onTargetSchoolChange={setTrackerSchoolId}
            />

            <div className="mb-0 mt-6 flex max-w-full flex-wrap border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <button
                type="button"
                onClick={() => setResultsTab("all")}
                className={`border-r-4 border-black px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors sm:px-5 sm:text-xs ${
                  resultsTab === "all"
                    ? "bg-[#1a1a2e] text-emerald-400"
                    : "bg-[#f5f0e8] text-[#1a1a2e] hover:bg-emerald-50"
                }`}
              >
                All Schools
              </button>
              <button
                type="button"
                onClick={() => setResultsTab("compare")}
                className={`border-r-4 border-black px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors sm:px-5 sm:text-xs ${
                  resultsTab === "compare"
                    ? "bg-[#1a1a2e] text-emerald-400"
                    : "bg-[#f5f0e8] text-[#1a1a2e] hover:bg-emerald-50"
                }`}
              >
                Compare
              </button>
              <button
                type="button"
                onClick={() => setResultsTab("advisor")}
                className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors sm:px-5 sm:text-xs ${
                  resultsTab === "advisor"
                    ? "bg-[#1a1a2e] text-emerald-400"
                    : "bg-[#f5f0e8] text-[#1a1a2e] hover:bg-emerald-50"
                }`}
              >
                AI Advisor
              </button>
            </div>

            {resultsTab === "all" ? (
              <ResultsTable
                selectedSchools={selectedSchools}
                selectedCourses={profile.courses}
                originSchoolId={profile.originSchoolId}
              />
            ) : null}
            {resultsTab === "compare" ? (
              <CompareView
                selectedSchools={selectedSchools}
                selectedCourses={profile.courses}
                originSchoolId={profile.originSchoolId}
              />
            ) : null}
            {resultsTab === "advisor" ? (
              <AiAdvisorTab
                displayName={profile.displayName}
                intendedMajor={profile.intendedMajor}
                selectedSchools={selectedSchools}
                selectedCourses={profile.courses}
                originSchoolId={profile.originSchoolId}
              />
            ) : null}

            <div className="mt-8 space-y-3">
              <BackToStartLink onClick={goToStart} />
              <div className="flex flex-wrap items-center gap-4">
                <RetroButtonOutline onClick={() => setStep("courses")}>
                  <ArrowLeft className="h-4 w-4" /> Edit Courses
                </RetroButtonOutline>
                <PDFReport
                  studentName={profile.displayName.trim()}
                  selectedSchools={selectedSchools}
                  selectedCourses={profile.courses}
                  intendedMajor={profile.intendedMajor}
                  originSchoolId={profile.originSchoolId}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 border-4 border-[#1a1a2e] bg-[#1a1a2e] px-6 py-4 shadow-[4px_4px_0px_#f5c842]">
              <span className="text-lg text-[#f5c842]">★</span>
              <p className="text-xs font-black uppercase tracking-widest text-[#f5c842]">
                Your roadmap to your dream school. Download your report and
                share it with your counselor or advisor.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
