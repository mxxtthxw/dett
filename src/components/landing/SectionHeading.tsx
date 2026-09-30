interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
}

export function SectionHeading({
  label,
  title,
  description,
  tone = "light",
  align = "left",
}: SectionHeadingProps) {
  const isDark = tone === "dark";
  const isCentered = align === "center";
  const ruleColor = isDark ? "bg-[#f5c842]" : "bg-[#c0392b]";
  const labelColor = isDark ? "text-[#f5c842]" : "text-[#c0392b]";

  return (
    <div className={isCentered ? "text-center" : ""}>
      <div
        className={`mb-4 flex items-center gap-3 ${isCentered ? "justify-center" : ""}`}
      >
        <span className={`h-[3px] w-8 ${ruleColor}`} />
        <span
          className={`text-[10px] font-black uppercase tracking-[0.35em] ${labelColor}`}
        >
          {label}
        </span>
        <span className={`h-[3px] w-8 ${ruleColor}`} />
      </div>

      <h2
        className={`text-3xl font-black uppercase md:text-4xl ${
          isDark ? "text-white" : "text-[#1a1a2e]"
        }`}
        style={{
          fontFamily: "Georgia, serif",
          textShadow: "4px 4px 0px #f5c842",
        }}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={`mt-4 max-w-2xl text-sm leading-relaxed ${
            isCentered ? "mx-auto" : ""
          } ${isDark ? "text-white/60" : "text-[#4a4a4a]"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
