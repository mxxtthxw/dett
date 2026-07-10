"use client";

import { useMemo } from "react";
import type { School } from "@/types";
import {
  US_MAP_VIEWBOX,
  US_STATE_MAP_PATHS,
} from "@/data/usStateMapPaths";

const MAP_ACTIVE_FILL = "#f5c842";
const MAP_ACTIVE_SELECTED_FILL = "#fdb813";
const MAP_DISABLED_FILL = "#d8d4cc";
const MAP_STROKE = "#1a1a2e";

interface UsCollegeMapProps {
  schools: School[];
  selectedState: string | null;
  onStateSelect: (state: string | null) => void;
}

export function UsCollegeMap({
  schools,
  selectedState,
  onStateSelect,
}: UsCollegeMapProps) {
  const statesWithSchools = useMemo(() => {
    const states = new Set<string>();
    for (const school of schools) {
      if (school.state) {
        states.add(school.state);
      }
    }
    return states;
  }, [schools]);

  const handleStateClick = (stateId: string) => {
    if (!statesWithSchools.has(stateId)) {
      return;
    }

    onStateSelect(selectedState === stateId ? null : stateId);
  };

  return (
    <div className="border-4 border-[#1a1a2e] bg-white p-4 shadow-[4px_4px_0px_#1a1a2e]">
      <svg
        viewBox={US_MAP_VIEWBOX}
        role="img"
        aria-label="United States map for filtering colleges by state"
        className="h-auto w-full max-h-[420px]"
        preserveAspectRatio="xMidYMid meet"
      >
        {US_STATE_MAP_PATHS.map((state) => {
          const isActive = statesWithSchools.has(state.id);
          const isSelected = selectedState === state.id;

          return (
            <path
              key={state.id}
              d={state.path}
              fill={
                isActive
                  ? isSelected
                    ? MAP_ACTIVE_SELECTED_FILL
                    : MAP_ACTIVE_FILL
                  : MAP_DISABLED_FILL
              }
              stroke={MAP_STROKE}
              strokeWidth={isSelected ? 2.5 : 1.25}
              vectorEffect="non-scaling-stroke"
              className={
                isActive
                  ? "cursor-pointer transition-[fill,stroke-width] hover:brightness-95"
                  : "cursor-not-allowed"
              }
              style={{ pointerEvents: isActive ? "auto" : "none" }}
              onClick={() => handleStateClick(state.id)}
              aria-label={
                isActive
                  ? `${state.name} — ${schools.filter((school) => school.state === state.id).length} colleges`
                  : `${state.name} — no colleges available`
              }
            />
          );
        })}
      </svg>
      <p className="mt-3 text-center text-xs font-bold uppercase tracking-widest text-[#4a4a4a]">
        {selectedState
          ? `Filtering: ${US_STATE_MAP_PATHS.find((state) => state.id === selectedState)?.name ?? selectedState}`
          : "Click a highlighted state to filter colleges"}
      </p>
    </div>
  );
}
