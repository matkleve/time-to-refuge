#!/usr/bin/env node
/**
 * Interactive glass audit — components must not import `userFeedbackClass` or
 * pair `glass*Class` / `actionClass` with feedback manually. Use
 * `@/lib/interactive-glass` helpers so material + `.user-feedback` stay on ONE node.
 *
 * Run: `npm run a11y:interactive`
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

const GLASS_IMPORT = /from\s+["']@\/lib\/surfaces["']/;
const FEEDBACK_VALUE_IMPORT =
  /import\s+(?!type\s)\{[^}]*\buserFeedbackClass\b[^}]*\}\s+from\s+["']@\/lib\/user-feedback["']/;
const FEEDBACK_NAMED_IMPORT =
  /import\s+\{\s*userFeedbackClass\s*\}\s+from\s+["']@\/lib\/user-feedback["']/;
const INTERACTIVE_IMPORT = /from\s+["']@\/lib\/interactive-glass["']/;

const GLASS_CLASS_CALL =
  /\b(?:glassFlushClass|glassFlushRowClass|glassFlushChipClass|glassClass|glassRowClass|glassChipClass|glassNavTabClass|actionClass)\s*\(/;

const ALLOWLIST = new Set([
  "lib/interactive-glass.ts",
  "lib/surfaces.ts",
  "lib/user-feedback.ts",
  "components/atoms/Surface.tsx",
  "components/atoms/icon-button-classes.ts",
  "app/dev/fonts/FontPicker.tsx",
]);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) {
      walk(path, out);
    } else if (/\.(tsx?|jsx?)$/.test(name)) {
      out.push(path);
    }
  }
  return out;
}

const files = walk(ROOT);
const problems: string[] = [];

for (const abs of files) {
  const rel = relative(ROOT, abs);
  if (ALLOWLIST.has(rel)) continue;
  const src = readFileSync(abs, "utf8");

  if (FEEDBACK_VALUE_IMPORT.test(src) || FEEDBACK_NAMED_IMPORT.test(src)) {
    problems.push(
      `${rel}: imports userFeedbackClass — use interactiveFeedbackClass / interactive-glass helpers`,
    );
    continue;
  }

  const hasGlass = GLASS_IMPORT.test(src);
  const hasInteractive = INTERACTIVE_IMPORT.test(src);
  const usesGlassClass = GLASS_CLASS_CALL.test(src);

  if (hasGlass && !hasInteractive) {
    problems.push(
      `${rel}: imports @/lib/surfaces — use @/lib/interactive-glass (staticGlass* for non-interactive shells)`,
    );
  }

  if (usesGlassClass && !hasInteractive && !ALLOWLIST.has(rel)) {
    problems.push(
      `${rel}: calls glass*Class / actionClass without @/lib/interactive-glass`,
    );
  }
}

if (problems.length) {
  console.error("Interactive glass audit failed:\n");
  for (const p of problems) console.error(`  • ${p}`);
  process.exit(1);
}

console.log(`Interactive glass audit passed (${files.length} files scanned).`);
