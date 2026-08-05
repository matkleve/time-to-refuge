#!/usr/bin/env node
/**
 * Layout height / fill audit for every AppView page.
 * Run: `npm run a11y:layout`
 *
 * Catches the blank-backdrop class of bug: a page uses flex-1 / absolute
 * inset-0 but an ancestor is not a flex column, so used height collapses
 * to 0 and only overflowing crumbs paint on the photo.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

type Row = {
  page: string;
  file: string;
  layers: number;
  root: string;
  problems: string[];
};

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function countMatches(src: string, re: RegExp): number {
  return (src.match(re) ?? []).length;
}

/** Rough “layout depth” — flex / absolute / min-h-0 / inset-0 hits in file. */
function layoutSignalCount(src: string): number {
  return (
    countMatches(src, /\bflex-1\b/g) +
    countMatches(src, /\bmin-h-0\b/g) +
    countMatches(src, /\babsolute\b/g) +
    countMatches(src, /\binset-0\b/g) +
    countMatches(src, /\bh-full\b/g) +
    countMatches(src, /\bh-dvh\b/g)
  );
}

function rootKind(src: string): string {
  // First return’s opening className is a decent proxy for the page root.
  const m =
    src.match(
      /return\s*\(\s*(?:\/\*[\s\S]*?\*\/\s*)*<(?:ListPageFrame|[A-Z][A-Za-z]+|div)[^>]*className=\{?cn\(([\s\S]*?)\)\}?/,
    ) ??
    src.match(
      /return\s*\(\s*(?:\/\*[\s\S]*?\*\/\s*)*<(?:ListPageFrame|div)([^>]*)>/,
    );
  if (!m) {
    if (src.includes("<ListPageFrame")) return "ListPageFrame (absolute scroll)";
    return "unknown";
  }
  const chunk = m[1] ?? "";
  if (src.includes("<ListPageFrame") && !chunk.includes("absolute")) {
    return "ListPageFrame (absolute scroll)";
  }
  if (/\babsolute\b/.test(chunk) && /\binset-0\b/.test(chunk)) {
    return "absolute inset-0";
  }
  if (/\bflex-1\b/.test(chunk)) return "flex-1 column";
  if (src.includes("<ListPageFrame")) return "ListPageFrame (absolute scroll)";
  return chunk.replace(/\s+/g, " ").slice(0, 60) || "unknown";
}

function problemsFor(page: string, file: string, src: string): string[] {
  const problems: string[] = [];
  const kind = rootKind(src);

  if (kind.startsWith("absolute") || kind.startsWith("ListPageFrame")) {
    // Absolute pages need a positioned ancestor with real height (PageEnter).
    if (!src.includes("inset-0") && !src.includes("ListPageFrame")) {
      problems.push("absolute root without inset-0");
    }
  }

  if (kind === "flex-1 column" || /\bflex-1\b/.test(src.slice(0, 800))) {
    // flex-1 at page root is fine IF shell slot is flex — checked on page.tsx.
  }

  // Narrow board clamp — Dana should use the shell width, not a phone column.
  if (page === "dana" && /max-w-(?:xl|2xl|3xl|4xl|5xl)\b/.test(src)) {
    problems.push("board page clamped with max-w-* inside app-content (reads tiny)");
  }

  // Bare overflow-y without x guard (also in a11y:overflow; double-signal here).
  if (
    /\boverflow-y-(?:auto|scroll)\b/.test(src) &&
    !/\bfocus-safe-scroll\b/.test(src) &&
    !/\boverflow-x-(?:clip|hidden)\b/.test(src)
  ) {
    problems.push("bare overflow-y-auto (x becomes auto)");
  }

  if (file.includes("PersonRailRow")) {
    problems.push("name-only rail — use PersonCard");
  }

  return problems;
}

const pageFiles: Array<{ page: string; file: string }> = [
  { page: "home", file: "components/organisms/LandingPage.tsx" },
  { page: "session/desktop", file: "components/organisms/DesktopWorkspace.tsx" },
  { page: "session/mobile", file: "components/organisms/RefugeView.tsx" },
  { page: "people", file: "components/organisms/PeopleSheet.tsx" },
  { page: "quicklog", file: "components/organisms/QuickLogView.tsx" },
  { page: "history", file: "components/organisms/HistoryPanel.tsx" },
  { page: "fields", file: "components/organisms/FieldsPage.tsx" },
  { page: "dana", file: "components/organisms/DanaPage.tsx" },
];

const pageTsx = read("app/page.tsx");
const pageEnter = read("components/atoms/PageEnter.tsx");
const listFrame = read("components/atoms/ListPageFrame.tsx");

const shellProblems: string[] = [];
if (
  !/className="relative flex min-h-0 flex-1 flex-col">\{page\}/.test(pageTsx) &&
  !/relative flex min-h-0 flex-1 flex-col">\{page\}/.test(pageTsx)
) {
  shellProblems.push(
    "page.tsx slot missing `flex flex-col` around {page} — flex-1 pages collapse to height 0",
  );
}
if (!/\bh-full\b/.test(pageEnter) || !/\bflex-1\b/.test(pageEnter)) {
  shellProblems.push("PageEnter must keep h-full + flex-1");
}
if (!/\babsolute inset-0\b/.test(listFrame) || !/\bfocus-safe-scroll\b/.test(listFrame)) {
  shellProblems.push("ListPageFrame must stay absolute inset-0 + focus-safe-scroll");
}

const rows: Row[] = pageFiles.map(({ page, file }) => {
  const src = read(file);
  return {
    page,
    file,
    layers: layoutSignalCount(src),
    root: rootKind(src),
    problems: problemsFor(page, file, src),
  };
});

// Shell synthetic rows
const shellRows: Row[] = [
  {
    page: "(shell) desktop slot",
    file: "app/page.tsx",
    layers: layoutSignalCount(pageTsx),
    root: "DesktopShell → app-content → flex slot → PageEnter",
    problems: shellProblems.filter((p) => p.includes("page.tsx") || p.includes("PageEnter")),
  },
  {
    page: "(shell) PageEnter",
    file: "components/atoms/PageEnter.tsx",
    layers: layoutSignalCount(pageEnter),
    root: "flex h-full flex-1 flex-col",
    problems: shellProblems.filter((p) => p.includes("PageEnter")),
  },
  {
    page: "(shell) ListPageFrame",
    file: "components/atoms/ListPageFrame.tsx",
    layers: layoutSignalCount(listFrame),
    root: "absolute inset-0 scroll",
    problems: shellProblems.filter((p) => p.includes("ListPageFrame")),
  },
];

const all = [...shellRows, ...rows];
const failed = all.filter((r) => r.problems.length > 0);

console.log("a11y:layout — AppView layout map\n");
console.log(
  "| Page | Root fill | Layout signals | Problems |",
);
console.log("| --- | --- | ---: | --- |");
for (const r of all) {
  const probs = r.problems.length ? r.problems.join("; ") : "ok";
  console.log(`| ${r.page} | ${r.root} | ${r.layers} | ${probs} |`);
}
console.log("");

if (failed.length) {
  console.error(`a11y:layout FAIL — ${failed.length} surface(s) with problems.`);
  process.exit(1);
}

console.log("a11y:layout OK — shell + every AppView fills height.");
process.exit(0);
