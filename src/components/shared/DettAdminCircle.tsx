"use client";

import { useRouter } from "next/navigation";

interface DettAdminCircleProps {
  className?: string;
}

export function DettAdminCircle({ className = "" }: DettAdminCircleProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/admin")}
      title="DETT"
      aria-label="DETT admin"
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-black bg-[#f4f1ea] font-bold text-[#1a1a2e] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}
    >
      <span className="text-[10px] font-black uppercase tracking-tighter">
        DETT
      </span>
    </button>
  );
}
