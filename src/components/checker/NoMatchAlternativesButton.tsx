"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { getAlternativeEquivalents } from "@/lib/alternativeEquivalents";

interface NoMatchAlternativesButtonProps {
  courseId: string;
  courseCode: string;
  schoolId: string;
  schoolName: string;
}

export function NoMatchAlternativesButton({
  courseId,
  courseCode,
  schoolId,
  schoolName,
}: NoMatchAlternativesButtonProps) {
  const [open, setOpen] = useState(false);
  const alternatives = useMemo(
    () => getAlternativeEquivalents(courseId, schoolId),
    [courseId, schoolId],
  );

  if (schoolId !== "columbus-state") {
    return null;
  }

  return (
    <div className="relative mt-1">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 border-2 border-black bg-white px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#1a1a2e] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#f5f0e8]"
        aria-expanded={open}
        aria-label={`Alternative equivalents for ${courseCode} at ${schoolName}`}
      >
        <Info className="h-3 w-3" />
        Alt
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-56 border-4 border-black bg-[#f4f1ea] p-3 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black uppercase tracking-wider text-[#1a1a2e]">
            Click to see alternative course equivalents.
          </p>
          {alternatives.length === 0 ? (
            <p className="mt-2 text-[10px] leading-relaxed text-[#4a4a4a]">
              No mapped alternatives yet — try a similar DE catalog course and
              re-check.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {alternatives.map((alt) => (
                <li
                  key={`${alt.schoolId}-${alt.targetCourseCode}`}
                  className="border-2 border-black bg-white px-2 py-1.5 text-[10px]"
                >
                  <p className="font-black text-emerald-600">{alt.targetCourseCode}</p>
                  <p className="text-[#4a4a4a]">{alt.schoolName}</p>
                  <p className="text-[#4a4a4a]">{alt.targetCourseName}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
