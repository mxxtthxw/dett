"use client";

import { useMemo } from "react";
import { summarizeSchoolCredits } from "@/lib/equivalencies";
import type { DualEnrollmentCourse, School } from "@/types";

interface ResultsTableProps {
  selectedSchools: School[];
  selectedCourses: DualEnrollmentCourse[];
  originSchoolId?: string;
}

export function ResultsTable({
  selectedSchools,
  selectedCourses,
  originSchoolId,
}: ResultsTableProps) {
  const summaries = useMemo(
    () =>
      selectedSchools.map((school) => ({
        school,
        summary: summarizeSchoolCredits(
          selectedCourses,
          school.id,
          originSchoolId,
        ),
      })),
    [originSchoolId, selectedCourses, selectedSchools],
  );

  const attemptedCredits = selectedCourses.reduce(
    (sum, course) => sum + course.credits,
    0,
  );

  const averageAccepted =
    summaries.length > 0
      ? Math.round(
          summaries.reduce(
            (sum, entry) => sum + entry.summary.acceptedCredits,
            0,
          ) / summaries.length,
        )
      : 0;

  const acceptanceRate =
    attemptedCredits > 0
      ? Math.round((averageAccepted / attemptedCredits) * 100)
      : 0;

  return (
    <div className="border-4 border-t-0 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-4 border-4 border-black bg-[#1a1a2e] p-4 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-xs font-black uppercase tracking-widest">
          Credit Totaler — All Target Schools (Average)
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase opacity-70">DE Attempted</p>
            <p className="text-3xl font-black dett-live-value">
              {attemptedCredits}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase opacity-70">Accepted</p>
            <p className="text-3xl font-black dett-live-value">
              {averageAccepted}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase opacity-70">Acceptance Rate</p>
            <p className="text-3xl font-black dett-live-value">
              {acceptanceRate}%
            </p>
          </div>
        </div>
        <div className="mt-3 h-3 overflow-hidden border-2 border-black bg-[#f5f0e8]">
          <div
            className="dett-live-fill h-full transition-all duration-500"
            style={{ width: `${acceptanceRate}%` }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-4 border-black text-left text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
              <th className="px-3 py-2">School</th>
              <th className="px-3 py-2">Attempted</th>
              <th className="px-3 py-2">Accepted</th>
              <th className="px-3 py-2">Direct</th>
              <th className="px-3 py-2">Elective</th>
              <th className="px-3 py-2">In Review</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map(({ school, summary }) => (
              <tr key={school.id} className="border-b border-black/20">
                <td className="px-3 py-3 font-bold text-[#1a1a2e]">
                  {school.name}
                </td>
                <td className="px-3 py-3 dett-live-value font-bold">
                  {summary.attemptedCredits}
                </td>
                <td className="px-3 py-3 font-black dett-live-value">
                  {summary.acceptedCredits}
                </td>
                <td className="px-3 py-3 dett-live-value font-bold">
                  {summary.directCredits}
                </td>
                <td className="px-3 py-3 font-bold text-[#1a1a2e]">
                  {summary.electiveCredits}
                </td>
                <td className="px-3 py-3 text-[#c0392b]/80">
                  {summary.reviewCredits}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
