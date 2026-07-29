"use client";

import { useState } from "react";
import { Person, PHASES, PHASE_LABELS, Phase, nextEmptyPhase } from "@/lib/types";
import { formatTimestamp } from "@/lib/format";
import LiveClockButton from "./LiveClockButton";

interface PersonCardProps {
  person: Person;
  onCapture: (phase: Phase) => void;
  onClear: (phase: Phase) => void;
}

export default function PersonCard({ person, onCapture, onClear }: PersonCardProps) {
  const [confirmPhase, setConfirmPhase] = useState<Phase | null>(null);
  const next = nextEmptyPhase(person);

  function handleRowClick(phase: Phase) {
    if (person[phase] === null) return;
    setConfirmPhase((cur) => (cur === phase ? null : phase));
  }

  return (
    <div
      className="flex h-full w-full shrink-0 flex-col px-5 pt-4"
      style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <h2 className="no-select truncate text-center text-2xl font-semibold text-gray-900">
        {person.name}
      </h2>

      <div className="mt-6 flex flex-1 flex-col justify-center gap-3">
        {PHASES.map((phase) => {
          const filled = person[phase] !== null;
          const isNext = next === phase;
          const asking = confirmPhase === phase;
          return (
            <div
              key={phase}
              className={`no-select overflow-hidden rounded-2xl border transition-colors
                ${filled ? "border-saffron-500/50 bg-saffron-50" : "border-gray-200 bg-gray-50"}
                ${isNext ? "ring-1 ring-flagblue-500/60" : ""}`}
            >
              {asking ? (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-700">Reset {PHASE_LABELS[phase]}?</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmPhase(null)}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClear(phase);
                        setConfirmPhase(null);
                      }}
                      className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-600 active:scale-95"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRowClick(phase)}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-left"
                >
                  <span className={`text-lg font-medium ${filled ? "text-gray-900" : "text-gray-400"}`}>
                    {PHASE_LABELS[phase]}
                  </span>
                  <span
                    className={`font-mono text-lg tabular-nums ${
                      filled ? "text-saffron-600" : "text-gray-300"
                    }`}
                  >
                    {formatTimestamp(person[phase])}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <LiveClockButton
          onCapture={() => next && onCapture(next)}
          armed={next !== null}
          label={next ? `Tap to record ${PHASE_LABELS[next]}` : "All three recorded"}
        />
      </div>
    </div>
  );
}
