"use client";

import { useCallback, useState } from "react";
import { DialogTrigger, GlassPopover } from "@/components/ui";
import { LocationCheckPanel } from "./location-check/LocationCheckPanel";
import { LocationCheckTrigger } from "./location-check/LocationCheckTrigger";
import { useLocationCheckModel } from "./location-check/use-location-check-model";

/**
 * Settles "is this device's *time zone* plausible for where we are?" and,
 * when online, probes network UTC (Cristian / RTT) so a right-zone / wrong-
 * minute clock can still be caught. Offline skips the probe honestly.
 * Prefer IANA zone from reverse-geocode over a longitude estimate. See §6b.
 */
export function LocationCheck() {
  const [open, setOpen] = useState(false);
  const model = useLocationCheckModel();

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (isOpen) model.handleOpen();
    },
    [model],
  );

  return (
    <DialogTrigger isOpen={open} onOpenChange={handleOpenChange}>
      <LocationCheckTrigger
        open={open}
        tone={model.tone}
        buttonAria={model.buttonAria}
        badgeLabel={model.badgeLabel}
        status={model.status}
        clock={model.clock}
        trouble={model.trouble}
        info={model.info}
        softUnavailable={model.softUnavailable}
      />
      <GlassPopover
        placement="top end"
        offset={8}
        bare
        className="z-50 max-w-[calc(100vw-1rem)] outline-none"
      >
        <LocationCheckPanel
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
        />
      </GlassPopover>
    </DialogTrigger>
  );
}
