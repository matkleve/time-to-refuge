"use client";

import { useMemo } from "react";
import { ArmedActionButton } from "@/components/atoms/ArmedActionButton";
import { TimezoneSelect } from "@/components/atoms/TimezoneSelect";
import type { useArmedAction } from "@/lib/use-armed-action";
import { useRegisterHeaderActions } from "@/components/timekeeper/header-actions-context";

function QuickLogClearButton({
  entryCount,
  armed,
  onTrigger,
}: {
  entryCount: number;
  armed: boolean;
  onTrigger: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <ArmedActionButton
      armed={armed}
      disabled={entryCount === 0}
      idleLabel="Clear all logged times"
      armedLabel="Confirm clear all logged times"
      showLabel="Clear"
      onTrigger={onTrigger}
    />
  );
}

export function QuickLogPageChrome({
  entryCount,
  tz,
  onTzChange,
  clearAll,
}: {
  entryCount: number;
  tz: string;
  onTzChange: (tz: string) => void;
  clearAll: ReturnType<typeof useArmedAction>;
}) {
  const { armed, trigger } = clearAll;

  const headerActions = useMemo(
    () => (
      <QuickLogClearButton
        entryCount={entryCount}
        armed={armed}
        onTrigger={(e) => {
          e.stopPropagation();
          trigger();
        }}
      />
    ),
    [armed, entryCount, trigger],
  );

  useRegisterHeaderActions(headerActions);

  return (
    <div className="flex flex-col gap-2 pb-2">
      <p className="text-base tabular-nums text-muted">{entryCount} logged</p>
      <TimezoneSelect value={tz} onChange={onTzChange} chip fullWidth />
    </div>
  );
}
