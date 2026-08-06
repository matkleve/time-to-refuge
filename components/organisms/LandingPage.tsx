"use client";

import { ArrowRight } from "lucide-react";
import type { AppView } from "@/components/atoms/ViewMenu";
import { Button } from "@/components/atoms/Button";
import landing from "@/content/landing.json";
import { ListPageFrame } from "@/components/atoms/ListPageFrame";
import { BUTTON_CLUSTER_GAP } from "@/lib/control-size";
import { cn } from "@/lib/utils";

/** Short nav labels — matches `DesktopNav` page names for deco hints on step cards. */
const STEP_NAV_LABEL: Record<string, string> = {
  people: "People",
  quicklog: "Quick Log",
  refuge: "Session",
};

interface LandingPageProps {
  onStart: () => void;
  onNavigate: (view: AppView) => void;
}

export function LandingPage({ onStart, onNavigate }: LandingPageProps) {
  return (
    <ListPageFrame fill="workspace">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 py-2 sm:gap-6 sm:py-4">
        <header className="mx-auto max-w-2xl space-y-2 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">
            {landing.headline}
          </h1>
          <p className="text-base text-muted sm:text-lg">{landing.intro}</p>
        </header>

        <ol className="grid min-h-0 w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
          {landing.steps.map((step, index) => (
            <li key={step.title} className="min-w-0">
              <Button
                variant="card"
                onClick={() => onNavigate(step.view as AppView)}
                aria-label={step.title}
              >
                <span className="text-xs font-medium tracking-wide text-subtle uppercase">
                  Step {index + 1}
                </span>
                <h2 className="font-display text-base font-semibold text-ink sm:text-lg">
                  {step.title}
                </h2>
                <p className="text-sm leading-snug text-muted sm:text-base">
                  {step.body}
                </p>
                <span
                  className={cn(
                    "mt-auto flex items-center justify-end pt-2 text-sm font-medium text-flagblue-600",
                    BUTTON_CLUSTER_GAP,
                  )}
                  aria-hidden
                >
                  {STEP_NAV_LABEL[step.view] ?? step.view}
                  <ArrowRight className="size-3.5 shrink-0" strokeWidth={2.5} />
                </span>
              </Button>
            </li>
          ))}
        </ol>

        <div className="flex flex-col items-center gap-2.5">
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="end"
            onClick={onStart}
            className="w-full max-w-sm font-medium sm:w-auto"
          >
            {landing.cta}
          </Button>
          <p className="text-center text-sm text-subtle">{landing.footnote}</p>
        </div>
      </div>
    </ListPageFrame>
  );
}
