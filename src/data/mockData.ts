import type { DualEnrollmentCourse, School } from "@/types";

/** Shared catalog source for preloaded dual-enrollment course templates. */
export const PRELOAD_CATALOG_SCHOOL_ID = "dual-enrollment-catalog";

export const PRELOADED_SCHOOLS: School[] = [
  {
    id: "uga",
    name: "University of Georgia",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "georgia-tech",
    name: "Georgia Institute of Technology",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "georgia-state",
    name: "Georgia State University",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "kennesaw-state",
    name: "Kennesaw State University",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "georgia-southern",
    name: "Georgia Southern University",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "emory",
    name: "Emory University",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "augusta",
    name: "Augusta University",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "mercer",
    name: "Mercer University",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "valdosta-state",
    name: "Valdosta State University",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "west-georgia",
    name: "University of West Georgia",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "columbus-state",
    name: "Columbus State University",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "clayton-state",
    name: "Clayton State University",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "north-georgia",
    name: "University of North Georgia",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "morehouse",
    name: "Morehouse College",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "spelman",
    name: "Spelman College",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "clark-atlanta",
    name: "Clark Atlanta University",
    type: "university",
    state: "GA",
    is_retro: true,
  },
  {
    id: "nc-at",
    name: "North Carolina A&T State University",
    type: "university",
    state: "NC",
    is_retro: true,
  },
  {
    id: "famu",
    name: "Florida A&M University",
    type: "university",
    state: "FL",
    is_retro: true,
  },
  {
    id: "tuskegee",
    name: "Tuskegee University",
    type: "university",
    state: "AL",
    is_retro: true,
  },
];

/** Common institutions where Georgia students take dual enrollment courses. */
export const DE_ORIGIN_SCHOOLS = [
  { id: "georgia-state", name: "Georgia State University" },
  { id: "georgia-state-perimeter", name: "Georgia State Perimeter" },
  { id: "gwinnett-tech", name: "Gwinnett Technical College" },
  { id: "north-georgia", name: "University of North Georgia" },
  { id: "georgia-highlands", name: "Georgia Highlands College" },
  { id: "perimeter-college", name: "Perimeter College (Georgia State)" },
  { id: "southern-crescent-tech", name: "Southern Crescent Tech" },
  { id: "ga-piedmont-tech", name: "GA Piedmont Tech" },
  { id: "clayton-state", name: "Clayton State" },
  { id: "gordon-college", name: "Gordon College" },
  { id: "toccoa-falls-college", name: "Toccoa Falls College" },
] as const;

export const DEFAULT_ORIGIN_SCHOOL_ID = DE_ORIGIN_SCHOOLS[0].id;

export function getOriginSchoolName(originSchoolId: string): string {
  return (
    DE_ORIGIN_SCHOOLS.find((school) => school.id === originSchoolId)?.name ??
    DE_ORIGIN_SCHOOLS[0].name
  );
}

export const PRELOADED_COURSES: DualEnrollmentCourse[] = [
  // English & Communications
  {
    id: "engl-1101",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "ENGL 1101",
    courseName: "English Composition I",
    credits: 3,
  },
  {
    id: "engl-1102",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "ENGL 1102",
    courseName: "English Composition II",
    credits: 3,
  },
  {
    id: "comm-1110",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "COMM 1110",
    courseName: "Public Speaking",
    credits: 3,
  },
  // Mathematics
  {
    id: "math-1111",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "MATH 1111",
    courseName: "College Algebra",
    credits: 3,
  },
  {
    id: "math-1113",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "MATH 1113",
    courseName: "Precalculus",
    credits: 3,
  },
  {
    id: "math-2211",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "MATH 2211",
    courseName: "Calculus I",
    credits: 4,
  },
  {
    id: "math-2212",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "MATH 2212",
    courseName: "Calculus II",
    credits: 4,
  },
  {
    id: "math-1401",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "MATH 1401",
    courseName: "Elementary Statistics",
    credits: 3,
  },
  // Natural Sciences
  {
    id: "biol-1107",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "BIOL 1107",
    courseName: "Principles of Biology I (plus Lab)",
    credits: 4,
  },
  {
    id: "biol-1108",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "BIOL 1108",
    courseName: "Principles of Biology II (plus Lab)",
    credits: 4,
  },
  {
    id: "biol-2111",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "BIOL 2111",
    courseName: "Anatomy & Physiology I (plus Lab)",
    credits: 4,
  },
  {
    id: "biol-2112",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "BIOL 2112",
    courseName: "Anatomy & Physiology II (plus Lab)",
    credits: 4,
  },
  {
    id: "chem-1211",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "CHEM 1211",
    courseName: "Principles of Chemistry I (plus Lab)",
    credits: 4,
  },
  {
    id: "chem-1212",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "CHEM 1212",
    courseName: "Principles of Chemistry II (plus Lab)",
    credits: 4,
  },
  {
    id: "phys-2211",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "PHYS 2211",
    courseName: "Principles of Physics I",
    credits: 4,
  },
  {
    id: "geol-1121",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "GEOL 1121",
    courseName: "Physical Geology",
    credits: 4,
  },
  // Social Sciences & History
  {
    id: "hist-2111",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "HIST 2111",
    courseName: "United States History I",
    credits: 3,
  },
  {
    id: "hist-2112",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "HIST 2112",
    courseName: "United States History II",
    credits: 3,
  },
  {
    id: "pols-1101",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "POLS 1101",
    courseName: "American Government",
    credits: 3,
  },
  {
    id: "psyc-1101",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "PSYC 1101",
    courseName: "Introduction to General Psychology",
    credits: 3,
  },
  {
    id: "soci-1101",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "SOCI 1101",
    courseName: "Introduction to Sociology",
    credits: 3,
  },
  {
    id: "econ-2105",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "ECON 2105",
    courseName: "Principles of Macroeconomics",
    credits: 3,
  },
  {
    id: "econ-2106",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "ECON 2106",
    courseName: "Principles of Microeconomics",
    credits: 3,
  },
  // Humanities & Fine Arts
  {
    id: "arts-1100",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "ARTS 1100",
    courseName: "Art Appreciation",
    credits: 3,
  },
  {
    id: "musc-1100",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "MUSC 1100",
    courseName: "Music Appreciation",
    credits: 3,
  },
  {
    id: "phil-1010",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "PHIL 1010",
    courseName: "Introduction to Philosophy",
    credits: 3,
  },
  // Technology & Business
  {
    id: "csci-1301",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "CSCI 1301",
    courseName: "Introduction to Computing / Programming I",
    credits: 3,
  },
  {
    id: "csci-1302",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "CSCI 1302",
    courseName: "Advanced Computing / Programming II",
    credits: 3,
  },
  {
    id: "busa-1105",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "BUSA 1105",
    courseName: "Introduction to Business",
    credits: 3,
  },
  {
    id: "acct-2101",
    schoolId: PRELOAD_CATALOG_SCHOOL_ID,
    courseCode: "ACCT 2101",
    courseName: "Principles of Accounting I",
    credits: 3,
  },
];
