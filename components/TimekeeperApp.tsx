"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDocumentTitle } from "@/lib/use-document-title";
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
      // Sync URL without Next.js navigation — router.push re-renders the page
      // and useMediaQuery briefly falls back to the mobile shell on desktop.
      if (pathname === "/") {
        const next = view === "home" ? "/" : `/?view=${view}`;
        window.history.replaceState(window.history.state, "", next);
      }
    },
    [app, pathname, router],
  );

  const appNav = { ...app, setView: navigate } as typeof app;

  useDocumentTitle(appNav.view);

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
