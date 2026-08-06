# Mobile header

## What It Is

Phone shell toolbar: brand (left) · centered page title · hamburger menu (right). Separate from desktop [`desktop-header.md`](nav/desktop-header.md).

## What It Looks Like

`grid-cols-[auto_1fr_auto] h-11` inside `px-3` + safe-area top padding. Ghost brand (emoji only). Title `text-lg leading-tight font-semibold text-ink` centered in a `min-w-0 overflow-hidden` middle slot (`truncate` + ellipsis). Menu trigger right.

[`HeaderScrim`](../component/header-scrim.md) behind row (not `extended`).

## Where It Lives

`components/timekeeper/TimekeeperMobileShell.tsx` · title: `components/atoms/HeaderTitle.tsx` · titles: `lib/view-titles.ts`

## Actions

| # | User action | System response |
| --- | --- | --- |
| 1 | Tap brand | `setView("home")` |
| 2 | Open menu | Pages + actions + Dana primary → `/dana` ([supplement](nav/view-menu-dana.supplement.md)) |
| 3 | — | Title updates from `getHeaderTitle(view)` |
| 4 | View-specific | [`HeaderActionsSlot`](../component/header-actions-slot.md) left of title when registered (e.g. Fields Reset) |

## Component Hierarchy

```text
header (absolute)
├── HeaderScrim
└── grid h-11 [auto 1fr auto]
    ├── Brand (no wordmark)
    ├── HeaderActionsSlot + HeaderTitle (left-aligned flex)
    └── hamburger menu
```

## Title policy

| View | Element | Title source |
| --- | --- | --- |
| `home` | `p` (not h1) | `getHeaderTitle` |
| other | `h1` | `getHeaderTitle` |

Desktop (`md+`): page title in [`NavPageTitle`](../component/nav-page-title.md) on second header row — **no** `PageTitle` or duplicate heading in list body.

## Acceptance Criteria

- [ ] Title visually centered in middle grid column
- [ ] Long titles truncate with ellipsis — **MUST NOT** overlap brand or menu
- [ ] Brand and menu ≥ 44px touch targets
- [ ] Safe area respected on notched devices
