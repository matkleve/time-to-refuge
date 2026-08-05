import { MapPin, type LucideIcon } from "lucide-react";
import type { LocationInfo } from "@/lib/location-check/types";
import { SideCard } from "./SideCard";

export function PanelZoneSideCards({
  info,
  HostIcon,
  HostNoun,
}: {
  info: LocationInfo;
  HostIcon: LucideIcon;
  HostNoun: string;
}) {
  return (
    <div className="flex gap-2">
      <SideCard
        icon={<MapPin className="size-3.5" aria-hidden />}
        label="Here"
        zone={
          info.placeZone
            ? info.placeZone.replace(/_/g, " ")
            : info.placeOffset
              ? "Rough from GPS"
              : "—"
        }
        offset={
          info.placeOffset
            ? info.placeZone
              ? info.placeOffset
              : `≈ ${info.placeOffset}`
            : "—"
        }
        tone={
          info.matchesLocation ? "ok" : info.placeOffset ? "danger" : "neutral"
        }
      />
      <SideCard
        icon={<HostIcon className="size-3.5" aria-hidden />}
        label={HostNoun}
        zone={info.deviceZone.replace(/_/g, " ")}
        offset={info.deviceOffset}
        tone={info.matchesLocation ? "ok" : "danger"}
      />
    </div>
  );
}
