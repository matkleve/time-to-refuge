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
    <div className="app-scroll-clearance flex min-h-0 flex-1 flex-col items-center overflow-hidden px-3 md:px-0">
      <div className="mx-auto flex w-full max-w-3xl min-h-0 flex-1 flex-col justify-center gap-5 py-2 sm:gap-6">
        <header className="mx-auto max-w-2xl space-y-2 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">
            {landing.headline}
          </h1>
          <p className="text-base text-muted sm:text-lg">{landing.intro}</p>
        </header>

        <ol className="grid min-h-0 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
          {landing.steps.map((step, index) => (
            <li
              key={step.title}
              className={cn(
                "flex min-w-0 flex-col gap-1.5 rounded-2xl px-3.5 py-3.5 sm:px-4 sm:py-4",
                /* Decorative shrink on pointer hover only — not a control. */
                "transition-transform duration-200 ease-out",
                "motion-safe:[@media(hover:hover)]:hover:scale-[0.97]",
                glassClass("card", { rim: true }),
              )}
            >
              <span className="text-xs font-medium tracking-wide text-subtle uppercase">
                Step {index + 1}
              </span>
              <h2 className="font-display text-base font-semibold text-ink sm:text-lg">
                {step.title}
              </h2>
              <p className="text-sm leading-snug text-muted sm:text-base">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={onStart}
            className={cn(
              "inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl px-6 text-base font-medium text-white sm:w-auto sm:text-lg",
              controlMinH.lg,
              "hover:brightness-[1.06]",
              userFeedbackClass({ press: "lg" }),
              "user-feedback--on-accent",
              actionClass("primary"),
            )}
          >
            {landing.cta}
            <ArrowRight className="size-4" aria-hidden />
          </button>
          <p className="text-center text-sm text-subtle">{landing.footnote}</p>
        </div>
      </div>
    </div>
  );
}
