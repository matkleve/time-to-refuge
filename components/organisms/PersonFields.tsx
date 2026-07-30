"use client";

import { useEffect, useState } from "react";
import { Person, PHASES, PHASE_LABELS, Phase } from "@/lib/types";
import { formatTimestamp } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SwipeToAction } from "@/components/atoms/SwipeToAction";
import { ConfirmInline } from "@/components/atoms/ConfirmInline";

interface PersonFieldsProps {
  person: Person;
  onClear?: (phase: Phase) => void;
  target?: Phase | null;
  onSelectPhase?: (phase: Phase) => void;
  readOnly?: boolean;
}

export function PersonFields({
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
        // Rows stay white so they read clearly against the card's fill.
        const rowClassName = cn(
          "no-select bg-white transition-shadow duration-200",
          filled && "shadow-sm",
          isTarget && "ring-2 ring-flagblue-500",
        );

        const content = asking ? (
          <ConfirmInline
            message={`Reset ${PHASE_LABELS[phase]}?`}
            confirmLabel={`Reset ${PHASE_LABELS[phase]}`}
            onConfirm={() => {
              onClear?.(phase);
              setConfirmPhase(null);
            }}
            onCancel={() => setConfirmPhase(null)}
          />
        ) : (
          <button
            type="button"
            onClick={() => handleRowClick(phase)}
            disabled={readOnly}
            className={cn(
              "flex w-full items-center justify-between px-4 text-left",
              readOnly ? "py-2.5" : "py-3.5 hover:bg-ink/[0.03]",
            )}
          >
            <span
              className={cn(
                "font-display font-medium",
                readOnly ? "text-sm" : "text-lg",
                filled ? "text-ink" : "text-subtle",
              )}
            >
              {PHASE_LABELS[phase]}
            </span>
            <span
              className={cn(
                "font-mono tabular-nums",
                readOnly ? "text-sm" : "text-lg",
                filled ? "text-saffron-700" : "text-subtle",
              )}
            >
              {formatTimestamp(person[phase])}
            </span>
          </button>
        );

        if (readOnly) {
          return (
            <div key={phase} className={cn("overflow-hidden rounded-2xl", rowClassName)}>
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
