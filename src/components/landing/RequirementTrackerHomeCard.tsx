"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { PRELOADED_SCHOOLS } from "@/data/mockData";
import { getRequirementProgress } from "@/lib/requirementProgress";
import { groupCoursesByRequirement } from "@/lib/requirements";
import type { StudentProfile } from "@/types";

const STORAGE_KEY = "dett_profile";

import {
  ROADMAP_CARD_LIVE,
  ROADMAP_CARD_SHELL,
} from "@/components/landing/roadmapCardStyles";

function readProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StudentProfile;
  } catch {
    return null;
  }
}

export function RequirementTrackerHomeCard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    setProfile(readProfile());
  }, []);

  const targetSchoolId =
    profile?.targetSchoolIds[0] ?? PRELOADED_SCHOOLS[0]?.id ?? "";

  const summary = useMemo(() => {
    const courses = profile?.courses ?? [];
    if (courses.length === 0) {
      return null;
    }

    const buckets = groupCoursesByRequirement(
      courses,
      profile?.intendedMajor ?? "",
      targetSchoolId,
      profile?.originSchoolId,
    );
    const progress = getRequirementProgress(buckets);
    const credits = courses.reduce((sum, course) => sum + course.credits, 0);

    return { credits, progress, courseCount: courses.length };
  }, [profile, targetSchoolId]);

  return (
    <Link
      href="/checker"
      className={`${ROADMAP_CARD_SHELL} ${ROADMAP_CARD_LIVE} group`}
    >
      <div className="mb-2 shrink-0 text-2xl leading-none">📋</div>
      <h3 className="mb-2 line-clamp-2 text-xs font-black uppercase tracking-wider text-emerald-400">
        University Requirement Tracker
      </h3>
      <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-white/60">
        Sort DE credits into core, major, and elective blocks instantly.
      </p>

      {summary ? (
        <p className="mb-3 line-clamp-1 text-[10px] font-black uppercase tracking-wider dett-live-value">
          {summary.courseCount} courses · {summary.credits} cr ·{" "}
          {summary.progress.satisfiedCount}/3 blocks
        </p>
      ) : (
        <p className="mb-3 line-clamp-1 text-[10px] uppercase tracking-wider text-white/40">
          Add courses in the checker to unlock live tracking.
        </p>
      )}

      <span className="mt-auto inline-flex w-fit items-center gap-1 border border-emerald-500 px-2 py-0.5">
        <Star className="h-2.5 w-2.5 text-emerald-500" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
          Live
        </span>
      </span>
    </Link>
  );
}
