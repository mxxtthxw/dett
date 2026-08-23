"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WizardStep } from "@/types";

type GuideCharacter = "boy" | "girl";

const SPRITE_COLUMNS = 14;
const SPRITE_ROWS = 20;

/** Each character is one pixel; keys map into the character's palette. */
const BOY_SPRITE = [
  "....HHHHHH....",
  "...HHHHHHHH...",
  "..HHHHHHHHHH..",
  "..HSSSSSSSSH..",
  "..HSSSSSSSSH..",
  "..SSEESSEESS..",
  "..SSSSSSSSSS..",
  "..SSSMMMMSSS..",
  "...SSSSSSSS...",
  ".....SSSS.....",
  "...TTTTTTTT...",
  "..TTTTTTTTTT..",
  ".STTTTTTTTTTS.",
  ".STTGGGGGGTTS.",
  ".SSTTTTTTTTSS.",
  "...TTTTTTTT...",
  "...PPPP.PPPP..",
  "...PPPP.PPPP..",
  "...PPPP.PPPP..",
  "..BBBBB.BBBBB.",
] as const;

const GIRL_SPRITE = [
  "....HHHHHH....",
  "..HHHHHHHHHH..",
  ".HHHHHHHHHHHH.",
  ".HHHSSSSSSHHH.",
  ".HHSSSSSSSSHH.",
  ".HHSEESSEESHH.",
  ".HHSSSSSSSSHH.",
  ".HHSSMMMMSSHH.",
  ".HHHSSSSSSHHH.",
  "..HHHSSSSHHH..",
  "...H.SSSS.H...",
  "..HTTTTTTTTH..",
  ".STTTTTTTTTTS.",
  ".STTTTTTTTTTS.",
  ".SSTTTTTTTTSS.",
  "..TTTTTTTTTT..",
  ".GGGGGGGGGGGG.",
  "...SSSS.SSSS..",
  "...SSSS.SSSS..",
  "..BBBBB.BBBBB.",
] as const;

const BOY_PALETTE: Record<string, string> = {
  H: "#3d2b1f",
  S: "#e8b98a",
  E: "#1a1a2e",
  M: "#a03028",
  T: "#c0392b",
  G: "#f5c842",
  P: "#1a1a2e",
  B: "#2b2b2b",
};

const GIRL_PALETTE: Record<string, string> = {
  H: "#5a2d0c",
  S: "#d9a066",
  E: "#1a1a2e",
  M: "#a03028",
  T: "#1a1a2e",
  G: "#f5c842",
  B: "#2b2b2b",
};

const STEP_MESSAGES: Record<WizardStep, string> = {
  name: "C'mon, we need to know a little bit about you before we start!",
  schools:
    "Dream big — pick every school you're even thinking about. You can choose more than one!",
  origin: "Stick with me here. This part is why your credits matter.",
  story: "Noah lost credits learning this the hard way. Let's not repeat that.",
  courses:
    "Add every DE class you've taken — even the ones you assume won't count.",
  results:
    "Here it is! Green means it transfers clean. Show this to your counselor.",
};

const CHARACTER_STORAGE_KEY = "dett_guide_character";

/** Snaps motion to a coarse frame rate so movement reads as pixel animation. */
const steppedEase = (progress: number) => Math.round(progress * 10) / 10;

function PixelSprite({
  rows,
  palette,
}: {
  rows: readonly string[];
  palette: Record<string, string>;
}) {
  return (
    <svg
      viewBox={`0 0 ${SPRITE_COLUMNS} ${SPRITE_ROWS}`}
      shapeRendering="crispEdges"
      aria-hidden
      className="h-auto w-[84px] drop-shadow-[3px_3px_0px_rgba(26,26,46,0.25)]"
    >
      {rows.map((row, y) =>
        row.split("").map((key, x) => {
          const fill = palette[key];

          if (!fill) {
            return null;
          }

          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={fill}
            />
          );
        }),
      )}
    </svg>
  );
}

/** Delay lets the guide finish sliding in before the message starts typing. */
const TYPEWRITER_START_DELAY_MS = 400;

function useTypewriter(message: string) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");
    let index = 0;
    let timer = 0;

    const startTimer = window.setTimeout(() => {
      timer = window.setInterval(() => {
        index += 1;
        setTyped(message.slice(0, index));

        if (index >= message.length) {
          window.clearInterval(timer);
        }
      }, 22);
    }, TYPEWRITER_START_DELAY_MS);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(timer);
    };
  }, [message]);

  return typed;
}

/** Alternates boy/girl on every page load so the guide changes back and forth. */
function useAlternatingCharacter() {
  const [character, setCharacter] = useState<GuideCharacter | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    let previous: string | null = null;
    try {
      previous = localStorage.getItem(CHARACTER_STORAGE_KEY);
    } catch {
      previous = null;
    }

    const next: GuideCharacter = previous === "boy" ? "girl" : "boy";

    try {
      localStorage.setItem(CHARACTER_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode) — the guide still renders.
    }

    setCharacter(next);
  }, []);

  return character;
}

export function PixelGuide({ step }: { step: WizardStep }) {
  const character = useAlternatingCharacter();
  const [dismissed, setDismissed] = useState(false);
  const message = STEP_MESSAGES[step];
  const typed = useTypewriter(message);

  if (!character || dismissed) {
    return null;
  }

  const isBoy = character === "boy";

  return (
    <div className="no-print pointer-events-none fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${step}-${character}`}
          initial={{ opacity: 0, x: 150, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 150, y: 100 }}
          transition={{ duration: 0.55, ease: steppedEase }}
          className="flex w-[208px] flex-col items-end gap-4"
        >
          <div className="relative border-4 border-[#1a1a2e] bg-white px-4 py-3 shadow-[4px_4px_0px_#1a1a2e]">
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Hide guide"
              className="pointer-events-auto absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center border-4 border-[#1a1a2e] bg-[#f5c842] text-[10px] font-black text-[#1a1a2e] transition-colors hover:bg-[#c0392b] hover:text-white"
            >
              ✕
            </button>

            <p className="text-[11px] font-bold leading-relaxed text-[#1a1a2e]">
              {typed}
              <span className="dett-terminal-cursor ml-0.5 text-[#c0392b]">
                ▮
              </span>
            </p>

            <span className="absolute -bottom-[10px] right-8 h-4 w-4 rotate-45 border-b-4 border-r-4 border-[#1a1a2e] bg-white" />
          </div>

          <div className="dett-guide-bob mr-4">
            <PixelSprite
              rows={isBoy ? BOY_SPRITE : GIRL_SPRITE}
              palette={isBoy ? BOY_PALETTE : GIRL_PALETTE}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
