import { controlH } from "@/lib/control-size";
import type { ClockProbeState, LocationInfo, ProbeTone, Status } from "@/lib/location-check/types";
import { toneBadge } from "@/lib/location-check/tone-styles";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
import { UiButton } from "@/components/ui";
import { LocationCheckBadgeIcon } from "./LocationCheckBadgeIcon";
import { StatusMark } from "./StatusMark";

export function LocationCheckTrigger({
  open,
  tone,
  buttonAria,
  badgeLabel,
  status,
  clock,
  trouble,
  info,
  softUnavailable,
}: {
  open: boolean;
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
    <UiButton
      aria-label={buttonAria}
      className={({ isPressed }) =>
        cn(
          "no-select flex max-w-44 items-center gap-1.5 rounded-full border pr-3 pl-2 shadow-sm outline-none",
          controlH.md,
          userFeedbackClass({ press: "sm", on: open || isPressed }),
          toneBadge[tone],
        )
      }
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
    </UiButton>
  );
}
