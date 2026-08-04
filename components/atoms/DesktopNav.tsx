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
 * Desktop / tablet chrome — classic top bar inside `app-content`:
 * brand left · page links centered · undo/redo/export + Dana right.
 *
 * Below `lg`, page labels hide (icon-only) so the bar fits tablets.
 * Link states: idle → hover → press → selected (`aria-current`) → focus ring.
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
      <div className="app-content relative z-10 px-4 py-3 sm:px-5">
        <div className="relative flex h-12 items-center justify-center gap-2">
          <div className="pointer-events-auto absolute inset-y-0 left-0 flex max-w-[30%] items-center">
            <BrandLockup
              titleSize="2xl"
              onHome={() => onChange("refuge")}
              className="[&_span]:hidden [&_span]:lg:inline"
            />
          </div>

          <nav
            aria-label="Primary"
            className="pointer-events-auto flex max-w-[min(100%,36rem)] items-center gap-0.5 overflow-x-auto"
          >
            {DESKTOP_NAV_PAGES.map(({ id, label, icon: Icon }) => {
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
                    "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-2.5 text-base font-medium lg:px-3.5",
                    userFeedbackClass({ press: "md", on: selected }),
                    selected ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                  <span className="hidden lg:inline">{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pointer-events-auto absolute inset-y-0 right-0 flex items-center gap-0.5 sm:gap-1">
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
              className="hidden sm:inline-flex"
            />
            <button
              type="button"
              aria-current={view === "dana" ? "page" : undefined}
              aria-label={dana.menuCta}
              title={dana.menuCta}
              onClick={() => onChange("dana")}
              className={cn(
                "ml-0.5 inline-flex h-11 items-center gap-2 rounded-full px-2.5 text-base font-medium text-white lg:ml-1 lg:px-3.5",
                actionClass("primary"),
                userFeedbackClass({ press: "md", on: view === "dana" }),
              )}
            >
              <HeartHandshake className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              <span className="hidden xl:inline">{dana.menuCta}</span>
              <span className="hidden lg:inline xl:hidden">{dana.menuLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
