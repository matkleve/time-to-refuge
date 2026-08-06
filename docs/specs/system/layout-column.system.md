# Layout column (system)

Cross-cutting layout invariants. Enforced by `AGENTS.md`, `lib/chrome.ts`, `npm run a11y:layout`.

## Rules (MUST)

1. **Shell owns horizontal inset** — mobile `PAGE_INLINE_GUTTER` (`px-3`); desktop `.app-content` + `px-4 sm:px-5`
2. **No nested horizontal padding** in page column — no extra `px-*` on list bodies
3. **Page slot** `flex flex-col` with `flex-1 min-h-0` around `{page}`
4. **Never gate clearance on `useMediaQuery`** — use `md:` / `lg:` CSS
5. **Lists scroll under brand** — full-bleed scroller + clearance; one `HeaderScrim` only (`extended` on nav pages)
6. **Scrollports:** `focus-safe-scroll` + `overflow-y-auto` only — no `overflow-x-clip` on chrome

## Header clearance (`lib/chrome.ts`)

| Token | Value | Use |
| --- | --- | --- |
| `DESKTOP_BRAND_CHROME_PAD` | 4.5rem | Tab row only (home, etc.) |
| `DESKTOP_PAGE_TITLE_BAND` | 3.5rem | In-header `NavPageTitle` row |
| `DESKTOP_CLEARANCE_WITH_TITLE` | `md:pt-[calc(4.5rem+3.5rem)]` | Nav page list bodies |
| `MOBILE_HEADER_CLEARANCE` | safe-area + mobile brand row | Mobile scroll bodies |
| `STICKY_CHROME_PT_BELOW_HEADER_TITLE` | mobile pad + `md:pt-[calc(4.5rem+3.5rem)]` | `StickyPageChrome` on nav pages |
| `BRAND_CHROME_PAD` | safe-area + mobile row | Legacy mobile sticky calc |

## Desktop page title

Nav pages (`fields`, `people`, `refuge`, `quicklog`, `history`): title in [`NavPageTitle`](../component/nav-page-title.md) inside `DesktopNav` — **MUST NOT** duplicate in scroll body.

## Acceptance

- [ ] `npm run a11y:layout` — shell + every AppView fills height
- [ ] Home, Session, People, Quick Log, Fields: nav and content share same left/right edge
