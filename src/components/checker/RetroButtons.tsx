import type { ReactNode } from "react";

interface RetroButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}

export function RetroButton({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
}: RetroButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 border-4 border-[#1a1a2e] bg-[#c0392b] px-7 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_#1a1a2e] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#1a1a2e] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-[4px_4px_0px_#1a1a2e] disabled:translate-x-0 disabled:translate-y-0 ${className}`}
    >
      {children}
    </button>
  );
}

export function RetroButtonOutline({
  children,
  onClick,
  disabled,
  className = "",
}: RetroButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 border-4 border-[#1a1a2e] bg-transparent px-7 py-3 text-xs font-black uppercase tracking-widest text-[#1a1a2e] transition-colors hover:bg-[#1a1a2e] hover:text-[#f5c842] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export const stepMotion = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export const retroHeadingStyle = {
  fontFamily: "Georgia, serif",
  textShadow: "3px 3px 0px #f5c842",
} as const;
