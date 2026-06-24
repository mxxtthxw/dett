"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listAccounts, type AccountRecord } from "@/lib/accounts";
import { DettAdminCircle } from "@/components/shared/DettAdminCircle";

export default function AdminPage() {
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);

  useEffect(() => {
    setAccounts(listAccounts());
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f0e8] px-4 py-8 font-mono md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c0392b]">
              Admin
            </p>
            <h1
              className="text-3xl font-black uppercase text-[#1a1a2e]"
              style={{
                fontFamily: "Georgia, serif",
                textShadow: "3px 3px 0px #f5c842",
              }}
            >
              Saved Accounts
            </h1>
          </div>
          <DettAdminCircle />
        </div>

        <div className="mb-6 border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-sm text-[#4a4a4a]">
            Local demo storage only — accounts and profiles are saved in this
            browser&apos;s localStorage.
          </p>
        </div>

        {accounts.length === 0 ? (
          <div className="border-4 border-black bg-[#f4f1ea] p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-sm font-bold uppercase tracking-widest text-[#1a1a2e]">
              No accounts yet
            </p>
            <p className="mt-2 text-xs text-[#4a4a4a]">
              Students can create an account when they add their first course.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.username}
                className="border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#c0392b]">
                      {account.username}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#1a1a2e]">
                      {account.profile.displayName || "Unnamed student"}
                      {account.profile.intendedMajor
                        ? ` · ${account.profile.intendedMajor}`
                        : ""}
                    </p>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-[#4a4a4a]">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-3 text-xs text-[#4a4a4a]">
                  {account.profile.courses.length} courses ·{" "}
                  {account.profile.targetSchoolIds.length} target schools · step:{" "}
                  {account.profile.wizardStep}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/"
            className="inline-block border-4 border-black bg-[#1a1a2e] px-6 py-3 text-xs font-black uppercase tracking-widest text-[#f5c842] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            ← Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
