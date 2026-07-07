const ADMIN_SESSION_KEY = "dett_admin_session";

const ADMIN_CREDENTIALS = [
  { username: "mxtthxw", password: "gt2027" },
  { username: "aadil", password: "gt2027" },
] as const;

export interface AdminSession {
  username: string;
  authenticatedAt: string;
}

export function readAdminSession(): AdminSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

function writeAdminSession(session: AdminSession) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminAuthenticated(): boolean {
  return readAdminSession() !== null;
}

export function loginAdmin(
  username: string,
  password: string,
): { ok: boolean; error?: string; session?: AdminSession } {
  const trimmedUsername = username.trim().toLowerCase();

  if (!trimmedUsername || !password) {
    return { ok: false, error: "Enter your admin username and password." };
  }

  const match = ADMIN_CREDENTIALS.find(
    (credential) =>
      credential.username.toLowerCase() === trimmedUsername &&
      credential.password === password,
  );

  if (!match) {
    return { ok: false, error: "Invalid admin credentials." };
  }

  const session: AdminSession = {
    username: match.username,
    authenticatedAt: new Date().toISOString(),
  };
  writeAdminSession(session);
  return { ok: true, session };
}

export function logoutAdmin() {
  clearAdminSession();
}
