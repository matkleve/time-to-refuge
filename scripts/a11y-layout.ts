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
  if (src.includes("<ListPageFrame")) return "flow scroll (ListPageFrame)";

  const m =
    src.match(
      /return\s*\(\s*(?:\/\*[\s\S]*?\*\/\s*)*<(?:ListPageFrame|[A-Z][A-Za-z]+|div)[^>]*className=\{?cn\(([\s\S]*?)\)\}?/,
    ) ??
    src.match(
      /return\s*\(\s*(?:\/\*[\s\S]*?\*\/\s*)*<(?:ListPageFrame|div)([^>]*)>/,
    );
  if (!m) return "unknown";
  const chunk = m[1] ?? "";
  if (/\babsolute\b/.test(chunk) && /\binset-0\b/.test(chunk)) {
    return "absolute inset-0 (avoid)";
  }
  if (/\bh-full\b/.test(chunk) && /\bflex-1\b/.test(chunk)) {
    return "flow fill (h-full flex-1)";
  }
  if (/\bflex-1\b/.test(chunk)) return "flex-1 column";
  return chunk.replace(/\s+/g, " ").slice(0, 60) || "unknown";
}

function problemsFor(page: string, file: string, src: string): string[] {
  const problems: string[] = [];
  const kind = rootKind(src);

  // Prefer ordinary fill+scroll over absolute inset-0 page roots.
  if (kind.includes("absolute inset-0")) {
    problems.push(
      "page root is absolute inset-0 — use h-full min-h-0 flex-1 overflow-y-auto (normal document in shell)",
    );
  }

  if (page === "dana" && /max-w-(?:xl|2xl|3xl|4xl|5xl)\b/.test(src)) {
    problems.push("board page clamped with max-w-* inside app-content (reads tiny)");
  }

  if (
    ["people", "history", "fields"].includes(page) &&
    /\bmax-w-(?:md|lg|xl|2xl)\b/.test(src)
  ) {
    problems.push("list body clamped with max-w-* — shell owns the column");
  }

  if (
    ["people", "quicklog"].includes(page) &&
    !/<ListPageFrame/.test(src)
  ) {
    problems.push("page must use ListPageFrame (one scroll/clearance model)");
  }

  if (page.startsWith("session/") && !/<ListPageFrame/.test(read("components/timekeeper/timekeeper-refuge-page.tsx"))) {
    problems.push("Session must use ListPageFrame via timekeeper-refuge-page");
  }

  if (page === "home" && !/<ListPageFrame/.test(src)) {
    problems.push("Home must use ListPageFrame fill=workspace");
  }

  if (
    /\boverflow-y-(?:auto|scroll)\b/.test(src) &&
    !/\bfocus-safe-scroll\b/.test(src) &&
    !/\boverflow-x-(?:clip|hidden)\b/.test(src)
  ) {
    problems.push("bare overflow-y-auto (x becomes auto)");
  }

  if (file.includes("PersonRailRow")) {
    problems.push("legacy name-only rail — use SessionPersonRow");
  }
  if (
    file.includes("DesktopWorkspace") &&
    /PersonCard/.test(src) &&
    !/SessionPersonRow/.test(src)
  ) {
    problems.push("Session rail must use SessionPersonRow (progress dots), not full cards");
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

const desktopAppShell = read("components/timekeeper/TimekeeperDesktopShell.tsx");
const mobileAppShell = read("components/timekeeper/TimekeeperMobileShell.tsx");
const pageEnter = read("components/atoms/PageEnter.tsx");
const listFrame = read("components/atoms/ListPageFrame.tsx");

const shellProblems: string[] = [];
const shellSlotOk =
  /className="relative flex min-h-0 flex-1 flex-col">\{page\}/.test(desktopAppShell) ||
  /relative flex min-h-0 flex-1 flex-col">\{page\}/.test(desktopAppShell);
if (!shellSlotOk) {
  shellProblems.push(
    "TimekeeperDesktopShell slot missing `flex flex-col` around {page} — flex-1 pages collapse to height 0",
  );
}
if (!/\bh-full\b/.test(pageEnter) || !/\bflex-1\b/.test(pageEnter)) {
  shellProblems.push("PageEnter must keep h-full + flex-1");
}
if (/\banimate-fade-in-up\b/.test(pageEnter)) {
  shellProblems.push(
    "PageEnter must not use animate-fade-in-up (translateY flashes a document scrollbar on switch)",
  );
}
if (!/\banimate-fade-in\b/.test(pageEnter)) {
  shellProblems.push("PageEnter should use animate-fade-in (opacity only)");
}

const desktopShell = read("components/DesktopShell.tsx");
if (!/\boverflow-hidden\b/.test(desktopShell) || !/\bh-dvh\b/.test(desktopShell)) {
  shellProblems.push("DesktopShell must be h-dvh overflow-hidden (no document scroll)");
}

const globals = read("app/globals.css");
if (!/html,\s*\n\s*body\s*\{[^}]*overflow:\s*hidden/s.test(globals)) {
  shellProblems.push("html, body must set overflow:hidden so page switches never jump");
}
if (
  !/\bh-full\b/.test(listFrame) ||
  !/\bflex-1\b/.test(listFrame) ||
  !/\bfocus-safe-scroll\b/.test(listFrame)
) {
  shellProblems.push(
    "ListPageFrame must be normal flow fill (h-full flex-1 + focus-safe-scroll), not absolute inset-0",
  );
}
if (/\babsolute inset-0\b/.test(listFrame)) {
  shellProblems.push("ListPageFrame still uses absolute inset-0 — prefer h-full flex-1 scroll");
}
if (/subheader/.test(desktopAppShell) || /subheader/.test(mobileAppShell)) {
  shellProblems.push("shell subheader removed — page titles live in ListPageFrame pin");
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
    file: "components/timekeeper/TimekeeperDesktopShell.tsx",
    layers: layoutSignalCount(desktopAppShell),
    root: "DesktopShell → app-content → flex slot → PageEnter",
    problems: shellProblems.filter(
      (p) =>
        p.includes("TimekeeperDesktopShell") ||
        p.includes("PageEnter"),
    ),
  },
  {
    page: "(shell) DesktopShell",
    file: "components/DesktopShell.tsx",
    layers: layoutSignalCount(desktopShell),
    root: "h-dvh overflow-hidden flex-col",
    problems: shellProblems.filter((p) => p.includes("DesktopShell")),
  },
  {
    page: "(shell) document",
    file: "app/globals.css",
    layers: 0,
    root: "html/body overflow hidden",
    problems: shellProblems.filter((p) => p.includes("html, body")),
  },
  {
    page: "(shell) PageEnter",
    file: "components/atoms/PageEnter.tsx",
    layers: layoutSignalCount(pageEnter),
    root: "flex h-full flex-1 + fade (no translate)",
    problems: shellProblems.filter(
      (p) => p.includes("PageEnter") || p.includes("animate-fade"),
    ),
  },
  {
    page: "(shell) ListPageFrame",
    file: "components/atoms/ListPageFrame.tsx",
    layers: layoutSignalCount(listFrame),
    root: "flow fill (h-full flex-1 scroll)",
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
