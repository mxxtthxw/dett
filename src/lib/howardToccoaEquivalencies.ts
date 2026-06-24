import { PRELOADED_COURSES } from "@/data/mockData";
import type { TransferEquivalency, TransferStatus } from "@/types";

type CourseOverride = {
  targetCourseCode?: string;
  targetCourseName?: string;
  targetCredits?: number;
  status?: TransferStatus;
};

function buildSchoolEquivalencies(
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

/** Howard University — HBCU core curriculum mappings from Georgia DE/USG courses. */
const HOWARD_OVERRIDES: Record<string, CourseOverride> = {
  "engl-1101": {
    targetCourseCode: "ENGW 105",
    targetCourseName: "Expository Writing I",
  },
  "engl-1102": {
    targetCourseCode: "ENGW 106",
    targetCourseName: "Expository Writing II",
  },
  "comm-1110": {
    targetCourseCode: "COMM 101",
    targetCourseName: "Introduction to Communication",
  },
  "math-1111": {
    targetCourseCode: "MATH 010",
    targetCourseName: "College Algebra",
  },
  "math-1113": {
    targetCourseCode: "MATH 012",
    targetCourseName: "Precalculus",
  },
  "math-2211": {
    targetCourseCode: "MATH 156",
    targetCourseName: "Calculus I",
  },
  "math-2212": {
    targetCourseCode: "MATH 157",
    targetCourseName: "Calculus II",
  },
  "math-1401": {
    targetCourseCode: "MATH 017",
    targetCourseName: "Elementary Statistics",
  },
  "biol-1107": {
    targetCourseCode: "BIOLOGY 101",
    targetCourseName: "General Biology I",
  },
  "biol-1108": {
    targetCourseCode: "BIOLOGY 102",
    targetCourseName: "General Biology II",
  },
  "biol-2111": {
    targetCourseCode: "BIOLOGY 221",
    targetCourseName: "Human Anatomy & Physiology I",
  },
  "biol-2112": {
    targetCourseCode: "BIOLOGY 222",
    targetCourseName: "Human Anatomy & Physiology II",
  },
  "chem-1211": {
    targetCourseCode: "CHEM 003",
    targetCourseName: "General Chemistry I",
  },
  "chem-1212": {
    targetCourseCode: "CHEM 004",
    targetCourseName: "General Chemistry II",
  },
  "phys-2211": {
    targetCourseCode: "PHYS 013",
    targetCourseName: "General Physics I",
    status: "review",
  },
  "geol-1121": {
    targetCourseCode: "ELEC 0000",
    targetCourseName: "Physical Geology — Elective Credit",
    status: "elective",
  },
  "hist-2111": {
    targetCourseCode: "HIST 169",
    targetCourseName: "United States History I",
  },
  "hist-2112": {
    targetCourseCode: "HIST 170",
    targetCourseName: "United States History II",
  },
  "pols-1101": {
    targetCourseCode: "POLS 201",
    targetCourseName: "American Government",
  },
  "psyc-1101": {
    targetCourseCode: "PSYC 101",
    targetCourseName: "Introduction to Psychology",
  },
  "soci-1101": {
    targetCourseCode: "SOCI 102",
    targetCourseName: "Introduction to Sociology",
  },
  "econ-2105": {
    targetCourseCode: "ECON 001",
    targetCourseName: "Principles of Macroeconomics",
  },
  "econ-2106": {
    targetCourseCode: "ECON 002",
    targetCourseName: "Principles of Microeconomics",
  },
  "arts-1100": {
    targetCourseCode: "ART 101",
    targetCourseName: "Introduction to Art",
  },
  "musc-1100": {
    targetCourseCode: "MUSC 101",
    targetCourseName: "Introduction to Music",
  },
  "phil-1010": {
    targetCourseCode: "PHIL 101",
    targetCourseName: "Introduction to Philosophy",
  },
  "csci-1301": {
    targetCourseCode: "CMSC 106",
    targetCourseName: "Introduction to Computer Science",
  },
  "csci-1302": {
    targetCourseCode: "CMSC 112",
    targetCourseName: "Data Structures",
    status: "review",
  },
  "busa-1105": {
    targetCourseCode: "ECON 003",
    targetCourseName: "Introduction to Business",
    status: "elective",
  },
  "acct-2101": {
    targetCourseCode: "ACCT 101",
    targetCourseName: "Principles of Accounting I",
  },
};

/** Boosted direct matches for GA DE pipelines → Howard (TFC, Perimeter, Piedmont). */
const HOWARD_GA_DE_PIPELINE_OVERRIDES: Record<string, CourseOverride> = {
  ...HOWARD_OVERRIDES,
  "biol-2111": {
    targetCourseCode: "BIOLOGY 221",
    targetCourseName: "Human Anatomy & Physiology I",
    status: "direct",
  },
  "biol-2112": {
    targetCourseCode: "BIOLOGY 222",
    targetCourseName: "Human Anatomy & Physiology II",
    status: "direct",
  },
  "phys-2211": {
    targetCourseCode: "PHYS 013",
    targetCourseName: "General Physics I",
    status: "direct",
  },
  "csci-1302": {
    targetCourseCode: "CMSC 112",
    targetCourseName: "Data Structures",
    status: "direct",
  },
  "busa-1105": {
    targetCourseCode: "BUS 101",
    targetCourseName: "Introduction to Business",
    status: "direct",
  },
};

/** Toccoa Falls College — home campus course mappings. */
const TOCCOA_FALLS_OVERRIDES: Record<string, CourseOverride> = {
  "engl-1101": {
    targetCourseCode: "ENG 113",
    targetCourseName: "English Composition I",
  },
  "engl-1102": {
    targetCourseCode: "ENG 123",
    targetCourseName: "English Composition II",
  },
  "comm-1110": {
    targetCourseCode: "COM 113",
    targetCourseName: "Public Speaking",
  },
  "math-1111": {
    targetCourseCode: "MAT 113",
    targetCourseName: "College Algebra",
  },
  "math-1113": {
    targetCourseCode: "MAT 123",
    targetCourseName: "Precalculus",
  },
  "math-2211": {
    targetCourseCode: "MAT 125",
    targetCourseName: "Calculus I",
  },
  "math-2212": {
    targetCourseCode: "MAT 225",
    targetCourseName: "Calculus II",
  },
  "math-1401": {
    targetCourseCode: "MAT 223",
    targetCourseName: "Statistics",
  },
  "biol-1107": {
    targetCourseCode: "BIO 124",
    targetCourseName: "General Biology I",
  },
  "biol-1108": {
    targetCourseCode: "BIO 134",
    targetCourseName: "General Biology II",
  },
  "biol-2111": {
    targetCourseCode: "BIO 213",
    targetCourseName: "Anatomy & Physiology I",
  },
  "biol-2112": {
    targetCourseCode: "BIO 223",
    targetCourseName: "Anatomy & Physiology II",
  },
  "chem-1211": {
    targetCourseCode: "CHE 111",
    targetCourseName: "General Chemistry I",
  },
  "chem-1212": {
    targetCourseCode: "CHE 121",
    targetCourseName: "General Chemistry II",
  },
  "phys-2211": {
    targetCourseCode: "PHY 113",
    targetCourseName: "General Physics I",
    status: "review",
  },
  "geol-1121": {
    targetCourseCode: "SCI 113",
    targetCourseName: "Earth Science",
  },
  "hist-2111": {
    targetCourseCode: "HIS 113",
    targetCourseName: "U.S. History I",
  },
  "hist-2112": {
    targetCourseCode: "HIS 123",
    targetCourseName: "U.S. History II",
  },
  "pols-1101": {
    targetCourseCode: "POL 213",
    targetCourseName: "American Government",
  },
  "psyc-1101": {
    targetCourseCode: "PSY 113",
    targetCourseName: "General Psychology",
  },
  "soci-1101": {
    targetCourseCode: "SOC 113",
    targetCourseName: "Introduction to Sociology",
  },
  "econ-2105": {
    targetCourseCode: "ECO 213",
    targetCourseName: "Macroeconomics",
  },
  "econ-2106": {
    targetCourseCode: "ECO 223",
    targetCourseName: "Microeconomics",
  },
  "arts-1100": {
    targetCourseCode: "ART 113",
    targetCourseName: "Art Appreciation",
  },
  "musc-1100": {
    targetCourseCode: "MUS 113",
    targetCourseName: "Music Appreciation",
  },
  "phil-1010": {
    targetCourseCode: "PHI 213",
    targetCourseName: "Introduction to Philosophy",
  },
  "csci-1301": {
    targetCourseCode: "CSC 113",
    targetCourseName: "Computer Science I",
  },
  "csci-1302": {
    targetCourseCode: "CSC 123",
    targetCourseName: "Computer Science II",
  },
  "busa-1105": {
    targetCourseCode: "BUS 113",
    targetCourseName: "Introduction to Business",
  },
  "acct-2101": {
    targetCourseCode: "ACC 213",
    targetCourseName: "Financial Accounting",
  },
};

export const howardEquivalencies = buildSchoolEquivalencies(
  "howard",
  HOWARD_OVERRIDES,
);

export const howardGaDePipelineEquivalencies = buildSchoolEquivalencies(
  "howard",
  HOWARD_GA_DE_PIPELINE_OVERRIDES,
);

export const toccoaFallsEquivalencies = buildSchoolEquivalencies(
  "toccoa-falls-college",
  TOCCOA_FALLS_OVERRIDES,
);

/** Spelman College — full HBCU women's college catalog mappings. */
const SPELMAN_OVERRIDES: Record<string, CourseOverride> = {
  "engl-1101": {
    targetCourseCode: "ENG 103",
    targetCourseName: "Composition I",
  },
  "engl-1102": {
    targetCourseCode: "ENG 104",
    targetCourseName: "Composition II",
  },
  "comm-1110": {
    targetCourseCode: "COM 101",
    targetCourseName: "Introduction to Communication",
  },
  "math-1111": {
    targetCourseCode: "MAT 115",
    targetCourseName: "College Algebra",
  },
  "math-1113": {
    targetCourseCode: "MAT 125",
    targetCourseName: "Precalculus",
  },
  "math-2211": {
    targetCourseCode: "MAT 192",
    targetCourseName: "Calculus I",
  },
  "math-2212": {
    targetCourseCode: "MAT 193",
    targetCourseName: "Calculus II",
  },
  "math-1401": {
    targetCourseCode: "MAT 140",
    targetCourseName: "Statistics",
  },
  "biol-1107": {
    targetCourseCode: "BIO 115",
    targetCourseName: "Organismal Biology",
  },
  "biol-1108": {
    targetCourseCode: "BIO 116",
    targetCourseName: "Cellular Biology",
  },
  "biol-2111": {
    targetCourseCode: "BIO 231",
    targetCourseName: "Human Anatomy & Physiology I",
  },
  "biol-2112": {
    targetCourseCode: "BIO 232",
    targetCourseName: "Human Anatomy & Physiology II",
  },
  "chem-1211": {
    targetCourseCode: "CHE 111",
    targetCourseName: "General Chemistry I",
  },
  "chem-1212": {
    targetCourseCode: "CHE 112",
    targetCourseName: "General Chemistry II",
    status: "review",
  },
  "phys-2211": {
    targetCourseCode: "PHY 111",
    targetCourseName: "General Physics I",
    status: "review",
  },
  "geol-1121": {
    targetCourseCode: "ELEC 0000",
    targetCourseName: "Physical Geology — Elective Credit",
    status: "elective",
  },
  "hist-2111": {
    targetCourseCode: "HIS 103",
    targetCourseName: "United States History I",
  },
  "hist-2112": {
    targetCourseCode: "HIS 104",
    targetCourseName: "United States History II",
  },
  "pols-1101": {
    targetCourseCode: "POL 201",
    targetCourseName: "American Government",
  },
  "psyc-1101": {
    targetCourseCode: "PSYC 101",
    targetCourseName: "Introduction to Psychology",
  },
  "soci-1101": {
    targetCourseCode: "SOC 101",
    targetCourseName: "Introduction to Sociology",
  },
  "econ-2105": {
    targetCourseCode: "ECON 201",
    targetCourseName: "Principles of Macroeconomics",
  },
  "econ-2106": {
    targetCourseCode: "ECON 202",
    targetCourseName: "Principles of Microeconomics",
  },
  "arts-1100": {
    targetCourseCode: "ART 103",
    targetCourseName: "Art Appreciation",
  },
  "musc-1100": {
    targetCourseCode: "MUS 103",
    targetCourseName: "Music Appreciation",
  },
  "phil-1010": {
    targetCourseCode: "PHIL 101",
    targetCourseName: "Introduction to Philosophy",
  },
  "csci-1301": {
    targetCourseCode: "CSCI 1301",
    targetCourseName: "Introduction to Computer Science",
  },
  "csci-1302": {
    targetCourseCode: "ELEC 0000",
    targetCourseName: "Advanced Programming — Elective Credit",
    status: "elective",
  },
  "busa-1105": {
    targetCourseCode: "BUS 101",
    targetCourseName: "Introduction to Business",
  },
  "acct-2101": {
    targetCourseCode: "ACC 201",
    targetCourseName: "Principles of Accounting I",
  },
};

export const spelmanEquivalencies = buildSchoolEquivalencies(
  "spelman",
  SPELMAN_OVERRIDES,
);

export function lookupHowardEquivalency(
  sourceCourseId: string,
  useGaDePipeline: boolean,
): TransferEquivalency | null {
  const table = useGaDePipeline
    ? howardGaDePipelineEquivalencies
    : howardEquivalencies;

  return table.find((entry) => entry.sourceCourseId === sourceCourseId) ?? null;
}

export function lookupToccoaFallsEquivalency(
  sourceCourseId: string,
): TransferEquivalency | null {
  return (
    toccoaFallsEquivalencies.find(
      (entry) => entry.sourceCourseId === sourceCourseId,
    ) ?? null
  );
}

export function buildDirectToccoaFallsEquivalency(
  sourceCourseId: string,
): TransferEquivalency | null {
  const course = PRELOADED_COURSES.find((entry) => entry.id === sourceCourseId);
  if (!course) {
    return null;
  }

  const override = TOCCOA_FALLS_OVERRIDES[sourceCourseId];

  return {
    id: `eq-${sourceCourseId}-toccoa-falls-college-origin-direct`,
    sourceCourseId,
    targetSchoolId: "toccoa-falls-college",
    targetCourseCode: override?.targetCourseCode ?? course.courseCode,
    targetCourseName: override?.targetCourseName ?? course.courseName,
    targetCredits: override?.targetCredits ?? course.credits,
    status: override?.status ?? "direct",
  };
}
