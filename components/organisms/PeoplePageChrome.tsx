"use client";

import { useMemo } from "react";
import { ArmedActionButton } from "@/components/atoms/ArmedActionButton";
import { useArmedAction } from "@/lib/use-armed-action";
import { useRegisterHeaderActions } from "@/components/timekeeper/header-actions-context";

function PeopleResetButton({
  hasPeople,
  armed,
  onTrigger,
}: {
  hasPeople: boolean;
  armed: boolean;
  onTrigger: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <ArmedActionButton
      armed={armed}
      disabled={!hasPeople}
      idleLabel="Delete all people"
      armedLabel="Confirm delete all people"
      showLabel="Reset"
      onTrigger={onTrigger}
    />
  );
}

/** People — header reset deletes every person (armed pattern like Fields / Quick Log). */
export function PeoplePageChrome({
  people,
  onDeleteAll,
}: {
  people: { id: string }[];
  onDeleteAll: () => void;
}) {
  const hasPeople = people.length > 0;

  const { armed, trigger } = useArmedAction(onDeleteAll);

  const headerActions = useMemo(
    () => (
      <PeopleResetButton
        hasPeople={hasPeople}
        armed={armed}
        onTrigger={(e) => {
          e.stopPropagation();
          trigger();
        }}
      />
    ),
    [armed, hasPeople, trigger],
  );

  useRegisterHeaderActions(headerActions);

  return null;
}
