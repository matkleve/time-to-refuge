import type { AppView } from "@/components/atoms/ViewMenu";
import { getNavPageMeta } from "@/lib/desktop-nav-pages";

/**
 * Desktop page title inside `DesktopNav` — above the scrim, below the tab row.
 * Mobile uses `HeaderTitle` in `TimekeeperMobileShell`.
 */
export function NavPageTitle({ view }: { view: AppView }) {
  const page = getNavPageMeta(view);
  if (!page) return null;

  return (
    <div className="flex min-h-12 items-center">
      <h2 className="min-w-0 truncate font-display text-2xl font-semibold text-ink">
        {page.label}
      </h2>
    </div>
  );
}
