"use client";

import { Monitor, Smartphone } from "lucide-react";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Copy noun for the local clock host: fine pointer → "computer", else
 * "device" (phone/tablet — never hard-code "phone" in the probe UI).
 */
export function useHostNoun(): {
  noun: string;
  Noun: string;
  Icon: typeof Monitor;
} {
  const computer = useMediaQuery("(pointer: fine)");
  return computer
    ? { noun: "computer", Noun: "Computer", Icon: Monitor }
    : { noun: "device", Noun: "Device", Icon: Smartphone };
}
