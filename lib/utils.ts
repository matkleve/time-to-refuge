import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to be told about the design system's font-size names.
 * Without this it reads `text-clock` as a *colour* utility (it matches
 * `text-<something>`) and drops it the moment a real colour follows in the
 * same call — so `cn("text-clock", "text-white")` silently rendered at the
 * base size. Every custom `--text-*` token must be listed here.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["clock", "display", "title", "body", "label", "caption"] }],
    },
  },
});

/** Merge Tailwind classes safely (clsx + tailwind-merge). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
