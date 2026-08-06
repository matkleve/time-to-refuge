"use client";

import { ArrowRight } from "lucide-react";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { LocationCheck } from "@/components/atoms/LocationCheck";
import { ShowcaseSection } from "@/components/dev/ShowcaseSection";
import { controlMinH } from "@/lib/control-size";
import {
  interactiveActionClass,
  interactiveGlassClass,
  interactiveGlassFlushChipClass,
} from "@/lib/interactive-glass";
import { PersonCardNameDisplay } from "@/components/organisms/PersonCardNameDisplay";
import { Brand } from "@/components/atoms/Brand";
import { DEMO_FIELDS, DEMO_PERSON_PARTIAL } from "@/components/dev/showcase-data";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export function ShowcaseMisc() {
  return (
    <>
      <ShowcaseSection title="Person name + brand" hint="Feedback-only taps (no separate glass shell).">
        <div className="max-w-sm space-y-3 rounded-2xl bg-white/40 p-3">
          <PersonCardNameDisplay
            person={DEMO_PERSON_PARTIAL}
            fields={DEMO_FIELDS}
            onSelectPerson={() => {}}
            isCurrent
            dangerTone={false}
          />
          <Brand wordmark onHome={() => {}} />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Landing card + CTA">
        <div className="grid max-w-lg gap-3 sm:grid-cols-2">
          <button
            type="button"
            className={cn(
              "flex flex-col gap-1 rounded-2xl px-3.5 py-3.5 text-left",
              interactiveGlassClass("card", { rim: true }, { press: "md" }),
            )}
          >
            <span className="text-xs font-medium tracking-wide text-subtle uppercase">Step 1</span>
            <span className="font-display font-semibold text-ink">Add people</span>
          </button>
          <button
            type="button"
            className={interactiveActionClass(
              "primary",
              { press: "lg" },
              cn(
                "inline-flex items-center justify-center gap-2 rounded-xl px-5 text-white",
                controlMinH.md,
                "user-feedback--on-accent",
              ),
            )}
          >
            Start session
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Empty note">
        <GlassEmptyNote
          title="Nothing here yet"
          action={{ label: "Add someone", onClick: () => {} }}
        >
          Onboarding copy over the backdrop.
        </GlassEmptyNote>
      </ShowcaseSection>

      <ShowcaseSection title="Link chip">
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted",
            interactiveGlassFlushChipClass({ press: "md" }),
          )}
        >
          Example link
          <ExternalLink className="size-4" aria-hidden />
        </button>
      </ShowcaseSection>

      <ShowcaseSection title="Location check" hint="Open the badge — panel is portaled; trigger is one feedback node.">
        <div className="relative max-w-xs rounded-3xl bg-flagblue-600/42 p-8">
          <div className="absolute -top-2 -right-2">
            <LocationCheck />
          </div>
          <p className="text-center text-sm text-white/90">Record button corner (mock)</p>
        </div>
      </ShowcaseSection>
    </>
  );
}
