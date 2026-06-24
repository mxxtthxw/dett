"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { groupCoursesByRequirement } from "@/lib/requirements";
import { getRequirementProgress } from "@/lib/requirementProgress";
import type { DualEnrollmentCourse, School } from "@/types";

interface RequirementTrackerProps {
  selectedSchools: School[];
  selectedCourses: DualEnrollmentCourse[];
  intendedMajor: string;
  originSchoolName: string;
  originSchoolId?: string;
  compact?: boolean;
  targetSchoolId?: string;
  onTargetSchoolChange?: (schoolId: string) => void;
}

const CATEGORY_META = {
  core: {
    title: "Core General Ed",
    hint: "English, history, math, and social science foundations",
    accent: "bg-emerald-50/60",
  },
  major: {
    title: "Major Prerequisites",
    hint: "Courses aligned with your intended field of study",
    accent: "bg-[#f5f0e8]",
  },
  elective: {
    title: "General Electives",
    hint: "Flexible credit or courses pending review",
    accent: "bg-[#f5f0e8]",
  },
} as const;

export function RequirementTracker({
  selectedSchools,
  selectedCourses,
  intendedMajor,
  originSchoolName,
  originSchoolId,
  compact = false,
  targetSchoolId: controlledSchoolId,
  onTargetSchoolChange,
}: RequirementTrackerProps) {
  const [internalSchoolId, setInternalSchoolId] = useState(
    selectedSchools[0]?.id ?? "",
  );

  const targetSchoolId = controlledSchoolId ?? internalSchoolId;

  const handleSchoolChange = (schoolId: string) => {
    if (onTargetSchoolChange) {
      onTargetSchoolChange(schoolId);
    } else {
      setInternalSchoolId(schoolId);
    }
  };

  const totalCredits = selectedCourses.reduce(
    (sum, course) => sum + course.credits,
    0,
  );

  const buckets = useMemo(
    () =>
      groupCoursesByRequirement(
        selectedCourses,
        intendedMajor,
        targetSchoolId || undefined,
        originSchoolId,
      ),
    [intendedMajor, originSchoolId, selectedCourses, targetSchoolId],
  );

  const progress = useMemo(
    () => getRequirementProgress(buckets),
    [buckets],
  );

  const targetSchool = selectedSchools.find(
    (school) => school.id === targetSchoolId,
  );

  if (selectedCourses.length === 0) {
    return (
      <div className="border-4 border-black bg-[#f4f1ea] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-xs font-black uppercase tracking-wider text-[#1a1a2e]">
          University Requirement Tracker
        </p>
        <p className="mt-2 text-xs text-[#4a4a4a]">
          Add DE courses in the checker to categorize up to 30+ credit hours
          into core, major, and elective blocks.
        </p>
        <Link
          href="/checker"
          className="mt-3 inline-block border-4 border-black bg-[#c0392b] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          Open Checker
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
        compact ? "p-5" : "border-t-0 p-4"
      }`}
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#c0392b]">
            University Requirement Tracker
          </p>
          <h2 className="text-lg font-black uppercase text-[#1a1a2e]">
            What Your DE Classes Cover
          </h2>
          <p className="mt-1 text-xs text-[#4a4a4a]">
            <span className="dett-live-value font-black">{totalCredits}</span>{" "}
            credit hours analyzed from{" "}
            <span className="font-bold text-[#1a1a2e]">{originSchoolName}</span>{" "}
            across{" "}
            <span className="font-bold">{selectedCourses.length}</span> courses
          </p>
        </div>
        {selectedSchools.length > 0 ? (
          <label className="block min-w-[220px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1a1a2e]">
              Track Against
            </span>
            <select
              value={targetSchoolId}
              onChange={(event) => handleSchoolChange(event.target.value)}
              className="mt-1 w-full border-4 border-black bg-[#f5f0e8] px-3 py-2 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:border-[#c0392b] focus:outline-none"
            >
              {selectedSchools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {targetSchool ? (
        <p className="mb-4 text-xs text-[#4a4a4a]">
          Baseline boxes checked for{" "}
          <strong className="text-[#1a1a2e]">{targetSchool.name}</strong>
          {intendedMajor ? (
            <>
              {" "}
              · major: <strong>{intendedMajor}</strong>
            </>
          ) : null}
          {" · "}
          <span className="dett-live-value font-black">
            {progress.satisfiedCount}/3 blocks live
          </span>
        </p>
      ) : null}

      <div className={`grid gap-4 ${compact ? "md:grid-cols-1" : "lg:grid-cols-3"}`}>
        {(Object.keys(CATEGORY_META) as Array<keyof typeof CATEGORY_META>).map(
          (key) => {
            const meta = CATEGORY_META[key];
            const items = buckets[key];

            return (
              <div
                key={key}
                className={`border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${meta.accent}`}
              >
                <div className="mb-3 border-b-4 border-black pb-2">
                  <p className="text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
                    {meta.title}
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-[#4a4a4a]">
                    {meta.hint}
                  </p>
                </div>

                {items.length === 0 ? (
                  <p className="text-xs font-bold uppercase tracking-wider text-[#aaa]">
                    None yet
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {items.map(({ course, acceptedAtTarget }) => (
                      <li
                        key={course.id}
                        className="flex items-start gap-2 text-sm font-bold text-[#1a1a2e]"
                      >
                        <span aria-hidden className={acceptedAtTarget ? "dett-live-value" : ""}>
                          {acceptedAtTarget ? "✅" : "⚠️"}
                        </span>
                        <span>
                          <span
                            className={
                              acceptedAtTarget ? "dett-live-value" : "text-[#4a4a4a]"
                            }
                          >
                            {course.courseCode}
                          </span>
                          <span className="block text-[10px] font-normal text-[#4a4a4a]">
                            {course.courseName} ·{" "}
                            <span className="dett-live-value font-bold">
                              {course.credits} cr
                            </span>
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
