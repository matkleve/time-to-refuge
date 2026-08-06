"use client";

import type { ReactNode } from "react";
import { Brand } from "@/components/atoms/Brand";
import { HeaderScrim } from "@/components/atoms/HeaderScrim";
import { HeaderTitle } from "@/components/atoms/HeaderTitle";
import { AppShell } from "@/components/AppShell";
import { SiteFooter } from "@/components/atoms/SiteFooter";
import type { TimekeeperAppModel } from "@/components/timekeeper/timekeeper-app-content";
import { HeaderActionsSlot, useHeaderActionsRegistered } from "@/components/timekeeper/header-actions-context";
import { getHeaderTitle } from "@/lib/view-titles";

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
      <header className="pointer-events-none absolute inset-x-0 top-0 z-40 overflow-visible">
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
            <div
              className="pointer-events-none absolute inset-x-0 top-0 flex h-11 items-center justify-center px-11"
            >
              <div className="relative min-w-0 max-w-full">
                {hasHeaderActions ? (
                  <div className="pointer-events-auto absolute top-1/2 right-full -translate-y-1/2 pr-1.5">
                    <HeaderActionsSlot />
                  </div>
                ) : null}
                <HeaderTitle
                  title={getHeaderTitle(app.view)}
                  as={app.view === "home" ? "p" : "h1"}
                  className="pointer-events-none w-auto max-w-full truncate"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="relative z-0 flex min-h-0 flex-1 flex-col">{page}</div>
      <SiteFooter />
    </AppShell>
  );
}
