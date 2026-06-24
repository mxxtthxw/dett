import { getCourseOutcomes } from "@/lib/equivalencies";
import type { DualEnrollmentCourse } from "@/types";

export type RequirementCategory =
  | "core"
  | "major"
  | "elective";

export interface CategorizedCourse {
  course: DualEnrollmentCourse;
  category: RequirementCategory;
  acceptedAtTarget: boolean;
}

export interface RequirementBuckets {
  core: CategorizedCourse[];
  major: CategorizedCourse[];
  elective: CategorizedCourse[];
}

const CORE_PREFIXES = [
  "engl",
  "hist",
  "pols",
  "psyc",
  "soci",
  "comm",
  "arts",
  "musc",
  "phil",
];

const MAJOR_STEM_PREFIXES = ["csci", "biol", "chem", "phys", "geol"];
const MAJOR_BUSINESS_PREFIXES = ["busa", "acct", "econ"];
const CALCULUS_IDS = ["math-2211", "math-2212"];

function majorHints(intendedMajor: string): {
  stem: boolean;
  business: boolean;
  health: boolean;
} {
  const major = intendedMajor.toLowerCase();

  return {
    stem:
      major.includes("computer") ||
      major.includes("engineering") ||
      major.includes("math") ||
      major.includes("physics") ||
      major.includes("csci") ||
      major.includes("cs"),
    business:
      major.includes("business") ||
      major.includes("accounting") ||
      major.includes("finance") ||
      major.includes("marketing"),
    health:
      major.includes("biology") ||
      major.includes("nursing") ||
      major.includes("pre-med") ||
      major.includes("health"),
  };
}

export function categorizeCourse(
  course: DualEnrollmentCourse,
  intendedMajor = "",
): RequirementCategory {
  const id = course.id.toLowerCase();
  const hints = majorHints(intendedMajor);

  if (hints.stem) {
    if (
      MAJOR_STEM_PREFIXES.some((prefix) => id.startsWith(prefix)) ||
      CALCULUS_IDS.includes(id)
    ) {
      return "major";
    }
  }

  if (hints.business) {
    if (MAJOR_BUSINESS_PREFIXES.some((prefix) => id.startsWith(prefix))) {
      return "major";
    }
  }

  if (hints.health) {
    if (id.startsWith("biol") || id.startsWith("chem")) {
      return "major";
    }
  }

  if (
    id.startsWith("csci") ||
    id.startsWith("biol") ||
    id.startsWith("chem") ||
    CALCULUS_IDS.includes(id)
  ) {
    return "major";
  }

  if (id.startsWith("math") && !CALCULUS_IDS.includes(id)) {
    return "core";
  }

  if (CORE_PREFIXES.some((prefix) => id.startsWith(prefix))) {
    return "core";
  }

  if (
    MAJOR_BUSINESS_PREFIXES.some((prefix) => id.startsWith(prefix)) ||
    id.startsWith("geol")
  ) {
    return "major";
  }

  return "elective";
}

export function groupCoursesByRequirement(
  courses: DualEnrollmentCourse[],
  intendedMajor = "",
  targetSchoolId?: string,
  originSchoolId?: string,
): RequirementBuckets {
  const buckets: RequirementBuckets = {
    core: [],
    major: [],
    elective: [],
  };

  for (const course of courses) {
    let category = categorizeCourse(course, intendedMajor);

    if (targetSchoolId) {
      const outcome = getCourseOutcomes(
        [course],
        targetSchoolId,
        originSchoolId,
      )[0];
      const status = outcome.equivalency?.status;

      if (!outcome.equivalency || status === "review") {
        category = "elective";
      } else if (status === "elective") {
        category = "elective";
      }
    }

    buckets[category].push({
      course,
      category,
      acceptedAtTarget: targetSchoolId
        ? getCourseOutcomes([course], targetSchoolId, originSchoolId)[0]
            .acceptedCredits > 0
        : true,
    });
  }

  return buckets;
}

export function countDirectPrerequisites(
  courses: DualEnrollmentCourse[],
  intendedMajor: string,
  targetSchoolId: string,
  originSchoolId?: string,
): number {
  return getCourseOutcomes(courses, targetSchoolId, originSchoolId).filter(
    (outcome) => {
    const isMajor = categorizeCourse(outcome.course, intendedMajor) === "major";
    const isDirect = (outcome.equivalency?.status ?? "direct") === "direct";
    return isMajor && isDirect && outcome.acceptedCredits > 0;
  }).length;
}
