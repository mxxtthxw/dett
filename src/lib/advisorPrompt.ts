import { summarizeSchoolCredits } from "@/lib/equivalencies";
import { groupCoursesByRequirement } from "@/lib/requirements";
import { getOriginSchoolName } from "@/data/mockData";
import type { DualEnrollmentCourse, School } from "@/types";

export interface AdvisorRequestPayload {
  displayName: string;
  intendedMajor: string;
  targetSchools: Array<{ id: string; name: string }>;
  courses: Array<{
    id: string;
    courseCode: string;
    courseName: string;
    credits: number;
  }>;
  schoolSummaries: Array<{
    schoolId: string;
    schoolName: string;
    attemptedCredits: number;
    acceptedCredits: number;
    directCredits: number;
    electiveCredits: number;
    reviewCredits: number;
    courseOutcomes: Array<{
      courseCode: string;
      courseName: string;
      status: string;
      acceptedCredits: number;
      targetCourseCode?: string;
    }>;
  }>;
  focusSchoolId?: string;
  deOriginSchoolId?: string;
  deOriginSchoolName?: string;
}

export const ADVISOR_SYSTEM_PROMPT = `You are an expert academic transfer advisor specializing in Georgia dual enrollment (DE) credit transfer to universities.

Your job:
1. Analyze whether the student's selected DE courses efficiently satisfy core and major requirements for their target schools.
2. Identify gaps, inefficiencies, or courses stuck in "review" status.
3. Recommend exactly 2-3 specific next-step DE courses they should take (use real course codes from typical Georgia DE catalogs like ENGL 1101, MATH 2211, CSCI 1301, BIOL 2111, HIST 2111, PSYC 1101, CHEM 1211, etc.).
4. Be encouraging but honest. Write for a high school student.

Format your response in markdown with these sections:
## Transfer Snapshot
(2-3 sentences personalized with their name)

## What's Working
(bullet list)

## Gaps & Risks
(bullet list)

## Recommended Next Courses
(numbered list of 2-3 courses with 1 sentence each explaining why)

## Action Plan
(2-3 concrete next steps)

Keep total response under 450 words. Do not invent university policies you aren't given — base analysis on the transfer data provided.`;

export function buildAdvisorPayload(
  displayName: string,
  intendedMajor: string,
  targetSchools: School[],
  courses: DualEnrollmentCourse[],
  focusSchoolId?: string,
  originSchoolId?: string,
): AdvisorRequestPayload {
  const schoolSummaries = targetSchools.map((school) => {
    const summary = summarizeSchoolCredits(
      courses,
      school.id,
      originSchoolId,
    );

    return {
      schoolId: school.id,
      schoolName: school.name,
      attemptedCredits: summary.attemptedCredits,
      acceptedCredits: summary.acceptedCredits,
      directCredits: summary.directCredits,
      electiveCredits: summary.electiveCredits,
      reviewCredits: summary.reviewCredits,
      courseOutcomes: summary.courseOutcomes.map((outcome) => ({
        courseCode: outcome.course.courseCode,
        courseName: outcome.course.courseName,
        status: outcome.equivalency?.status ?? "no_match",
        acceptedCredits: outcome.acceptedCredits,
        targetCourseCode: outcome.equivalency?.targetCourseCode,
      })),
    };
  });

  return {
    displayName,
    intendedMajor,
    targetSchools: targetSchools.map((school) => ({
      id: school.id,
      name: school.name,
    })),
    courses: courses.map((course) => ({
      id: course.id,
      courseCode: course.courseCode,
      courseName: course.courseName,
      credits: course.credits,
    })),
    schoolSummaries,
    focusSchoolId,
    deOriginSchoolId: originSchoolId,
    deOriginSchoolName: originSchoolId
      ? getOriginSchoolName(originSchoolId)
      : undefined,
  };
}

export function buildAdvisorUserPrompt(payload: AdvisorRequestPayload): string {
  const focus =
    payload.schoolSummaries.find(
      (entry) => entry.schoolId === payload.focusSchoolId,
    ) ?? payload.schoolSummaries[0];

  return JSON.stringify(
    {
      student: {
        name: payload.displayName,
        intendedMajor: payload.intendedMajor || "Undeclared",
        deOriginSchoolId: payload.deOriginSchoolId,
        deOriginSchoolName: payload.deOriginSchoolName,
      },
      primaryTargetSchool: focus?.schoolName ?? "Unknown",
      primaryTargetSummary: focus,
      allTargetSchools: payload.schoolSummaries,
      coursesTaken: payload.courses,
    },
    null,
    2,
  );
}

const RECOMMENDED_POOL = [
  { code: "MATH 2211", name: "Calculus I", reason: "unlocks STEM major prerequisites" },
  { code: "CSCI 1301", name: "Intro to Computing", reason: "required for CS and engineering paths" },
  { code: "BIOL 2111", name: "Anatomy & Physiology I", reason: "essential for health-science majors" },
  { code: "CHEM 1211", name: "General Chemistry I", reason: "opens science and pre-med sequences" },
  { code: "HIST 2111", name: "US History I", reason: "fills a core humanities requirement" },
  { code: "PSYC 1101", name: "Intro to Psychology", reason: "covers social science core credit" },
];

export function generateLocalAdvisorAdvice(
  payload: AdvisorRequestPayload,
): string {
  const focus =
    payload.schoolSummaries.find(
      (entry) => entry.schoolId === payload.focusSchoolId,
    ) ?? payload.schoolSummaries[0];

  const name = payload.displayName.trim() || "Student";
  const major = payload.intendedMajor.trim() || "your intended major";
  const schoolName = focus?.schoolName ?? "your target school";
  const buckets = groupCoursesByRequirement(
    payload.courses.map((course) => ({
      ...course,
      schoolId: "dual-enrollment-catalog",
    })),
    payload.intendedMajor,
    focus?.schoolId,
  );

  const takenCodes = new Set(payload.courses.map((course) => course.courseCode));
  const suggestions = RECOMMENDED_POOL.filter(
    (entry) => !takenCodes.has(entry.code),
  ).slice(0, 3);

  const acceptanceRate =
    focus && focus.attemptedCredits > 0
      ? Math.round((focus.acceptedCredits / focus.attemptedCredits) * 100)
      : 0;

  const working =
    buckets.core.length > 0
      ? buckets.core.map((entry) => `- **${entry.course.courseCode}** counts toward core gen ed`).join("\n")
      : "- You haven't locked in core gen ed credits yet — start with ENGL 1101 or a history course.";

  const gaps: string[] = [];
  if (buckets.major.length === 0) {
    gaps.push(`- No clear major prerequisites yet for **${major}**.`);
  }
  if (focus && focus.reviewCredits > 0) {
    gaps.push(
      `- **${focus.reviewCredits} credit hours** need departmental review at ${schoolName}.`,
    );
  }
  if (acceptanceRate < 70 && focus) {
    gaps.push(
      `- Only **${acceptanceRate}%** of attempted credits fully transfer to ${schoolName}.`,
    );
  }
  if (gaps.length === 0) {
    gaps.push("- Your current mix is solid — focus on depth in your major area next.");
  }

  const recs =
    suggestions.length > 0
      ? suggestions
          .map(
            (entry, index) =>
              `${index + 1}. **${entry.code}** (${entry.name}) — ${entry.reason}.`,
          )
          .join("\n")
      : "1. **MATH 2211** — strengthens your STEM foundation.\n2. **HIST 2111** — adds flexible core credit.";

  return `## Transfer Snapshot
Hi **${name}** — based on your ${payload.courses.length} DE course${payload.courses.length === 1 ? "" : "s"} toward **${schoolName}**, you're building a ${acceptanceRate >= 75 ? "strong" : "developing"} transfer profile for **${major}**.

## What's Working
${working}
${buckets.major.length > 0 ? buckets.major.map((entry) => `- **${entry.course.courseCode}** aligns with major prerequisites`).join("\n") : ""}

## Gaps & Risks
${gaps.join("\n")}

## Recommended Next Courses
${recs}

## Action Plan
1. Confirm ${schoolName}'s latest transfer catalog with your counselor.
2. Prioritize the recommended courses above before stacking electives.
3. Re-run DETT after your next term to track acceptance rate changes.

*Demo advisor — add \`OPENAI_API_KEY\` for live AI analysis.*`;
}

export interface AdvisorFollowUpPayload {
  type: "followup";
  displayName: string;
  question: string;
  initialAdvice: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
}

export const ADVISOR_FOLLOWUP_SYSTEM_PROMPT = `${ADVISOR_SYSTEM_PROMPT}

You are now answering a follow-up question from the student. Keep answers concise (under 180 words), friendly, and grounded in the original transfer analysis. Do not repeat the entire original advice.`;

export function generateLocalFollowUpAnswer(
  payload: AdvisorFollowUpPayload,
): string {
  const name = payload.displayName.trim() || "there";
  const question = payload.question.toLowerCase();

  if (question.includes("gpa") || question.includes("grade")) {
    return `Hi ${name} — GPA impact depends on how many credits you take and the grades you earn. Use the **GPA Outlook** tab on your results page to forecast your cumulative GPA if you earn all A's this semester. Strong DE grades can noticeably help if you're taking several college credits.`;
  }

  if (
    question.includes("review") ||
    question.includes("department") ||
    question.includes("accept")
  ) {
    return `Great question, ${name}. Courses marked **review** at your target school usually need a syllabus or catalog description before they count toward major requirements — they may still transfer as elective credit. Ask your DE counselor to request a formal evaluation from the university's transfer office early.`;
  }

  if (
    question.includes("next") ||
    question.includes("course") ||
    question.includes("take")
  ) {
    return `Based on your DETT report, ${name}, prioritize courses that fill core gaps first (English, math, history, lab science), then stack major prerequisites. Re-run DETT after adding planned courses to see which target school accepts them best.`;
  }

  if (
    question.includes("spelman") ||
    question.includes("howard") ||
    question.includes("hbcu")
  ) {
    return `${name}, HBCU transfer policies vary by department. DETT maps common Georgia DE courses to each school's catalog, but you should confirm with the registrar — especially for lab sciences and upper-level math.`;
  }

  return `Thanks for asking, ${name}. Based on your transfer snapshot, keep confirming equivalencies with your counselor and your target school's transfer portal. If you share a specific course or school in your question, I can be more precise — try asking about a course code or requirement area.`;
}
