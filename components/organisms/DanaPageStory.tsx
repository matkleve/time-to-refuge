"use client";

import Image from "next/image";
import dana from "@/content/dana.json";
import { glassFlushClass } from "@/lib/surfaces";
import { cn } from "@/lib/utils";

export function DanaPageStory() {
  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div
        className={cn(
          "relative aspect-[3/2] w-full overflow-hidden rounded-3xl bg-ink/10 md:aspect-[4/3] md:min-h-[24rem] lg:min-h-[28rem]",
          glassFlushClass(),
        )}
      >
        <Image
          src={dana.image}
          alt={dana.imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 40rem"
          className="object-cover"
        />
      </div>

      <div className="space-y-2 md:space-y-3">
        <h3 className="font-display text-2xl font-semibold text-ink">{dana.headline}</h3>
        <p className="text-base leading-relaxed text-muted md:text-lg">{dana.intro}</p>
      </div>

      <blockquote className="hidden space-y-1 border-l-2 border-saffron-400 pl-3 md:block md:pl-4">
        <p className="font-display text-lg text-ink md:text-2xl">{dana.quote.text}</p>
        <footer className="text-sm text-muted md:text-base">
          — {dana.quote.attribution}
        </footer>
      </blockquote>
    </div>
  );
}
