"use client";

import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { GlassMenuPanel } from "@/components/atoms/glass-menu/GlassMenuPanel";
import { useGlassMenu } from "@/components/atoms/glass-menu/useGlassMenu";
import type { GlassMenuProps } from "@/components/atoms/glass-menu/types";

export type {
  GlassMenuIconAction,
  GlassMenuItem,
  GlassMenuPrimaryAction,
  GlassMenuSection,
} from "@/components/atoms/glass-menu/types";

/**
 * Cloudy menu: always icon + label. Hover / selected use the shared feedback
 * wash (§4 chrome recipe) — no second `hover:bg-*`. Portaled so card overflow
 * can't clip it (navbar + person-card ⋯).
 *
 * Destructive items (`tone: "danger"`) render at the bottom below a hairline.
 * When armed (`selected` on a danger row), the row uses the same filled
 * danger chip as `Button` armed glass.
 */
export function GlassMenu({
  label,
  items,
  sections,
  primaryAction,
  iconActions,
  triggerIcon: TriggerIcon = MoreVertical,
  size = "md",
  triggerVariant = "glass",
  align = "right",
  className,
}: GlassMenuProps) {
  const {
    open,
    box,
    triggerRef,
    panelRef,
    pick,
    pickIcon,
    onPrimarySelect,
    toggle,
  } = useGlassMenu({ align, primaryAction });

  return (
    <div className={cn("relative", open && "z-50", className)} ref={triggerRef}>
      <Button
        variant={triggerVariant}
        icon={TriggerIcon}
        aria-label={open ? `Close ${label}` : label}
        title={open ? `Close ${label}` : label}
        size={size}
        selected={open}
        onClick={toggle}
        className={cn(
          "text-ink",
          "hover:text-flagblue-600",
          open && "text-flagblue-600",
        )}
      />
      {open && box && (
        <GlassMenuPanel
          panelRef={panelRef}
          box={box}
          label={label}
          sections={sections}
          items={items}
          primaryAction={primaryAction}
          iconActions={iconActions}
          onPick={pick}
          onPickIcon={pickIcon}
          onPrimarySelect={onPrimarySelect}
        />
      )}
    </div>
  );
}
