"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LayoutDashboard, LogIn } from "lucide-react";
import { useProfile } from "@/context/StudentProfileContext";
import { LoginModal } from "@/components/dashboard/LoginModal";
import { RetroButtonOutline } from "@/components/checker/RetroButtons";

export function WelcomeBackBox() {
  const router = useRouter();
  const { profile, isAuthenticated, isLoaded } = useProfile();
  const [showLogin, setShowLogin] = useState(false);

  if (!isLoaded) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <div className="mx-auto mt-8 max-w-md border-4 border-black bg-white p-5 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#10b981]">
          Signed in
        </p>
        <h2 className="mt-1 text-lg font-black uppercase text-[#1a1a2e]">
          Welcome back, {profile.displayName.trim() || profile.username}!
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-[#4a4a4a]">
          Your saved progress is ready. Jump straight to your dashboard.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-2 border-4 border-black bg-[#1a1a2e] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-[#f5c842] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          <LayoutDashboard className="h-4 w-4" />
          View Saved Progress
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto mt-8 max-w-md border-4 border-black bg-[#f4f1ea] p-5 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#c0392b]">
          Returning user
        </p>
        <h2 className="mt-1 text-lg font-black uppercase text-[#1a1a2e]">
          Welcome Back?
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-[#4a4a4a]">
          Sign in with the username and password you created when you saved your
          progress. We&apos;ll load your courses, schools, and reports.
        </p>
        <RetroButtonOutline
          className="mt-4 w-full justify-center"
          onClick={() => setShowLogin(true)}
        >
          <LogIn className="h-4 w-4" />
          Sign In to Dashboard
        </RetroButtonOutline>
      </div>

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => router.push("/dashboard")}
        title="Welcome Back?"
        description="Enter the account you created when saving your DETT progress."
      />
    </>
  );
}
