# Header actions slot

## What It Is

Desktop-only portal for **view-specific** toolbar actions (e.g. Fields Reset, Quick Log Clear) into the **page title row** beside [`NavPageTitle`](nav-page-title.md) (desktop) or [`HeaderTitle`](../../components/atoms/HeaderTitle.tsx) (mobile).

## What It Looks Like

When registered: a `flex gap-1.5` group of quiet/glass controls matching header chrome. When empty: renders nothing (no placeholder gap).

## Where It Lives

| File | Role |
| --- | --- |
| `components/timekeeper/header-actions-context.tsx` | Provider + slot + `useRegisterHeaderActions` |
| `DesktopNav` | Renders `<HeaderActionsSlot />` on the **title row** (nav pages only) |
| `components/timekeeper/TimekeeperMobileShell.tsx` | Renders slot beside `HeaderTitle` |
| Pages | `useRegisterHeaderActions(node)` |

## Actions

| # | Trigger | System response |
| --- | --- | --- |
| 1 | Page mounts with hook | Actions appear right of `NavPageTitle` |
| 2 | Page unmounts | Slot clears |

## Component Hierarchy

```text
HeaderActionsProvider (app root)
├── DesktopNav
│   └── [nav page title row]
│       ├── NavPageTitle
│       └── HeaderActionsSlot
└── TimekeeperMobileShell
    └── [title column]
        ├── HeaderTitle
        └── HeaderActionsSlot
```

## Wiring

```text
useRegisterHeaderActions(<Fragment>...</Fragment>)
  → useEffect set on mount, clear on unmount
```

**MUST** unregister on unmount (effect cleanup).

## Rules

- Desktop: title row at `md+` · mobile: left of title in the title column when registered
- **MUST** mount on title row — **MUST NOT** on tab row (undo/export/Dana stay in `DesktopNavActions`)
- **MUST NOT** duplicate global undo/export/Dana
- Controls **SHOULD** use `Button` `quiet` or `glass` per [`button.md`](ui-primitives/button.md)

## Acceptance Criteria

- [ ] Fields (or other registering view): actions on title row at `md+`; mobile actions left of title
- [ ] Navigating away removes previous view's actions
- [ ] No layout jump when slot empty vs filled (slot is `shrink-0`)
