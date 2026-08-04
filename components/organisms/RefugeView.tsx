"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { Person, Phase, FieldDef, fieldLabel } from "@/lib/types";
import { usePhaseTarget } from "@/lib/use-phase-target";
import { LiveClockButton } from "@/components/atoms/LiveClockButton";
import { PersonCard } from "./PersonCard";

interface RefugeViewProps {
  people: Person[];
  fields: FieldDef[];
  index: number;
  onIndexChange: (index: number) => void;
  onCapture: (personId: string, phase: Phase) => void;
  onClear: (personId: string, phase: Phase) => void;
  onResetAll: (personId: string) => void;
  onDelete: (personId: string) => void;
  onExport: (person: Person) => void;
  onRename: (personId: string, name: string) => void;
  onEditTime: (personId: string, phase: Phase, at: number) => void;
  /** A field picked in the overview, to arm once this view takes over. */
  requestedPhase?: Phase | null;
  onRequestedPhaseConsumed?: () => void;
  retreatName?: string;
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
      glass
      onClick={onClick}
      disabled={!available}
      hideWhenDisabled
      tone="neutral"
      size="sm"
    />
  );
}

export function RefugeView({
  people,
  fields,
  index,
  onIndexChange,
  onCapture,
  onClear,
  onResetAll,
  onDelete,
  onExport,
  onRename,
  onEditTime,
  requestedPhase = null,
  onRequestedPhaseConsumed,
  retreatName = "",
}: RefugeViewProps) {
  const touchStartX = useRef<number | null>(null);

  const current = people[index];
  const { target, setSelectedPhase } = usePhaseTarget(
    current,
    fields,
    requestedPhase,
    onRequestedPhaseConsumed,
  );

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
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      {/*
        Card fills the space under the page chrome and above the record
        button. Many fields scroll inside the card — the card shell stays put.
        Horizontal swipe still changes person.
      */}
      <div
        className="relative min-h-0 flex-1 overflow-x-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute top-3 right-4 z-20 flex items-center gap-1">
          <NavButton
            direction="prev"
            available={index > 0}
            onClick={() => onIndexChange(index - 1)}
          />
          <span className="min-w-8 px-0.5 text-center text-sm tabular-nums text-muted">
            {index + 1}/{people.length}
          </span>
          <NavButton
            direction="next"
            available={index < people.length - 1}
            onClick={() => onIndexChange(index + 1)}
          />
        </div>

        <div
          className="flex h-full w-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {people.map((p) => {
            const isCurrent = p.id === current?.id;
            return (
              <div
                key={p.id}
                className="flex h-full w-full shrink-0 flex-col px-4 pt-12 pb-1"
              >
                <PersonCard
                  fillHeight
                  person={p}
                  fields={fields}
                  target={isCurrent ? target : null}
                  onSelectPhase={isCurrent ? setSelectedPhase : undefined}
                  onClear={(phase) => onClear(p.id, phase)}
                  onResetAll={() => onResetAll(p.id)}
                  onDelete={() => onDelete(p.id)}
                  onExport={() => onExport(p)}
                  onRename={(name) => onRename(p.id, name)}
                  onEditTime={(phase, at) => onEditTime(p.id, phase, at)}
                  retreatName={retreatName}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 px-4 pt-3">
        <LiveClockButton
          onCapture={handleCaptureClick}
          armed={target !== null}
          label={
            target
              ? `Tap to record ${fieldLabel(fields, target)}`
              : "All fields recorded"
          }
        />
      </div>
    </div>
  );
}
