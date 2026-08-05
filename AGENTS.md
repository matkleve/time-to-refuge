# Agent rules — Timekeeper

Hard gates before merge. Companion: `docs/AGENT-OVERFLOW-OUTLINES.md`, `lib/chrome.ts`.

## CI (must pass)

```bash
npm run typecheck
npm run lint
npm run a11y
```

## Layout — one column, one gutter (never regress)

1. **Shell owns horizontal inset** — mobile `px-3` (`PAGE_INLINE_GUTTER`), desktop `.app-content` + `px-4 sm:px-5` in `app/page.tsx` / `DesktopNav`. Title, filters, and rows share that edge.
2. **No nested horizontal padding** inside the page column — no `px-1` / `px-2` / `max-w-xl` + `mx-auto` on list bodies. Scrollports: `focus-safe-scroll` with **`px-0`** (vertical bleed only).
3. **Page slot must be `flex flex-col`** with `flex-1 min-h-0` around `{page}`. `PageEnter` needs `h-full flex-1`.
4. **Never gate layout clearance on `useMediaQuery`** (defaults false until mount). Column geometry and header clearance use **`md:` / `lg:` CSS**, not JS.
5. **Lists scroll under scrims** — full-bleed scroller + `StickyPageChrome`, not padding the shell below the header.

## Overflow / focus

- No `overflow-x-auto` on chrome (clips focus rings).
- Every `overflow-y-auto` list of controls → `focus-safe-scroll` or inset focus cues.
- Menus/popovers → portal (`GlassMenu`).

## Session desktop

- Left rail = `SessionPersonRow` (name + field status circles), not full `PersonCard`.
- Right pane = focused `PersonCard` + `LiveClockButton`.

## File size (ESLint warn)

- `max-lines` 200 code lines (skip blanks + comments)
- `max-lines-per-function` 60
- At ~150 lines: extract before growing. Split candidates: `LocationCheck`, handlers in hooks.

## Before shipping a page change

Check **Home, Session, People, Quick Log, Fields** on desktop + mobile: nav and content share the same left/right edge.
