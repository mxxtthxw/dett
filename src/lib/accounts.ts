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
