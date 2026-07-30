"use client";

import { useEffect, useState } from "react";
import { Person, PHASES, PHASE_LABELS, Phase, nextEmptyPhase } from "@/lib/types";
import { sharePerson } from "@/lib/share";
import LiveClockButton from "./LiveClockButton";
import PersonFields from "./PersonFields";

interface PersonCardProps {
  person: Person;
  onCapture: (phase: Phase) => void;
  onClear: (phase: Phase) => void;
  onResetAll: () => void;
}

export default function PersonCard({ person, onCapture, onClear, onResetAll }: PersonCardProps) {
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const autoNext = nextEmptyPhase(person);
  const target = selectedPhase !== null && person[selectedPhase] === null ? selectedPhase : autoNext;
  const anyFilled = PHASES.some((phase) => person[phase] !== null);

  useEffect(() => {
    setSelectedPhase(null);
    setConfirmResetAll(false);
  }, [person.id]);

  function handleCaptureClick() {
    if (!target) return;
    onCapture(target);
    setSelectedPhase(null);
  }

  async function handleShare() {
    const result = await sharePerson(person);
    if (result === "copied") {
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 1800);
    }
  }

  return (
    <div
      className="flex h-full w-full shrink-0 flex-col px-5 pt-4"
      style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-center gap-1">
        <h2 className="no-select truncate text-2xl font-semibold text-gray-900">{person.name}</h2>
        <button
          type="button"
          onClick={() => setConfirmResetAll(true)}
          disabled={!anyFilled}
          aria-label="Reset all times"
          className="rounded-full p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 disabled:pointer-events-none disabled:opacity-0 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.5 9a7.5 7.5 0 1 1 1.8 7.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={!anyFilled}
          aria-label="Share"
          className="rounded-full p-1.5 text-gray-300 hover:bg-flagblue-50 hover:text-flagblue-600 disabled:pointer-events-none disabled:opacity-0 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 4v9" strokeLinecap="round" />
            <path d="M8 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {shareStatus === "copied" && (
        <p className="no-select mt-1 text-center text-xs text-flagblue-600">Copied to clipboard</p>
      )}

      {confirmResetAll && (
        <div className="no-select mt-2 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm">
          <span className="text-gray-700">Reset all three times?</span>
          <button
            type="button"
            onClick={() => setConfirmResetAll(false)}
            className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-600 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onResetAll();
              setConfirmResetAll(false);
            }}
            className="rounded-lg border border-red-300 bg-white px-2.5 py-1 text-xs text-red-600 active:scale-95"
          >
            Reset
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-1 flex-col justify-center">
        <PersonFields person={person} onClear={onClear} target={target} onSelectPhase={setSelectedPhase} />
      </div>

      <div className="mt-6">
        <LiveClockButton
          onCapture={handleCaptureClick}
          armed={target !== null}
          label={target ? `Tap to record ${PHASE_LABELS[target]}` : "All three recorded"}
        />
      </div>
    </div>
  );
}
