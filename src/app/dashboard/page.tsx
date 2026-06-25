import type { Metadata } from "next";
import Link from "next/link";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { DettAdminCircle } from "@/components/shared/DettAdminCircle";

export const metadata: Metadata = {
  title: "DETT — Saved Progress Dashboard",
  description:
    "View your saved dual enrollment courses, target schools, and transfer breakdown.",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 md:px-8 md:py-10">
      <header className="dett-section-header no-print mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-[10px] font-black uppercase tracking-widest text-[#4a4a4a] hover:text-[#c0392b]"
            >
              ← DETT Home
            </Link>
            <h1
              className="mt-2 text-4xl font-black uppercase text-[#1a1a2e] md:text-5xl"
              style={{
                fontFamily: "Georgia, serif",
                textShadow: "3px 3px 0px #f5c842",
              }}
            >
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#4a4a4a]">
              Your saved transfer roadmap — courses, schools, and credit
              breakdown in one place.
            </p>
          </div>
          <DettAdminCircle />
        </div>
      </header>

      <DashboardView />
    </div>
  );
}
