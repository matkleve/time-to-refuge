"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";

/**
 * Person navigation. When there is nobody that way the button keeps its
 * footprint and goes invisible, so the counter never shifts.
 */
export function RefugeNavButton({
  direction,
  available,
  onClick,
}: {
  direction: "prev" | "next";
  available: boolean;
  onClick: () => void;
}) {
  const prev = direction === "prev";
  return (
    <IconButton
      icon={prev ? ChevronLeft : ChevronRight}
      label={prev ? "Previous person" : "Next person"}
      quiet
      onClick={onClick}
      disabled={!available}
      hideWhenDisabled
      tone="neutral"
      size="sm"
    />
  );
}
