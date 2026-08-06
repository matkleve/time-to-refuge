# Desktop nav — Actions cluster

Parent: [`desktop-header.md`](../ui/nav/desktop-header.md) · Dana route: [`dana-page.md`](../ui/public/dana-page.md)

## What It Is

Right-side **tab-row** utilities: undo, redo, export, Dana. View-specific actions are **not** here — they mount on the title row via [`header-actions-slot.md`](header-actions-slot.md).

## What It Looks Like

Undo, redo, export are **quiet** ghost `sm` icon buttons. Dana is a **`Link`** styled with `interactiveGlassFlushChipClass` — not quiet `Button`, because Dana is an external public route (`/dana`), not an `AppView`.

| Control | Size | Label |
| --- | --- | --- |
| Undo / Redo / Export | `sm` (36×36) | Icon only |
| Dana | `h-9` chip | Icon; + label at `lg+` |

Hamburger menu Dana remains `primary` `fullWidth` with `href="/dana"` — see [`view-menu-dana.supplement.md`](../ui/nav/view-menu-dana.supplement.md).

## Where It Lives

`components/atoms/DesktopNavActions.tsx` — mounted in `DesktopNav` tab row, grid column 3 (`justify-end`).

## Actions

| # | User action | System response |
| --- | --- | --- |
| 1 | Undo | `onUndo()` |
| 2 | Redo | `onRedo()` |
| 3 | Export | `onExportAll()` |
| 4 | Dana | `Link` → `/dana` (leaves SPA) |
| 5 | Disabled undo/redo | `disabled` + reduced opacity |

## Component Hierarchy

```text
div[role=group, aria-label=Actions] (flex shrink-0, gap-1.5)
├── Button quiet sm — Undo
├── Button quiet sm — Redo
├── Button quiet sm — Export
└── Link[/dana] + interactiveGlassFlushChipClass
    ├── HeartHandshake icon
    └── span.hidden.lg:inline — menuCta label
```

## Dana control (normative)

| Property | Value |
| --- | --- |
| Component | Next.js `Link` — **MUST NOT** `Button` + `onChange("dana")` |
| Classes | `interactiveGlassFlushChipClass({ press: "md" })` + `h-9 rounded-xl px-2.5 lg:px-3` |
| `href` | `/dana` |
| Icon | `HeartHandshake` `size-4` |
| Label | `dana.menuCta`; `hidden lg:inline` |
| `aria-current` | **MUST NOT** — Dana is not `AppView` |

**Rationale:** Real URL for crawlability from app chrome and correct browser history when leaving SPA.

## Spacing

- Cluster: single row, uniform `gap-1.5` between all controls

## Acceptance Criteria

- [ ] Undo/redo/export: 36px targets, ghost idle
- [ ] Dana navigates to `/dana` without `setView`
- [ ] Dana label hidden below `lg`
- [ ] Export disabled when `people.length === 0`
- [ ] **MUST NOT** include `HeaderActionsSlot` (title row only)
