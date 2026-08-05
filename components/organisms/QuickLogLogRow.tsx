"use client";

import { useCallback, useEffect, useState } from "react";
import { formatInZone } from "@/lib/format";
import { useArmedAction } from "@/lib/use-armed-action";
import { useDismissible } from "@/lib/use-dismissible";
import { controlMinH, BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { cn } from "@/lib/utils";
import { QuickLogLogRowActions } from "@/components/organisms/QuickLogLogRowActions";
import { QuickLogLogRowStamp } from "@/components/organisms/QuickLogLogRowStamp";

export function QuickLogLogRow({
  index,
  at,
  tz,
  armedAll,
  onDelete,
}: {
  index: number;
  at: number;
  tz: string;
  armedAll: boolean;
  onDelete: () => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const remove = useArmedAction(onDelete);
  const { date, time, ms } = formatInZone(at, tz);
  const stamp = `${date} · ${time}.${ms}`;
  const red = remove.armed || armedAll;

  const { disarm } = remove;
  const closeActions = useCallback(() => {
    setShowActions(false);
    disarm();
  }, [disarm]);

  const dismissRef = useDismissible<HTMLDivElement>({
    active: showActions,
    onDismiss: closeActions,
  });

  useEffect(() => {
    setShowActions(false);
    setCopied(false);
    disarm();
  }, [at, disarm]);

  async function copyTime(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(stamp);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard denied */
    }
  }

  function handleRowClick(e: React.MouseEvent) {
    e.stopPropagation();
    setShowActions((v) => !v);
    disarm();
  }

  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
       Stops the page-wide tap-to-log layer; the row's real controls are buttons. */
    <div
      className="max-w-full shrink-0 animate-fade-in-up"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={dismissRef}
        className={cn(
          "flex w-full max-w-full min-w-0 items-center",
          BUTTON_CLUSTER_GAP,
          controlMinH.md,
        )}
      >
        <QuickLogLogRowStamp
          index={index}
          date={date}
          time={time}
          ms={ms}
          red={red}
          showActions={showActions}
          onToggleActions={handleRowClick}
        />
        <QuickLogLogRowActions
          index={index}
          copied={copied}
          showActions={showActions}
          remove={remove}
          onCopy={copyTime}
        />
      </div>
    </div>
  );
}
