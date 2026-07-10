"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, Map } from "lucide-react";
import type { School } from "@/types";
import { CollegeRequestModal } from "@/components/checker/CollegeRequestModal";
import { UsCollegeMap } from "@/components/checker/UsCollegeMap";

type SchoolViewMode = "list" | "map";

interface SchoolSelectorProps {
  schools: School[];
  selected: string[];
  onChange: (selectedIds: string[]) => void;
}

function SchoolGrid({
  schools,
  selected,
  onToggle,
}: {
  schools: School[];
  selected: string[];
  onToggle: (schoolId: string) => void;
}) {
  if (schools.length === 0) {
    return (
      <div className="border-4 border-[#1a1a2e] bg-[#f4f1ea] px-4 py-8 text-center shadow-[3px_3px_0px_#1a1a2e]">
        <p className="text-sm font-bold uppercase tracking-widest text-[#1a1a2e]">
          No colleges in this state yet
        </p>
        <p className="mt-2 text-xs text-[#4a4a4a]">
          Try another highlighted state or switch to list view.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {schools.map((school) => {
        const isSelected = selected.includes(school.id);

        return (
          <button
            key={school.id}
            type="button"
            onClick={() => onToggle(school.id)}
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
  );
}

export function SchoolSelector({
  schools,
  selected,
  onChange,
}: SchoolSelectorProps) {
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<SchoolViewMode>("list");
  const [mapStateFilter, setMapStateFilter] = useState<string | null>(null);

  const toggleSchool = (schoolId: string) => {
    if (selected.includes(schoolId)) {
      onChange(selected.filter((id) => id !== schoolId));
      return;
    }

    onChange([...selected, schoolId]);
  };

  const visibleSchools = useMemo(() => {
    if (viewMode !== "map" || !mapStateFilter) {
      return schools;
    }

    return schools.filter((school) => school.state === mapStateFilter);
  }, [mapStateFilter, schools, viewMode]);

  const handleViewModeChange = (mode: SchoolViewMode) => {
    setViewMode(mode);
    if (mode === "list") {
      setMapStateFilter(null);
    }
  };

  return (
    <>
      <p className="mb-4 text-sm tracking-wide text-[#4a4a4a]">
        Select all the colleges you&apos;re considering.
      </p>

      <div className="mb-6 inline-flex border-4 border-[#1a1a2e] bg-white p-1 shadow-[3px_3px_0px_#1a1a2e]">
        <button
          type="button"
          onClick={() => handleViewModeChange("list")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors ${
            viewMode === "list"
              ? "bg-[#f5c842] text-[#1a1a2e]"
              : "bg-white text-[#4a4a4a] hover:bg-[#f5f0e8]"
          }`}
          aria-pressed={viewMode === "list"}
        >
          <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
          List View
        </button>
        <button
          type="button"
          onClick={() => handleViewModeChange("map")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors ${
            viewMode === "map"
              ? "bg-[#f5c842] text-[#1a1a2e]"
              : "bg-white text-[#4a4a4a] hover:bg-[#f5f0e8]"
          }`}
          aria-pressed={viewMode === "map"}
        >
          <Map className="h-3.5 w-3.5" aria-hidden />
          Map View
        </button>
      </div>

      {viewMode === "list" ? (
        <SchoolGrid
          schools={schools}
          selected={selected}
          onToggle={toggleSchool}
        />
      ) : (
        <div className="space-y-6">
          <UsCollegeMap
            schools={schools}
            selectedState={mapStateFilter}
            onStateSelect={setMapStateFilter}
          />
          <SchoolGrid
            schools={visibleSchools}
            selected={selected}
            onToggle={toggleSchool}
          />
        </div>
      )}

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
