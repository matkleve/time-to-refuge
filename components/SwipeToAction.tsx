"use client";

import { ReactNode } from "react";
import { useSwipeLeft } from "@/lib/useSwipeLeft";

interface SwipeToActionProps {
  children: ReactNode;
  onSwipe: () => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

export default function SwipeToAction({
  children,
  onSwipe,
  label,
  disabled,
  className = "",
}: SwipeToActionProps) {
  const { dragX, handlers } = useSwipeLeft({ onSwipe, disabled });
  const progress = Math.min(1, Math.abs(dragX) / 64);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {!disabled && (
        <div
          className="absolute inset-0 flex items-center justify-end bg-red-500 pr-6 text-sm font-semibold text-white"
          style={{ opacity: progress }}
        >
          {label}
        </div>
      )}
      <div
        {...(disabled ? {} : handlers)}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: dragX === 0 ? "transform 150ms ease-out" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
