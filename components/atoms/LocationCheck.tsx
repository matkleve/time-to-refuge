"use client";

import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { LocationCheckPanel } from "./location-check/LocationCheckPanel";
import { LocationCheckTrigger } from "./location-check/LocationCheckTrigger";
import {
  usePanelDismiss,
  usePanelPlacement,
} from "./location-check/use-location-check-panel";
import { useLocationCheckModel } from "./location-check/use-location-check-model";

/**
 * Settles "is this device's *time zone* plausible for where we are?" and,
 * when online, probes network UTC (Cristian / RTT) so a right-zone / wrong-
 * minute clock can still be caught. Offline skips the probe honestly.
 * Prefer IANA zone from reverse-geocode over a longitude estimate. See §6b.
 */
export function LocationCheck() {
  const [open, setOpen] = useState(false);
  const dismiss = useCallback(() => setOpen(false), []);
  const { triggerRef, panelRef, box } = usePanelPlacement(open);
  usePanelDismiss(open, dismiss, panelRef, triggerRef);
  const model = useLocationCheckModel();

  const handleOpen = () => {
    setOpen(true);
    model.handleOpen();
  };

  const panel =
    open &&
    box &&
    typeof document !== "undefined" &&
    createPortal(
      <LocationCheckPanel
        panelRef={panelRef}
        box={box}
        tone={model.tone}
        trouble={model.trouble}
        title={model.title}
        detail={model.detail}
        info={model.info}
        status={model.status}
        clock={model.clock}
        hostNoun={model.hostNoun}
        HostNoun={model.HostNoun}
        HostIcon={model.HostIcon}
        gapCopy={model.gapCopy}
      />,
      document.body,
    );

  return (
    <>
      <LocationCheckTrigger
        triggerRef={triggerRef}
        open={open}
        onOpen={handleOpen}
        tone={model.tone}
        buttonAria={model.buttonAria}
        badgeLabel={model.badgeLabel}
        status={model.status}
        clock={model.clock}
        trouble={model.trouble}
        info={model.info}
        softUnavailable={model.softUnavailable}
      />
      {panel}
    </>
  );
}
