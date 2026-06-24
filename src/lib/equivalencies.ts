import type { DualEnrollmentCourse, TransferEquivalency, TransferStatus } from "@/types";
import { MOCK_EQUIVALENCIES } from "@/data/equivalencies";
import {
  buildDirectHomeInstitutionEquivalency,
  georgiaStatePerimeterEquivalencies,
} from "@/lib/usgEquivalencyBuilder";
import {
  isPerimeterToGsuTransfer,
  shouldUseOriginArticulation,
} from "@/lib/originEquivalencyRules";

export interface SchoolCreditSummary {
  schoolId: string;
  attemptedCredits: number;
  acceptedCredits: number;
  directCredits: number;
  electiveCredits: number;
  reviewCredits: number;
  courseOutcomes: CourseOutcome[];
}

export interface CourseOutcome {
  course: DualEnrollmentCourse;
  equivalency: TransferEquivalency | null;
  acceptedCredits: number;
}

function acceptedCreditsForStatus(
  equivalency: TransferEquivalency | null,
  attemptedCredits: number,
): number {
  if (!equivalency) {
    return 0;
  }

  const status: TransferStatus = equivalency.status ?? "direct";

  if (status === "review") {
    return 0;
  }

  return equivalency.targetCredits ?? attemptedCredits;
}

function lookupMockEquivalency(
  sourceCourseId: string,
  targetSchoolId: string,
): TransferEquivalency | null {
  return (
    MOCK_EQUIVALENCIES.find(
      (entry) =>
        entry.sourceCourseId === sourceCourseId &&
        entry.targetSchoolId === targetSchoolId,
    ) ?? null
  );
}

function lookupPerimeterGsuEquivalency(
  sourceCourseId: string,
): TransferEquivalency | null {
  return (
    georgiaStatePerimeterEquivalencies.find(
      (entry) => entry.sourceCourseId === sourceCourseId,
    ) ?? null
  );
}

export function findEquivalency(
  sourceCourseId: string,
  targetSchoolId: string,
  originSchoolId?: string,
): TransferEquivalency | null {
  const mockMatch = lookupMockEquivalency(sourceCourseId, targetSchoolId);

  if (isPerimeterToGsuTransfer(originSchoolId, targetSchoolId)) {
    return (
      lookupPerimeterGsuEquivalency(sourceCourseId) ??
      mockMatch ??
      buildDirectHomeInstitutionEquivalency(sourceCourseId, targetSchoolId)
    );
  }

  if (shouldUseOriginArticulation(originSchoolId, targetSchoolId)) {
    return (
      mockMatch ?? buildDirectHomeInstitutionEquivalency(sourceCourseId, targetSchoolId)
    );
  }

  return mockMatch;
}

export function getCourseOutcomes(
  courses: DualEnrollmentCourse[],
  targetSchoolId: string,
  originSchoolId?: string,
): CourseOutcome[] {
  return courses.map((course) => {
    const equivalency = findEquivalency(
      course.id,
      targetSchoolId,
      originSchoolId,
    );

    return {
      course,
      equivalency,
      acceptedCredits: acceptedCreditsForStatus(equivalency, course.credits),
    };
  });
}

export function summarizeSchoolCredits(
  courses: DualEnrollmentCourse[],
  targetSchoolId: string,
  originSchoolId?: string,
): SchoolCreditSummary {
  const courseOutcomes = getCourseOutcomes(
    courses,
    targetSchoolId,
    originSchoolId,
  );
  const attemptedCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  let acceptedCredits = 0;
  let directCredits = 0;
  let electiveCredits = 0;
  let reviewCredits = 0;

  for (const outcome of courseOutcomes) {
    acceptedCredits += outcome.acceptedCredits;

    if (!outcome.equivalency) {
      continue;
    }

    const status = outcome.equivalency.status ?? "direct";

    if (status === "direct") {
      directCredits += outcome.acceptedCredits;
    } else if (status === "elective") {
      electiveCredits += outcome.acceptedCredits;
    } else if (status === "review") {
      reviewCredits += outcome.course.credits;
    }
  }

  return {
    schoolId: targetSchoolId,
    attemptedCredits,
    acceptedCredits,
    directCredits,
    electiveCredits,
    reviewCredits,
    courseOutcomes,
  };
}
