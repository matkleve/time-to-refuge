"use client";

import { useRef, useState } from "react";

interface UseSwipeLeftOptions {
  onSwipe: () => void;
  threshold?: number;
  disabled?: boolean;
}

export function useSwipeLeft({ onSwipe, threshold = 64, disabled }: UseSwipeLeftOptions) {
  const [dragX, setDragX] = useState(0);
  const dragXRef = useRef(0);
  const startX = useRef<number | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    if (disabled) return;
    e.stopPropagation();
    startX.current = e.touches[0].clientX;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (disabled || startX.current === null) return;
    e.stopPropagation();
    const delta = e.touches[0].clientX - startX.current;
    const next = Math.max(delta, -threshold * 1.4);
    dragXRef.current = next;
    setDragX(next);
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (disabled) return;
    e.stopPropagation();
    if (dragXRef.current <= -threshold) onSwipe();
    dragXRef.current = 0;
    setDragX(0);
    startX.current = null;
  }

  return {
    dragX,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}
