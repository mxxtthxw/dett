import { MOCK_EQUIVALENCIES } from "@/data/equivalencies";
import { PRELOADED_SCHOOLS } from "@/data/mockData";

export interface AlternativeEquivalent {
  schoolId: string;
  schoolName: string;
  targetCourseCode: string;
  targetCourseName: string;
  status: string;
}

export function getAlternativeEquivalents(
  sourceCourseId: string,
  excludeSchoolId = "columbus-state",
  limit = 4,
): AlternativeEquivalent[] {
  return MOCK_EQUIVALENCIES.filter(
    (entry) =>
      entry.sourceCourseId === sourceCourseId &&
      entry.targetSchoolId !== excludeSchoolId,
  )
    .slice(0, limit)
    .map((entry) => ({
      schoolId: entry.targetSchoolId,
      schoolName:
        PRELOADED_SCHOOLS.find((school) => school.id === entry.targetSchoolId)
          ?.name ?? entry.targetSchoolId,
      targetCourseCode: entry.targetCourseCode,
      targetCourseName: entry.targetCourseName,
      status: entry.status ?? "direct",
    }));
}
