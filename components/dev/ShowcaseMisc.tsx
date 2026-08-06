"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import { Brand } from "@/components/atoms/Brand";
import { Button } from "@/components/atoms/Button";
import { GlassEmptyNote } from "@/components/atoms/GlassEmptyNote";
import { LocationCheck } from "@/components/atoms/LocationCheck";
import { ShowcaseSection } from "@/components/dev/ShowcaseSection";
import { DEMO_FIELDS, DEMO_PERSON_PARTIAL } from "@/components/dev/showcase-data";
import { PersonCardNameDisplay } from "@/components/organisms/PersonCardNameDisplay";

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
          <Button variant="card" aria-label="Add people">
            <span className="text-xs font-medium tracking-wide text-subtle uppercase">Step 1</span>
            <span className="font-display font-semibold text-ink">Add people</span>
          </Button>
          <Button variant="primary" size="md" icon={ArrowRight} iconPosition="end" className="px-5">
            Start session
          </Button>
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
        <Button variant="flushChip" icon={ExternalLink} aria-label="Example link">
          Example link
        </Button>
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
