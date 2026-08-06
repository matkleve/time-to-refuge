import type { RefObject } from "react";
import type { LucideIcon } from "lucide-react";
import { Surface } from "@/components/atoms/Surface";
import type {
  ClockProbeState,
  LocationInfo,
  PanelBox,
  ProbeTone,
  Status,
} from "@/lib/location-check/types";
import { PanelClockSection } from "./PanelClockSection";
import { PanelFootnotes } from "./PanelFootnotes";
import { PanelHeader } from "./PanelHeader";
import { PanelZoneCards } from "./PanelZoneCards";

type PanelProps = {
  panelRef: RefObject<HTMLDivElement | null>;
  box: PanelBox;
  tone: ProbeTone;
  trouble: boolean;
  title: string;
  detail?: string;
  info: LocationInfo | null;
  status: Status;
  clock: ClockProbeState;
  hostNoun: string;
  HostNoun: string;
  HostIcon: LucideIcon;
  gapCopy: string | null;
};

export function LocationCheckPanel(props: PanelProps) {
  const { panelRef, box, tone, trouble, title, detail, info, status, clock } = props;

  return (
    <div
      ref={panelRef}
      className="fixed z-50 overflow-visible"
      style={{
        left: box.left,
        width: box.width,
        ...(box.side === "above"
          ? { bottom: box.bottom }
          : { top: box.top }),
      }}
    >
      <Surface
        material="glass-panel"
        rim
        className="focus-safe-scroll animate-scale-in overflow-y-auto rounded-3xl p-4 text-left"
        style={{ maxHeight: box.maxHeight }}
        onClick={(e) => e.stopPropagation()}
      >
        <PanelHeader
          tone={tone}
          trouble={trouble}
          title={title}
          info={info}
          status={status}
          clock={clock}
        />
        <PanelZoneCards
          info={info}
          status={status}
          HostIcon={props.HostIcon}
          HostNoun={props.HostNoun}
          gapCopy={props.gapCopy}
        />
        <PanelClockSection
          clock={clock}
          hostNoun={props.hostNoun}
          HostNoun={props.HostNoun}
        />
        <PanelFootnotes
          detail={detail}
          status={status}
          info={info}
          clock={clock}
          hostNoun={props.hostNoun}
        />
      </Surface>
    </div>
  );
}
