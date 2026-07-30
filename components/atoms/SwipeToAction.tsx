"use client";

import { ReactNode } from "react";
import { useSwipeLeft } from "@/lib/use-swipe-left";
import { cn } from "@/lib/utils";

interface SwipeToActionProps {
  children: ReactNode;
  onSwipe: () => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function SwipeToAction({
  children,
  onSwipe,
  label,
  disabled,
  className,
}: SwipeToActionProps) {
  const { dragX, handlers } = useSwipeLeft({ onSwipe, disabled });
  const progress = Math.min(1, Math.abs(dragX) / 64);

  return (
    <div className={cn("relative overflow-hidden rounded-row", className)}>
      {!disabled && (
        <div
          className="absolute inset-0 flex items-center justify-end bg-danger-600 pr-6 text-label font-semibold text-white"
          style={{ opacity: progress }}
        >
          {label}
        </div>
      )}
      <div
        {...(disabled ? {} : handlers)}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: dragX === 0 ? "transform var(--duration-ui) var(--ease-out-ui)" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
