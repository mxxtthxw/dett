"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bot, RefreshCw, Sparkles, Terminal } from "lucide-react";
import { buildAdvisorPayload } from "@/lib/advisorPrompt";
import type { DualEnrollmentCourse, School } from "@/types";
import { RetroButton, RetroButtonOutline } from "@/components/checker/RetroButtons";

interface AiAdvisorTabProps {
  displayName: string;
  intendedMajor: string;
  selectedSchools: School[];
  selectedCourses: DualEnrollmentCourse[];
  originSchoolId?: string;
}

const LOADING_MESSAGES = [
  "Parsing transfer equivalencies...",
  "Cross-referencing core requirements...",
  "Scanning major prerequisite gaps...",
  "Drafting course recommendations...",
  "Finalizing your roadmap...",
];

function TypewriterText({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    setVisibleLength(0);
    if (!text) {
      return;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleLength(index);
      if (index >= text.length) {
        window.clearInterval(timer);
        onComplete?.();
      }
    }, 12);

    return () => window.clearInterval(timer);
  }, [text, onComplete]);

  return (
    <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[#f5c842]">
      {text.slice(0, visibleLength)}
      {visibleLength < text.length ? (
        <span className="dett-terminal-cursor ml-0.5 inline-block">▊</span>
      ) : null}
    </div>
  );
}

function renderMarkdownSections(text: string) {
  const sections = text.split(/^## /m).filter(Boolean);

  return sections.map((section) => {
    const [titleLine, ...bodyLines] = section.split("\n");
    const body = bodyLines.join("\n").trim();

    return (
      <section
        key={titleLine}
        className="border-4 border-black bg-[#f4f1ea] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#c0392b]">
          {titleLine.trim()}
        </h3>
        <div
          className="space-y-2 text-sm leading-relaxed text-[#1a1a2e]"
          dangerouslySetInnerHTML={{
            __html: body
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/^- /gm, "• ")
              .replace(/^\d+\. /gm, (match) => `<span class="font-black">${match}</span>`)
              .replace(/\n/g, "<br />"),
          }}
        />
      </section>
    );
  });
}

function AdvisorTerminalLoader({ messageIndex }: { messageIndex: number }) {
  return (
    <div className="border-4 border-black bg-[#1a1a2e] p-6 text-[#f5c842] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
        <Terminal className="h-4 w-4" />
        DETT Advisor Terminal
      </div>
      <div className="font-mono text-sm">
        <p className="opacity-70">&gt; boot sequence complete</p>
        <p className="mt-2">
          &gt; {LOADING_MESSAGES[messageIndex]}
          <span className="dett-terminal-cursor ml-1">▊</span>
        </p>
      </div>
      <div className="mt-6 h-2 overflow-hidden border-2 border-[#f5c842]">
        <div className="dett-advisor-progress h-full bg-[#f5c842]" />
      </div>
    </div>
  );
}

export function AiAdvisorTab({
  displayName,
  intendedMajor,
  selectedSchools,
  selectedCourses,
  originSchoolId,
}: AiAdvisorTabProps) {
  const [focusSchoolId, setFocusSchoolId] = useState(
    selectedSchools[0]?.id ?? "",
  );
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [advice, setAdvice] = useState("");
  const [source, setSource] = useState<"ai" | "local">("local");
  const [notice, setNotice] = useState("");
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);

  const payload = useMemo(
    () =>
      buildAdvisorPayload(
        displayName,
        intendedMajor,
        selectedSchools,
        selectedCourses,
        focusSchoolId,
        originSchoolId,
      ),
    [
      displayName,
      intendedMajor,
      originSchoolId,
      selectedCourses,
      selectedSchools,
      focusSchoolId,
    ],
  );

  const fetchAdvice = useCallback(async () => {
    setStatus("loading");
    setAdvice("");
    setNotice("");
    setErrorMessage("");
    setTypingComplete(false);
    setLoadingIndex(0);

    const messageTimer = window.setInterval(() => {
      setLoadingIndex((index) => (index + 1) % LOADING_MESSAGES.length);
    }, 1400);

    try {
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        advice?: string;
        source?: "ai" | "local";
        notice?: string;
        error?: string;
      };

      if (!response.ok || !data.advice) {
        throw new Error(data.error ?? "Advisor request failed.");
      }

      setAdvice(data.advice);
      setSource(data.source ?? "local");
      setNotice(data.notice ?? "");
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      window.clearInterval(messageTimer);
    }
  }, [payload]);

  const focusSchool = selectedSchools.find(
    (school) => school.id === focusSchoolId,
  );

  return (
    <div className="border-4 border-t-0 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <div className="mb-2 inline-flex items-center gap-2 border-4 border-black bg-[#f5c842] px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="h-3.5 w-3.5" />
            AI Academic Advisor
          </div>
          <h2
            className="text-2xl font-black uppercase text-[#1a1a2e]"
            style={{
              fontFamily: "Georgia, serif",
              textShadow: "2px 2px 0px #f5c842",
            }}
          >
            Your Personalized Transfer Plan
          </h2>
          <p className="mt-2 text-sm text-[#4a4a4a]">
            Expert analysis of whether your DE courses efficiently satisfy
            requirements at your target schools — plus 2–3 specific next-step
            recommendations.
          </p>
        </div>

        {selectedSchools.length > 1 ? (
          <label className="block min-w-[240px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1a1a2e]">
              Primary Target
            </span>
            <select
              value={focusSchoolId}
              onChange={(event) => setFocusSchoolId(event.target.value)}
              disabled={status === "loading"}
              className="mt-1 w-full border-4 border-black bg-[#f5f0e8] px-3 py-2 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:border-[#c0392b] focus:outline-none disabled:opacity-60"
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

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Student", value: displayName.trim() || "You" },
          { label: "Major", value: intendedMajor.trim() || "Undeclared" },
          {
            label: "Focus School",
            value: focusSchool?.name ?? "Target",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="border-4 border-black bg-[#f4f1ea] px-3 py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-[#4a4a4a]">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-black text-[#1a1a2e]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <RetroButton onClick={fetchAdvice} disabled={status === "loading"}>
          <Bot className="h-4 w-4" />
          {status === "ready" ? "Refresh Advice" : "Generate Advice"}
        </RetroButton>
        {status === "ready" ? (
          <RetroButtonOutline onClick={fetchAdvice}>
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </RetroButtonOutline>
        ) : null}
      </div>

      {status === "idle" ? (
        <div className="border-4 border-dashed border-black bg-[#f5f0e8] p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-black uppercase tracking-widest text-[#1a1a2e]">
            Ready when you are
          </p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#4a4a4a]">
            Press Generate Advice to analyze {selectedCourses.length} course
            {selectedCourses.length === 1 ? "" : "s"} against{" "}
            {focusSchool?.name ?? "your target school"}.
          </p>
        </div>
      ) : null}

      {status === "loading" ? (
        <AdvisorTerminalLoader messageIndex={loadingIndex} />
      ) : null}

      {status === "error" ? (
        <div className="border-4 border-[#c0392b] bg-[#fff5f5] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm font-black uppercase tracking-widest text-[#c0392b]">
            Advisor Error
          </p>
          <p className="mt-2 text-sm text-[#4a4a4a]">{errorMessage}</p>
          <div className="mt-4">
            <RetroButtonOutline onClick={fetchAdvice}>Try Again</RetroButtonOutline>
          </div>
        </div>
      ) : null}

      {status === "ready" && advice ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border-4 border-black bg-[#1a1a2e] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#f5c842] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {source === "ai" ? "Live AI Analysis" : "Smart Demo Mode"}
            </span>
            {notice ? (
              <span className="text-xs text-[#4a4a4a]">{notice}</span>
            ) : null}
          </div>

          <div className="border-4 border-black bg-[#1a1a2e] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <TypewriterText
              text={advice}
              onComplete={() => setTypingComplete(true)}
            />
          </div>

          {typingComplete ? (
            <div className="grid gap-4">{renderMarkdownSections(advice)}</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
