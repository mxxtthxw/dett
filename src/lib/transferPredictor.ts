import { summarizeSchoolCredits } from "@/lib/equivalencies";
import { countDirectPrerequisites } from "@/lib/requirements";
import type { DualEnrollmentCourse } from "@/types";

/** Lower = more selective / harder transfer odds modifier. */
const SCHOOL_DIFFICULTY: Record<string, number> = {
  "georgia-tech": 0.72,
  emory: 0.7,
  uga: 0.78,
  "georgia-state": 0.9,
  "kennesaw-state": 0.92,
  "georgia-southern": 0.94,
  augusta: 0.93,
  morehouse: 0.88,
  spelman: 0.86,
  mercer: 0.84,
};

const DEFAULT_DIFFICULTY = 0.88;

export interface TransferPredictorInput {
  gpa: number;
  courses: DualEnrollmentCourse[];
  targetSchoolId: string;
  intendedMajor?: string;
}

export interface TransferPredictorResult {
  percentage: number;
  breakdown: string;
  targetSchoolId: string;
  factors: {
    gpaComponent: number;
    creditComponent: number;
    prereqComponent: number;
    difficultyModifier: number;
  };
}

export function calculateTransferProbability(
  input: TransferPredictorInput,
): TransferPredictorResult {
  const { gpa, courses, targetSchoolId, intendedMajor = "" } = input;
  const summary = summarizeSchoolCredits(courses, targetSchoolId);
  const directPrereqs = countDirectPrerequisites(
    courses,
    intendedMajor,
    targetSchoolId,
  );

  const gpaNorm = Math.min(Math.max(gpa, 0) / 4, 1);
  const creditRate =
    summary.attemptedCredits > 0
      ? summary.acceptedCredits / summary.attemptedCredits
      : 0;
  const prereqNorm = Math.min(directPrereqs / 4, 1);

  const gpaComponent = gpaNorm * 40;
  const creditComponent = creditRate * 35;
  const prereqComponent = prereqNorm * 25;
  const rawScore = gpaComponent + creditComponent + prereqComponent;

  const difficultyModifier =
    SCHOOL_DIFFICULTY[targetSchoolId] ?? DEFAULT_DIFFICULTY;
  const percentage = Math.round(
    Math.min(97, Math.max(15, rawScore * difficultyModifier)),
  );

  const breakdownParts: string[] = [];

  if (gpa >= 3.5) {
    breakdownParts.push("Your GPA meets the target average");
  } else if (gpa >= 3.0) {
    breakdownParts.push("Your GPA is competitive but could be stronger");
  } else {
    breakdownParts.push("Raising your GPA would improve transfer odds");
  }

  if (directPrereqs > 0) {
    breakdownParts.push(
      `your DE courses cover ${directPrereqs} core prerequisite${directPrereqs === 1 ? "" : "s"}`,
    );
  } else if (summary.acceptedCredits > 0) {
    breakdownParts.push(
      `${summary.acceptedCredits} DE credit hours transfer cleanly`,
    );
  } else {
    breakdownParts.push("adding more transferable DE courses would help");
  }

  const breakdown = `${breakdownParts[0]}, and ${breakdownParts[1] ?? "keep building your roadmap"}.`;

  return {
    percentage,
    breakdown,
    targetSchoolId,
    factors: {
      gpaComponent: Math.round(gpaComponent),
      creditComponent: Math.round(creditComponent),
      prereqComponent: Math.round(prereqComponent),
      difficultyModifier,
    },
  };
}
