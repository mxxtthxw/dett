export interface GpaOutlookInput {
  currentGpa: number;
  hsCredits: number;
  semesterCollegeCredits: number;
  completedDeCredits?: number;
}

export interface GpaOutlookResult {
  projectedGpa: number;
  gpaChange: number;
  totalPreviousCredits: number;
  newTotalCredits: number;
  semesterQualityPoints: number;
  assumption: string;
}

const ALL_A_GRADE_POINTS = 4.0;

export function predictSemesterGpaAllAs(
  input: GpaOutlookInput,
): GpaOutlookResult {
  const { currentGpa, hsCredits, semesterCollegeCredits, completedDeCredits = 0 } =
    input;

  const safeGpa = Math.min(Math.max(currentGpa, 0), 4);
  const safeHsCredits = Math.max(hsCredits, 0);
  const safeSemesterCredits = Math.max(semesterCollegeCredits, 0);
  const safeDeCredits = Math.max(completedDeCredits, 0);

  const totalPreviousCredits = safeHsCredits + safeDeCredits;
  const previousQualityPoints = safeGpa * totalPreviousCredits;
  const semesterQualityPoints = ALL_A_GRADE_POINTS * safeSemesterCredits;
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
    assumption: "Assumes all A grades (4.0) this semester.",
  };
}

export const HS_CREDITS_PER_YEAR_HINT = 7;
