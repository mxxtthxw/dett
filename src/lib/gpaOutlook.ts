export interface GpaOutlookInput {
  currentGpa: number;
  hsCredits: number;
  semesterCollegeCredits: number;
}

export interface GpaOutlookResult {
  projectedGpa: number;
  gpaChange: number;
  totalPreviousCredits: number;
  newTotalCredits: number;
  semesterQualityPoints: number;
  assumption: string;
}

/** Typical weighted A for dual enrollment / AP on a high school transcript. */
const WEIGHTED_A_GRADE_POINTS = 5.0;

/** Sanity cap for weighted HS GPA inputs (many districts top out around 5.0–6.0). */
export const HS_WEIGHTED_GPA_MAX = 6;

export function predictSemesterGpaAllAs(
  input: GpaOutlookInput,
): GpaOutlookResult {
  const { currentGpa, hsCredits, semesterCollegeCredits } = input;

  const safeGpa = Math.min(Math.max(currentGpa, 0), HS_WEIGHTED_GPA_MAX);
  const safeHsCredits = Math.max(hsCredits, 0);
  const safeSemesterCredits = Math.max(semesterCollegeCredits, 0);

  const totalPreviousCredits = safeHsCredits;
  const previousQualityPoints = safeGpa * totalPreviousCredits;
  const semesterQualityPoints =
    WEIGHTED_A_GRADE_POINTS * safeSemesterCredits;
  const newTotalCredits = totalPreviousCredits + safeSemesterCredits;

  const projectedGpa =
    newTotalCredits > 0
      ? (previousQualityPoints + semesterQualityPoints) / newTotalCredits
      : safeGpa;

  return {
    projectedGpa: Math.round(projectedGpa * 1000) / 1000,
    gpaChange: Math.round((projectedGpa - safeGpa) * 1000) / 1000,
    totalPreviousCredits,
    newTotalCredits,
    semesterQualityPoints,
    assumption:
      "Assumes all A grades on college credits this semester (weighted 5.0 on your HS GPA scale). Prior total uses only the HS credits you entered.",
  };
}

export const HS_CREDITS_PER_YEAR_HINT = 7;
