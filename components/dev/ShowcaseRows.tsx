"use client";

import { useState } from "react";
import { FieldEditorRow } from "@/components/organisms/FieldEditorRow";
import { PersonFieldRow } from "@/components/organisms/PersonFieldRow";
import { QuickLogLogRowStamp } from "@/components/organisms/QuickLogLogRowStamp";
import { SessionPersonRow } from "@/components/organisms/SessionPersonRow";
import { ShowcaseSection } from "@/components/dev/ShowcaseSection";
import {
  DEMO_FIELDS,
  DEMO_FIELDS_EIGHT,
  DEMO_PERSON_EMPTY,
  DEMO_PERSON_PARTIAL,
} from "@/components/dev/showcase-data";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { cn } from "@/lib/utils";

export function ShowcaseRows() {
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sessionTarget, setSessionTarget] = useState<string | null>("dharma");
  const [logOpen, setLogOpen] = useState(false);
  const people = [DEMO_PERSON_EMPTY, DEMO_PERSON_PARTIAL];

  return (
    <>
      <ShowcaseSection
        title="Session rail"
        hint="Whole chip bounces — glass + feedback on the outer shell, not the name button."
      >
        <ul className={cn("flex max-w-sm flex-col", BUTTON_CLUSTER_GAP)}>
          {people.map((p, i) => (
            <li key={p.id}>
              <SessionPersonRow
                person={p}
                fields={DEMO_FIELDS}
                isCurrent={i === sessionIndex}
                target={i === sessionIndex ? sessionTarget : null}
                onSelect={() => setSessionIndex(i)}
                onSelectPhase={(phase) => {
                  setSessionIndex(i);
                  setSessionTarget(phase);
                }}
              />
            </li>
          ))}
        </ul>
      </ShowcaseSection>

      <ShowcaseSection
        title="Session rail (8 fields)"
        hint="Compact density — 20px circles, 4px gaps."
      >
        <ul className="flex w-64 flex-col gap-1.5">
          <li>
            <SessionPersonRow
              person={DEMO_PERSON_PARTIAL}
              fields={DEMO_FIELDS_EIGHT}
              isCurrent
              onSelect={() => {}}
              onSelectPhase={() => {}}
            />
          </li>
        </ul>
      </ShowcaseSection>

      <ShowcaseSection title="Person field rows" hint="Stamp button owns glass + feedback.">
        <ul className={cn("flex max-w-lg flex-col", BUTTON_CLUSTER_GAP)}>
          <li>
            <PersonFieldRow
              person={DEMO_PERSON_PARTIAL}
              fields={DEMO_FIELDS}
              phase="sangha"
              phaseLabel="Sangha"
              isTarget
              onSelectPhase={() => {}}
              onClear={() => {}}
            />
          </li>
          <li>
            <PersonFieldRow
              person={DEMO_PERSON_PARTIAL}
              fields={DEMO_FIELDS}
              phase="buddha"
              phaseLabel="Buddha"
              isTarget={false}
              onClear={() => {}}
            />
          </li>
        </ul>
      </ShowcaseSection>

      <ShowcaseSection title="Field editor row">
        <FieldEditorRow
          field={DEMO_FIELDS[1]}
          canDelete
          canUp
          canDown={false}
          bumpNonce={0}
          onRename={() => {}}
          onUp={() => {}}
          onDown={() => {}}
          onDelete={() => {}}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Quick Log stamp">
        <div className="max-w-md">
          <QuickLogLogRowStamp
            index={1}
            date="2026-08-05"
            time="14:30:00"
            ms="123"
            red={false}
            showActions={logOpen}
            onToggleActions={() => setLogOpen((v) => !v)}
          />
        </div>
      </ShowcaseSection>
    </>
  );
}
