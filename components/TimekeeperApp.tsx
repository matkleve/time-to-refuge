"use client";

import { useTimekeeperApp } from "@/lib/use-timekeeper-app";
import { useMediaQuery } from "@/lib/use-media-query";
import {
  TimekeeperPage,
  TimekeeperSubheader,
  TimekeeperViewMenu,
} from "@/components/timekeeper/timekeeper-app-content";
import { TimekeeperDesktopShell } from "@/components/timekeeper/TimekeeperDesktopShell";
import { TimekeeperMobileShell } from "@/components/timekeeper/TimekeeperMobileShell";

export function TimekeeperApp() {
  const app = useTimekeeperApp();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!app.ready) return null;

  const subheader = <TimekeeperSubheader app={app} />;
  const page = <TimekeeperPage app={app} isDesktop={isDesktop} />;

  if (isDesktop) {
    return (
      <TimekeeperDesktopShell app={app} subheader={subheader} page={page} />
    );
  }

  return (
    <TimekeeperMobileShell
      app={app}
      menu={<TimekeeperViewMenu app={app} />}
      subheader={subheader}
      page={page}
    />
  );
}
