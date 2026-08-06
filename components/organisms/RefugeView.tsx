"use client";

import { useRef } from "react";
import { Person, Phase, FieldDef, fieldLabel } from "@/lib/types";
import { usePhaseTarget } from "@/lib/use-phase-target";
import { ClockStamp } from "@/components/atoms/ClockStamp";
import { RefugeCarousel } from "./RefugeCarousel";
import { RefugePersonSwitcher } from "./RefugePersonSwitcher";

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
      className="flex min-h-0 flex-1 flex-col"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      {/*
        Person switcher sits in its own row above the card — quiet glyphs,
        no glass chip overlaying the card corner. Card fills remaining height;
        many fields scroll inside. Horizontal swipe still changes person.
      */}
      <RefugePersonSwitcher
        index={index}
        total={people.length}
        onPrev={() => onIndexChange(index - 1)}
        onNext={() => onIndexChange(index + 1)}
      />

      <RefugeCarousel
        people={people}
        fields={fields}
        index={index}
        current={current}
        target={target}
        setSelectedPhase={setSelectedPhase}
        onClear={onClear}
        onResetAll={onResetAll}
        onDelete={onDelete}
        onExport={onExport}
        onRename={onRename}
        onEditTime={onEditTime}
        retreatName={retreatName}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />

      <div className="shrink-0 pt-3">
        <ClockStamp
          mode="session"
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
