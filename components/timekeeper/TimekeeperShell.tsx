"use client";

import type { ReactNode } from "react";
import { downloadCsv } from "@/lib/csv";
import { BACKDROP_CLASS, backdropStyle } from "@/lib/backdrop";
import { Brand } from "@/components/atoms/Brand";
import { HeaderScrim } from "@/components/atoms/HeaderScrim";
import { HeaderTitle } from "@/components/atoms/HeaderTitle";
import { DesktopNav } from "@/components/atoms/DesktopNav";
import { SiteFooter } from "@/components/atoms/SiteFooter";
import type { TimekeeperAppModel } from "@/components/timekeeper/timekeeper-app-content";
import { undoRedoMenuProps } from "@/components/timekeeper/timekeeper-menu-props";
import {
  HeaderActionsSlot,
  useHeaderActionsRegistered,
} from "@/components/timekeeper/header-actions-context";
import { getHeaderTitle, getViewDescription } from "@/lib/view-titles";

/**
 * Responsive app shell — mobile header and desktop nav coexist in the DOM;
 * CSS breakpoints pick the visible chrome. Avoids `useMediaQuery` shell
 * switching (SSR false → brief mobile/thin layout on desktop reload).
 */
export function TimekeeperShell({
  app,
  menu,
  page,
}: {
  app: TimekeeperAppModel;
  menu: ReactNode;
  page: ReactNode;
}) {
  const undoRedo = undoRedoMenuProps(app.undoStack, app.redoStack);
  const hasHeaderActions = useHeaderActionsRegistered();
  const headerTitle = getHeaderTitle(app.view);
  const headerSubtitle = getViewDescription(app.view);

  return (
    <div
      className={`min-h-dvh md:relative md:flex md:h-dvh md:w-full md:flex-col md:overflow-hidden ${BACKDROP_CLASS}`}
      style={backdropStyle}
    >
      <header className="pointer-events-none absolute inset-x-0 top-0 z-40 overflow-visible md:hidden">
        <HeaderScrim />
        <div
          className="relative z-10 px-3 pb-1.5"
          style={{ paddingTop: "max(0.375rem, env(safe-area-inset-top))" }}
        >
          <div className="relative">
            <div className="grid h-11 grid-cols-[auto_1fr_auto] items-center gap-2">
              <div className="pointer-events-auto justify-self-start">
                <Brand onHome={() => app.setView("home")} />
              </div>
              <div className="min-w-0" aria-hidden />
              <div className="pointer-events-auto flex shrink-0 items-center justify-self-end">
                {menu}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-0 flex h-11 items-center justify-center px-11">
              <div className="relative min-w-0 max-w-full">
                {hasHeaderActions ? (
                  <div className="pointer-events-auto absolute top-1/2 right-full -translate-y-1/2 pr-1.5">
                    <HeaderActionsSlot />
                  </div>
                ) : null}
                <HeaderTitle
                  title={headerTitle}
                  as={app.view === "home" ? "p" : "h1"}
                  className="pointer-events-none w-auto max-w-full"
                />
              </div>
            </div>
            {headerSubtitle ? (
              <p className="min-w-0 truncate px-11 text-center text-sm text-muted">
                {headerSubtitle}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="hidden md:contents">
        <DesktopNav
          view={app.view}
          onChange={app.setView}
          onUndo={app.handleUndo}
          onRedo={app.handleRedo}
          {...undoRedo}
          onExportAll={() => downloadCsv(app.people, app.fields, app.retreatName)}
          exportDisabled={app.people.length === 0}
        />
      </div>

      <main className="relative mx-auto flex h-dvh w-full max-w-md flex-col md:h-auto md:max-w-none md:min-h-0 md:flex-1">
        <div className="relative z-0 flex min-h-0 flex-1 flex-col">
          <div className="relative flex min-h-0 flex-1 flex-col md:absolute md:inset-0">
            <div className="flex min-h-0 flex-1 flex-col md:app-content md:absolute md:inset-0 md:px-4 md:sm:px-5">
              <div className="relative flex min-h-0 flex-1 flex-col">{page}</div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </main>
    </div>
  );
}
