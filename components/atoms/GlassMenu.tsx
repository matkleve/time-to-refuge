"use client";

import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";
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
 * danger chip as `IconButton.armed`.
 */
export function GlassMenu({
  label,
  items,
  sections,
  primaryAction,
  iconActions,
  triggerIcon: TriggerIcon = MoreVertical,
  size = "md",
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
      <IconButton
        icon={TriggerIcon}
        label={open ? `Close ${label}` : label}
        glass
        size={size}
        /* Same md chip as row Copy / Edit — glyph follows IconButton size. */
        feedbackOn={open}
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
