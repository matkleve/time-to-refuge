"use client";

import { useCallback } from "react";
import { deriveLocationCheckView } from "./derive-location-check-view";
import { useClockProbe } from "./use-clock-probe";
import { useHostNoun } from "./use-host-noun";
import { useLocationGeocode } from "./useLocationGeocode";

export function useLocationCheckModel() {
  const { noun: hostNoun, Noun: HostNoun, Icon: HostIcon } = useHostNoun();
  const { status, info, runGeocode } = useLocationGeocode();
  const { clock, runClockProbe } = useClockProbe();

  const handleOpen = useCallback(() => {
    void runClockProbe();
    runGeocode();
  }, [runClockProbe, runGeocode]);

  const view = deriveLocationCheckView(status, info, clock, hostNoun);

  return {
    hostNoun,
    HostNoun,
    HostIcon,
    status,
    info,
    clock,
    handleOpen,
    ...view,
  };
}
