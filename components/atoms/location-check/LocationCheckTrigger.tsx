import type { RefObject } from "react";
import { controlH } from "@/lib/control-size";
import type { ClockProbeState, LocationInfo, ProbeTone, Status } from "@/lib/location-check/types";
import { toneBadge } from "@/lib/location-check/tone-styles";
import { interactiveFeedbackClass } from "@/lib/interactive-glass";
import { cn } from "@/lib/utils";
import { LocationCheckBadgeIcon } from "./LocationCheckBadgeIcon";
import { StatusMark } from "./StatusMark";

export function LocationCheckTrigger({
  triggerRef,
  open,
  onOpen,
  tone,
  buttonAria,
  badgeLabel,
  status,
  clock,
  trouble,
  info,
  softUnavailable,
}: {
  triggerRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  onOpen: () => void;
  tone: ProbeTone;
  buttonAria: string;
  badgeLabel: string;
  status: Status;
  clock: ClockProbeState;
  trouble: boolean;
  info: LocationInfo | null;
  softUnavailable: boolean;
}) {
  return (
    <div className={cn("relative", open && "z-50")} ref={triggerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        aria-label={buttonAria}
        className={cn(
          /* pl matches vertical inset around the size-7 mark in h-11 ((44-28)/2). */
          "no-select flex max-w-44 items-center gap-1.5 rounded-full border pr-3 pl-2",
          controlH.md,
          interactiveFeedbackClass({ press: "sm", on: open }),
          /* Opaque light fill — glass was too see-through on the record button. */
          toneBadge[tone],
        )}
      >
        <StatusMark tone={tone}>
          <LocationCheckBadgeIcon
            status={status}
            clock={clock}
            trouble={trouble}
            info={info}
            softUnavailable={softUnavailable}
          />
        </StatusMark>
        <span className="truncate text-sm font-medium">{badgeLabel}</span>
      </button>
    </div>
  );
}
