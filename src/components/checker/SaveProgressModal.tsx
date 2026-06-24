"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useProfile } from "@/context/StudentProfileContext";
import { registerAccount } from "@/lib/accounts";
import { RetroButton, RetroButtonOutline } from "@/components/checker/RetroButtons";

interface SaveProgressModalProps {
  onClose: () => void;
  onAccountCreated: (username: string) => void;
  onSkip: () => void;
}

export function SaveProgressModal({
  onClose,
  onAccountCreated,
  onSkip,
}: SaveProgressModalProps) {
  const { profile } = useProfile();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    const result = registerAccount(username, password, profile);
    if (!result.ok) {
      setError(result.error ?? "Could not create account.");
      return;
    }
    onAccountCreated(username.trim().toLowerCase());
    onClose();
  };

  const handleSkip = () => {
    onSkip();
    onClose();
  };

  const inputClass =
    "w-full border-4 border-black bg-[#f5f0e8] px-4 py-3 text-sm font-bold text-[#1a1a2e] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:border-[#c0392b] focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-labelledby="save-progress-title"
        className="relative w-full max-w-md border-4 border-black bg-[#f4f1ea] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <button
          type="button"
          onClick={handleSkip}
          className="absolute right-4 top-4 text-[#1a1a2e] hover:text-[#c0392b]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-[#c0392b]">
          Save Progress
        </p>
        <h2
          id="save-progress-title"
          className="mb-2 text-xl font-black uppercase text-[#1a1a2e]"
        >
          Save your progress?
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-[#4a4a4a]">
          Create a temporary account to store your roadmap. Your selections stay
          saved in this browser.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
              Username
            </label>
            <input
              autoFocus
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              placeholder="Pick a username"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Choose a password"
              className={inputClass}
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-xs font-bold text-[#c0392b]">{error}</p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <RetroButton
            className="flex-1 justify-center"
            disabled={!username.trim() || !password}
            onClick={handleCreate}
          >
            Create Account
          </RetroButton>
          <RetroButtonOutline
            className="flex-1 justify-center"
            onClick={handleSkip}
          >
            Skip for Now
          </RetroButtonOutline>
        </div>
      </div>
    </div>
  );
}
