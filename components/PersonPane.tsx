"use client";

import { useEffect, useState } from "react";
import { Person, PHASE_LABELS, Phase, nextEmptyPhase } from "@/lib/types";
import LiveClockButton from "./LiveClockButton";
import PersonCard from "./PersonCard";

interface PersonPaneProps {
  person: Person;
  onCapture: (phase: Phase) => void;
  onClear: (phase: Phase) => void;
  onResetAll: () => void;
}

export default function PersonPane({ person, onCapture, onClear, onResetAll }: PersonPaneProps) {
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const autoNext = nextEmptyPhase(person);
  const target = selectedPhase !== null && person[selectedPhase] === null ? selectedPhase : autoNext;

  useEffect(() => {
    setSelectedPhase(null);
  }, [person.id]);

  function handleCaptureClick() {
    if (!target) return;
    onCapture(target);
    setSelectedPhase(null);
  }

  return (
    <div
      className="flex h-full w-full shrink-0 flex-col px-4 pt-4"
      style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <PersonCard
            person={person}
            variant="focused"
            target={target}
            onSelectPhase={setSelectedPhase}
            onClear={onClear}
            onResetAll={onResetAll}
          />
        </div>
      </div>

      <div className="mt-4">
        <LiveClockButton
          onCapture={handleCaptureClick}
          armed={target !== null}
          label={target ? `Tap to record ${PHASE_LABELS[target]}` : "All three recorded"}
        />
      </div>
    </div>
  );
}
