import type { RequirementBuckets } from "@/lib/requirements";

export interface RequirementProgress {
  satisfiedCount: number;
  totalCategories: number;
  percentage: number;
  coreSatisfied: boolean;
  majorSatisfied: boolean;
  electiveSatisfied: boolean;
}

export function getRequirementProgress(
  buckets: RequirementBuckets,
): RequirementProgress {
  const coreSatisfied = buckets.core.some((entry) => entry.acceptedAtTarget);
  const majorSatisfied = buckets.major.some((entry) => entry.acceptedAtTarget);
  const electiveSatisfied = buckets.elective.some(
    (entry) => entry.acceptedAtTarget,
  );

  const satisfiedCount = [coreSatisfied, majorSatisfied, electiveSatisfied].filter(
    Boolean,
  ).length;

  return {
    satisfiedCount,
    totalCategories: 3,
    percentage: Math.round((satisfiedCount / 3) * 100),
    coreSatisfied,
    majorSatisfied,
    electiveSatisfied,
  };
}
