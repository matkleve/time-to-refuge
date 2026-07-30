"use client";

import { useEffect, useRef, useState } from "react";
import { Person, PHASE_LABELS, Phase, nextEmptyPhase } from "@/lib/types";
import LiveClockButton from "./LiveClockButton";
import PersonCard from "./PersonCard";

interface RefugeViewProps {
  people: Person[];
  index: number;
  onIndexChange: (index: number) => void;
  onCapture: (personId: string, phase: Phase) => void;
  onClear: (personId: string, phase: Phase) => void;
  onResetAll: (personId: string) => void;
  onExport: (person: Person) => void;
}

export default function RefugeView({
  people,
  index,
  onIndexChange,
  onCapture,
  onClear,
  onResetAll,
  onExport,
}: RefugeViewProps) {
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const touchStartX = useRef<number | null>(null);

  const current = people[index];
  const autoNext = current ? nextEmptyPhase(current) : null;
  const target =
    current && selectedPhase !== null && current[selectedPhase] === null ? selectedPhase : autoNext;

  // A phase picked on one person shouldn't stay armed when you swipe to another.
  useEffect(() => {
    setSelectedPhase(null);
  }, [current?.id]);

  function handleCaptureClick() {
    if (!current || !target) return;
    onCapture(current.id, target);
    setSelectedPhase(null);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    onIndexChange(Math.max(0, Math.min(people.length - 1, index + (delta < 0 ? 1 : -1))));
  }

  return (
    <div
      className="flex flex-1 flex-col overflow-hidden pt-4"
      style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      {/* Only this track moves when swiping between people. */}
      <div
        className="flex flex-1 items-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {people.map((p) => {
            const isCurrent = p.id === current?.id;
            return (
              <div key={p.id} className="w-full shrink-0 px-4">
                <PersonCard
                  person={p}
                  variant="focused"
                  target={isCurrent ? target : null}
                  onSelectPhase={isCurrent ? setSelectedPhase : undefined}
                  onClear={(phase) => onClear(p.id, phase)}
                  onResetAll={() => onResetAll(p.id)}
                  onExport={() => onExport(p)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Stays put while the cards swipe past. */}
      <div className="shrink-0 px-4 pt-4">
        <LiveClockButton
          onCapture={handleCaptureClick}
          armed={target !== null}
          label={target ? `Tap to record ${PHASE_LABELS[target]}` : "All three recorded"}
        />
      </div>
    </div>
  );
}
