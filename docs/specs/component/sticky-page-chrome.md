# Sticky page chrome

## What It Is

Optional pinned block **below** the floating app header (e.g. retreat name chip on Session / People). Provides top clearance so pinned content sits in the correct vertical band.

**Not** a second header — page titles live in [`NavPageTitle`](nav-page-title.md) (desktop nav pages) or [`HeaderTitle`](../ui/mobile-header.md) (mobile).

## What It Looks Like

`sticky top-0 z-20` strip with pointer-events split: outer `pointer-events-none`, inner content `pointer-events-auto`.

## Where It Lives

`components/atoms/StickyPageChrome.tsx` · used via `ListPageFrame` `pin` / `pinBelow`

## Clearance (MUST match `lib/chrome.ts`)

| `belowHeaderTitle` | `padding-top` |
| --- | --- |
| `false` | Mobile: `BRAND_CHROME_PAD` calc · `md+`: `4.5rem` |
| `true` (nav pages) | `STICKY_CHROME_PT_BELOW_HEADER_TITLE` — mobile brand pad · `md:pt-[calc(4.5rem+3.5rem)]` |

Horizontal: `PAGE_INLINE_GUTTER` on inner blocks only.

## Component Hierarchy

```text
div.sticky (clearance padding-top)
├── [children] div.pointer-events-auto + PAGE_INLINE_GUTTER + pb-1
└── [below] div.pointer-events-auto + PAGE_INLINE_GUTTER + pb-2
```

## Rules

- **MUST NOT** add horizontal padding beyond `PAGE_INLINE_GUTTER`
- **MUST NOT** nest extra vertical pad on top of clearance
- Page title **MUST NOT** repeat here on desktop (lives in `DesktopNav`)

## Acceptance Criteria

- [ ] Retreat chip on Session clears floating header + title band
- [ ] Pin content left edge = list gutter
- [ ] No title scrim / second blur band
