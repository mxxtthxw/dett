"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  getDisplayNameFromProfile,
  submitCollegeRequest,
} from "@/lib/collegeRequests";
import { useOptionalProfile } from "@/context/StudentProfileContext";
import { RetroButton, RetroButtonOutline } from "@/components/checker/RetroButtons";

interface CollegeRequestModalProps {
  open: boolean;
  onClose: () => void;
}

export function CollegeRequestModal({ open, onClose }: CollegeRequestModalProps) {
  const profileContext = useOptionalProfile();
  const profile = profileContext?.profile;
  const [collegeName, setCollegeName] = useState("");
  const [state, setState] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!open) {
    return null;
  }

  const inputClass =
    "w-full border-4 border-black bg-[#f5f0e8] px-4 py-3 text-sm font-bold text-[#1a1a2e] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:border-[#c0392b] focus:outline-none";

  const handleSubmit = () => {
    const result = submitCollegeRequest({
      collegeName,
      state,
      message,
      displayName: profile
        ? getDisplayNameFromProfile(profile)
        : undefined,
    });

    if (!result.ok) {
      setError(result.error ?? "Could not submit request.");
      return;
    }

    setSubmitted(true);
    setError("");
  };

  const handleClose = () => {
    setCollegeName("");
    setState("");
    setMessage("");
    setError("");
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-labelledby="college-request-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto border-4 border-black bg-[#f4f1ea] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 text-[#1a1a2e] hover:text-[#c0392b]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-[#10b981]">
              Request received
            </p>
            <h2
              id="college-request-title"
              className="mb-2 text-xl font-black uppercase text-[#1a1a2e]"
            >
              Thanks for the suggestion!
            </h2>
            <p className="text-sm leading-relaxed text-[#4a4a4a]">
              We&apos;ve saved your college request locally. The DETT team can
              review community suggestions in the admin panel.
            </p>
            <div className="mt-6">
              <RetroButton onClick={handleClose}>Close</RetroButton>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-[#c0392b]">
              Community Request
            </p>
            <h2
              id="college-request-title"
              className="mb-2 text-xl font-black uppercase text-[#1a1a2e]"
            >
              Request a College
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-[#4a4a4a]">
              Tell us which school you&apos;d like added to DETT — plus any
              transfer questions, course suggestions, or articulation notes.
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
                  College / University Name
                </label>
                <input
                  autoFocus
                  type="text"
                  value={collegeName}
                  onChange={(event) => {
                    setCollegeName(event.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Duke University"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
                  State (optional)
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                  placeholder="e.g. NC"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
                  Suggestions or Questions
                </label>
                <textarea
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    setError("");
                  }}
                  rows={5}
                  placeholder="Which DE courses should transfer? Any gen-ed or major requirements we should know about?"
                  className={`${inputClass} resize-y min-h-[120px]`}
                />
              </div>
            </div>

            {error ? (
              <p className="mt-4 text-xs font-bold text-[#c0392b]">{error}</p>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <RetroButton
                className="flex-1 justify-center"
                disabled={!collegeName.trim()}
                onClick={handleSubmit}
              >
                Submit Request
              </RetroButton>
              <RetroButtonOutline
                className="flex-1 justify-center"
                onClick={handleClose}
              >
                Cancel
              </RetroButtonOutline>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
