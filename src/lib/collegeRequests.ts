import type { StudentProfile } from "@/types";

const REQUESTS_KEY = "dett_college_requests";

export interface CollegeRequest {
  id: string;
  collegeName: string;
  state: string;
  message: string;
  displayName: string;
  createdAt: string;
}

function readRequests(): CollegeRequest[] {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as CollegeRequest[];
  } catch {
    return [];
  }
}

function writeRequests(requests: CollegeRequest[]) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export function submitCollegeRequest(input: {
  collegeName: string;
  state?: string;
  message: string;
  displayName?: string;
}): { ok: boolean; error?: string } {
  const collegeName = input.collegeName.trim();
  const message = input.message.trim();

  if (collegeName.length < 2) {
    return { ok: false, error: "Enter a college name." };
  }

  const requests = readRequests();
  requests.unshift({
    id: `req-${Date.now()}`,
    collegeName,
    state: input.state?.trim() ?? "",
    message,
    displayName: input.displayName?.trim() ?? "Anonymous",
    createdAt: new Date().toISOString(),
  });
  writeRequests(requests);
  return { ok: true };
}

export function listCollegeRequests(): CollegeRequest[] {
  return readRequests();
}

export function getCollegeRequestCount(): number {
  return readRequests().length;
}

export function getDisplayNameFromProfile(
  profile: Pick<StudentProfile, "displayName" | "username">,
): string {
  return profile.displayName.trim() || profile.username?.trim() || "Anonymous";
}
