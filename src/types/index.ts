export type SchoolType = "high_school" | "community_college" | "university";

export interface School {
  id: string;
  name: string;
  type: SchoolType;
  state?: string;
  is_retro: boolean;
}

export interface DualEnrollmentCourse {
  id: string;
  schoolId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  term?: string;
  grade?: string;
}

export type TransferStatus = "direct" | "review" | "elective";

export interface TransferEquivalency {
  id: string;
  sourceCourseId: string;
  targetSchoolId: string;
  targetCourseCode: string;
  targetCourseName: string;
  targetCredits: number;
  status?: TransferStatus;
}

export type WizardStep =
  | "schools"
  | "origin"
  | "name"
  | "story"
  | "courses"
  | "results";

export interface StudentProfile {
  displayName: string;
  intendedMajor: string;
  schools: School[];
  courses: DualEnrollmentCourse[];
  equivalencies: TransferEquivalency[];
  communityCollegeId?: string;
  targetSchoolIds: string[];
  wizardStep: WizardStep;
  username?: string;
  accountCreated?: boolean;
  savePromptDismissed?: boolean;
  /** Institution where the student took their DE classes. */
  originSchoolId: string;
  currentGpa?: number;
  hsCredits?: number;
  semesterCollegeCredits?: number;
  lastAdvisorAdvice?: string;
}

export function createEmptyStudentProfile(): StudentProfile {
  return {
    displayName: "",
    intendedMajor: "",
    schools: [],
    courses: [],
    equivalencies: [],
    targetSchoolIds: [],
    wizardStep: "name",
    accountCreated: false,
    savePromptDismissed: false,
    originSchoolId: "georgia-state",
  };
}
