"use client";

import { ShowcaseActions } from "@/components/dev/ShowcaseActions";
import { ShowcaseControls } from "@/components/dev/ShowcaseControls";
import { ShowcaseMenus } from "@/components/dev/ShowcaseMenus";
import { ShowcaseMisc } from "@/components/dev/ShowcaseMisc";
import { ShowcaseRows } from "@/components/dev/ShowcaseRows";
import { PAGE_INLINE_GUTTER } from "@/lib/chrome";
import { cn } from "@/lib/utils";

export function ComponentShowcase() {
  return (
    <div className={cn("mx-auto min-h-dvh max-w-3xl pb-16", PAGE_INLINE_GUTTER)}>
      <header className="border-b border-line/60 py-6">
        <p className="text-xs font-medium tracking-wide text-subtle uppercase">Dev only</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Component showcase</h1>
        <p className="mt-2 max-w-2xl text-base text-muted">
          Tap every control — glass material and <code className="text-sm">user-feedback</code> must
          live on the <strong className="font-semibold text-ink">same element</strong> so the whole
          chip bounces. Split shells are a regression.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-10">
        <ShowcaseActions />
        <ShowcaseControls />
        <ShowcaseRows />
        <ShowcaseMenus />
        <ShowcaseMisc />
      </div>
    </div>
  );
}
