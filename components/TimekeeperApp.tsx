"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTimekeeperApp } from "@/lib/use-timekeeper-app";
import { useMediaQuery } from "@/lib/use-media-query";
import type { AppView } from "@/components/atoms/ViewMenu";
import {
  TimekeeperPage,
  TimekeeperViewMenu,
} from "@/components/timekeeper/timekeeper-app-content";
import { TimekeeperDesktopShell } from "@/components/timekeeper/TimekeeperDesktopShell";
import { TimekeeperMobileShell } from "@/components/timekeeper/TimekeeperMobileShell";
import { HeaderActionsProvider } from "@/components/timekeeper/header-actions-context";

export function TimekeeperApp({ initialView = "home" }: { initialView?: AppView }) {
  const app = useTimekeeperApp(initialView);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback(
    (view: AppView) => {
      if (view === "dana") {
        router.push("/dana");
        return;
      }
      app.setView(view);
      if (pathname === "/" || pathname === "/dana") {
        router.push(view === "home" ? "/" : `/?view=${view}`, { scroll: false });
      }
    },
    [app, pathname, router],
  );

  const appNav = { ...app, setView: navigate } as typeof app;

  if (!app.ready && app.view !== "home" && app.view !== "dana") return null;

  const page = <TimekeeperPage app={appNav} isDesktop={isDesktop} />;

  return (
    <HeaderActionsProvider>
      {isDesktop ? (
        <TimekeeperDesktopShell app={appNav} page={page} />
      ) : (
        <TimekeeperMobileShell
          app={appNav}
          menu={<TimekeeperViewMenu app={appNav} />}
          page={page}
        />
      )}
    </HeaderActionsProvider>
  );
}
