# Desktop shell

## What It Is

`md+` app frame: floating [`desktop-header`](nav/desktop-header.md) over full-height page slot inside `DesktopShell`.

## What It Looks Like

`h-dvh overflow-hidden flex-col`. Page area = `app-content absolute inset-0` with `px-4 sm:px-5`. Nav is sibling above page slot (not inside scroll).

## Where It Lives

| File | Role |
| --- | --- |
| `components/timekeeper/TimekeeperDesktopShell.tsx` | Wiring |
| `components/DesktopShell.tsx` | Viewport shell |

## Component Hierarchy

```text
DesktopShell
├── DesktopNav
└── div.flex-1
    └── .app-content.absolute.inset-0
        └── {page}
```

## Actions

| # | Event | Response |
| --- | --- | --- |
| 1 | Shell mount | Header + page fill viewport |
| 2 | View change | Nav selection updates; page swaps in slot |

## Acceptance Criteria

- [ ] `npm run a11y:layout` — desktop slot fills height
- [ ] Page scroll inside slot, not document body
- [ ] Nav stays fixed while list scrolls under scrim
