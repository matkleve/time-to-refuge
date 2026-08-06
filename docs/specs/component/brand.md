# Brand (header home lockup)

## What It Is

Header home control: ⏱️ emoji + optional “Timekeeper” wordmark. Desktop toolbar always shows wordmark; mobile shows emoji only (page title is [`HeaderTitle`](../../ui/mobile-header.md) center).

`Button variant="quiet"` — same ghost chrome as header tabs; wordmark uses `h-11 w-auto px-3` (not `labelCollapse`).

## What It Looks Like

| Mode | Mark | Type |
| --- | --- | --- |
| Desktop (`wordmark`) | ⏱️ + “Timekeeper” | `font-display font-bold text-ink` · `text-lg xl:text-2xl` · `gap-2` |
| Mobile | ⏱️ only | `text-lg` |

Idle: ghost — no fill. Desktop wordmark on `home` view: white glass chip (same as selected nav tab). Mobile: ghost on all views (title shows “Timekeeper” on `home`). Hover/press: feedback wash on `rounded-full` chip.

## Where It Lives

| File | Usage |
| --- | --- |
| `components/atoms/Brand.tsx` | Implementation |
| `DesktopNav` | `wordmark={true}` |
| `TimekeeperMobileShell` | `wordmark={false}` |

## Actions

| # | User action | System response |
| --- | --- | --- |
| 1 | Click (when `onHome`) | Navigate to `home` |
| 2 | Focus | `flagblue-600` focus ring |

## Component Hierarchy

```text
Button[quiet] | span.Brand (static)
├── span [emoji ⏱️, aria-hidden, text-2xl]
└── [wordmark] span "Timekeeper" whitespace-nowrap
```

## Visual Behavior Contract

| Behavior | Owner | Geometry |
| --- | --- | --- |
| Hit area | `Button` host | Mobile: `size-11` icon chip; desktop wordmark: `h-11 w-auto px-3 gap-2` |
| Feedback | host | `quiet` + `press="md"`; `surfaceClass={interactiveGlassNavTabClass(selected)}` |
| Emoji | child | `text-2xl leading-none shrink-0` |

**MUST NOT** use `labelCollapse` on wordmark — label is always visible on desktop (`wordmark`).

## Acceptance Criteria

- [ ] Desktop: “Timekeeper” always visible; never clipped at 1280px
- [ ] `aria-label="Timekeeper — open Home"` when clickable
- [ ] Left edge aligns with page column gutter in `DesktopNav`
- [ ] Desktop wordmark on `home`: glass chip fill matches selected nav tab
- [ ] Mobile: ghost on all views (including `home`)
