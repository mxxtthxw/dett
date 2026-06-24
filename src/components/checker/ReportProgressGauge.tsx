"use client";

import { useMemo } from "react";
import {
  getRequirementProgress,
} from "@/lib/requirementProgress";
import { groupCoursesByRequirement } from "@/lib/requirements";
import type { DualEnrollmentCourse } from "@/types";

interface ReportProgressGaugeProps {
  selectedCourses: DualEnrollmentCourse[];
  intendedMajor: string;
  targetSchoolId: string;
  targetSchoolName: string;
  originSchoolId?: string;
}

export function ReportProgressGauge({
  selectedCourses,
  intendedMajor,
  targetSchoolId,
  targetSchoolName,
  originSchoolId,
}: ReportProgressGaugeProps) {
  const totalCredits = selectedCourses.reduce(
    (sum, course) => sum + course.credits,
    0,
  );

  const progress = useMemo(() => {
    const buckets = groupCoursesByRequirement(
      selectedCourses,
      intendedMajor,
      targetSchoolId,
      originSchoolId,
    );
    return getRequirementProgress(buckets);
  }, [intendedMajor, originSchoolId, selectedCourses, targetSchoolId]);

  const segments = [
    { label: "Core Gen Ed", done: progress.coreSatisfied },
    { label: "Major Prereqs", done: progress.majorSatisfied },
    { label: "Electives", done: progress.electiveSatisfied },
  ];

  return (
    <div className="mb-6 border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#c0392b]">
            Requirement Progress
          </p>
          <p className="text-sm font-black uppercase text-[#1a1a2e]">
            {targetSchoolName} ·{" "}
            <span className="dett-live-value">{totalCredits}</span> DE credit hours
          </p>
        </div>
        <p className="text-2xl font-black dett-live-value">
          {progress.percentage}%
        </p>
      </div>

      <div className="mb-3 h-4 overflow-hidden border-4 border-black bg-[#f5f0e8] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div
          className="dett-live-fill h-full transition-all duration-700"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={`border-4 border-black px-3 py-2 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              segment.done ? "bg-emerald-50" : "bg-[#f5f0e8]"
            }`}
          >
            <p
              className={`text-[10px] font-black uppercase tracking-wider ${
                segment.done ? "dett-live-value" : "text-[#4a4a4a]"
              }`}
            >
              {segment.done ? "✓" : "○"} {segment.label}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[10px] uppercase tracking-widest text-[#4a4a4a]">
        {progress.satisfiedCount} of {progress.totalCategories} requirement
        blocks satisfied
      </p>
    </div>
  );
}
