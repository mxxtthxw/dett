"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  MapPin,
  User,
} from "lucide-react";
import { PRELOADED_SCHOOLS, getOriginSchoolName } from "@/data/mockData";
import { useProfile } from "@/context/StudentProfileContext";
import { summarizeSchoolCredits } from "@/lib/equivalencies";
import { ReportProgressGauge } from "@/components/checker/ReportProgressGauge";
import { RequirementTracker } from "@/components/checker/RequirementTracker";
import { ResultsTable } from "@/components/checker/ResultsTable";
import {
  RetroButton,
  RetroButtonOutline,
} from "@/components/checker/RetroButtons";
import type { WizardStep } from "@/types";

const STEP_LABELS: Record<WizardStep, string> = {
  name: "Enter your name",
  schools: "Pick target schools",
  origin: "Origin story",
  story: "Noah's story",
  courses: "Add DE courses",
  results: "View transfer results",
};

function OverviewStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="border-4 border-black bg-[#f4f1ea] px-4 py-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-2 flex items-center gap-2 text-[#4a4a4a]">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-widest">
          {label}
        </p>
      </div>
      <p className="text-sm font-black text-[#1a1a2e]">{value}</p>
    </div>
  );
}

export function DashboardView() {
  const { profile, isAuthenticated, isLoaded } = useProfile();
  const [trackerSchoolId, setTrackerSchoolId] = useState("");

  const selectedSchools = useMemo(
    () =>
      PRELOADED_SCHOOLS.filter((school) =>
        profile.targetSchoolIds.includes(school.id),
      ),
    [profile.targetSchoolIds],
  );

  const trackerSchool =
    selectedSchools.find((school) => school.id === trackerSchoolId) ??
    selectedSchools[0];
  const activeTrackerSchoolId = trackerSchool?.id ?? selectedSchools[0]?.id ?? "";

  const totalCourseCredits = profile.courses.reduce(
    (sum, course) => sum + course.credits,
    0,
  );

  const schoolSummaries = useMemo(
    () =>
      selectedSchools.map((school) => ({
        school,
        summary: summarizeSchoolCredits(
          profile.courses,
          school.id,
          profile.originSchoolId,
        ),
      })),
    [profile.courses, profile.originSchoolId, selectedSchools],
  );

  if (!isLoaded) {
    return (
      <p className="text-sm font-black uppercase tracking-widest text-[#4a4a4a]">
        Loading your saved progress…
      </p>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="border-4 border-dashed border-black bg-[#f5f0e8] p-10 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-sm font-black uppercase tracking-widest text-[#1a1a2e]">
          Sign in to view your dashboard
        </p>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#4a4a4a]">
          Create an account while using the checker, or sign in from the homepage
          Welcome Back box.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/">
            <RetroButtonOutline>Back to Home</RetroButtonOutline>
          </Link>
          <Link href="/checker">
            <RetroButton>Start Checker</RetroButton>
          </Link>
        </div>
      </div>
    );
  }

  const hasProgress =
    profile.displayName.trim() ||
    profile.courses.length > 0 ||
    selectedSchools.length > 0;

  return (
    <div className="space-y-8">
      <section className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#10b981]">
              Saved Progress Dashboard
            </p>
            <h1
              className="mt-1 text-3xl font-black uppercase text-[#1a1a2e] md:text-4xl"
              style={{
                fontFamily: "Georgia, serif",
                textShadow: "3px 3px 0px #f5c842",
              }}
            >
              {profile.displayName.trim() || "Your Roadmap"}
            </h1>
            <p className="mt-2 text-sm text-[#4a4a4a]">
              Signed in as{" "}
              <strong className="text-[#1a1a2e]">@{profile.username}</strong>
              {profile.intendedMajor.trim()
                ? ` · ${profile.intendedMajor.trim()}`
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/checker">
              <RetroButton>
                Continue Checker
                <ArrowRight className="h-4 w-4" />
              </RetroButton>
            </Link>
            {profile.wizardStep === "results" && profile.courses.length > 0 ? (
              <Link href="/checker">
                <RetroButtonOutline>View Full Results</RetroButtonOutline>
              </Link>
            ) : null}
          </div>
        </div>

        <p className="mt-4 border-4 border-black bg-[#f5f0e8] px-4 py-3 text-xs text-[#4a4a4a]">
          <strong className="text-[#1a1a2e]">Last step:</strong>{" "}
          {STEP_LABELS[profile.wizardStep]}
        </p>
      </section>

      {!hasProgress ? (
        <section className="border-4 border-dashed border-black bg-[#f5f0e8] p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-black uppercase tracking-widest text-[#1a1a2e]">
            No courses saved yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#4a4a4a]">
            Head to the checker to pick schools and add your dual enrollment
            courses. Your dashboard will fill in automatically.
          </p>
          <Link href="/checker" className="mt-4 inline-block">
            <RetroButton>Check My Credits</RetroButton>
          </Link>
        </section>
      ) : (
        <>
          <section>
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
              Overview
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <OverviewStat
                label="Student"
                value={profile.displayName.trim() || "—"}
                icon={<User className="h-3.5 w-3.5" />}
              />
              <OverviewStat
                label="DE Courses"
                value={`${profile.courses.length} (${totalCourseCredits} cr)`}
                icon={<BookOpen className="h-3.5 w-3.5" />}
              />
              <OverviewStat
                label="Target Schools"
                value={
                  selectedSchools.length > 0
                    ? String(selectedSchools.length)
                    : "None yet"
                }
                icon={<GraduationCap className="h-3.5 w-3.5" />}
              />
              <OverviewStat
                label="DE Origin"
                value={getOriginSchoolName(profile.originSchoolId)}
                icon={<MapPin className="h-3.5 w-3.5" />}
              />
            </div>
          </section>

          {selectedSchools.length > 0 ? (
            <section className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-3 text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
                Target Colleges
              </h2>
              <ul className="flex flex-wrap gap-2">
                {selectedSchools.map((school) => (
                  <li
                    key={school.id}
                    className="border-2 border-black bg-[#f5f0e8] px-3 py-1.5 text-xs font-bold"
                  >
                    {school.name}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {profile.courses.length > 0 ? (
            <section className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-3 text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
                Dual Enrollment Courses
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-black text-left text-[10px] uppercase">
                      <th className="py-2 pr-3">Code</th>
                      <th className="py-2 pr-3">Course</th>
                      <th className="py-2">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.courses.map((course) => (
                      <tr
                        key={course.id}
                        className="border-b border-black/15 last:border-0"
                      >
                        <td className="py-2 pr-3 font-bold">
                          {course.courseCode}
                        </td>
                        <td className="py-2 pr-3">{course.courseName}</td>
                        <td className="py-2">{course.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {schoolSummaries.length > 0 && profile.courses.length > 0 ? (
            <section>
              <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
                Credit Breakdown
              </h2>
              <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {schoolSummaries.map(({ school, summary }) => (
                  <div
                    key={school.id}
                    className="border-4 border-black bg-[#f4f1ea] px-4 py-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#4a4a4a]">
                      {school.name}
                    </p>
                    <p className="mt-2 text-2xl font-black dett-live-value">
                      {summary.acceptedCredits}
                      <span className="text-base text-[#4a4a4a]">
                        {" "}
                        / {summary.attemptedCredits} accepted
                      </span>
                    </p>
                    {summary.reviewCredits > 0 ? (
                      <p className="mt-1 text-[10px] text-[#c0392b]">
                        {summary.reviewCredits} credits need review
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>

              {activeTrackerSchoolId ? (
                <>
                  <ReportProgressGauge
                    selectedCourses={profile.courses}
                    intendedMajor={profile.intendedMajor}
                    targetSchoolId={activeTrackerSchoolId}
                    targetSchoolName={trackerSchool?.name ?? "Target"}
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
                  <ResultsTable
                    selectedSchools={selectedSchools}
                    selectedCourses={profile.courses}
                    originSchoolId={profile.originSchoolId}
                  />
                </>
              ) : null}
            </section>
          ) : null}

          {profile.lastAdvisorAdvice ? (
            <section className="border-4 border-black bg-[#1a1a2e] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-3 text-xs font-black uppercase tracking-widest text-[#f5c842]">
                DETT Suggests
              </h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#f5c842]/90">
                {profile.lastAdvisorAdvice.replace(/^## /gm, "").slice(0, 600)}
                {profile.lastAdvisorAdvice.length > 600 ? "…" : ""}
              </p>
              <Link
                href="/checker"
                className="mt-4 inline-block text-xs font-black uppercase tracking-widest text-[#f5c842] underline-offset-2 hover:underline"
              >
                Open full advisor in checker →
              </Link>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
