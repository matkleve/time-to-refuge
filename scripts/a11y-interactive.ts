#!/usr/bin/env node
/**
 * Interactive glass audit — tappable controls must not pair `glass*Class` /
 * `actionClass` with `userFeedbackClass` manually. Use `@/lib/interactive-glass`.
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

const GLASS_IMPORT =
  /from\s+["']@\/lib\/surfaces["']/;
const FEEDBACK_IMPORT =
  /from\s+["']@\/lib\/user-feedback["']/;
const INTERACTIVE_IMPORT =
  /from\s+["']@\/lib\/interactive-glass["']/;

const ALLOWLIST = new Set([
  "lib/interactive-glass.ts",
  "lib/surfaces.ts",
  "lib/user-feedback.ts",
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
  const hasGlass = GLASS_IMPORT.test(src);
  const hasFeedback = FEEDBACK_IMPORT.test(src);
  if (!hasGlass || !hasFeedback) continue;
  if (INTERACTIVE_IMPORT.test(src)) continue;
  problems.push(
    `${rel}: imports both @/lib/surfaces and @/lib/user-feedback — use @/lib/interactive-glass helpers`,
  );
}

if (problems.length) {
  console.error("Interactive glass audit failed:\n");
  for (const p of problems) console.error(`  • ${p}`);
  process.exit(1);
}

console.log(`Interactive glass audit passed (${files.length} files scanned).`);
