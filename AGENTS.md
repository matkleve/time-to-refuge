# Agent rules — Timekeeper

Wall-clock moment recorder for timed session steps — not a stopwatch. See `docs/DESIGN-SYSTEM.md` §0.

## CI (must pass)

```bash
npm run typecheck
npm run lint
npm run a11y
```

Targeted: `a11y:layout`, `a11y:overflow`, `a11y:interactive`.

## Cursor rules (scoped UI chrome)

| Rule | When |
| --- | --- |
| `.cursor/rules/timekeeper-ui-chrome.mdc` | Editing `components/`, `app/`, `app/globals.css` |
| `.cursor/rules/timekeeper-interactive-glass.mdc` | Editing `components/` |

**Constants:** `lib/chrome.ts`. **Overflow detail:** `docs/DESIGN-SYSTEM.md` §4c.

## Scope discipline

- **Layout, gutter, scroll, header clearance, overflow, glass on controls** — follow Cursor rules above; minimal diffs are not exempt.
- **Logic, copy, non-chrome styling** — minimal diff OK; run CI if you touch components.

## Before shipping a page change

Check **Home, Session, People, Quick Log, Fields** on desktop + mobile: nav and content share the same left/right edge. Tap controls on `/dev/components` — whole chip must bounce (`lib/interactive-glass.ts`).

## File size (ESLint warn)

`max-lines` 200, `max-lines-per-function` 60 (100 in `components/`). Extract before ~150 lines.
