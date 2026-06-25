import type { Metadata } from "next";
import { DettAdminCircle } from "@/components/shared/DettAdminCircle";

export const metadata: Metadata = {
  title: "DETT — Dual Enrollment Transfer Tool",
  description:
    "Compare dual enrollment transfer outcomes across Georgia universities and beyond.",
};

export default function CheckerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 md:px-8 md:py-10">
      <header className="dett-section-header no-print">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="dett-step-tag tracking-[0.35em]">
                Dual Enrollment Transfer Tool
              </p>
              <h1
                className="mt-1 text-4xl font-black uppercase text-[#1a1a2e] md:text-5xl"
                style={{
                  fontFamily: "Georgia, serif",
                  textShadow: "3px 3px 0px #f5c842",
                }}
              >
                DETT
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[#4a4a4a] md:text-base">
                Your transfer roadmap from dual enrollment to your dream school.
              </p>
            </div>
            <DettAdminCircle />
          </div>
        </header>
        {children}
      </div>
  );
}
