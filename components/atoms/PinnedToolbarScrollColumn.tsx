"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { WORKSPACE_UNDER_TOOLBAR_LIST_SCROLL } from "@/lib/chrome";
import { cn } from "@/lib/utils";

type PinnedToolbarScrollColumnProps = {
  toolbar: ReactNode;
  /** Override measured toolbar height (padding + mask full-opacity line). */
  toolbarBand?: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  className?: string;
  listClassName?: string;
  onListClick?: (e: React.MouseEvent) => void;
};

function measureToolbarBand(el: HTMLElement): string {
  // Slight buffer so list rows under the toolbar always hit the fade band.
  const { height } = el.getBoundingClientRect();
  return `${Math.ceil(height) + 4}px`;
}

/**
 * Absolute toolbar over a masked list scrollport — list scrolls beneath the
 * toolbar with a soft fade; toolbar stays crisp; first row is opaque at rest.
 */
export function PinnedToolbarScrollColumn({
  toolbar,
  toolbarBand: toolbarBandProp,
  scrollRef,
  children,
  className,
  listClassName,
  onListClick,
}: PinnedToolbarScrollColumnProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [measuredBand, setMeasuredBand] = useState<string>();

  useEffect(() => {
    const el = toolbarRef.current;
    if (!el) return;
    const sync = () => setMeasuredBand(measureToolbarBand(el));
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [toolbar]);

  const toolbarBand = toolbarBandProp ?? measuredBand ?? "5.5rem";
  const listStyle = {
    paddingTop: toolbarBand,
    "--scroll-fade-toolbar-band": toolbarBand,
  } as CSSProperties;

  if (!toolbar) {
    return (
      /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
         Optional stop-propagation for parent tap layers; scrollport is not interactive. */
      <div
        ref={scrollRef}
        className={cn(WORKSPACE_UNDER_TOOLBAR_LIST_SCROLL, className, listClassName)}
        onClick={onListClick}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={cn("relative flex min-h-0 flex-1 flex-col", className)}>
      <div ref={toolbarRef} className="absolute inset-x-0 top-0 z-20">
        {toolbar}
      </div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions --
         Optional stop-propagation for parent tap layers; scrollport is not interactive. */}
      <div
        ref={scrollRef}
        className={cn(WORKSPACE_UNDER_TOOLBAR_LIST_SCROLL, listClassName)}
        style={listStyle}
        onClick={onListClick}
      >
        {children}
      </div>
    </div>
  );
}
