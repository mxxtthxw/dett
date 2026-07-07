"use client";

import { useState } from "react";
import type { School } from "@/types";
import { CollegeRequestModal } from "@/components/checker/CollegeRequestModal";

interface SchoolSelectorProps {
  schools: School[];
  selected: string[];
  onChange: (selectedIds: string[]) => void;
}

export function SchoolSelector({
  schools,
  selected,
  onChange,
}: SchoolSelectorProps) {
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const toggleSchool = (schoolId: string) => {
    if (selected.includes(schoolId)) {
      onChange(selected.filter((id) => id !== schoolId));
      return;
    }

    onChange([...selected, schoolId]);
  };

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {schools.map((school) => {
          const isSelected = selected.includes(school.id);

          return (
            <button
              key={school.id}
              type="button"
              onClick={() => toggleSchool(school.id)}
              className={`border-4 border-[#1a1a2e] px-4 py-3 text-left text-sm font-bold transition-all ${
                isSelected
                  ? "bg-[#f5c842] text-[#1a1a2e] shadow-[4px_4px_0px_#1a1a2e]"
                  : "bg-white text-[#1a1a2e] shadow-[3px_3px_0px_#1a1a2e] hover:bg-[#f5f0e8]"
              }`}
            >
              {school.name}
              {school.state ? (
                <span className="mt-1 block text-xs font-normal text-[#4a4a4a]">
                  {school.state}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-sm">
        <button
          type="button"
          onClick={() => setRequestModalOpen(true)}
          className="font-bold text-[#c0392b] underline decoration-2 underline-offset-4 transition-colors hover:text-[#1a1a2e]"
        >
          Don&apos;t see your College?
        </button>
      </p>

      <CollegeRequestModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />
    </>
  );
}
