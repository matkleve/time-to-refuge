"use client";

import { MoreVertical } from "lucide-react";
import { useCallback, useState } from "react";
import {
  buildIconButtonClassName,
  iconButtonIconSize,
} from "@/components/atoms/icon-button-build";
import type { GlassMenuProps } from "@/components/atoms/glass-menu/types";
import { GlassMenuBody } from "@/components/atoms/glass-menu/GlassMenuBody";
import { GlassPopover, MenuTrigger, UiButton } from "@/components/ui";
import { cn } from "@/lib/utils";

export type {
  GlassMenuIconAction,
  GlassMenuItem,
  GlassMenuPrimaryAction,
  GlassMenuSection,
} from "@/components/atoms/glass-menu/types";

/**
 * Cloudy menu: always icon + label. Hover / selected use the shared feedback
 * wash (§4 chrome recipe) — no second `hover:bg-*`. Portaled via ui/Popover.
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
  const [open, setOpen] = useState(false);
  const placement = align === "right" ? "bottom end" : "bottom start";

  const onPrimarySelect = useCallback(() => {
    primaryAction?.onSelect();
  }, [primaryAction]);

  return (
    <div className={cn("relative", open && "z-50", className)}>
      <MenuTrigger isOpen={open} onOpenChange={setOpen}>
      <UiButton
        aria-label={open ? `Close ${label}` : label}
        className={({ isPressed }) =>
          buildIconButtonClassName({
            visible: null,
            size,
            useGlass: true,
            armed: false,
            tone: "neutral",
            press: "sm",
            feedbackOn: open || isPressed,
            hideWhenDisabled: false,
            className: cn(
              "text-ink hover:text-flagblue-600",
              open && "text-flagblue-600",
              className,
            ),
          })
        }
      >
        <TriggerIcon className={iconButtonIconSize[size]} strokeWidth={2} aria-hidden />
      </UiButton>
      <GlassPopover placement={placement} aria-label={label}>
        <GlassMenuBody
          label={label}
          items={items}
          sections={sections}
          primaryAction={primaryAction}
          iconActions={iconActions}
          onPrimarySelect={onPrimarySelect}
        />
      </GlassPopover>
      </MenuTrigger>
    </div>
  );
}
