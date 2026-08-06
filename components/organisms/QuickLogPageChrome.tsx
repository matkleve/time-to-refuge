"use client";

import { useMemo } from "react";
import { ArmedActionButton } from "@/components/atoms/ArmedActionButton";
import { TimezoneSelect } from "@/components/atoms/TimezoneSelect";
import type { useArmedAction } from "@/lib/use-armed-action";
import { useRegisterHeaderActions } from "@/components/timekeeper/header-actions-context";
import { useMediaQuery } from "@/lib/use-media-query";

function QuickLogClearButton({
  entryCount,
  clearAll,
}: {
  entryCount: number;
  clearAll: ReturnType<typeof useArmedAction>;
}) {
  return (
    <ArmedActionButton
      armed={clearAll.armed}
      disabled={entryCount === 0}
      idleLabel="Clear all logged times"
      armedLabel="Confirm clear all logged times"
      showLabel="Clear"
      onTrigger={(e) => {
        e.stopPropagation();
        clearAll.trigger();
      }}
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const headerActions = useMemo(
    () => (
      <QuickLogClearButton entryCount={entryCount} clearAll={clearAll} />
    ),
    [entryCount, clearAll],
  );

  useRegisterHeaderActions(isDesktop ? headerActions : null);

  return (
    <div className="flex flex-col gap-2 pb-2">
      {!isDesktop ? (
        <div className="flex justify-end">
          <QuickLogClearButton entryCount={entryCount} clearAll={clearAll} />
        </div>
      ) : null}
      <p className="text-base tabular-nums text-muted">{entryCount} logged</p>
      <TimezoneSelect value={tz} onChange={onTzChange} chip />
    </div>
  );
}
