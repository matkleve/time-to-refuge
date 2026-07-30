"use client";

import { useEffect, useState } from "react";
import { Person, PHASES, PHASE_LABELS, Phase, nextEmptyPhase } from "@/lib/types";
import { formatTimestamp } from "@/lib/format";
import LiveClockButton from "./LiveClockButton";
import SwipeToAction from "./SwipeToAction";

interface PersonCardProps {
  person: Person;
  onCapture: (phase: Phase) => void;
  onClear: (phase: Phase) => void;
  onResetAll: () => void;
}

export default function PersonCard({ person, onCapture, onClear, onResetAll }: PersonCardProps) {
  const [confirmPhase, setConfirmPhase] = useState<Phase | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const autoNext = nextEmptyPhase(person);
  const target = selectedPhase !== null && person[selectedPhase] === null ? selectedPhase : autoNext;
  const anyFilled = PHASES.some((phase) => person[phase] !== null);

  useEffect(() => {
    setSelectedPhase(null);
    setConfirmResetAll(false);
  }, [person.id]);

  function handleRowClick(phase: Phase) {
    if (person[phase] === null) {
      setSelectedPhase(phase);
      setConfirmPhase(null);
    } else {
      setConfirmPhase((cur) => (cur === phase ? null : phase));
    }
  }

  function handleCaptureClick() {
    if (!target) return;
    onCapture(target);
    setSelectedPhase(null);
  }

  return (
    <div
      className="flex h-full w-full shrink-0 flex-col px-5 pt-4"
      style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-center gap-2">
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
      </div>

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

      <div className="mt-6 flex flex-1 flex-col justify-center gap-3">
        {PHASES.map((phase) => {
          const filled = person[phase] !== null;
          const isTarget = target === phase;
          const asking = confirmPhase === phase;
          return (
            <SwipeToAction
              key={phase}
              onSwipe={() => setConfirmPhase(phase)}
              label="Reset"
              disabled={!filled || asking}
              className={`no-select border transition-colors
                ${filled ? "border-saffron-500/50 bg-saffron-50" : "border-gray-200 bg-gray-50"}
                ${isTarget ? "ring-2 ring-flagblue-500/70" : ""}`}
            >
              <div className="bg-inherit">
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
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-black/[0.02]"
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
            </SwipeToAction>
          );
        })}
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
