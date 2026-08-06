import type { AppView } from "@/components/atoms/ViewMenu";
import { siteName, siteTitle } from "@/lib/site";

/** In-header page labels — keep in sync with `DesktopNav` tab names. */
export const VIEW_TITLES: Partial<Record<AppView, string>> = {
  fields: "Fields",
  people: "People",
  refuge: "Session",
  quicklog: "Quick Log",
  history: "History",
  dana: "Dana",
};

/** Browser tab title — matches layout metadata template (`%s · Timekeeper`). */
export function getDocumentTitle(view: AppView): string {
  if (view === "home") return siteTitle;
  const label = VIEW_TITLES[view];
  return label ? `${label} · ${siteName}` : siteTitle;
}

/** Mobile center title; desktop fallback for views without tabs. */
export function getHeaderTitle(view: AppView): string {
  if (view === "home") return "Timekeeper";
  return VIEW_TITLES[view] ?? "Timekeeper";
}

/** Five primary nav pages — desktop shows an in-page title under the tab row. */
export function isNavPageView(view: AppView): boolean {
  return view in VIEW_TITLES;
}
