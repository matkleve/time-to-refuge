"use client";

import type { Person, Phase, FieldDef } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PersonCard } from "./PersonCard";

/** Gap between carousel slides — keep in sync with `translateX` below. */
const CAROUSEL_GAP = "1rem";

function RefugeCarouselSlide({
  person,
  fields,
  isCurrent,
  target,
  setSelectedPhase,
  onClear,
  onResetAll,
  onDelete,
  onExport,
  onRename,
  onEditTime,
  retreatName,
}: {
  person: Person;
  fields: FieldDef[];
  isCurrent: boolean;
  target: Phase | null;
  setSelectedPhase: (phase: Phase | null) => void;
  onClear: (phase: Phase) => void;
  onResetAll: () => void;
  onDelete: () => void;
  onExport: () => void;
  onRename: (name: string) => void;
  onEditTime: (phase: Phase, at: number) => void;
  retreatName: string;
}) {
  return (
    <div className="focus-safe-scroll flex h-full w-full shrink-0 flex-col overflow-y-auto overscroll-contain px-3 pb-1">
      <PersonCard
        person={person}
        fields={fields}
        target={isCurrent ? target : null}
        onSelectPhase={isCurrent ? setSelectedPhase : undefined}
        onClear={onClear}
        onResetAll={onResetAll}
        onDelete={onDelete}
        onExport={onExport}
        onRename={onRename}
        onEditTime={onEditTime}
        retreatName={retreatName}
      />
    </div>
  );
}

export function RefugeCarousel({
  people,
  fields,
  index,
  current,
  target,
  setSelectedPhase,
  onClear,
  onResetAll,
  onDelete,
  onExport,
  onRename,
  onEditTime,
  retreatName,
  onTouchStart,
  onTouchEnd,
}: {
  people: Person[];
  fields: FieldDef[];
  index: number;
  current: Person | undefined;
  target: Phase | null;
  setSelectedPhase: (phase: Phase | null) => void;
  onClear: (personId: string, phase: Phase) => void;
  onResetAll: (personId: string) => void;
  onDelete: (personId: string) => void;
  onExport: (person: Person) => void;
  onRename: (personId: string, name: string) => void;
  onEditTime: (personId: string, phase: Phase, at: number) => void;
  retreatName: string;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}) {
  return (
    <div
      className={cn(
        "relative -mx-3 min-h-0 flex-1 overflow-x-hidden md:mx-0",
      )}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        aria-hidden
        className="refuge-carousel-edge refuge-carousel-edge-start"
      />
      <div
        aria-hidden
        className="refuge-carousel-edge refuge-carousel-edge-end"
      />
      <div
        className="flex h-full w-full gap-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          transform: `translateX(calc(-${index} * (100% + ${CAROUSEL_GAP})))`,
        }}
      >
        {people.map((p) => (
          <RefugeCarouselSlide
            key={p.id}
            person={p}
            fields={fields}
            isCurrent={p.id === current?.id}
            target={target}
            setSelectedPhase={setSelectedPhase}
            onClear={(phase) => onClear(p.id, phase)}
            onResetAll={() => onResetAll(p.id)}
            onDelete={() => onDelete(p.id)}
            onExport={() => onExport(p)}
            onRename={(name) => onRename(p.id, name)}
            onEditTime={(phase, at) => onEditTime(p.id, phase, at)}
            retreatName={retreatName}
          />
        ))}
      </div>
    </div>
  );
}
