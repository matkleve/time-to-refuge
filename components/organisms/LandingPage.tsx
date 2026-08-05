"use client";

import { ArrowRight } from "lucide-react";
import landing from "@/content/landing.json";
import { controlMinH } from "@/lib/control-size";
import { actionClass, glassClass } from "@/lib/surfaces";
import { userFeedbackClass } from "@/lib/user-feedback";
import { cn } from "@/lib/utils";

interface LandingPageProps {
  onStart: () => void;
}

/**
 * Home / landing — one viewport, no scroll. Crawlable copy lives here when
 * this view is active; metadata + JSON-LD cover the rest for search.
 */
export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="app-scroll-clearance flex min-h-0 flex-1 flex-col overflow-hidden px-3 md:px-0">
      <div className="mx-auto flex w-full max-w-2xl min-h-0 flex-1 flex-col justify-center gap-4 py-1">
        <header className="space-y-1.5 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">{landing.headline}</h1>
          <p className="text-base text-muted">{landing.intro}</p>
        </header>

        <ol className="grid min-h-0 grid-cols-3 gap-2">
          {landing.steps.map((step, index) => (
            <li
              key={step.title}
              className={cn(
                "flex min-w-0 flex-col gap-1 rounded-2xl px-2.5 py-2.5 sm:px-3 sm:py-3",
                glassClass("card", { rim: true }),
              )}
            >
              <span className="text-xs font-medium tracking-wide text-subtle uppercase">
                Step {index + 1}
              </span>
              <h2 className="font-display text-sm font-semibold text-ink sm:text-base">
                {step.title}
              </h2>
              <p className="text-xs leading-snug text-muted sm:text-sm">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onStart}
            className={cn(
              "inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl px-5 text-base font-medium text-white sm:w-auto",
              controlMinH.md,
              "hover:brightness-[1.06]",
              userFeedbackClass({ press: "lg" }),
              "user-feedback--on-accent",
              actionClass("primary"),
            )}
          >
            {landing.cta}
            <ArrowRight className="size-4" aria-hidden />
          </button>
          <p className="text-center text-xs text-subtle">{landing.footnote}</p>
        </div>
      </div>
    </div>
  );
}
