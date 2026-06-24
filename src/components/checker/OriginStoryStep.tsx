"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  RetroButton,
  RetroButtonOutline,
  retroHeadingStyle,
} from "@/components/checker/RetroButtons";

interface OriginStoryStepProps {
  studentName: string;
  onContinue: () => void;
  onBack: () => void;
  onBackToStart?: () => void;
}

export function OriginStoryStep({
  studentName,
  onContinue,
  onBack,
  onBackToStart,
}: OriginStoryStepProps) {
  const storyRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const checkScroll = useCallback(() => {
    const element = storyRef.current;
    if (!element) {
      return;
    }

    const atBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 12;

    setHasScrolledToBottom(atBottom);
  }, []);

  useEffect(() => {
    const element = storyRef.current;
    if (!element) {
      return;
    }

    checkScroll();
    element.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      element.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-[#c0392b]">
          Our Origin Story
        </p>
        <h1
          className="text-3xl font-black uppercase text-[#1a1a2e] md:text-4xl"
          style={retroHeadingStyle}
        >
          Hi{studentName.trim() ? `, ${studentName.trim()}` : ""}, I&apos;m
          Matthew.
        </h1>
      </div>

      <div
        ref={storyRef}
        className="mb-4 max-h-[42vh] flex-1 overflow-y-auto border-4 border-[#1a1a2e] bg-white p-6 shadow-[4px_4px_0px_#1a1a2e] md:max-h-[48vh]"
      >
        <div className="space-y-4 text-base leading-relaxed text-[#1a1a2e] md:text-lg">
          <p>
            Aadil and I met in high school with the same dream:{" "}
            <strong>Georgia Tech</strong>. We wanted the campus, the rigor, and
            the future — but we kept hitting the same wall.
          </p>
          <p>
            Dual enrollment sounded like a shortcut. Take college classes in high
            school, stack credits, and arrive ahead of the game. Instead, we got
            a maze. Every university had different course numbers, different
            rules, and different answers about what would actually transfer.
          </p>
          <p>
            We spent nights comparing catalogs, emailing registrars, and guessing
            whether <strong>MATH 2211</strong> would count the same everywhere.
            Aadil would find one answer. I would find another. Nobody had a
            single place to see the full picture.
          </p>
          <p>
            That frustration became the idea for <strong>DETT</strong> — Dual
            Enrollment Transfer Tool. We built it so students like you can see
            your credits clearly, compare schools side-by-side, and walk into
            admissions with confidence instead of confusion.
          </p>
          <p className="font-black">
            This is the tool we wish we had when we were dreaming about Tech.
            Now let&apos;s make your path just as clear.
          </p>
        </div>
      </div>

      {!hasScrolledToBottom && (
        <p className="mb-4 text-center text-xs font-black uppercase tracking-widest text-[#c0392b]">
          ↓ Scroll through the full note to continue ↓
        </p>
      )}

      <div className="mt-auto space-y-3 pt-2">
        {onBackToStart ? (
          <button
            type="button"
            onClick={onBackToStart}
            className="text-xs font-black uppercase tracking-widest text-[#4a4a4a] underline-offset-2 hover:text-[#c0392b] hover:underline"
          >
            ← Back to Start
          </button>
        ) : null}
        <div className="flex justify-between">
          <RetroButtonOutline onClick={onBack}>
            <ArrowLeft className="h-4 w-4" /> Back
          </RetroButtonOutline>
          <RetroButton disabled={!hasScrolledToBottom} onClick={onContinue}>
            Continue <ArrowRight className="h-4 w-4" />
          </RetroButton>
        </div>
      </div>
    </div>
  );
}
