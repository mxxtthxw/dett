import type { TransferEquivalency } from "@/types";

/** DE institutions with verified articulation emphasis in DETT. */
export const PRIORITY_DE_ORIGIN_IDS = new Set([
  "georgia-state-perimeter",
  "perimeter-college",
  "georgia-state",
  "clayton-state",
  "north-georgia",
  "toccoa-falls-college",
  "ga-piedmont-tech",
]);

export const PERIMETER_ORIGIN_IDS = new Set([
  "georgia-state-perimeter",
  "perimeter-college",
]);

/** GA DE origins with verified Howard University articulation tables. */
export const HOWARD_PRIORITY_ORIGIN_IDS = new Set([
  "toccoa-falls-college",
  "georgia-state-perimeter",
  "perimeter-college",
  "ga-piedmont-tech",
]);

export const HOWARD_TARGET_ID = "howard";
export const TOCCOA_FALLS_TARGET_ID = "toccoa-falls-college";

/** Perimeter College DE credits articulate to Georgia State University main campus. */
export const PERIMETER_TO_GSU_TARGET = "georgia-state";

/** Origin → primary target pairs that use verified USG articulation tables. */
export const ORIGIN_TARGET_ARTICULATION: Record<string, string> = {
  "georgia-state-perimeter": "georgia-state",
  "perimeter-college": "georgia-state",
  "clayton-state": "clayton-state",
  "north-georgia": "north-georgia",
  "toccoa-falls-college": "toccoa-falls-college",
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

export function isHowardPriorityTransfer(
  originSchoolId: string | undefined,
  targetSchoolId: string,
): boolean {
  return (
    !!originSchoolId &&
    targetSchoolId === HOWARD_TARGET_ID &&
    HOWARD_PRIORITY_ORIGIN_IDS.has(originSchoolId)
  );
}

export function isToccoaFallsHomeTransfer(
  originSchoolId: string | undefined,
  targetSchoolId: string,
): boolean {
  return (
    !!originSchoolId &&
    originSchoolId === TOCCOA_FALLS_TARGET_ID &&
    targetSchoolId === TOCCOA_FALLS_TARGET_ID
  );
}

export function mergeEquivalency(
  primary: TransferEquivalency | null,
  fallback: TransferEquivalency | null,
): TransferEquivalency | null {
  return primary ?? fallback;
}
