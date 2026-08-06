# Brand (header home lockup)

## What It Is

Header home control: ⏱️ emoji + optional “Timekeeper” wordmark. Desktop toolbar always shows wordmark; mobile shows emoji only (page title is [`HeaderTitle`](../../ui/mobile-header.md) center).

**Not** `Button variant="quiet"` — plain `<button>` + `interactiveFeedbackClass` so wordmark sizing is not fighting chip/`labelCollapse` geometry.

## What It Looks Like

| Mode | Mark | Type |
| --- | --- | --- |
| Desktop (`wordmark`) | ⏱️ + “Timekeeper” | `font-display font-bold text-ink` · `text-lg xl:text-2xl` · `gap-2` |
| Mobile | ⏱️ only | `text-lg` |

Idle: ghost — no fill. Hover/press: feedback wash on rounded-lg hit area.

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
button.Brand | span.Brand (static)
├── span [emoji ⏱️, aria-hidden, text-2xl]
└── [wordmark] span "Timekeeper" whitespace-nowrap
```

## Visual Behavior Contract

| Behavior | Owner | Geometry |
| --- | --- | --- |
| Hit area | `button` host | Desktop: implicit padding via `gap-2`; no fixed `size-*` on wordmark variant |
| Feedback | host | `interactiveFeedbackClass({ press: "sm" })` |
| Emoji | child | `text-2xl leading-none shrink-0` |

**MUST NOT** use `labelCollapse`, `size-11`, or `Button` wrapper on desktop wordmark.

## Acceptance Criteria

- [ ] Desktop: “Timekeeper” always visible; never clipped at 1280px
- [ ] `aria-label="Timekeeper — open Home"` when clickable
- [ ] Left edge aligns with page column gutter in `DesktopNav`
- [ ] Matches ghost family of header chrome at idle
