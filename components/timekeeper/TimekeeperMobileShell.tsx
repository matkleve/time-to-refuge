"use client";

import type { ReactNode } from "react";
import { Brand } from "@/components/atoms/Brand";
import { HeaderScrim } from "@/components/atoms/HeaderScrim";
import { HeaderTitle } from "@/components/atoms/HeaderTitle";
import { AppShell } from "@/components/AppShell";
import type { TimekeeperAppModel } from "@/components/timekeeper/timekeeper-app-content";
import { HeaderActionsSlot, useHeaderActionsRegistered } from "@/components/timekeeper/header-actions-context";
import { getHeaderTitle } from "@/lib/view-titles";
import { cn } from "@/lib/utils";

export function TimekeeperMobileShell({
  app,
  menu,
  page,
}: {
  app: TimekeeperAppModel;
  menu: ReactNode;
  page: ReactNode;
}) {
  const hasHeaderActions = useHeaderActionsRegistered();

  return (
    <AppShell>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-40">
        <HeaderScrim />
        <div
          className="relative z-10 px-3 pb-1.5"
          style={{ paddingTop: "max(0.375rem, env(safe-area-inset-top))" }}
        >
          <div className="grid h-11 grid-cols-[auto_1fr_auto] items-center gap-2">
            <div className="pointer-events-auto justify-self-start">
              <Brand onHome={() => app.setView("home")} />
            </div>
            <div
              className={cn(
                "flex min-w-0 items-center gap-1.5 overflow-hidden px-1",
                hasHeaderActions ? "justify-start" : "justify-center",
              )}
            >
              {hasHeaderActions ? (
                <div className="pointer-events-auto shrink-0">
                  <HeaderActionsSlot />
                </div>
              ) : null}
              <HeaderTitle
                title={getHeaderTitle(app.view)}
                as={app.view === "home" ? "p" : "h1"}
                className={cn(
                  "pointer-events-none",
                  hasHeaderActions && "min-w-0 truncate",
                )}
              />
            </div>
            <div className="pointer-events-auto flex shrink-0 items-center justify-self-end">
              {menu}
            </div>
          </div>
        </div>
      </header>
      <div className="relative z-0 flex min-h-0 flex-1 flex-col">{page}</div>
    </AppShell>
  );
}
