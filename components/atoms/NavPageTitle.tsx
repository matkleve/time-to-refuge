import type { AppView } from "@/components/atoms/ViewMenu";
import { getNavPageMeta } from "@/lib/desktop-nav-pages";
import { getViewDescription } from "@/lib/view-titles";

/**
 * Desktop page title inside `DesktopNav` — above the scrim, below the tab row.
 * Mobile uses `HeaderTitle` in `TimekeeperMobileShell`.
 */
export function NavPageTitle({ view }: { view: AppView }) {
  const page = getNavPageMeta(view);
  if (!page) return null;
  const description = getViewDescription(view);

  return (
    <div className="flex min-h-12 flex-col justify-center gap-0.5 py-0.5">
      <h2 className="min-w-0 truncate font-display text-2xl font-semibold text-ink">
        {page.label}
      </h2>
      {description ? (
        <p className="min-w-0 truncate text-sm text-muted">{description}</p>
      ) : null}
    </div>
  );
}
