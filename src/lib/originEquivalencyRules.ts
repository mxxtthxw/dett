import type { TransferEquivalency } from "@/types";

/** DE institutions with verified articulation emphasis in DETT. */
export const PRIORITY_DE_ORIGIN_IDS = new Set([
  "georgia-state-perimeter",
  "perimeter-college",
  "georgia-state",
  "clayton-state",
  "north-georgia",
]);

export const PERIMETER_ORIGIN_IDS = new Set([
  "georgia-state-perimeter",
  "perimeter-college",
]);

/** Perimeter College DE credits articulate to Georgia State University main campus. */
export const PERIMETER_TO_GSU_TARGET = "georgia-state";

/** Origin → primary target pairs that use verified USG articulation tables. */
export const ORIGIN_TARGET_ARTICULATION: Record<string, string> = {
  "georgia-state-perimeter": "georgia-state",
  "perimeter-college": "georgia-state",
  "clayton-state": "clayton-state",
  "north-georgia": "north-georgia",
};

export function shouldUseOriginArticulation(
  originSchoolId: string | undefined,
  targetSchoolId: string,
): boolean {
  if (!originSchoolId) {
    return false;
  }

  return ORIGIN_TARGET_ARTICULATION[originSchoolId] === targetSchoolId;
}

export function isPerimeterToGsuTransfer(
  originSchoolId: string | undefined,
  targetSchoolId: string,
): boolean {
  return (
    !!originSchoolId &&
    PERIMETER_ORIGIN_IDS.has(originSchoolId) &&
    targetSchoolId === PERIMETER_TO_GSU_TARGET
  );
}

export function mergeEquivalency(
  primary: TransferEquivalency | null,
  fallback: TransferEquivalency | null,
): TransferEquivalency | null {
  return primary ?? fallback;
}
