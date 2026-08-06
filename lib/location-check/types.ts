import type { NetworkTimeSample } from "@/lib/network-time";

export type Status =
  | "idle"
  | "checking"
  | "ok"
  | "denied"
  | "unavailable"
  | "error";

export type MatchKind = "iana" | "offset" | "rough" | "none";

export interface LocationInfo {
  place: string;
  city: string;
  /** Device-reported IANA zone. */
  deviceZone: string;
  deviceOffset: string;
  /** IANA zone for the GPS place, when the lookup returned one. */
  placeZone: string | null;
  placeOffset: string;
  matchesLocation: boolean;
  matchKind: MatchKind;
}

export type GeocodePayload = {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
  localityInfo?: {
    informative?: Array<{ name?: string; description?: string }>;
  };
};

export type ProbeTone = "idle" | "ok" | "warn" | "danger" | "checking";

export type PanelBox =
  | {
      side: "above";
      bottom: number;
      left: number;
      width: number;
      maxHeight: number;
    }
  | {
      side: "below" | "left" | "right";
      top: number;
      left: number;
      width: number;
      maxHeight: number;
    };

export type ClockProbeState =
  | { status: "idle" }
  | { status: "probing" }
  | { status: "offline" }
  | { status: "ready"; sample: NetworkTimeSample };
