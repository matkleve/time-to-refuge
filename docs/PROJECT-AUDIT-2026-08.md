# Project audit — Timekeeper (August 2026)

Post-hygiene pass: CI gates, layout invariant, ESLint maintainability, `page.tsx` split.

Companion audits: `docs/WCAG-AUDIT-2026-08.md`, `docs/AGENT-OVERFLOW-OUTLINES.md`, `AGENTS.md`.

---

## 1. Verdict

| Area | Status |
| --- | --- |
| CI (`typecheck`, `lint`, `a11y`) | **Green** with `--max-warnings 0` |
| Layout (one gutter, flex shell) | **Enforced** — `PAGE_INLINE_GUTTER`, `a11y:layout`, `a11y:overflow` |
| WCAG contrast | **50/50 pass** (`a11y:contrast`) |
| Type scale | **Pass** (`a11y:type`) |
| File size (200 code lines) | **Green** — large files split; `lint --max-warnings 0` |
| Session desktop rail | `SessionPersonRow` (name + field dots) |
| Page titles | Always visible |

---

## 2. CI pipeline

`.github/workflows/ci.yml` on every PR / push to `main`:

```bash
npm ci
npm run typecheck
npm run lint      # --max-warnings 0 (errors + warns block)
npm run a11y      # contrast + type + overflow + layout
```

Agent entry point: **`AGENTS.md`** (layout rules, session rail, no stacked gutters).

---

## 3. Layout invariant (root cause of “rand” bugs)

| Rule | Implementation |
| --- | --- |
| One horizontal edge | Shell: mobile `px-3`, desktop `.app-content` + `px-4 sm:px-5` |
| Page chrome | `PAGE_INLINE_GUTTER` in `lib/chrome.ts` |
| No double frame | Scrollports `focus-safe-scroll` + `px-0` |
| No JS layout breakpoints | Clearance / columns = `md:` CSS, not `useMediaQuery` |
| Flex shell | Page slot `flex flex-col` + `PageEnter` `h-full flex-1` |

---

## 4. File size / ESLint splits

`npm run lint` uses `--max-warnings 0`. Caps:

| Scope | `max-lines` | `max-lines-per-function` | `complexity` |
| --- | ---: | ---: | ---: |
| `lib/**` | 200 | 60 | 15 |
| `components/**`, `app/**` | 200 | **100** | **18** |
| Exempt | `scripts/**`, `app/dev/**`, `app/opengraph-image.tsx`, `lib/card-image.ts` |

**Splits (branch `cursor/eslint-split-9eb7`):**

- `LocationCheck` → `lib/location-check/*`, `components/atoms/location-check/*`
- `PersonFields` / `PersonCard` → row + layout + menu subcomponents + hooks
- `GlassMenu` → `components/atoms/glass-menu/*`
- `QuickLogView` → chrome + log row subcomponents
- `use-timekeeper-app` → `lib/timekeeper/*` handlers + effects
- `FieldsPage` / `DanaPage` / `RefugeView` / `DesktopNav` / `ViewMenu` / `IconButton` — thin shells + helpers
- `TimekeeperApp` → `components/timekeeper/*` shells + `timekeeper-app-content`

**Done earlier:** `app/page.tsx` → thin entry + `TimekeeperApp` + `useTimekeeperApp`.

**Backlog:** tighten component `max-lines-per-function` from 100 → 60 with more splits if desired.

---

## 5. ESLint vs Feldpost / Codegrapher

| Rule | Timekeeper | Feldpost |
| --- | --- | --- |
| `max-lines` | warn 200 | warn 200 |
| `max-lines-per-function` | warn 60 | warn 60 |
| `complexity` | warn 15 | warn 15 |
| `--max-warnings 0` | **yes** | yes in `apps/web` |
| Angular / unused-imports | — | yes |

**Next:** optional tighten component function cap 100 → 60.

---

## 6. AppView layout map (`a11y:layout`)

All pages: shell fill OK. Quick Log / People / Session use shared gutter.

---

## 7. Open backlog

1. Quiet undo/redo on photo — contrast watch (WCAG audit).
2. Optional: component `max-lines-per-function` 100 → 60 with further splits.

---

## 8. Commands

```bash
npm run typecheck
npm run lint
npm run a11y
npm run a11y:layout
```
