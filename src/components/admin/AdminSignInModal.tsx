"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { RetroButton, RetroButtonOutline } from "@/components/checker/RetroButtons";

interface AdminSignInModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AdminSignInModal({
  open,
  onClose,
  onSuccess,
}: AdminSignInModalProps) {
  const { login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  const inputClass =
    "w-full border-4 border-black bg-[#f5f0e8] px-4 py-3 text-sm font-bold text-[#1a1a2e] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:border-[#c0392b] focus:outline-none";

  const handleClose = () => {
    setUsername("");
    setPassword("");
    setError("");
    onClose();
  };

  const handleSignIn = () => {
    const result = login(username, password);
    if (!result.ok) {
      setError(result.error ?? "Could not sign in.");
      return;
    }

    setUsername("");
    setPassword("");
    setError("");
    onSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-labelledby="admin-sign-in-title"
        className="relative w-full max-w-md border-4 border-black bg-[#f4f1ea] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 text-[#1a1a2e] hover:text-[#c0392b]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-[#c0392b]">
          Admin Access
        </p>
        <h2
          id="admin-sign-in-title"
          className="mb-2 text-xl font-black uppercase text-[#1a1a2e]"
        >
          Admin Sign-In
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-[#4a4a4a]">
          Sign in to review community college requests and manage DETT admin
          tools.
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
              placeholder="Admin username"
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
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSignIn();
                }
              }}
              placeholder="Admin password"
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
            onClick={handleSignIn}
          >
            Sign In
          </RetroButton>
          <RetroButtonOutline
            className="flex-1 justify-center"
            onClick={handleClose}
          >
            Cancel
          </RetroButtonOutline>
        </div>
      </div>
    </div>
  );
}
