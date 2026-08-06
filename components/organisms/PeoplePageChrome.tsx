"use client";

import { useEffect, useMemo, useRef } from "react";
import { ArmedActionButton } from "@/components/atoms/ArmedActionButton";
import { Person, FieldDef, getTime } from "@/lib/types";
import { useArmedAction } from "@/lib/use-armed-action";
import { useRegisterHeaderActions } from "@/components/timekeeper/header-actions-context";

function personHasRecordedTimes(person: Person, fields: FieldDef[]): boolean {
  return fields.some((field) => getTime(person, field.id) !== null);
}

function PeopleResetButton({
  idleLabel,
  armedLabel,
  hasTimes,
  armed,
  onTrigger,
}: {
  idleLabel: string;
  armedLabel: string;
  hasTimes: boolean;
  armed: boolean;
  onTrigger: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <ArmedActionButton
      armed={armed}
      disabled={!hasTimes}
      idleLabel={idleLabel}
      armedLabel={armedLabel}
      showLabel="Reset"
      onTrigger={onTrigger}
    />
  );
}

/** People — header reset (armed pattern like Fields / Quick Log). */
export function PeoplePageChrome({
  people,
  fields,
  currentPerson,
  isDesktop,
  onResetAll,
}: {
  people: Person[];
  fields: FieldDef[];
  currentPerson: Person | null;
  isDesktop: boolean;
  onResetAll: (id: string) => void;
}) {
  const peopleWithTimes = people.filter((p) => personHasRecordedTimes(p, fields));

  const hasTimes = isDesktop
    ? Boolean(currentPerson && personHasRecordedTimes(currentPerson, fields))
    : peopleWithTimes.length > 0;

  const resetCtx = useRef({
    isDesktop,
    currentPerson,
    peopleWithTimes,
    onResetAll,
  });
  useEffect(() => {
    resetCtx.current = { isDesktop, currentPerson, peopleWithTimes, onResetAll };
  });

  const { armed, trigger } = useArmedAction(() => {
    const ctx = resetCtx.current;
    const targets =
      ctx.isDesktop && ctx.currentPerson ? [ctx.currentPerson] : ctx.peopleWithTimes;
    for (const person of targets) {
      ctx.onResetAll(person.id);
    }
  });

  const idleLabel = isDesktop
    ? currentPerson
      ? `Reset all recorded times for ${currentPerson.name}`
      : "Reset all recorded times"
    : "Reset all recorded times";

  const armedLabel = isDesktop
    ? currentPerson
      ? `Confirm reset all recorded times for ${currentPerson.name}`
      : "Confirm reset all recorded times"
    : "Confirm reset all recorded times";

  const headerActions = useMemo(
    () => (
      <PeopleResetButton
        idleLabel={idleLabel}
        armedLabel={armedLabel}
        hasTimes={hasTimes}
        armed={armed}
        onTrigger={(e) => {
          e.stopPropagation();
          trigger();
        }}
      />
    ),
    [armed, armedLabel, hasTimes, idleLabel, trigger],
  );

  useRegisterHeaderActions(headerActions);

  return null;
}
