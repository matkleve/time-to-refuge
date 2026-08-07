"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { cn } from "@/lib/utils";

export function RefugePersonSwitcher({
  index,
  total,
  onPrev,
  onNext,
  inline = false,
}: {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  inline?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center",
        BUTTON_CLUSTER_GAP,
        !inline && "justify-end px-3 pb-1",
      )}
    >
      <Button
        variant="quiet"
        icon={ChevronLeft}
        aria-label="Previous person"
        title="Previous person"
        size="sm"
        onClick={onPrev}
        disabled={index <= 0}
        hideWhenDisabled
      />
      <span className="min-w-8 px-0.5 text-center text-sm tabular-nums text-muted">
        {index + 1}/{total}
      </span>
      <Button
        variant="quiet"
        icon={ChevronRight}
        aria-label="Next person"
        title="Next person"
        size="sm"
        onClick={onNext}
        disabled={index >= total - 1}
        hideWhenDisabled
      />
    </div>
  );
}
