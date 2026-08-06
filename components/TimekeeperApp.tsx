"use client";

import { useTimekeeperApp } from "@/lib/use-timekeeper-app";
import { useMediaQuery } from "@/lib/use-media-query";
import {
  TimekeeperPage,
  TimekeeperViewMenu,
} from "@/components/timekeeper/timekeeper-app-content";
import { TimekeeperDesktopShell } from "@/components/timekeeper/TimekeeperDesktopShell";
import { TimekeeperMobileShell } from "@/components/timekeeper/TimekeeperMobileShell";
import { HeaderActionsProvider } from "@/components/timekeeper/header-actions-context";

export function TimekeeperApp() {
  const app = useTimekeeperApp();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!app.ready) return null;

  const page = <TimekeeperPage app={app} isDesktop={isDesktop} />;

  return (
    <HeaderActionsProvider>
      {isDesktop ? (
        <TimekeeperDesktopShell app={app} page={page} />
      ) : (
        <TimekeeperMobileShell
          app={app}
          menu={<TimekeeperViewMenu app={app} />}
          page={page}
        />
      )}
    </HeaderActionsProvider>
  );
}
