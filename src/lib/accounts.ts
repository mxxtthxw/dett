import type { StudentProfile } from "@/types";

const ACCOUNTS_KEY = "dett_accounts";

export interface AccountRecord {
  username: string;
  password: string;
  profile: StudentProfile;
  createdAt: string;
}

function readAccounts(): AccountRecord[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as AccountRecord[];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: AccountRecord[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function registerAccount(
  username: string,
  password: string,
  profile: StudentProfile,
): { ok: boolean; error?: string } {
  const trimmed = username.trim().toLowerCase();
  if (trimmed.length < 3) {
    return { ok: false, error: "Username must be at least 3 characters." };
  }
  if (password.length < 4) {
    return { ok: false, error: "Password must be at least 4 characters." };
  }

  const accounts = readAccounts();
  if (accounts.some((account) => account.username === trimmed)) {
    return { ok: false, error: "That username is already taken." };
  }

  accounts.push({
    username: trimmed,
    password,
    profile,
    createdAt: new Date().toISOString(),
  });
  writeAccounts(accounts);
  return { ok: true };
}

export function saveAccountProfile(username: string, profile: StudentProfile) {
  const trimmed = username.trim().toLowerCase();
  const accounts = readAccounts();
  const index = accounts.findIndex((account) => account.username === trimmed);
  if (index === -1) {
    return;
  }
  accounts[index] = { ...accounts[index], profile };
  writeAccounts(accounts);
}

export function listAccounts(): AccountRecord[] {
  return readAccounts();
}

export function loginAccount(
  username: string,
  password: string,
): { ok: boolean; error?: string; profile?: StudentProfile } {
  const trimmed = username.trim().toLowerCase();
  if (!trimmed) {
    return { ok: false, error: "Enter your username." };
  }
  if (!password) {
    return { ok: false, error: "Enter your password." };
  }

  const account = readAccounts().find((entry) => entry.username === trimmed);
  if (!account) {
    return { ok: false, error: "No account found with that username." };
  }
  if (account.password !== password) {
    return { ok: false, error: "Incorrect password." };
  }

  return {
    ok: true,
    profile: {
      ...account.profile,
      username: trimmed,
      accountCreated: true,
    },
  };
}

export function isAuthenticatedProfile(
  profile: Pick<StudentProfile, "username" | "accountCreated">,
): boolean {
  return profile.accountCreated === true && Boolean(profile.username?.trim());
}
