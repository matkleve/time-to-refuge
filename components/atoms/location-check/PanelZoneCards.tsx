import type { LucideIcon } from "lucide-react";
import type { LocationInfo, Status } from "@/lib/location-check/types";
import { cn } from "@/lib/utils";
import { PanelZoneSideCards } from "./PanelZoneSideCards";

export function PanelZoneCards({
  info,
  status,
  HostIcon,
  HostNoun,
  gapCopy,
}: {
  info: LocationInfo | null;
  status: Status;
  HostIcon: LucideIcon;
  HostNoun: string;
  gapCopy: string | null;
}) {
  if (!info || !(info.placeOffset || info.deviceOffset) || status === "checking") {
    return null;
  }

  return (
    <div className="mt-3 space-y-2.5">
      <PanelZoneSideCards info={info} HostIcon={HostIcon} HostNoun={HostNoun} />
      {gapCopy ? (
        <p
          className={cn(
            "rounded-2xl px-3 py-2 text-sm",
            info.matchesLocation
              ? "bg-saffron-400/15 text-saffron-800"
              : "bg-danger-500/10 text-danger-700",
          )}
        >
          {gapCopy}
        </p>
      ) : null}
    </div>
  );
}
