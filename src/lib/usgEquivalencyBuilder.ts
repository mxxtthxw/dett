import { PRELOADED_COURSES } from "@/data/mockData";
import { buildDirectToccoaFallsEquivalency } from "@/lib/howardToccoaEquivalencies";
import type { TransferEquivalency, TransferStatus } from "@/types";

type CourseOverride = {
  targetCourseCode?: string;
  targetCourseName?: string;
  targetCredits?: number;
  status?: TransferStatus;
};

/** Institution-specific target mappings (USG catalog → home campus course). */
const CLAYTON_STATE_OVERRIDES: Record<string, CourseOverride> = {
  "comm-1110": {
    targetCourseCode: "COMM 1110",
    targetCourseName: "Public Speaking",
  },
  "biol-1107": {
    targetCourseCode: "BIOL 1111",
    targetCourseName: "Introduction to Biology I",
  },
  "biol-1108": {
    targetCourseCode: "BIOL 1112",
    targetCourseName: "Introduction to Biology II",
  },
  "hist-2111": {
    targetCourseCode: "HIST 2111",
    targetCourseName: "United States History I",
  },
  "hist-2112": {
    targetCourseCode: "HIST 2112",
    targetCourseName: "United States History II",
  },
  "busa-1105": {
    targetCourseCode: "BUSA 1105",
    targetCourseName: "Introduction to Business",
  },
  "arts-1100": {
    targetCourseCode: "ART 1101",
    targetCourseName: "Art Appreciation",
  },
};

const NORTH_GEORGIA_OVERRIDES: Record<string, CourseOverride> = {
  "comm-1110": {
    targetCourseCode: "COMM 1110",
    targetCourseName: "Public Speaking",
  },
  "hist-2111": {
    targetCourseCode: "HIST 2111",
    targetCourseName: "United States History to 1877",
  },
  "hist-2112": {
    targetCourseCode: "HIST 2112",
    targetCourseName: "United States History since 1877",
  },
  "biol-1107": {
    targetCourseCode: "BIOL 1107",
    targetCourseName: "Principles of Biology I",
  },
  "biol-1108": {
    targetCourseCode: "BIOL 1108",
    targetCourseName: "Principles of Biology II",
  },
  "csci-1301": {
    targetCourseCode: "CSCI 1301",
    targetCourseName: "Computer Science I",
  },
  "csci-1302": {
    targetCourseCode: "CSCI 1302",
    targetCourseName: "Computer Science II",
  },
};

const GEORGIA_STATE_OVERRIDES: Record<string, CourseOverride> = {
  "comm-1110": {
    targetCourseCode: "COMM 1100",
    targetCourseName: "Human Communication",
  },
  "hist-2111": {
    targetCourseCode: "HIST 2110",
    targetCourseName: "United States History I",
  },
  "hist-2112": {
    targetCourseCode: "HIST 2120",
    targetCourseName: "United States History II",
  },
  "biol-1107": {
    targetCourseCode: "BIOL 1103",
    targetCourseName: "Introductory Biology I",
  },
  "biol-1108": {
    targetCourseCode: "BIOL 1104",
    targetCourseName: "Introductory Biology II",
  },
  "biol-2111": {
    targetCourseCode: "BIOL 2110",
    targetCourseName: "Human Anatomy and Physiology I",
  },
  "biol-2112": {
    targetCourseCode: "BIOL 2120",
    targetCourseName: "Human Anatomy and Physiology II",
  },
  "arts-1100": {
    targetCourseCode: "AH 1700",
    targetCourseName: "Art Appreciation",
  },
  "musc-1100": {
    targetCourseCode: "MUS 1010",
    targetCourseName: "Music Appreciation",
  },
  "busa-1105": {
    targetCourseCode: "BUSA 2100",
    targetCourseName: "Introduction to Business",
  },
  "phys-2211": {
    targetCourseCode: "ELEC 0000",
    targetCourseName: "Physics I — Free Elective Credit",
    status: "elective",
  },
};

export function buildUsgSchoolEquivalencies(
  targetSchoolId: string,
  overrides: Record<string, CourseOverride> = {},
): TransferEquivalency[] {
  return PRELOADED_COURSES.map((course) => {
    const override = overrides[course.id];

    return {
      id: `eq-${course.id}-${targetSchoolId}`,
      sourceCourseId: course.id,
      targetSchoolId,
      targetCourseCode: override?.targetCourseCode ?? course.courseCode,
      targetCourseName: override?.targetCourseName ?? course.courseName,
      targetCredits: override?.targetCredits ?? course.credits,
      status: override?.status ?? "direct",
    };
  });
}

export const claytonStateEquivalencies = buildUsgSchoolEquivalencies(
  "clayton-state",
  CLAYTON_STATE_OVERRIDES,
);

export const northGeorgiaEquivalencies = buildUsgSchoolEquivalencies(
  "north-georgia",
  NORTH_GEORGIA_OVERRIDES,
);

/** Perimeter DE credits articulate to GSU main campus using GSU course numbers. */
export const georgiaStatePerimeterEquivalencies = buildUsgSchoolEquivalencies(
  "georgia-state",
  GEORGIA_STATE_OVERRIDES,
);

export function buildDirectHomeInstitutionEquivalency(
  sourceCourseId: string,
  targetSchoolId: string,
): TransferEquivalency | null {
  const course = PRELOADED_COURSES.find((entry) => entry.id === sourceCourseId);
  if (!course) {
    return null;
  }

  let overrides: Record<string, CourseOverride> = {};
  if (targetSchoolId === "clayton-state") {
    overrides = CLAYTON_STATE_OVERRIDES;
  } else if (targetSchoolId === "north-georgia") {
    overrides = NORTH_GEORGIA_OVERRIDES;
  } else   if (targetSchoolId === "georgia-state") {
    overrides = GEORGIA_STATE_OVERRIDES;
  } else if (targetSchoolId === "toccoa-falls-college") {
    return buildDirectToccoaFallsEquivalency(sourceCourseId);
  }

  const override = overrides[sourceCourseId];

  return {
    id: `eq-${sourceCourseId}-${targetSchoolId}-origin-direct`,
    sourceCourseId,
    targetSchoolId,
    targetCourseCode: override?.targetCourseCode ?? course.courseCode,
    targetCourseName: override?.targetCourseName ?? course.courseName,
    targetCredits: override?.targetCredits ?? course.credits,
    status: override?.status ?? "direct",
  };
}
