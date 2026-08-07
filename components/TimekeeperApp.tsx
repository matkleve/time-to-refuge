"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDocumentTitle } from "@/lib/use-document-title";
import { useTimekeeperApp } from "@/lib/use-timekeeper-app";
import type { AppView } from "@/components/atoms/ViewMenu";
import {
  TimekeeperPage,
  TimekeeperViewMenu,
} from "@/components/timekeeper/timekeeper-app-content";
import { TimekeeperShell } from "@/components/timekeeper/TimekeeperShell";
import { HeaderActionsProvider } from "@/components/timekeeper/header-actions-context";

export function TimekeeperApp({ initialView = "home" }: { initialView?: AppView }) {
  const app = useTimekeeperApp(initialView);
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback(
    (view: AppView) => {
      if (view === "dana") {
        router.push("/dana");
        return;
      }
      if (view === "privacy") {
        router.push("/privacy");
        return;
      }
      const next = view === "home" ? "/" : `/?view=${view}`;
      if (pathname === "/dana" || pathname === "/privacy") {
        // Leave standalone public routes so the URL matches the in-app view again.
        router.replace(next);
        return;
      }
      app.setView(view);
      // Sync URL without Next.js navigation — router.push re-renders the page
      // and can flash the wrong shell while client state reconciles.
      if (pathname === "/") {
        window.history.replaceState(window.history.state, "", next);
      }
    },
    [app, pathname, router],
  );

  const appNav = { ...app, setView: navigate } as typeof app;

  useDocumentTitle(appNav.view);

  if (!app.ready && app.view !== "home" && app.view !== "dana" && app.view !== "privacy") {
    return null;
  }

  const page = <TimekeeperPage app={appNav} />;

  return (
    <HeaderActionsProvider>
      <TimekeeperShell
        app={appNav}
        menu={<TimekeeperViewMenu app={appNav} />}
        page={page}
      />
    </HeaderActionsProvider>
  );
}
