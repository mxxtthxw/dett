"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const HEADLINE = "DETT";
const SUBHEAD = "Dual Enrollment Transfer Tool";
const DESCRIPTION =
  "Map your dual enrollment credits, compare transfer outcomes across universities, and print your personalized roadmap.";

const TERMINAL_LINES = [
  "> SYS.INIT :: DUAL_ENROLLMENT_TRANSFER_TOOL",
  "> LOADING EQUIVALENCY_MATRIX... OK",
  "> SYNC TARGET_UNIVERSITIES [18 NODES]",
  "> CREDIT_SCANNER :: STANDBY",
  "> AWAITING USER SESSION...",
];

const GLITCH_CHARS = "01X7F9A2E#@$%&";

function randomGlitchChar(): string {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] ?? "0";
}

function TerminalStatusLines({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 top-0 overflow-hidden opacity-[0.12]"
    >
      <div className="flex h-full flex-col justify-end gap-1 px-6 pb-8 text-left text-[10px] leading-5 text-cyan-500/90 md:px-12 md:text-xs">
        {TERMINAL_LINES.map((line, index) => (
          <div
            key={line}
            className="terminal-line font-mono"
            style={{ animationDelay: `${index * 0.35}s` }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScanningHeadline({
  scanActive,
  resolved,
}: {
  scanActive: boolean;
  resolved: boolean;
}) {
  const [chars, setChars] = useState<string[]>(() =>
    HEADLINE.split("").map(() => randomGlitchChar()),
  );

  useEffect(() => {
    const timers: number[] = [];

    HEADLINE.split("").forEach((targetChar, index) => {
      const settleTimer = window.setTimeout(() => {
        setChars((previous) => {
          const next = [...previous];
          next[index] = targetChar;
          return next;
        });
      }, 180 + index * 110);

      timers.push(settleTimer);
    });

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <h1 className="text-6xl font-black tracking-[0.18em] text-cyan-400 md:text-8xl">
      {chars.map((char, index) => (
        <span
          key={`${index}-${char}`}
          className={`inline-block ${
            resolved ? "" : scanActive ? "scanner-char-settle" : ""
          }`}
          style={{
            animationDelay: `${index * 0.11}s`,
            opacity: resolved ? 1 : undefined,
          }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
}

function CascadingDescription({ startDelay }: { startDelay: number }) {
  const words = DESCRIPTION.split(" ");

  return (
    <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-300 md:text-lg">
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="scanner-word-reveal mr-[0.35em] inline-block"
          style={{ animationDelay: `${startDelay + index * 0.09}s` }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}

export function ScannerLanding() {
  const [scanPhase, setScanPhase] = useState<"idle" | "scanning" | "resolved">(
    "idle",
  );
  const [showDescription, setShowDescription] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    const scanStart = window.setTimeout(() => setScanPhase("scanning"), 350);
    const scanEnd = window.setTimeout(() => setScanPhase("resolved"), 2800);
    const terminalStart = window.setTimeout(() => setShowTerminal(true), 500);
    const descriptionStart = window.setTimeout(() => setShowDescription(true), 3200);
    const ctaStart = window.setTimeout(() => setShowCta(true), 4800);

    return () => {
      window.clearTimeout(scanStart);
      window.clearTimeout(scanEnd);
      window.clearTimeout(terminalStart);
      window.clearTimeout(descriptionStart);
      window.clearTimeout(ctaStart);
    };
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-12">
      <TerminalStatusLines visible={showTerminal} />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.07),transparent_60%)]" />

      <main className="relative z-10 w-full max-w-3xl text-center">
        <div
          className={`dett-retro-panel scanner-content-dissolve relative overflow-hidden px-8 py-12 md:px-12 ${
            scanPhase === "scanning"
              ? "is-scanning"
              : scanPhase === "resolved"
                ? "is-resolved"
                : ""
          }`}
        >
          {scanPhase === "scanning" && (
            <div
              aria-hidden
              className="scanner-sweep-bar pointer-events-none absolute inset-y-0 z-20 w-[3px] bg-cyan-400 shadow-[0_0_24px_8px_rgba(34,211,238,0.65)]"
            />
          )}

          {scanPhase === "scanning" && (
            <div
              aria-hidden
              className="scanner-sweep-bar pointer-events-none absolute inset-y-0 z-10 w-32 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-sm"
              style={{ animationDelay: "0.05s" }}
            />
          )}

          <p
            className="dett-step-tag tracking-[0.45em]"
            style={{
              opacity: scanPhase === "resolved" ? 1 : 0.45,
              transition: "opacity 0.6s ease",
            }}
          >
            {SUBHEAD}
          </p>

          <div className="mt-4">
            <ScanningHeadline
              scanActive={scanPhase === "scanning"}
              resolved={scanPhase === "resolved"}
            />
          </div>

          <p
            className="mt-3 text-sm tracking-widest text-fuchsia-400/80"
            style={{
              opacity: scanPhase === "resolved" ? 1 : 0,
              transition: "opacity 0.8s ease 0.2s",
            }}
          >
            [ DATA FLOW SCANNER :: ACTIVE ]
          </p>

          {showDescription && <CascadingDescription startDelay={0.1} />}

          {showCta && (
            <div
              className="mt-10"
              style={{ animation: "scanner-word-in 0.6s ease forwards" }}
            >
              <Link
                href="/checker"
                className="dett-retro-btn dett-retro-btn-primary scanner-cta-glow inline-block px-10 py-4 text-sm tracking-[0.2em]"
              >
                Launch Credit Checker
              </Link>
            </div>
          )}
        </div>

        <p
          className="mt-8 text-[10px] uppercase tracking-[0.35em] text-gray-600"
          style={{ opacity: showCta ? 1 : 0, transition: "opacity 0.8s ease" }}
        >
          Initializing transfer intelligence pipeline
        </p>
      </main>
    </div>
  );
}
