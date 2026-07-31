"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { glassClass, actionClass, glassRowClass } from "@/lib/surfaces";

type OptionId = "a" | "b" | "c" | "d" | "e";

interface FontOption {
  id: OptionId;
  name: string;
  pitch: string;
  display: string;
  sans: string;
  mono: string;
}

/**
 * Five proposals. Each keeps the three-role split (display / sans / mono)
 * from DESIGN-SYSTEM.md §1 — only the faces change.
 */
const OPTIONS: FontOption[] = [
  {
    id: "a",
    name: "Current",
    pitch: "Contemplative book serif + calm sibling sans/mono. What ships today.",
    display: "Newsreader",
    sans: "DM Sans",
    mono: "DM Mono",
  },
  {
    id: "b",
    name: "Quiet book",
    pitch: "Literata reads like a printed page; Source Sans stays neutral under it.",
    display: "Literata",
    sans: "Source Sans 3",
    mono: "Source Code Pro",
  },
  {
    id: "c",
    name: "Soft ceremony",
    pitch: "Fraunces has a warm optical axis; Outfit is soft without going cute.",
    display: "Fraunces",
    sans: "Outfit",
    mono: "IBM Plex Mono",
  },
  {
    id: "d",
    name: "Formal record",
    pitch: "High-contrast Garamond for names; Karla keeps the chrome quiet.",
    display: "Cormorant Garamond",
    sans: "Karla",
    mono: "JetBrains Mono",
  },
  {
    id: "e",
    name: "Warm modern",
    pitch: "Source Serif 4 is contemporary bookish; Manrope is geometric but calm.",
    display: "Source Serif 4",
    sans: "Manrope",
    mono: "DM Mono",
  },
];

function optionStyle(id: OptionId): React.CSSProperties {
  /* Option E reuses DM Mono (same as A) — no separate --pick-e-mono load. */
  const monoVar = id === "e" ? "var(--pick-a-mono)" : `var(--pick-${id}-mono)`;
  return {
    ["--font-display" as string]: `var(--pick-${id}-display), Georgia, serif`,
    ["--font-sans" as string]: `var(--pick-${id}-sans), system-ui, sans-serif`,
    ["--font-mono" as string]: `${monoVar}, ui-monospace, monospace`,
  };
}

/** Miniature of the focused card + record button — enough to judge the faces. */
function Sample({ option }: { option: FontOption }) {
  return (
    <div
      className="flex flex-col gap-4"
      style={optionStyle(option.id)}
    >
      <div className={cn(glassClass("card", { rim: true }), "overflow-hidden rounded-3xl")}>
        <p className="truncate px-4 pt-3 font-sans text-xs tracking-wide text-ink uppercase">
          Spring retreat 2026
        </p>
        <h2 className="truncate px-4 pt-1 font-display text-2xl font-semibold text-ink">
          Tenzin Pema
        </h2>
        <div className="space-y-2 p-3">
          {(["Buddha", "Dharma", "Sangha"] as const).map((phase, i) => (
            <div
              key={phase}
              className={cn(
                glassRowClass(),
                "flex min-h-13 items-center justify-between rounded-2xl px-4",
              )}
            >
              <span className="font-display text-lg font-medium text-ink">{phase}</span>
              <span
                className={cn(
                  "font-mono text-lg tabular-nums",
                  i === 0 ? "text-saffron-700" : "text-muted",
                )}
              >
                {i === 0 ? "14:32:08.441" : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          actionClass("primary"),
          "flex flex-col items-center justify-center gap-1 rounded-3xl py-5",
        )}
      >
        <span className="font-sans text-xs tracking-[0.18em] text-white/85 uppercase">
          Friday, Jul 31
        </span>
        <span className="font-mono text-4xl font-semibold tabular-nums tracking-wide text-white">
          14:32:11<span className="text-2xl text-white/75">.882</span>
        </span>
        <span className="font-sans text-xs tracking-[0.2em] text-white/90 uppercase">
          Tap to record Dharma
        </span>
      </div>
    </div>
  );
}

export function FontPicker() {
  const [selected, setSelected] = useState<OptionId>("a");
  const active = OPTIONS.find((o) => o.id === selected)!;

  return (
    <main className="min-h-dvh bg-[#e8e6e1] px-4 py-8 text-ink sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 max-w-2xl">
          <p className="font-sans text-xs tracking-[0.2em] text-muted uppercase">Dev · fonts</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Pick a type trio
          </h1>
          <p className="mt-2 font-sans text-base text-muted">
            Five proposals for the design system&apos;s three roles — display
            (names), sans (UI), mono (times). Same sample card for each; tap
            one to pin it large.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="order-2 lg:order-1">
            <div
              className="mx-auto w-full max-w-md"
              style={optionStyle(selected)}
            >
              <p className="mb-3 font-sans text-sm text-muted">
                Preview · <span className="text-ink">{active.name}</span>
                {" — "}
                {active.display} · {active.sans} · {active.mono}
              </p>
              <Sample option={active} />
            </div>
          </section>

          <section className="order-1 flex flex-col gap-2 lg:order-2">
            {OPTIONS.map((option) => {
              const on = option.id === selected;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelected(option.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left transition-colors duration-150",
                    on
                      ? "border-flagblue-600 bg-white shadow-sm"
                      : "border-transparent bg-white/50 hover:bg-white/80",
                  )}
                  style={optionStyle(option.id)}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-lg font-semibold">{option.name}</span>
                    {on && (
                      <span className="font-sans text-xs tracking-wide text-flagblue-600 uppercase">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-sans text-sm text-muted">{option.pitch}</p>
                  <p className="mt-2 font-sans text-xs text-subtle">
                    <span className="font-display text-ink">{option.display}</span>
                    {" · "}
                    {option.sans}
                    {" · "}
                    <span className="font-mono">{option.mono}</span>
                  </p>
                </button>
              );
            })}
          </section>
        </div>

        <p className="mt-10 font-sans text-sm text-subtle">
          Dev-only route · <code className="font-mono text-xs">/dev/fonts</code>
          {" · "}
          choosing one here does not change the app yet — tell an agent which
          letter (A–E) to apply.
        </p>
      </div>
    </main>
  );
}
