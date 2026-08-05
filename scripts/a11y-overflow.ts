#!/usr/bin/env node
/**
 * Static overflow / clip audit for production UI (DESIGN-SYSTEM §4c,
 * docs/AGENT-OVERFLOW-OUTLINES.md). Run with `npm run a11y:overflow`.
 *
 * Catches the regressions that keep shipping:
 *   - bare `overflow-y-auto` (CSS promotes x→auto → horizontal scrollbar
 *     from outset focus rings / soft-lift shadows)
 *   - `overflow-x-auto` on chrome (clips focus rings on both axes)
 *
 * Not a browser layout probe — pair with a manual Tab pass on UC-1.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dev",
  "scripts",
  "public",
  "docs",
]);

/** How many neighboring lines to search for a companion overflow-x guard. */
const CONTEXT = 6;

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

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function contextHas(lines: string[], index: number, re: RegExp): boolean {
  const from = Math.max(0, index - CONTEXT);
  const to = Math.min(lines.length, index + CONTEXT + 1);
  return re.test(lines.slice(from, to).join("\n"));
}

function checkFile(file: string): Hit[] {
  const hits: Hit[] = [];
  const rel = relative(ROOT, file);
  const raw = readFileSync(file, "utf8");
  const lines = stripComments(raw).split("\n");

  lines.forEach((line, i) => {
    const n = i + 1;
    const trimmed = line.trim();
    if (!trimmed) return;

    // Never clip shadows / rounded corners on chrome.
    if (/\boverflow-x-clip\b/.test(line)) {
      hits.push({
        file: rel,
        line: n,
        token: "overflow-x-clip",
        reason:
          "Horizontal clip slices glass shadows and rounded corners. Use focus-safe-scroll + glassFlushClass instead.",
        snippet: trimmed.slice(0, 160),
      });
    }

    if (/\bcontain-paint\b/.test(line)) {
      hits.push({
        file: rel,
        line: n,
        token: "contain-paint",
        reason:
          "Paint containment clips descendant shadows and popover bleed. Remove contain-paint from layout chrome.",
        snippet: trimmed.slice(0, 160),
      });
    }

    // Ban horizontal scroll on chrome — clips focus on both axes (§4c #2).
    if (/\boverflow-x-auto\b/.test(line)) {
      hits.push({
        file: rel,
        line: n,
        token: "overflow-x-auto",
        reason:
          "Horizontal scroll on UI chrome clips focus rings (and often shadows). Compress density instead; see DESIGN-SYSTEM §4c.",
        snippet: trimmed.slice(0, 160),
      });
    }

    // Bare overflow-y scrollports invent an x scrollbar for outset rings.
    if (/\boverflow-y-(?:auto|scroll)\b/.test(line)) {
      const guarded = contextHas(
        lines,
        i,
        /\bfocus-safe-scroll\b|\boverflow-x-(?:clip|hidden)\b/,
      );
      if (!guarded) {
        hits.push({
          file: rel,
          line: n,
          token: "overflow-y-auto/scroll",
          reason:
            "Bare overflow-y makes overflow-x compute to auto. Pair with `focus-safe-scroll` on the same scrollport (inset focus — no overflow-x clip).",
          snippet: trimmed.slice(0, 160),
        });
      }
    }
  });

  return hits;
}

const roots = [join(ROOT, "app"), join(ROOT, "components")].filter((p) => {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
});

const files = roots.flatMap((r) => walk(r));
const hits = files.flatMap(checkFile);

if (hits.length === 0) {
  console.log(
    `a11y:overflow OK — ${files.length} files, no bare overflow-y or overflow-x-auto.`,
  );
  process.exit(0);
}

console.error(`a11y:overflow FAIL — ${hits.length} hit(s):\n`);
for (const h of hits) {
  console.error(`${h.file}:${h.line}`);
  console.error(`  ${h.token} — ${h.reason}`);
  console.error(`  ${h.snippet}\n`);
}
process.exit(1);
