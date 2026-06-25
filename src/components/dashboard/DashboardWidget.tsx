"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { useProfile } from "@/context/StudentProfileContext";

export function DashboardWidget() {
  const pathname = usePathname();
  const { isAuthenticated, isLoaded, profile } = useProfile();

  if (!isLoaded || !isAuthenticated || pathname === "/dashboard") {
    return null;
  }

  return (
    <Link
      href="/dashboard"
      className="fixed bottom-6 right-6 z-50 flex max-w-[220px] items-center gap-2 border-4 border-black bg-[#1a1a2e] px-4 py-3 text-xs font-black uppercase tracking-widest text-[#f5c842] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] no-print"
      aria-label="Return to dashboard"
    >
      <LayoutDashboard className="h-4 w-4 shrink-0" />
      <span>
        View Saved Progress
        {profile.displayName.trim() ? (
          <span className="mt-0.5 block text-[10px] font-bold normal-case tracking-normal text-[#f5c842]/70">
            {profile.displayName.trim()}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
