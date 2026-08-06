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

/** One-line hint under the in-header page title — mobile + desktop nav pages. */
export const VIEW_DESCRIPTIONS: Partial<Record<AppView, string>> = {
  home: "Millisecond timestamps for vow ceremonies.",
  fields: "Choose what you record — rename, reorder, or add your own.",
  people: "Name each aspirant and set the retreat.",
  refuge: "Record each ceremony step, one person at a time.",
  quicklog: "Stamp wall-clock moments without fields or people.",
  history: "Recorded, reset, and undone moments in order.",
  dana: "Your dana helps keep DRCE open for teachings and practice.",
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

export function getViewDescription(view: AppView): string | undefined {
  return VIEW_DESCRIPTIONS[view];
}

/** Five primary nav pages — desktop shows an in-page title under the tab row. */
export function isNavPageView(view: AppView): boolean {
  return view in VIEW_TITLES;
}
