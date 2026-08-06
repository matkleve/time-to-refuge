import type { AppView } from "@/components/atoms/ViewMenu";

/** In-header page labels — keep in sync with `DesktopNav` tab names. */
export const VIEW_TITLES: Partial<Record<AppView, string>> = {
  fields: "Fields",
  people: "People",
  refuge: "Session",
  quicklog: "Quick Log",
  history: "History",
  dana: "Dana",
};

/** Mobile center title; desktop fallback for views without tabs. */
export function getHeaderTitle(view: AppView): string {
  if (view === "home") return "Timekeeper";
  return VIEW_TITLES[view] ?? "Timekeeper";
}

/** Five primary nav pages — desktop shows an in-page title under the tab row. */
export function isNavPageView(view: AppView): boolean {
  return view in VIEW_TITLES;
}
