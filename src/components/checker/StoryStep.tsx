"use client";

import { useEffect, useState } from "react";
import { RetroButton, RetroButtonOutline } from "@/components/checker/RetroButtons";

const NOAH_COURSES = [
  { code: "ENGL 1101", name: "English Composition I" },
  { code: "MATH 2211", name: "Calculus I" },
  { code: "CSCI 1301", name: "Introduction to Computing I" },
  { code: "BIOL 2111", name: "Anatomy & Physiology I" },
  { code: "BIOL 2112", name: "Anatomy & Physiology II" },
  { code: "HIST 2111", name: "United States History I" },
  { code: "PSYC 1101", name: "Introduction to Psychology" },
];

type NoahPhase = "idle" | "revealing" | "evaluating" | "success";

interface StoryStepProps {
  studentName: string;
  onContinue: () => void;
  onBack: () => void;
}

export function StoryStep({ studentName, onContinue, onBack }: StoryStepProps) {
  const [noahPhase, setNoahPhase] = useState<NoahPhase>("idle");
  const [visibleClassCount, setVisibleClassCount] = useState(0);

  useEffect(() => {
    if (noahPhase !== "revealing") {
      return;
    }

    if (visibleClassCount >= NOAH_COURSES.length) {
      setNoahPhase("evaluating");
      return;
    }

    const timer = window.setTimeout(() => {
      setVisibleClassCount((count) => count + 1);
    }, 420);

    return () => window.clearTimeout(timer);
  }, [noahPhase, visibleClassCount]);

  useEffect(() => {
    if (noahPhase !== "evaluating") {
      return;
    }

    const timer = window.setTimeout(() => {
      setNoahPhase("success");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [noahPhase]);

  const startNoahJourney = () => {
    setVisibleClassCount(0);
    setNoahPhase("revealing");
  };

  const displayName = studentName.trim() || "Student";

  return (
    <div>
      <div className="mb-8">
        <h1
          className="mb-2 text-3xl font-black uppercase text-[#1a1a2e] md:text-4xl"
          style={{
            fontFamily: "Georgia, serif",
            textShadow: "3px 3px 0px #f5c842",
          }}
        >
          Noah&apos;s GSU Transfer Story
        </h1>
        <p className="text-sm tracking-wide text-[#4a4a4a]">
          Hi {displayName} — watch how dual enrollment mapped cleanly to Georgia
          State University.
        </p>
      </div>

      <div className="border-4 border-[#1a1a2e] bg-white p-6 shadow-[6px_6px_0px_#1a1a2e]">
        <h2 className="text-center text-2xl font-black uppercase leading-tight text-[#c0392b] md:text-3xl">
          This website makes what noah did easier.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-[#4a4a4a]">
          Our friend <strong className="text-[#1a1a2e]">Noah</strong> used dual
          enrollment to transfer into{" "}
          <strong className="text-[#1a1a2e]">Georgia State University (GSU)</strong>.
          He stacked English, Calculus, Computing, Anatomy & Physiology, History,
          and Psychology — and every credit cleared as a direct match.
        </p>

        {noahPhase === "idle" && (
          <div className="mt-8 flex justify-center">
            <RetroButton onClick={startNoahJourney}>See Noah&apos;s Journey</RetroButton>
          </div>
        )}

        {(noahPhase === "revealing" ||
          noahPhase === "evaluating" ||
          noahPhase === "success") && (
          <div className="mt-8">
            {noahPhase !== "success" && (
              <div className="mx-auto max-w-lg border-4 border-[#1a1a2e] bg-[#f5f0e8] p-4 shadow-[4px_4px_0px_#1a1a2e]">
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
                  Noah&apos;s High School Transcript
                </p>
                <ul className="space-y-2">
                  {NOAH_COURSES.slice(0, visibleClassCount).map((course) => (
                    <li
                      key={course.code}
                      className="dett-class-enter flex items-center justify-between border-4 border-[#1a1a2e] bg-white px-3 py-2 text-sm shadow-[2px_2px_0px_#1a1a2e]"
                    >
                      <span className="font-black">{course.code}</span>
                      <span className="text-xs text-[#4a4a4a]">{course.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {noahPhase === "evaluating" && (
              <div className="mx-auto mt-6 max-w-lg text-center">
                <div className="border-4 border-[#1a1a2e] bg-[#1a1a2e] p-6 text-[#f5c842] shadow-[4px_4px_0px_#f5c842]">
                  <div className="mx-auto mb-4 dett-pixel-spinner" />
                  <p className="text-sm font-black uppercase tracking-widest">
                    Evaluating credits at GSU database...
                  </p>
                  <div className="mt-4 h-3 overflow-hidden border-2 border-[#f5c842] bg-[#1a1a2e]">
                    <div className="dett-scan-bar h-full bg-[#f5c842]" />
                  </div>
                </div>
              </div>
            )}

            {noahPhase === "success" && (
              <div className="mx-auto max-w-2xl">
                <div className="border-4 border-[#1a1a2e] bg-[#f0fff4] p-6 shadow-[6px_6px_0px_#1a1a2e]">
                  <div className="mb-4 flex items-center gap-3 border-b-4 border-[#1a1a2e] pb-3">
                    <span className="border-2 border-[#1a1a2e] bg-[#0039a6] px-3 py-1 text-xs font-black uppercase text-white">
                      GSU
                    </span>
                    <p className="font-black uppercase text-[#00a651]">
                      100% Direct Transfer Match
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {NOAH_COURSES.map((course) => (
                      <li
                        key={course.code}
                        className="flex items-center gap-3 border-4 border-[#00a651] bg-white px-3 py-2 text-[#00a651] shadow-[2px_2px_0px_#1a1a2e]"
                      >
                        <span className="text-lg font-black">✓</span>
                        <span className="font-black text-[#1a1a2e]">
                          {course.code}
                        </span>
                        <span className="text-sm text-[#4a4a4a]">{course.name}</span>
                        <span className="ml-auto text-xs font-black uppercase">
                          Direct
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex justify-center">
                  <RetroButton onClick={onContinue}>Now Map My Credits</RetroButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {noahPhase !== "success" && (
        <div className="mt-10 flex justify-between">
          <RetroButtonOutline onClick={onBack}>Back</RetroButtonOutline>
        </div>
      )}
    </div>
  );
}
