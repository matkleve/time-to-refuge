"use client";

import { useEffect, useState } from "react";
import { Person, PHASES, PHASE_LABELS, Phase } from "@/lib/types";
import { formatTimestamp } from "@/lib/format";
import SwipeToAction from "./SwipeToAction";

interface PersonFieldsProps {
  person: Person;
  onClear?: (phase: Phase) => void;
  target?: Phase | null;
  onSelectPhase?: (phase: Phase) => void;
  readOnly?: boolean;
}

export default function PersonFields({
  person,
  onClear,
  target = null,
  onSelectPhase,
  readOnly = false,
}: PersonFieldsProps) {
  const [confirmPhase, setConfirmPhase] = useState<Phase | null>(null);

  useEffect(() => {
    setConfirmPhase(null);
  }, [person.id]);

  function handleRowClick(phase: Phase) {
    if (readOnly) return;
    if (person[phase] === null) {
      onSelectPhase?.(phase);
    } else {
      setConfirmPhase((cur) => (cur === phase ? null : phase));
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {PHASES.map((phase) => {
        const filled = person[phase] !== null;
        const isTarget = target === phase;
        const asking = confirmPhase === phase;
        const rowClassName = `no-select border transition-colors
          ${filled ? "border-saffron-500/50 bg-saffron-50" : "border-gray-200 bg-gray-50"}
          ${isTarget ? "ring-2 ring-flagblue-500/70" : ""}`;

        const content = asking ? (
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
                  onClear?.(phase);
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
            disabled={readOnly}
            className={`flex w-full items-center justify-between px-4 text-left ${
              readOnly ? "py-2.5" : "py-3.5 hover:bg-black/[0.02]"
            }`}
          >
            <span className={`font-medium ${readOnly ? "text-sm" : "text-lg"} ${filled ? "text-gray-900" : "text-gray-400"}`}>
              {PHASE_LABELS[phase]}
            </span>
            <span
              className={`font-mono tabular-nums ${readOnly ? "text-sm" : "text-lg"} ${
                filled ? "text-saffron-600" : "text-gray-300"
              }`}
            >
              {formatTimestamp(person[phase])}
            </span>
          </button>
        );

        if (readOnly) {
          return (
            <div key={phase} className={`overflow-hidden rounded-2xl ${rowClassName}`}>
              {content}
            </div>
          );
        }

        return (
          <SwipeToAction
            key={phase}
            onSwipe={() => setConfirmPhase(phase)}
            label="Reset"
            disabled={!filled || asking}
            className={rowClassName}
          >
            <div className="bg-inherit">{content}</div>
          </SwipeToAction>
        );
      })}
    </div>
  );
}
