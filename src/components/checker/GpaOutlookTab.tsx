"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import {
  HS_CREDITS_PER_YEAR_HINT,
  predictSemesterGpaAllAs,
} from "@/lib/gpaOutlook";

interface GpaOutlookTabProps {
  currentGpa?: number;
  hsCredits?: number;
  semesterCollegeCredits?: number;
  completedDeCredits: number;
  onChange: (values: {
    currentGpa?: number;
    hsCredits?: number;
    semesterCollegeCredits?: number;
  }) => void;
}

function parseOptionalNumber(value: string): number | undefined {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function GpaOutlookTab({
  currentGpa,
  hsCredits,
  semesterCollegeCredits,
  completedDeCredits,
  onChange,
}: GpaOutlookTabProps) {
  const result = useMemo(() => {
    if (
      currentGpa === undefined ||
      hsCredits === undefined ||
      semesterCollegeCredits === undefined ||
      hsCredits <= 0
    ) {
      return null;
    }

    return predictSemesterGpaAllAs({
      currentGpa,
      hsCredits,
      semesterCollegeCredits,
      completedDeCredits,
    });
  }, [completedDeCredits, currentGpa, hsCredits, semesterCollegeCredits]);

  const changeLabel =
    result && result.gpaChange > 0
      ? `+${result.gpaChange.toFixed(3)}`
      : result
        ? result.gpaChange.toFixed(3)
        : null;

  return (
    <div className="border-4 border-t-0 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-5 max-w-xl">
        <div className="mb-2 inline-flex items-center gap-2 border-4 border-black bg-[#10b981] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <TrendingUp className="h-3.5 w-3.5" />
          GPA Outlook
        </div>
        <h2
          className="text-2xl font-black uppercase text-[#1a1a2e]"
          style={{
            fontFamily: "Georgia, serif",
            textShadow: "2px 2px 0px #10b981",
          }}
        >
          Semester GPA Forecast
        </h2>
        <p className="mt-2 text-sm text-[#4a4a4a]">
          See how your cumulative GPA could shift if you earn all A&apos;s on
          the college credits you take this semester.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1a1a2e]">
            Current GPA
          </span>
          <input
            type="number"
            min={0}
            max={4}
            step={0.01}
            value={currentGpa ?? ""}
            onChange={(event) =>
              onChange({ currentGpa: parseOptionalNumber(event.target.value) })
            }
            placeholder="e.g. 3.75"
            className="mt-1 w-full border-4 border-black bg-[#f5f0e8] px-3 py-2 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:border-[#10b981] focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1a1a2e]">
            High School Credits
          </span>
          <input
            type="number"
            min={0}
            step={1}
            value={hsCredits ?? ""}
            onChange={(event) =>
              onChange({ hsCredits: parseOptionalNumber(event.target.value) })
            }
            placeholder="e.g. 21"
            className="mt-1 w-full border-4 border-black bg-[#f5f0e8] px-3 py-2 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:border-[#10b981] focus:outline-none"
          />
          <p className="mt-1 text-[10px] leading-relaxed text-[#4a4a4a]">
            Not sure? Most students earn about{" "}
            <strong>{HS_CREDITS_PER_YEAR_HINT} credits per year</strong> (7 ×
            freshman + 7 × sophomore + 7 × junior = 21 total).
          </p>
        </label>

        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1a1a2e]">
            College Credits This Semester
          </span>
          <input
            type="number"
            min={0}
            step={1}
            value={semesterCollegeCredits ?? ""}
            onChange={(event) =>
              onChange({
                semesterCollegeCredits: parseOptionalNumber(event.target.value),
              })
            }
            placeholder="e.g. 12"
            className="mt-1 w-full border-4 border-black bg-[#f5f0e8] px-3 py-2 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:border-[#10b981] focus:outline-none"
          />
          <p className="mt-1 text-[10px] leading-relaxed text-[#4a4a4a]">
            Dual enrollment + any other college courses you&apos;re taking now.
          </p>
        </label>
      </div>

      {completedDeCredits > 0 ? (
        <p className="mt-4 text-xs text-[#4a4a4a]">
          Your DETT roadmap includes{" "}
          <strong className="dett-live-value">{completedDeCredits}</strong> DE
          credits already counted toward your prior credit total.
        </p>
      ) : null}

      {result ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="border-4 border-black bg-[#f4f1ea] px-4 py-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#4a4a4a]">
              Projected GPA (all A&apos;s)
            </p>
            <p className="dett-live-value mt-2 text-3xl font-black">
              {result.projectedGpa.toFixed(3)}
            </p>
          </div>
          <div className="border-4 border-black bg-[#f4f1ea] px-4 py-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#4a4a4a]">
              GPA Change
            </p>
            <p
              className={`mt-2 text-3xl font-black ${
                result.gpaChange >= 0 ? "dett-live-value" : "text-[#c0392b]"
              }`}
            >
              {changeLabel}
            </p>
          </div>
          <div className="border-4 border-black bg-[#f4f1ea] px-4 py-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#4a4a4a]">
              New Credit Total
            </p>
            <p className="mt-2 text-3xl font-black text-[#1a1a2e]">
              {result.newTotalCredits}
            </p>
            <p className="mt-1 text-[10px] text-[#4a4a4a]">
              {result.totalPreviousCredits} prior + {semesterCollegeCredits}{" "}
              this term
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 border-4 border-dashed border-black bg-[#f5f0e8] p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-black uppercase tracking-widest text-[#1a1a2e]">
            Enter your numbers above
          </p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#4a4a4a]">
            We&apos;ll calculate your projected cumulative GPA if every college
            credit this semester earns a 4.0.
          </p>
        </div>
      )}

      {result ? (
        <p className="mt-4 text-xs italic text-[#4a4a4a]">{result.assumption}</p>
      ) : null}
    </div>
  );
}
