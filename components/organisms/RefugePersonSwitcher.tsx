"use client";

import { RefugeNavButton } from "./RefugeNavButton";

export function RefugePersonSwitcher({
  index,
  total,
  onPrev,
  onNext,
}: {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-1 px-3 pb-1">
      <RefugeNavButton direction="prev" available={index > 0} onClick={onPrev} />
      <span className="min-w-8 px-0.5 text-center text-sm tabular-nums text-muted">
        {index + 1}/{total}
      </span>
      <RefugeNavButton
        direction="next"
        available={index < total - 1}
        onClick={onNext}
      />
    </div>
  );
}
