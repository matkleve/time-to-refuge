import {
  Clock,
  Contact,
  History,
  ListTree,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { AppView } from "@/components/atoms/ViewMenu";

/**
 * Desktop page tabs — same order as the mobile Pages menu, minus Home
 * (the brand icon already goes home; a second Home tab overcrowds the bar).
 */
export const DESKTOP_NAV_PAGES: ReadonlyArray<{
  id: AppView;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}> = [
  { id: "fields", label: "Fields", shortLabel: "Fields", icon: ListTree },
  { id: "people", label: "People", shortLabel: "People", icon: Contact },
  { id: "refuge", label: "Session", shortLabel: "Session", icon: Users },
  { id: "quicklog", label: "Quick Log", shortLabel: "Log", icon: Clock },
  { id: "history", label: "History", shortLabel: "History", icon: History },
];

export function getNavPageMeta(view: AppView) {
  return DESKTOP_NAV_PAGES.find((page) => page.id === view);
}
