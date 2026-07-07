import { buildUsgSchoolEquivalencies } from "@/lib/usgEquivalencyBuilder";
import type { TransferEquivalency, TransferStatus } from "@/types";

type O = {
  targetCourseCode?: string;
  targetCourseName?: string;
  targetCredits?: number;
  status?: TransferStatus;
};

const REVIEW_CSCI1302: O = {
  targetCourseCode: "TBR 0000",
  targetCourseName: "Advanced Programming — Departmental Review Required",
  status: "review",
};

const REVIEW_CHEM1212: O = {
  targetCourseCode: "TBR 0000",
  targetCourseName: "General Chemistry II — Departmental Review Required",
  status: "review",
};

/** Shared USG-style gen-ed + STEM mappings for Georgia public universities. */
const USG_GEN_ED: Record<string, O> = {
  "comm-1110": {
    targetCourseCode: "COMM 1110",
    targetCourseName: "Public Speaking",
  },
  "hist-2111": {
    targetCourseCode: "HIST 2111",
    targetCourseName: "United States History I",
  },
  "hist-2112": {
    targetCourseCode: "HIST 2112",
    targetCourseName: "United States History II",
  },
  "pols-1101": {
    targetCourseCode: "POLS 1101",
    targetCourseName: "American Government",
  },
  "psyc-1101": {
    targetCourseCode: "PSYC 1101",
    targetCourseName: "Introduction to Psychology",
  },
  "soci-1101": {
    targetCourseCode: "SOCI 1101",
    targetCourseName: "Introduction to Sociology",
  },
  "arts-1100": {
    targetCourseCode: "ART 1100",
    targetCourseName: "Art Appreciation",
  },
  "musc-1100": {
    targetCourseCode: "MUS 1100",
    targetCourseName: "Music Appreciation",
  },
  "phil-1010": {
    targetCourseCode: "PHIL 1010",
    targetCourseName: "Introduction to Philosophy",
  },
  "econ-2105": {
    targetCourseCode: "ECON 2105",
    targetCourseName: "Principles of Macroeconomics",
  },
  "econ-2106": {
    targetCourseCode: "ECON 2106",
    targetCourseName: "Principles of Microeconomics",
  },
  "biol-1107": {
    targetCourseCode: "BIOL 1107",
    targetCourseName: "Principles of Biology I",
  },
  "biol-1108": {
    targetCourseCode: "BIOL 1108",
    targetCourseName: "Principles of Biology II",
  },
  "biol-2111": {
    targetCourseCode: "BIOL 2111",
    targetCourseName: "Human Anatomy & Physiology I",
  },
  "biol-2112": {
    targetCourseCode: "BIOL 2112",
    targetCourseName: "Human Anatomy & Physiology II",
  },
  "csci-1301": {
    targetCourseCode: "CSCI 1301",
    targetCourseName: "Computer Science I",
  },
  "csci-1302": REVIEW_CSCI1302,
  "chem-1211": {
    targetCourseCode: "CHEM 1211",
    targetCourseName: "General Chemistry I",
  },
  "chem-1212": REVIEW_CHEM1212,
  "busa-1105": {
    targetCourseCode: "BUSA 1105",
    targetCourseName: "Introduction to Business",
  },
  "acct-2101": {
    targetCourseCode: "ACCT 2101",
    targetCourseName: "Principles of Accounting I",
  },
};

function catalog(schoolId: string, overrides: Record<string, O> = {}) {
  return buildUsgSchoolEquivalencies(schoolId, { ...USG_GEN_ED, ...overrides });
}

const EMORY_OVERRIDES: Record<string, O> = {
  "engl-1101": {
    targetCourseCode: "ENG 101",
    targetCourseName: "Expository Writing",
  },
  "engl-1102": {
    targetCourseCode: "ENG 102",
    targetCourseName: "Research Writing",
  },
  "comm-1110": {
    targetCourseCode: "COMM 101",
    targetCourseName: "Public Speaking",
  },
  "math-1111": {
    targetCourseCode: "MATH 111",
    targetCourseName: "College Algebra",
  },
  "math-1113": {
    targetCourseCode: "MATH 112",
    targetCourseName: "Precalculus",
  },
  "math-2211": {
    targetCourseCode: "MATH 111",
    targetCourseName: "Calculus I",
  },
  "math-2212": {
    targetCourseCode: "MATH 112",
    targetCourseName: "Calculus II",
  },
  "math-1401": {
    targetCourseCode: "QTM 100",
    targetCourseName: "Introduction to Statistics",
  },
  "biol-1107": {
    targetCourseCode: "BIOL 141",
    targetCourseName: "Foundations of Biology I",
  },
  "biol-1108": {
    targetCourseCode: "BIOL 142",
    targetCourseName: "Foundations of Biology II",
  },
  "biol-2111": {
    targetCourseCode: "BIOL 301",
    targetCourseName: "Human Anatomy & Physiology I",
    status: "review",
  },
  "biol-2112": {
    targetCourseCode: "BIOL 302",
    targetCourseName: "Human Anatomy & Physiology II",
    status: "review",
  },
  "chem-1211": {
    targetCourseCode: "CHEM 150",
    targetCourseName: "General Chemistry I",
  },
  "chem-1212": REVIEW_CHEM1212,
  "phys-2211": {
    targetCourseCode: "PHYS 141",
    targetCourseName: "Introductory Physics I",
    status: "review",
  },
  "geol-1121": {
    targetCourseCode: "ELEC 0000",
    targetCourseName: "Physical Geology — Elective Credit",
    status: "elective",
  },
  "hist-2111": {
    targetCourseCode: "HIST 185",
    targetCourseName: "United States History I",
  },
  "hist-2112": {
    targetCourseCode: "HIST 186",
    targetCourseName: "United States History II",
  },
  "pols-1101": {
    targetCourseCode: "POLS 100",
    targetCourseName: "American Government",
  },
  "psyc-1101": {
    targetCourseCode: "PSYC 110",
    targetCourseName: "Introduction to Psychology",
  },
  "soci-1101": {
    targetCourseCode: "SOC 101",
    targetCourseName: "Introduction to Sociology",
  },
  "econ-2105": {
    targetCourseCode: "ECON 101",
    targetCourseName: "Principles of Macroeconomics",
  },
  "econ-2106": {
    targetCourseCode: "ECON 102",
    targetCourseName: "Principles of Microeconomics",
  },
  "arts-1100": {
    targetCourseCode: "ART 101",
    targetCourseName: "Art Appreciation",
  },
  "musc-1100": {
    targetCourseCode: "MUS 101",
    targetCourseName: "Music Appreciation",
  },
  "phil-1010": {
    targetCourseCode: "PHIL 101",
    targetCourseName: "Introduction to Philosophy",
  },
  "csci-1301": {
    targetCourseCode: "CS 170",
    targetCourseName: "Computer Science I",
  },
  "csci-1302": REVIEW_CSCI1302,
  "busa-1105": {
    targetCourseCode: "ELEC 0000",
    targetCourseName: "Introduction to Business — Elective Credit",
    status: "elective",
  },
  "acct-2101": {
    targetCourseCode: "BUS 201",
    targetCourseName: "Principles of Accounting I",
    status: "review",
  },
};

const MERCER_OVERRIDES: Record<string, O> = {
  "engl-1101": { targetCourseCode: "ENG 111", targetCourseName: "Composition I" },
  "engl-1102": { targetCourseCode: "ENG 112", targetCourseName: "Composition II" },
  "math-2211": { targetCourseCode: "MAT 191", targetCourseName: "Calculus I" },
  "math-2212": { targetCourseCode: "MAT 192", targetCourseName: "Calculus II" },
  "csci-1301": { targetCourseCode: "CSC 120", targetCourseName: "Computer Science I" },
  "csci-1302": REVIEW_CSCI1302,
  "busa-1105": {
    targetCourseCode: "BUS 101",
    targetCourseName: "Introduction to Business",
  },
};

const HBCU_STANDARD: Record<string, O> = {
  "engl-1101": { targetCourseCode: "ENG 101", targetCourseName: "English Composition I" },
  "engl-1102": { targetCourseCode: "ENG 102", targetCourseName: "English Composition II" },
  "hist-2111": { targetCourseCode: "HIST 101", targetCourseName: "United States History I" },
  "hist-2112": { targetCourseCode: "HIST 102", targetCourseName: "United States History II" },
  "pols-1101": { targetCourseCode: "POL 101", targetCourseName: "American Government" },
  "psyc-1101": { targetCourseCode: "PSY 101", targetCourseName: "Introduction to Psychology" },
  "math-2211": { targetCourseCode: "MATH 1314", targetCourseName: "Calculus I" },
  "math-2212": { targetCourseCode: "MATH 2414", targetCourseName: "Calculus II" },
  "csci-1301": { targetCourseCode: "CSC 1301", targetCourseName: "Computer Science I" },
  "csci-1302": REVIEW_CSCI1302,
  "biol-1107": { targetCourseCode: "BIO 101", targetCourseName: "General Biology I" },
  "chem-1211": { targetCourseCode: "CHE 111", targetCourseName: "General Chemistry I" },
  "chem-1212": REVIEW_CHEM1212,
};

const UNC_OVERRIDES: Record<string, O> = {
  "engl-1101": { targetCourseCode: "ENGL 105", targetCourseName: "English Composition" },
  "engl-1102": { targetCourseCode: "ENGL 105", targetCourseName: "English Composition II" },
  "comm-1110": { targetCourseCode: "COMM 113", targetCourseName: "Public Speaking" },
  "math-2211": { targetCourseCode: "MATH 231", targetCourseName: "Calculus of One Variable" },
  "math-2212": { targetCourseCode: "MATH 232", targetCourseName: "Calculus of One Variable II" },
  "math-1111": { targetCourseCode: "MATH 110", targetCourseName: "College Algebra" },
  "math-1401": { targetCourseCode: "STOR 155", targetCourseName: "Introduction to Statistics" },
  "biol-1107": { targetCourseCode: "BIOL 101", targetCourseName: "Principles of Biology" },
  "chem-1211": { targetCourseCode: "CHEM 101", targetCourseName: "General Chemistry I" },
  "chem-1212": REVIEW_CHEM1212,
  "hist-2111": { targetCourseCode: "HIST 128", targetCourseName: "United States History to 1865" },
  "hist-2112": { targetCourseCode: "HIST 129", targetCourseName: "United States History since 1865" },
  "pols-1101": { targetCourseCode: "POLI 100", targetCourseName: "American Government" },
  "psyc-1101": { targetCourseCode: "PSYC 101", targetCourseName: "General Psychology" },
  "csci-1301": { targetCourseCode: "COMP 110", targetCourseName: "Introduction to Programming" },
  "csci-1302": { targetCourseCode: "COMP 401", targetCourseName: "Data Structures", status: "review" },
  "econ-2105": { targetCourseCode: "ECON 101", targetCourseName: "Introduction to Economics" },
};

const FLORIDA_OVERRIDES: Record<string, O> = {
  "engl-1101": { targetCourseCode: "ENC 1101", targetCourseName: "English Composition I" },
  "engl-1102": { targetCourseCode: "ENC 1102", targetCourseName: "English Composition II" },
  "math-2211": { targetCourseCode: "MAC 2311", targetCourseName: "Calculus I" },
  "math-2212": { targetCourseCode: "MAC 2312", targetCourseName: "Calculus II" },
  "math-1111": { targetCourseCode: "MAC 1105", targetCourseName: "College Algebra" },
  "biol-1107": { targetCourseCode: "BSC 2010", targetCourseName: "Integrated Principles of Biology I" },
  "biol-1108": { targetCourseCode: "BSC 2011", targetCourseName: "Integrated Principles of Biology II" },
  "chem-1211": { targetCourseCode: "CHM 2045", targetCourseName: "General Chemistry I" },
  "chem-1212": REVIEW_CHEM1212,
  "hist-2111": { targetCourseCode: "AMH 2010", targetCourseName: "United States History I" },
  "hist-2112": { targetCourseCode: "AMH 2020", targetCourseName: "United States History II" },
  "pols-1101": { targetCourseCode: "POS 2041", targetCourseName: "American Federal Government" },
  "psyc-1101": { targetCourseCode: "PSY 2012", targetCourseName: "General Psychology" },
  "csci-1301": { targetCourseCode: "COP 3503", targetCourseName: "Programming Fundamentals I" },
  "csci-1302": { targetCourseCode: "COP 3530", targetCourseName: "Data Structures", status: "review" },
  "econ-2105": { targetCourseCode: "ECO 2013", targetCourseName: "Principles of Macroeconomics" },
  "econ-2106": { targetCourseCode: "ECO 2023", targetCourseName: "Principles of Microeconomics" },
};

const UAB_OVERRIDES: Record<string, O> = {
  "engl-1101": { targetCourseCode: "EH 101", targetCourseName: "English Composition I" },
  "engl-1102": { targetCourseCode: "EH 102", targetCourseName: "English Composition II" },
  "math-2211": { targetCourseCode: "MA 125", targetCourseName: "Calculus I" },
  "math-2212": { targetCourseCode: "MA 126", targetCourseName: "Calculus II" },
  "biol-1107": { targetCourseCode: "BY 123", targetCourseName: "Introductory Biology I" },
  "chem-1211": { targetCourseCode: "CH 115", targetCourseName: "General Chemistry I" },
  "chem-1212": REVIEW_CHEM1212,
  "hist-2111": { targetCourseCode: "HY 101", targetCourseName: "Western Civilization I" },
  "pols-1101": { targetCourseCode: "PSC 100", targetCourseName: "American Government" },
  "psyc-1101": { targetCourseCode: "PY 101", targetCourseName: "Introduction to Psychology" },
  "csci-1301": { targetCourseCode: "CS 103", targetCourseName: "Intro to Computer Science" },
  "csci-1302": REVIEW_CSCI1302,
};

const AUBURN_OVERRIDES: Record<string, O> = {
  "engl-1101": { targetCourseCode: "ENGL 1100", targetCourseName: "English Composition I" },
  "engl-1102": { targetCourseCode: "ENGL 1120", targetCourseName: "English Composition II" },
  "math-2211": { targetCourseCode: "MATH 1610", targetCourseName: "Calculus I" },
  "math-2212": { targetCourseCode: "MATH 1620", targetCourseName: "Calculus II" },
  "biol-1107": { targetCourseCode: "BIOL 1030", targetCourseName: "Organismal Biology" },
  "chem-1211": { targetCourseCode: "CHEM 1030", targetCourseName: "Fundamentals Chemistry I" },
  "chem-1212": REVIEW_CHEM1212,
  "hist-2111": { targetCourseCode: "HIST 1010", targetCourseName: "World History I" },
  "pols-1101": { targetCourseCode: "POLI 1090", targetCourseName: "American Government" },
  "psyc-1101": { targetCourseCode: "PSYC 2010", targetCourseName: "Introduction to Psychology" },
  "csci-1301": { targetCourseCode: "COMP 1210", targetCourseName: "Fundamentals of Computing I" },
  "csci-1302": { targetCourseCode: "COMP 1220", targetCourseName: "Fundamentals of Computing II", status: "review" },
  "econ-2105": { targetCourseCode: "ECON 2020", targetCourseName: "Principles of Macroeconomics" },
};

const ALABAMA_OVERRIDES: Record<string, O> = {
  "engl-1101": { targetCourseCode: "EN 101", targetCourseName: "English Composition I" },
  "engl-1102": { targetCourseCode: "EN 102", targetCourseName: "English Composition II" },
  "math-2211": { targetCourseCode: "MATH 125", targetCourseName: "Calculus I" },
  "math-2212": { targetCourseCode: "MATH 126", targetCourseName: "Calculus II" },
  "biol-1107": { targetCourseCode: "BSC 114", targetCourseName: "Principles of Biology I" },
  "chem-1211": { targetCourseCode: "CH 101", targetCourseName: "General Chemistry I" },
  "chem-1212": REVIEW_CHEM1212,
  "hist-2111": { targetCourseCode: "HY 101", targetCourseName: "Western Civilization I" },
  "pols-1101": { targetCourseCode: "PSC 100", targetCourseName: "American Government" },
  "psyc-1101": { targetCourseCode: "PY 101", targetCourseName: "Introductory Psychology" },
  "csci-1301": { targetCourseCode: "CS 100", targetCourseName: "Computer Science I" },
  "csci-1302": REVIEW_CSCI1302,
  "econ-2105": { targetCourseCode: "EC 111", targetCourseName: "Principles of Macroeconomics" },
};

export const emoryEquivalencies = buildUsgSchoolEquivalencies(
  "emory",
  EMORY_OVERRIDES,
);

export const georgiaSouthernEquivalencies = catalog("georgia-southern", {
  "arts-1100": {
    targetCourseCode: "ELEC 0000",
    targetCourseName: "Art Appreciation — Fine Arts Elective",
    status: "elective",
  },
});

export const augustaEquivalencies = catalog("augusta", {
  "csci-1301": { targetCourseCode: "CSCI 1301", targetCourseName: "Computer Science I" },
});

export const mercerEquivalencies = catalog("mercer", MERCER_OVERRIDES);
export const valdostaStateEquivalencies = catalog("valdosta-state");
export const westGeorgiaEquivalencies = catalog("west-georgia");
export const columbusStateEquivalencies = catalog("columbus-state");
export const clarkAtlantaEquivalencies = catalog("clark-atlanta", HBCU_STANDARD);
export const tuskegeeEquivalencies = catalog("tuskegee", HBCU_STANDARD);
export const morehouseEquivalencies = catalog("morehouse", {
  ...HBCU_STANDARD,
  "math-2211": { targetCourseCode: "MATH 1314", targetCourseName: "Calculus I" },
  "phil-1010": { targetCourseCode: "PHIL 101", targetCourseName: "Introduction to Philosophy" },
});
export const ncAtEquivalencies = catalog("nc-at", HBCU_STANDARD);
export const famuEquivalencies = catalog("famu", {
  ...HBCU_STANDARD,
  "math-2211": { targetCourseCode: "MAC 2311", targetCourseName: "Calculus I" },
  "csci-1301": { targetCourseCode: "COP 2210", targetCourseName: "Programming I" },
  "hist-2111": { targetCourseCode: "AMH 2010", targetCourseName: "United States History I" },
  "busa-1105": { targetCourseCode: "GEB 1011", targetCourseName: "Introduction to Business" },
});

export const uncChapelHillEquivalencies = catalog("unc-chapel-hill", UNC_OVERRIDES);
export const floridaEquivalencies = catalog("florida", FLORIDA_OVERRIDES);
export const uabEquivalencies = catalog("uab", UAB_OVERRIDES);
export const auburnEquivalencies = catalog("auburn", AUBURN_OVERRIDES);
export const alabamaEquivalencies = catalog("alabama", ALABAMA_OVERRIDES);

export const extendedSchoolEquivalencies: TransferEquivalency[] = [
  ...emoryEquivalencies,
  ...georgiaSouthernEquivalencies,
  ...augustaEquivalencies,
  ...mercerEquivalencies,
  ...valdostaStateEquivalencies,
  ...westGeorgiaEquivalencies,
  ...columbusStateEquivalencies,
  ...clarkAtlantaEquivalencies,
  ...tuskegeeEquivalencies,
  ...morehouseEquivalencies,
  ...ncAtEquivalencies,
  ...famuEquivalencies,
  ...uncChapelHillEquivalencies,
  ...floridaEquivalencies,
  ...uabEquivalencies,
  ...auburnEquivalencies,
  ...alabamaEquivalencies,
];
