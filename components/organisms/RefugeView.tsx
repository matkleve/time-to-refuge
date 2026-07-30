"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Person, PHASE_LABELS, Phase, nextEmptyPhase } from "@/lib/types";
import { cn } from "@/lib/utils";
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
 * Ghost arrow beside the record button. When there's no person that way it goes
 * invisible rather than unmounting, so the record button never changes width.
 */
function GhostNav({
  direction,
  available,
  onClick,
}: {
  direction: "prev" | "next";
  available: boolean;
  onClick: () => void;
}) {
  const prev = direction === "prev";
  const Icon = prev ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!available}
      aria-hidden={!available}
      aria-label={prev ? "Previous person" : "Next person"}
      className={cn(
        "shrink-0 rounded-full p-2 text-muted/70 transition-opacity hover:bg-black/[0.05] hover:text-ink active:scale-90",
        !available && "pointer-events-none opacity-0",
      )}
    >
      <Icon className="h-6 w-6" />
    </button>
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
                  onRename={(name) => onRename(p.id, name)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Stays put while the cards swipe past. */}
      <div className="flex shrink-0 items-center gap-1 px-2 pt-4">
        <GhostNav
          direction="prev"
          available={index > 0}
          onClick={() => onIndexChange(index - 1)}
        />

        <div className="min-w-0 flex-1">
          <LiveClockButton
            onCapture={handleCaptureClick}
            armed={target !== null}
            label={target ? `Tap to record ${PHASE_LABELS[target]}` : "All three recorded"}
          />
        </div>

        <GhostNav
          direction="next"
          available={index < people.length - 1}
          onClick={() => onIndexChange(index + 1)}
        />
      </div>
    </div>
  );
}
