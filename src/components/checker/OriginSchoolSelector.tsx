import { DE_ORIGIN_SCHOOLS } from "@/data/mockData";
import { PRIORITY_DE_ORIGIN_IDS, HOWARD_PRIORITY_ORIGIN_IDS } from "@/lib/originEquivalencyRules";

interface OriginSchoolSelectorProps {
  value: string;
  onChange: (originSchoolId: string) => void;
}

export function OriginSchoolSelector({
  value,
  onChange,
}: OriginSchoolSelectorProps) {
  const isVerifiedOrigin = PRIORITY_DE_ORIGIN_IDS.has(value);
  const isHowardPipelineOrigin = HOWARD_PRIORITY_ORIGIN_IDS.has(value);

  return (
    <div className="mb-6 border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <label className="block">
        <span className="mb-3 block text-xs font-black uppercase tracking-[0.2em] text-[#1a1a2e]">
          Where Did You Take These DE Classes?
        </span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full border-4 border-black bg-[#f5f0e8] px-4 py-3 text-sm font-bold text-[#1a1a2e] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:border-[#c0392b] focus:outline-none"
        >
          {DE_ORIGIN_SCHOOLS.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>
      </label>
      {isVerifiedOrigin ? (
        <p className="mt-3 text-[10px] font-bold uppercase tracking-wider dett-live-value">
          ✓ Verified articulation tables for this DE origin
          {isHowardPipelineOrigin
            ? " · Howard University pipeline emphasized"
            : ""}
        </p>
      ) : null}
    </div>
  );
}
