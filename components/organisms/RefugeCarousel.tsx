"use client";

import type { Person, Phase, FieldDef } from "@/lib/types";
import { PersonCard } from "./PersonCard";

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
    <div className="flex h-full w-full shrink-0 flex-col px-3 pb-1">
      <PersonCard
        fillHeight
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
      className="relative min-h-0 flex-1 overflow-x-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex h-full w-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
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
