"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, type LucideIcon } from "lucide-react";
import { actionClass } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";
import { Surface } from "@/components/atoms/Surface";

export type GlassMenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  /** Danger copy / armed destructive. */
  tone?: "neutral" | "danger";
  disabled?: boolean;
  /** Light glass wash — current page, or an armed destructive row. */
  selected?: boolean;
  /** Keep the menu open after this item (e.g. first arm tap). */
  keepOpen?: boolean;
};

export type GlassMenuSection = {
  /** Small tracked caption above the group (e.g. Pages, Actions). */
  title: string;
  items: GlassMenuItem[];
};

/** Icon-only strip at the bottom of a sectioned menu (Undo / Redo). */
export type GlassMenuIconAction = {
  id: string;
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  disabled?: boolean;
  /** Keep the menu open (multi-step undo/redo). */
  keepOpen?: boolean;
};

/** Full-width primary CTA in a sectioned menu (e.g. Dana). */
export type GlassMenuPrimaryAction = {
  id: string;
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  selected?: boolean;
};

interface GlassMenuProps {
  label: string;
  /** Flat list — person-card ⋯ and other single-group menus. */
  items?: GlassMenuItem[];
  /** Titled groups with a hairline between them (app hamburger). */
  sections?: GlassMenuSection[];
  /** Primary filled button under sections (before icon footer). */
  primaryAction?: GlassMenuPrimaryAction;
  /** Icon-only row under sections, after a hairline. */
  iconActions?: GlassMenuIconAction[];
  /** Trigger icon — hamburger or ⋯. */
  triggerIcon?: LucideIcon;
  size?: "sm" | "md";
  align?: "left" | "right";
  className?: string;
}

type MenuBox = { top: number; left: number; minWidth: number };

function MenuRows({
  items,
  onPick,
}: {
  items: GlassMenuItem[];
  onPick: (item: GlassMenuItem) => void;
}) {
  return (
    <>
      {items.map((item) => {
        const Icon = item.icon;
        const danger = item.tone === "danger";
        return (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => onPick(item)}
            className={cn(
              "flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-left text-base font-medium",
              "transition-[colors,transform,background-color] duration-150 ease-out",
              "disabled:pointer-events-none disabled:opacity-35",
              "active:scale-[0.98]",
              danger ? "text-danger-700" : "text-ink",
              /* iOS: soft wash, not a solid fill */
              item.selected
                ? "bg-white/55"
                : "hover:bg-white/40 focus-visible:bg-white/40",
            )}
          >
            <Icon className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
          </button>
        );
      })}
    </>
  );
}

/** Safe items first; any `tone: "danger"` items sit below a hairline. */
function MenuItemList({
  items,
  onPick,
}: {
  items: GlassMenuItem[];
  onPick: (item: GlassMenuItem) => void;
}) {
  const safe = items.filter((item) => item.tone !== "danger");
  const danger = items.filter((item) => item.tone === "danger");
  return (
    <>
      <MenuRows items={safe} onPick={onPick} />
      {safe.length > 0 && danger.length > 0 && (
        <div className="mx-2 my-1.5 border-t border-line" role="separator" />
      )}
      <MenuRows items={danger} onPick={onPick} />
    </>
  );
}

/**
 * iOS-style cloudy menu: always icon + label; hover / selected is a light
 * glass wash — never a solid filled pill. Portaled so card overflow can't
 * clip it (navbar + person-card ⋯).
 *
 * Destructive items (`tone: "danger"`) always render at the bottom of their
 * list, below a hairline separator from safe actions.
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
  const [box, setBox] = useState<MenuBox | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dismiss = useCallback(() => setOpen(false), []);

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const minWidth = Math.max(192, r.width);
    const left = align === "right" ? r.right - minWidth : r.left;
    setBox({
      top: r.bottom + 6,
      left: Math.min(Math.max(8, left), window.innerWidth - minWidth - 8),
      minWidth,
    });
  }, [align]);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return;

    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(dismiss, 8000);
    };

    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) {
        arm();
        return;
      }
      dismiss();
    }

    arm();
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, dismiss]);

  function pick(item: GlassMenuItem) {
    item.onSelect();
    if (!item.keepOpen) setOpen(false);
  }

  function pickIcon(action: GlassMenuIconAction) {
    action.onSelect();
    if (!action.keepOpen) setOpen(false);
  }

  const body = sections?.length
    ? sections.map((section, i) => (
        <div key={section.title}>
          {i > 0 && <div className="mx-2 my-1.5 border-t border-line" role="separator" />}
          <p className="px-3 pb-1 pt-1.5 text-xs font-medium uppercase tracking-wide text-muted">
            {section.title}
          </p>
          <MenuItemList items={section.items} onPick={pick} />
        </div>
      ))
    : items
      ? <MenuItemList items={items} onPick={pick} />
      : null;

  const primary =
    primaryAction != null ? (
      <div className="px-1 pb-0.5 pt-1.5">
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            primaryAction.onSelect();
            setOpen(false);
          }}
          className={cn(
            "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3.5 text-base font-medium text-white",
            "transition-[box-shadow,background-color,transform,filter] duration-150 ease-out",
            "active:scale-[0.98] hover:brightness-[1.06]",
            actionClass("primary"),
            primaryAction.selected && "ring-2 ring-white/70 ring-offset-1 ring-offset-transparent",
          )}
        >
          <primaryAction.icon className="size-5 shrink-0" strokeWidth={2} aria-hidden />
          <span>{primaryAction.label}</span>
        </button>
      </div>
    ) : null;

  const iconStrip =
    iconActions && iconActions.length > 0 ? (
      <div>
        <div className="mx-2 my-1.5 border-t border-line" role="separator" />
        <div className="flex items-center justify-center gap-1 px-1 py-0.5">
          {iconActions.map((action) => (
            <IconButton
              key={action.id}
              icon={action.icon}
              label={action.label}
              size="sm"
              disabled={action.disabled}
              onClick={() => pickIcon(action)}
            />
          ))}
        </div>
      </div>
    ) : null;

  const panel =
    open &&
    box &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        ref={panelRef}
        className="fixed z-50"
        style={{ top: box.top, left: box.left, minWidth: box.minWidth }}
      >
        <Surface
          material="glass-panel"
          rim
          role="menu"
          aria-label={label}
          className="overflow-hidden rounded-2xl p-1.5 shadow-lg animate-scale-in"
        >
          {body}
          {primary}
          {iconStrip}
        </Surface>
      </div>,
      document.body,
    );

  return (
    <div className={cn("relative", open && "z-50", className)} ref={triggerRef}>
      <IconButton
        icon={TriggerIcon}
        label={open ? `Close ${label}` : label}
        size={size}
        /* Circular hit target; wash from userFeedback (ForJu). Larger glyph;
           open holds the cover + blue icon. */
        feedbackOn={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "bg-transparent text-ink",
          size === "sm" ? "[&_svg]:size-6" : "[&_svg]:size-7",
          "hover:text-flagblue-600",
          open && "text-flagblue-600",
        )}
      />
      {panel}
    </div>
  );
}
