"use client";

import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { TimezoneSelect } from "@/components/atoms/TimezoneSelect";
import { IconButton } from "@/components/atoms/IconButton";
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
    <IconButton
      icon={RotateCcw}
      label={
        clearAll.armed
          ? "Confirm clear all logged times"
          : "Clear all logged times"
      }
      showLabel="Clear"
      glass
      tone="danger"
      size="md"
      disabled={entryCount === 0}
      armed={clearAll.armed}
      onClick={(e) => {
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
