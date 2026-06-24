"use client";

import { useMemo, useState } from "react";
import { summarizeSchoolCredits } from "@/lib/equivalencies";
import { NoMatchAlternativesButton } from "@/components/checker/NoMatchAlternativesButton";
import type { DualEnrollmentCourse, School, TransferStatus } from "@/types";

interface CompareViewProps {
  selectedSchools: School[];
  selectedCourses: DualEnrollmentCourse[];
  originSchoolId?: string;
}

function statusLabel(status: TransferStatus | undefined): string {
  if (status === "review") {
    return "Review";
  }

  if (status === "elective") {
    return "Elective";
  }

  return "Direct";
}

function statusClasses(status: TransferStatus | undefined): string {
  if (status === "review") {
    return "border-[#c0392b] bg-[#fff5f5] text-[#c0392b]";
  }

  if (status === "elective") {
    return "border-black bg-[#f5f0e8] text-[#1a1a2e]";
  }

  return "border-black bg-emerald-50 text-emerald-700";
}

function OutcomeCell({
  courseId,
  courseCode,
  outcomes,
  schoolId,
  schoolName,
}: {
  courseId: string;
  courseCode: string;
  outcomes: ReturnType<typeof summarizeSchoolCredits>["courseOutcomes"];
  schoolId: string;
  schoolName: string;
}) {
  const outcome = outcomes.find((entry) => entry.course.id === courseId);

  if (!outcome?.equivalency) {
    return (
      <div className="border-4 border-[#c0392b] bg-[#fff5f5] px-2 py-2 text-xs text-[#c0392b] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <p className="font-black">No Match</p>
        <p>0 cr</p>
        <NoMatchAlternativesButton
          courseId={courseId}
          courseCode={courseCode}
          schoolId={schoolId}
          schoolName={schoolName}
        />
      </div>
    );
  }

  const status = outcome.equivalency.status ?? "direct";
  const isLiveMatch = status === "direct" || status === "elective";

  return (
    <div
      className={`border-4 px-2 py-2 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${statusClasses(status)}`}
    >
      <p className={`font-black ${isLiveMatch ? "dett-live-value" : ""}`}>
        {outcome.equivalency.targetCourseCode}
      </p>
      <p className="line-clamp-2">{outcome.equivalency.targetCourseName}</p>
      <p className={`mt-1 font-bold ${isLiveMatch ? "dett-live-value" : ""}`}>
        {outcome.acceptedCredits} cr · {statusLabel(status)}
      </p>
    </div>
  );
}

function CreditTotaler({
  attempted,
  accepted,
  label,
}: {
  attempted: number;
  accepted: number;
  label: string;
}) {
  const percentage =
    attempted > 0 ? Math.round((accepted / attempted) * 100) : 0;

  return (
    <div className="border-4 border-black bg-[#1a1a2e] p-4 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-xs font-black uppercase tracking-widest">{label}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-[10px] uppercase opacity-70">Attempted</p>
          <p className="text-2xl font-black dett-live-value">{attempted}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase opacity-70">Accepted</p>
          <p className="text-2xl font-black dett-live-value">{accepted}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase opacity-70">Rate</p>
          <p className="text-2xl font-black dett-live-value">{percentage}%</p>
        </div>
      </div>
    </div>
  );
}

export function CompareView({
  selectedSchools,
  selectedCourses,
  originSchoolId,
}: CompareViewProps) {
  const [leftSchoolId, setLeftSchoolId] = useState(
    selectedSchools[0]?.id ?? "georgia-tech",
  );
  const [rightSchoolId, setRightSchoolId] = useState(
    selectedSchools[1]?.id ?? selectedSchools[0]?.id ?? "uga",
  );

  const leftSchool = selectedSchools.find((school) => school.id === leftSchoolId);
  const rightSchool = selectedSchools.find(
    (school) => school.id === rightSchoolId,
  );

  const leftSummary = useMemo(
    () =>
      summarizeSchoolCredits(selectedCourses, leftSchoolId, originSchoolId),
    [selectedCourses, leftSchoolId, originSchoolId],
  );

  const rightSummary = useMemo(
    () =>
      summarizeSchoolCredits(selectedCourses, rightSchoolId, originSchoolId),
    [selectedCourses, rightSchoolId, originSchoolId],
  );

  return (
    <div className="border-4 border-t-0 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
            Left School
          </span>
          <select
            value={leftSchoolId}
            onChange={(event) => setLeftSchoolId(event.target.value)}
            className="mt-1 w-full border-4 border-black bg-[#f5f0e8] px-3 py-2 text-sm font-bold text-[#1a1a2e] focus:border-[#c0392b] focus:outline-none"
          >
            {selectedSchools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
            Right School
          </span>
          <select
            value={rightSchoolId}
            onChange={(event) => setRightSchoolId(event.target.value)}
            className="mt-1 w-full border-4 border-black bg-[#f5f0e8] px-3 py-2 text-sm font-bold text-[#1a1a2e] focus:border-[#c0392b] focus:outline-none"
          >
            {selectedSchools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mb-4 grid gap-3 lg:grid-cols-2">
        <CreditTotaler
          attempted={leftSummary.attemptedCredits}
          accepted={leftSummary.acceptedCredits}
          label={leftSchool?.name ?? "Left"}
        />
        <CreditTotaler
          attempted={rightSummary.attemptedCredits}
          accepted={rightSummary.acceptedCredits}
          label={rightSchool?.name ?? "Right"}
        />
      </div>

      <div className="border-4 border-black bg-[#f5f0e8] p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-2 grid grid-cols-[1fr_auto_1fr] gap-2 border-b-4 border-black pb-2 text-center text-[10px] font-black uppercase tracking-widest text-[#1a1a2e]">
          <span>{leftSchool?.name}</span>
          <span>Your DE Course</span>
          <span>{rightSchool?.name}</span>
        </div>

        <div className="space-y-3">
          {selectedCourses.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2"
            >
              <OutcomeCell
                courseId={course.id}
                courseCode={course.courseCode}
                outcomes={leftSummary.courseOutcomes}
                schoolId={leftSchoolId}
                schoolName={leftSchool?.name ?? "Left School"}
              />
              <div className="flex min-w-[120px] flex-col items-center justify-center border-4 border-black bg-[#f5f0e8] px-2 py-2 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs font-black">{course.courseCode}</p>
                <p className="text-[10px] leading-tight">{course.courseName}</p>
                <p className="mt-1 text-[10px] font-bold dett-live-value">
                  {course.credits} cr
                </p>
              </div>
              <OutcomeCell
                courseId={course.id}
                courseCode={course.courseCode}
                outcomes={rightSummary.courseOutcomes}
                schoolId={rightSchoolId}
                schoolName={rightSchool?.name ?? "Right School"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
