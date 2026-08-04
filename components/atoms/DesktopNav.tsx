"use client";

import {
  Clock,
  Contact,
  Download,
  HeartHandshake,
  History,
  ListTree,
  Redo2,
  Undo2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { BrandLockup } from "@/components/atoms/BrandLockup";
import { HeaderScrim } from "@/components/atoms/HeaderScrim";
import { IconButton } from "@/components/atoms/IconButton";
import type { AppView } from "@/components/atoms/ViewMenu";
import { actionClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
import dana from "@/content/dana.json";

/** Primary destinations — same set as the mobile hamburger Pages group. */
export const DESKTOP_NAV_PAGES: ReadonlyArray<{
  id: AppView;
  label: string;
  icon: LucideIcon;
}> = [
  { id: "refuge", label: "Session", icon: Users },
  { id: "people", label: "People", icon: Contact },
  { id: "fields", label: "Fields", icon: ListTree },
  { id: "quicklog", label: "Quick Log", icon: Clock },
  { id: "history", label: "History", icon: History },
];

interface DesktopNavProps {
  view: AppView;
  onChange: (view: AppView) => void;
  onUndo: () => void;
  undoDisabled?: boolean;
  undoLabel?: string;
  onRedo: () => void;
  redoDisabled?: boolean;
  redoLabel?: string;
  onExportAll: () => void;
  exportDisabled?: boolean;
}

/**
 * Desktop chrome — classic top bar:
 * brand left · page links centered · undo/redo/export + Dana right.
 *
 * Link states (each page control):
 * - idle: muted text, no fill
 * - hover: feedback wash (pointer devices)
 * - pressed: bounce + active wash
 * - selected: ink + light wash (`is-feedback-on`) — current AppView
 * - focus-visible: global ring
 *
 * Switching pages uses the existing `PageEnter` on the main slot (fade-up).
 * Brand home → Session. Dana is a filled primary (same role as in the menu).
 */
export function DesktopNav({
  view,
  onChange,
  onUndo,
  undoDisabled = false,
  undoLabel = "Undo",
  onRedo,
  redoDisabled = false,
  redoLabel = "Redo",
  onExportAll,
  exportDisabled = false,
}: DesktopNavProps) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40">
      <HeaderScrim className="h-[10rem]" />
      <div className="relative z-10 px-5 py-3">
        <div className="relative flex h-12 items-center justify-center">
          <div className="pointer-events-auto absolute inset-y-0 left-0 flex items-center">
            <BrandLockup titleSize="2xl" onHome={() => onChange("refuge")} />
          </div>

          <nav
            aria-label="Primary"
            className="pointer-events-auto flex items-center gap-0.5"
          >
            {DESKTOP_NAV_PAGES.map(({ id, label, icon: Icon }) => {
              const selected = view === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-current={selected ? "page" : undefined}
                  onClick={() => onChange(id)}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-full px-3.5 text-base font-medium",
                    userFeedbackClass({ press: "md", on: selected }),
                    selected ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="pointer-events-auto absolute inset-y-0 right-0 flex items-center gap-1">
            <IconButton
              icon={Undo2}
              label={undoLabel}
              quiet
              size="md"
              onClick={onUndo}
              disabled={undoDisabled}
            />
            <IconButton
              icon={Redo2}
              label={redoLabel}
              quiet
              size="md"
              onClick={onRedo}
              disabled={redoDisabled}
            />
            <IconButton
              icon={Download}
              label="Export all"
              quiet
              size="md"
              onClick={onExportAll}
              disabled={exportDisabled}
            />
            <button
              type="button"
              aria-current={view === "dana" ? "page" : undefined}
              onClick={() => onChange("dana")}
              className={cn(
                "ml-1 inline-flex h-11 items-center gap-2 rounded-full px-3.5 text-base font-medium text-white",
                actionClass("primary"),
                userFeedbackClass({ press: "md", on: view === "dana" }),
              )}
            >
              <HeartHandshake className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              {dana.menuCta}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
