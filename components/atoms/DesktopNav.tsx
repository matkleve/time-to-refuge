"use client";

import {
  Clock,
  Contact,
  Download,
  HeartHandshake,
  History,
  Home,
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
import { glassNavSelectedClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";
import dana from "@/content/dana.json";

/** Primary destinations — same order as the mobile hamburger Pages group. */
export const DESKTOP_NAV_PAGES: ReadonlyArray<{
  id: AppView;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}> = [
  { id: "home", label: "Home", shortLabel: "Home", icon: Home },
  { id: "fields", label: "Fields", shortLabel: "Fields", icon: ListTree },
  { id: "people", label: "People", shortLabel: "People", icon: Contact },
  { id: "refuge", label: "Session", shortLabel: "Session", icon: Users },
  { id: "quicklog", label: "Quick Log", shortLabel: "Log", icon: Clock },
  { id: "history", label: "History", shortLabel: "History", icon: History },
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
 * Desktop / tablet chrome inside `app-content`:
 * brand · page links (flex) · undo/redo · Export/Dana actions cluster.
 *
 * Left-aligned after the brand (no absolute-center fight on tablet).
 * Page labels stay visible; Quick Log shortens to “Log” below `lg`.
 * Selected tab = saffron mist glass + bold (not a white chip). Dana stays
 * quiet glyph — filled only via accent tone when that page is current.
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
      <HeaderScrim />
      <div className="app-content relative z-10 px-4 py-3 sm:px-5">
        <div className="pointer-events-auto flex h-12 items-center gap-2 sm:gap-3">
          <BrandLockup
            titleSize="2xl"
            onHome={() => onChange("home")}
            className="mr-1 min-w-0 shrink sm:mr-2"
          />

          <nav
            aria-label="Primary"
            className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto"
          >
            {DESKTOP_NAV_PAGES.map(({ id, label, shortLabel, icon: Icon }) => {
              const selected = view === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-current={selected ? "page" : undefined}
                  aria-label={label}
                  title={label}
                  onClick={() => onChange(id)}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-sm lg:gap-2 lg:px-3 lg:text-base",
                    userFeedbackClass({ press: "md", on: selected }),
                    selected
                      ? cn(glassNavSelectedClass(), "font-bold text-ink")
                      : "font-medium text-muted hover:text-ink",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                  <span className="lg:hidden">{shortLabel}</span>
                  <span className="hidden lg:inline">{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5">
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
            <div
              className="ml-0.5 flex items-center gap-0.5 border-l border-line pl-1.5"
              role="group"
              aria-label="Actions"
            >
              <IconButton
                icon={Download}
                label="Export all"
                quiet
                size="md"
                onClick={onExportAll}
                disabled={exportDisabled}
              />
              <IconButton
                icon={HeartHandshake}
                label={dana.menuCta}
                quiet
                size="md"
                tone={view === "dana" ? "accent" : "neutral"}
                feedbackOn={view === "dana"}
                className={
                  view === "dana"
                    ? cn(glassNavSelectedClass(), "text-flagblue-600")
                    : undefined
                }
                onClick={() => onChange("dana")}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
