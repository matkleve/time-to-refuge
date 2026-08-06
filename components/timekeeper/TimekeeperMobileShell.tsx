"use client";

import type { ReactNode } from "react";
import { Brand } from "@/components/atoms/Brand";
import { HeaderScrim } from "@/components/atoms/HeaderScrim";
import { HeaderTitle } from "@/components/atoms/HeaderTitle";
import { AppShell } from "@/components/AppShell";
import type { TimekeeperAppModel } from "@/components/timekeeper/timekeeper-app-content";
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
            <HeaderTitle
              title={getHeaderTitle(app.view)}
              className="pointer-events-none justify-self-center px-1"
            />
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
