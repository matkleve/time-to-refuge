#!/usr/bin/env node
/**
 * Verifies every Tailwind text-size utility in production UI stays on the
 * design-system scale (docs/DESIGN-SYSTEM.md §1). Run with `npm run a11y:type`.
 *
 * Catches the class of bug that already shipped once: inventing a size
 * (`text-clock`, `text-[0.625rem]`, `text-xl`) that is not one of the six
 * re-valued steps — or using `text-xs` for body/UI chrome that is not a
 * tracked uppercase caption.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

/** Six steps — Tailwind names, re-valued in globals.css. Nothing else. */
const SCALE = new Set(["xs", "sm", "base", "lg", "2xl", "4xl"]);

/** Paths skipped (dev playgrounds, scripts). */
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dev",
  "scripts",
  "public",
]);

/**
 * `text-xs` is reserved for tracked uppercase captions (and a few status
 * badges that share that visual weight). Body, labels, and controls must
 * be `text-sm` or larger.
 *
 * A class string is an allowed xs use when it also carries tracking and/or
 * uppercase — the caption recipe from §1.
 */
function xsLooksLikeCaption(classChunk: string): boolean {
  return (
    /\b(?:uppercase|tracking-(?:\[[^\]]+\]|wide|wider|widest|tighter|tight|normal))\b/.test(
      classChunk,
    )
  );
}

type Hit = {
  file: string;
  line: number;
  token: string;
  reason: string;
  snippet: string;
};

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.(tsx|jsx|css)$/.test(name) && !name.endsWith(".d.ts")) out.push(full);
  }
  return out;
}

/** Match text-size utilities, including arbitrary values and responsive variants. */
const TEXT_SIZE_RE =
  /(?:^|[\s"'`])((?:sm:|md:|lg:|xl:|2xl:)?text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[[^\]]+\]))/g;

function classContext(line: string, matchIndex: number): string {
  // Prefer the nearest quoted className / cn(…) string around the match.
  const before = line.slice(0, matchIndex);
  const quote = Math.max(before.lastIndexOf('"'), before.lastIndexOf("'"), before.lastIndexOf("`"));
  if (quote === -1) return line.trim();
  const q = line[quote];
  const end = line.indexOf(q!, quote + 1);
  return (end === -1 ? line.slice(quote + 1) : line.slice(quote + 1, end)).trim();
}

function checkFile(file: string): Hit[] {
  const hits: Hit[] = [];
  const lines = readFileSync(file, "utf8").split("\n");
  const rel = relative(ROOT, file);

  lines.forEach((line, i) => {
    TEXT_SIZE_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = TEXT_SIZE_RE.exec(line))) {
      const token = m[1]!;
      const sizePart = token.replace(/^(?:sm:|md:|lg:|xl:|2xl:)/, "");
      const step = sizePart.replace(/^text-/, "");
      const ctx = classContext(line, m.index);

      if (step.startsWith("[")) {
        hits.push({
          file: rel,
          line: i + 1,
          token,
          reason: "arbitrary size — use the six-step scale (xs…4xl)",
          snippet: ctx.slice(0, 120),
        });
        continue;
      }

      if (!SCALE.has(step)) {
        hits.push({
          file: rel,
          line: i + 1,
          token,
          reason: `"${step}" is not on the type scale (allowed: ${[...SCALE].join(", ")})`,
          snippet: ctx.slice(0, 120),
        });
        continue;
      }

      if (step === "xs" && !xsLooksLikeCaption(ctx)) {
        hits.push({
          file: rel,
          line: i + 1,
          token,
          reason:
            "text-xs is for tracked uppercase captions only — bump body/UI chrome to text-sm+",
          snippet: ctx.slice(0, 120),
        });
      }
    }
  });

  return hits;
}

const files = walk(join(ROOT, "app")).concat(walk(join(ROOT, "components")));
const hits = files.flatMap(checkFile);

if (hits.length === 0) {
  console.log(`a11y:type OK — ${files.length} files, scale {${[...SCALE].join(", ")}}`);
  process.exit(0);
}

console.error(`a11y:type FAILED — ${hits.length} issue(s)\n`);
for (const h of hits) {
  console.error(`${h.file}:${h.line}`);
  console.error(`  ${h.token} — ${h.reason}`);
  console.error(`  ${h.snippet}\n`);
}
process.exit(1);
