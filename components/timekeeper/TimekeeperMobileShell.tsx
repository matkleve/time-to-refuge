"use client";

import type { ReactNode } from "react";
import { BrandLockup } from "@/components/atoms/BrandLockup";
import { HeaderScrim } from "@/components/atoms/HeaderScrim";
import { AppShell } from "@/components/AppShell";
import type { TimekeeperAppModel } from "@/components/timekeeper/timekeeper-app-content";

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
          <div className="flex h-11 items-center justify-between gap-3">
            <div className="pointer-events-auto">
              <BrandLockup titleSize="lg" onHome={() => app.setView("home")} />
            </div>
            <div className="pointer-events-auto flex shrink-0 items-center">
              {menu}
            </div>
          </div>
        </div>
      </header>
      <div className="relative z-0 flex min-h-0 flex-1 flex-col">{page}</div>
    </AppShell>
  );
}
