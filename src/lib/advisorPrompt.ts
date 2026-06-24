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
  intendedMajor: string;
  question: string;
  initialAdvice: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  profileSnapshot: FollowUpProfileSnapshot;
}

export interface FollowUpProfileSnapshot {
  focusSchoolName: string;
  deOriginSchoolName?: string;
  attemptedCredits: number;
  acceptedCredits: number;
  reviewCredits: number;
  courseCodes: string[];
  courseOutcomes: Array<{
    courseCode: string;
    status: string;
    targetCourseCode?: string;
  }>;
}

export function buildFollowUpProfileSnapshot(
  payload: AdvisorRequestPayload,
): FollowUpProfileSnapshot {
  const focus =
    payload.schoolSummaries.find(
      (entry) => entry.schoolId === payload.focusSchoolId,
    ) ?? payload.schoolSummaries[0];

  return {
    focusSchoolName: focus?.schoolName ?? "Unknown",
    deOriginSchoolName: payload.deOriginSchoolName,
    attemptedCredits: focus?.attemptedCredits ?? 0,
    acceptedCredits: focus?.acceptedCredits ?? 0,
    reviewCredits: focus?.reviewCredits ?? 0,
    courseCodes: payload.courses.map((course) => course.courseCode),
    courseOutcomes: (focus?.courseOutcomes ?? []).map((outcome) => ({
      courseCode: outcome.courseCode,
      status: outcome.status,
      targetCourseCode: outcome.targetCourseCode,
    })),
  };
}

export function buildFollowUpSystemPrompt(
  displayName: string,
  hasPriorTurns: boolean,
): string {
  const studentName = displayName.trim() || "the student";

  return `You are an expert academic advisor for DETT (Dual Enrollment Transfer Tool). You help Georgia dual enrollment students transfer credits to universities.

You already delivered a full transfer report. ${studentName} is now chatting with follow-up questions.

CRITICAL — follow-up mode rules:
- Answer their specific question directly. Talk like a human advisor in office hours.
- Do NOT use the Transfer Snapshot / What's Working / Gaps & Risks / Recommended Next Courses / Action Plan section template.
- Do NOT repeat or re-summarize your entire prior report unless they explicitly ask for a recap.
- Do NOT start with "Hi ${studentName}" every time — vary your openings.
- Keep replies under 150 words (2–4 short paragraphs or a tight bullet list if helpful).
- Ground answers in the student profile JSON and conversation history provided.
- If a course appears in their profile with a status (direct, review, elective, no_match), reference that status when relevant.
- Do not invent university policies not supported by the data given.

${hasPriorTurns ? "This is a continuing conversation — build on what you already said; never rehash the same points." : "This is their first follow-up after the initial report."}`;
}

export function buildFollowUpContextMessage(
  payload: AdvisorFollowUpPayload,
): string {
  return JSON.stringify(
    {
      student: {
        name: payload.displayName.trim() || "Student",
        intendedMajor: payload.intendedMajor.trim() || "Undeclared",
      },
      profileSnapshot: payload.profileSnapshot,
      note: "Use this profile data to answer the student's follow-up. Do not output JSON — reply in plain, friendly prose.",
    },
    null,
    2,
  );
}

export const ADVISOR_FOLLOWUP_SYSTEM_PROMPT = buildFollowUpSystemPrompt(
  "Student",
  false,
);

export function generateLocalFollowUpAnswer(
  payload: AdvisorFollowUpPayload,
): string {
  const name = payload.displayName.trim() || "there";
  const question = payload.question.toLowerCase();
  const snapshot = payload.profileSnapshot;
  const priorTopics = payload.history
    .filter((entry) => entry.role === "assistant")
    .join(" ")
    .toLowerCase();

  const findCourseMention = () => {
    for (const outcome of snapshot.courseOutcomes) {
      const code = outcome.courseCode.toLowerCase();
      const shortCode = code.replace(/\s+/g, "");
      if (
        question.includes(code) ||
        question.includes(shortCode) ||
        question.includes(outcome.courseCode.split(" ")[0]?.toLowerCase() ?? "")
      ) {
        return outcome;
      }
    }
    return null;
  };

  const mentionedCourse = findCourseMention();
  if (mentionedCourse) {
    const target = mentionedCourse.targetCourseCode ?? "no mapped equivalent";
    if (mentionedCourse.status === "review") {
      return `${name}, **${mentionedCourse.courseCode}** maps to ${target} at ${snapshot.focusSchoolName}, but it's flagged for departmental review. Send your syllabus to the transfer office early — it may still count as elective credit while pending.`;
    }
    if (mentionedCourse.status === "no_match") {
      return `**${mentionedCourse.courseCode}** doesn't have a direct match to ${snapshot.focusSchoolName} in DETT yet. Ask your counselor to request a manual evaluation — sometimes courses count even without a published equivalency.`;
    }
    if (mentionedCourse.status === "elective") {
      return `At ${snapshot.focusSchoolName}, **${mentionedCourse.courseCode}** (${target}) transfers as elective credit. It helps your total hours but may not satisfy a core or major requirement — check whether you still need that area filled.`;
    }
    return `Yes — **${mentionedCourse.courseCode}** transfers directly to **${target}** at ${snapshot.focusSchoolName}. That should count toward your requirements without extra review.`;
  }

  if (question.includes("gpa") || question.includes("grade")) {
    if (priorTopics.includes("gpa outlook")) {
      return `Plug your numbers into the **GPA Outlook** tab — it updates instantly. The biggest lever is how many college credits you take this term and the grades you earn on them.`;
    }
    return `${name}, open the **GPA Outlook** tab next to this advisor. Enter your current GPA, high school credits (~7 per year if unsure), and college credits this semester to see your projected GPA if you earn all A's.`;
  }

  if (
    question.includes("review") ||
    question.includes("department") ||
    question.includes("accept")
  ) {
    if (snapshot.reviewCredits > 0) {
      return `${snapshot.reviewCredits} of your credits at ${snapshot.focusSchoolName} need review. Courses stuck in review often need a syllabus — your DE counselor can submit one to the registrar before you apply.`;
    }
    return `None of your current courses are flagged for review at ${snapshot.focusSchoolName}. You're in good shape on acceptance — focus on filling any core or major gaps next.`;
  }

  if (
    question.includes("next") ||
    question.includes("course") ||
    question.includes("take") ||
    question.includes("should i")
  ) {
    const taken = new Set(snapshot.courseCodes);
    const missing = RECOMMENDED_POOL.find((entry) => !taken.has(entry.code));
    if (missing) {
      return `Given what you've already taken (${snapshot.courseCodes.join(", ")}), I'd look at **${missing.code}** next — ${missing.reason}. Add it in DETT to preview how ${snapshot.focusSchoolName} treats it.`;
    }
    return `You've covered the usual DE building blocks. Next step: stack courses aligned with **${payload.intendedMajor.trim() || "your major"}** — ask your target department which prerequisites they want to see on your transcript.`;
  }

  if (
    question.includes("spelman") ||
    question.includes("howard") ||
    question.includes("hbcu")
  ) {
    return `${name}, HBCU departments often evaluate lab sciences and upper-level math individually. DETT shows published mappings for ${snapshot.focusSchoolName}, but confirm with their registrar — especially for courses marked review.`;
  }

  if (
    question.includes("origin") ||
    question.includes("where") ||
    snapshot.deOriginSchoolName &&
      question.includes(snapshot.deOriginSchoolName.toLowerCase())
  ) {
    return `Your DE courses are analyzed from **${snapshot.deOriginSchoolName ?? "your origin school"}** toward **${snapshot.focusSchoolName}**. Articulation agreements can differ by origin — that's why DETT tracks where you took each class.`;
  }

  const acceptancePct =
    snapshot.attemptedCredits > 0
      ? Math.round(
          (snapshot.acceptedCredits / snapshot.attemptedCredits) * 100,
        )
      : 0;

  return `${name}, at ${snapshot.focusSchoolName} you're at **${snapshot.acceptedCredits}/${snapshot.attemptedCredits}** accepted credits (${acceptancePct}%). Ask about a specific course code or requirement area and I can dig in — e.g. "Will CHEM 1211 count?"`;
}
