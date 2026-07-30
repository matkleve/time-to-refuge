"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { Person, PHASE_LABELS, Phase, nextEmptyPhase } from "@/lib/types";
import { LiveClockButton } from "@/components/atoms/LiveClockButton";
import { PersonCard } from "./PersonCard";

interface RefugeViewProps {
  people: Person[];
  index: number;
  onIndexChange: (index: number) => void;
  onCapture: (personId: string, phase: Phase) => void;
  onClear: (personId: string, phase: Phase) => void;
  onResetAll: (personId: string) => void;
  onExport: (person: Person) => void;
  onRename: (personId: string, name: string) => void;
}

/**
 * Person navigation. When there is nobody that way the button keeps its
 * footprint and goes invisible, so the counter never shifts.
 */
function NavButton({
  direction,
  available,
  onClick,
}: {
  direction: "prev" | "next";
  available: boolean;
  onClick: () => void;
}) {
  const prev = direction === "prev";
  return (
    <IconButton
      icon={prev ? ChevronLeft : ChevronRight}
      label={prev ? "Previous person" : "Next person"}
      onClick={onClick}
      disabled={!available}
      hideWhenDisabled
      tone="neutral"
    />
  );
}

export function RefugeView({
  people,
  index,
  onIndexChange,
  onCapture,
  onClear,
  onResetAll,
  onExport,
  onRename,
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
      <div className="flex flex-1 flex-col justify-center overflow-hidden">
        {/* Position + navigation, directly above the card. */}
        <div className="flex shrink-0 items-center justify-center gap-1 pb-3">
          <NavButton
            direction="prev"
            available={index > 0}
            onClick={() => onIndexChange(index - 1)}
          />
          <span className="min-w-14 text-center text-label tabular-nums text-muted">
            {index + 1} / {people.length}
          </span>
          <NavButton
            direction="next"
            available={index < people.length - 1}
            onClick={() => onIndexChange(index + 1)}
          />
        </div>

        {/* Only this track moves when swiping between people. */}
        <div className="overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div
            className="flex w-full transition-transform duration-(--duration-slide) ease-(--ease-out-ui)"
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
                    onRename={(name) => onRename(p.id, name)}
                  />
                </div>
              );
            })}
          </div>
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
