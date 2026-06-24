import type { School } from "@/types";

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
  const toggleSchool = (schoolId: string) => {
    if (selected.includes(schoolId)) {
      onChange(selected.filter((id) => id !== schoolId));
      return;
    }

    onChange([...selected, schoolId]);
  };

  return (
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
  );
}
