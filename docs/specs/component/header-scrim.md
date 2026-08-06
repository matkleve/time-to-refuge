# Header scrim

## What It Is

Single soften band under the floating header. Lists scroll **under** the brand so content fades through one blur layer — not a stack of scrims, not a title scrim.

## What It Looks Like

Full-width band, pointer-events none.

| Mode | Breakpoint | Height |
| --- | --- | --- |
| Default | Mobile | `calc(env(safe-area-inset-top) + 4.75rem)` |
| Default | `md+` | `4.75rem` |
| `extended` (nav pages) | Mobile | `calc(env(safe-area-inset-top) + 4.75rem + 3.5rem)` |
| `extended` (nav pages) | `md+` | `calc(4.75rem + 3.5rem)` |

Tokens: `HEADER_SCRIM_HEIGHT`, `HEADER_SCRIM_EXTENDED_HEIGHT` in `lib/chrome.ts`.  
Class: `header-scrim` (global styles in `globals.css`).

`extended={isNavPageView(view)}` on desktop when the in-header title row is visible.

## Where It Lives

`components/atoms/HeaderScrim.tsx` — first child inside desktop and mobile headers.

## Component Hierarchy

```text
header
├── HeaderScrim (aria-hidden) [extended?]
└── toolbar rows (z-10, relative)
```

## Rules (MUST)

- **One** scrim per shell — no page-level duplicate scrims
- `pointer-events-none` always
- `aria-hidden` — decorative only
- `extended` grows through title row — **MUST NOT** add a second scrim for the title

## Acceptance Criteria

- [ ] List rows visible through soften band when scrolling
- [ ] Nav pages: extended band covers tab + title rows
- [ ] Scrim does not block clicks on header controls (sits behind rows)
