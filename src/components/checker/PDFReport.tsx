"use client";

import { useMemo } from "react";
import { summarizeSchoolCredits } from "@/lib/equivalencies";
import type { DualEnrollmentCourse, School, TransferStatus } from "@/types";
import { RetroButton } from "@/components/checker/RetroButtons";

interface PDFReportProps {
  studentName: string;
  selectedSchools: School[];
  selectedCourses: DualEnrollmentCourse[];
  intendedMajor?: string;
  originSchoolId?: string;
}

function statusLabel(status: TransferStatus | undefined): string {
  if (status === "review") {
    return "Review";
  }

  if (status === "elective") {
    return "Elective";
  }

  if (!status) {
    return "—";
  }

  return "Direct";
}

export function PDFReport({
  studentName,
  selectedSchools,
  selectedCourses,
  intendedMajor = "",
  originSchoolId,
}: PDFReportProps) {
  const schoolSummaries = useMemo(
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

  const totalAttempted = selectedCourses.reduce(
    (sum, course) => sum + course.credits,
    0,
  );

  const totalAcceptedAllSchools = schoolSummaries.reduce(
    (sum, entry) => sum + entry.summary.acceptedCredits,
    0,
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <RetroButton onClick={handlePrint}>Print / Save PDF</RetroButton>

      <article id="dett-print-report" className="dett-print-report print-only">
        <header className="dett-print-avoid-break border-b-4 border-black pb-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[#c0392b]">
            Dual Enrollment Transfer Tool
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-tight text-[#1a1a2e] md:text-4xl">
            DETT — Your Roadmap to Your Dream School
          </h1>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <p>
              <span className="text-xs uppercase">Student</span>
              <br />
              <strong className="text-xl">{studentName}</strong>
            </p>
            <p>
              <span className="text-xs uppercase">Intended Major</span>
              <br />
              <strong className="text-xl">{intendedMajor || "—"}</strong>
            </p>
          </div>
        </header>

        <section className="dett-print-avoid-break mt-8">
          <h2 className="mb-3 font-black uppercase">Target Universities</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {selectedSchools.map((school) => (
              <li key={school.id} className="border-2 border-black px-3 py-2 font-bold">
                {school.name}
                {school.state ? ` (${school.state})` : ""}
              </li>
            ))}
          </ul>
        </section>

        <section className="dett-print-avoid-break mt-8">
          <h2 className="mb-3 font-black uppercase">Dual Enrollment Courses</h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-black text-left uppercase">
                <th className="py-2 pr-3">Code</th>
                <th className="py-2 pr-3">Course</th>
                <th className="py-2">Credits</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourses.map((course) => (
                <tr key={course.id} className="border-b border-black/20">
                  <td className="py-2 pr-3 font-bold">{course.courseCode}</td>
                  <td className="py-2 pr-3">{course.courseName}</td>
                  <td className="py-2">{course.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {schoolSummaries.map(({ school, summary }, index) => (
          <section
            key={school.id}
            className={`mt-8 ${index > 0 ? "dett-print-page-break" : ""}`}
          >
            <h2 className="mb-3 font-black uppercase">
              {school.name} — Transfer Equivalencies
            </h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-black text-left text-xs uppercase">
                  <th className="py-2 pr-2">DE Course</th>
                  <th className="py-2 pr-2">Target Course</th>
                  <th className="py-2 pr-2">Status</th>
                  <th className="py-2">Accepted</th>
                </tr>
              </thead>
              <tbody>
                {summary.courseOutcomes.map((outcome) => (
                  <tr
                    key={`${school.id}-${outcome.course.id}`}
                    className="border-b border-black/20"
                  >
                    <td className="py-2 pr-2">
                      <span className="font-bold">{outcome.course.courseCode}</span>
                      <br />
                      <span className="text-xs">{outcome.course.courseName}</span>
                    </td>
                    <td className="py-2 pr-2">
                      {outcome.equivalency ? (
                        <>
                          <span className="font-bold">
                            {outcome.equivalency.targetCourseCode}
                          </span>
                          <br />
                          <span className="text-xs">
                            {outcome.equivalency.targetCourseName}
                          </span>
                        </>
                      ) : (
                        "No mapping"
                      )}
                    </td>
                    <td className="py-2 pr-2 uppercase">
                      {statusLabel(outcome.equivalency?.status)}
                    </td>
                    <td className="py-2">
                      {outcome.acceptedCredits} / {outcome.course.credits}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}

        <section className="dett-print-avoid-break mt-10 border-4 border-black p-6">
          <h2 className="mb-4 font-black uppercase">Total Credit Summary</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs uppercase">Total DE Attempted</p>
              <p className="text-3xl font-black">{totalAttempted}</p>
            </div>
            {schoolSummaries.map(({ school, summary }) => (
              <div key={school.id}>
                <p className="text-xs uppercase">{school.name}</p>
                <p className="text-2xl font-black">
                  {summary.acceptedCredits} / {summary.attemptedCredits} accepted
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs uppercase">
            Combined accepted credits across all targets: {totalAcceptedAllSchools}
          </p>
        </section>
      </article>
    </>
  );
}
