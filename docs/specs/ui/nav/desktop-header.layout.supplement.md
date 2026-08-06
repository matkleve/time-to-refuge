# Desktop header — Layout supplement

Parent: [`desktop-header.md`](desktop-header.md)

Normative geometry for the shipped header. Tab row uses a **flex row**; nav pages add a **title row** below.

## Tab row container

| Property | Value |
| --- | --- |
| Display | `flex items-center` |
| Align | `items-center` |
| Min height | `min-h-12` (48px) |
| Gap | `gap-x-2 sm:gap-x-3` |
| Width | `w-full` |
| Pointer events | `pointer-events-auto` on row only |

Parent header remains `pointer-events-none`; scrim and outer wrapper unchanged.

## Tab row — three zones

```text
┌────────────────────────────────────────────────────────────────── app-content ──┐
│  flex min-h-12                                                                  │
│                                                                                 │
│  [Brand shrink-0]     [@container/nav flex-1 · DesktopNavPages]  [Actions end]  │
│  ⏱️ Timekeeper              Fields · People · Session …            ↶ ↷ │ ⬇ Dana │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Left — brand

| Property | Value |
| --- | --- |
| Placement | `shrink-0`, `flex justify-start` |
| Overflow | `overflow-visible` |
| Spec | [`brand.md`](../../component/brand.md) |

### Middle — page tabs

| Property | Value |
| --- | --- |
| Placement | `flex-1 min-w-0`, `@container/nav`, `justify-center` |
| Pointer events | `pointer-events-auto` on `<nav>` |
| Whitespace | `flex-nowrap` — **MUST NOT** wrap tabs to second line |
| Overflow | **MUST NOT** `overflow-x-auto` on nav |
| Labels | `labelCollapse="nav"` — icons only below `30rem` slot width |

Tabs are grouped in the middle flex slot — constrained between brand and actions, not viewport-centered via symmetric grid tracks.

### Right — global actions

| Property | Value |
| --- | --- |
| Placement | `shrink-0`, `flex justify-end` |
| Overflow | `overflow-visible` |
| Gap | `BUTTON_CLUSTER_GAP` (`gap-1.5`) |
| Spec | [`desktop-nav-actions.md`](../../component/desktop-nav-actions.md) |

**MUST NOT** mount [`HeaderActionsSlot`](../../component/header-actions-slot.md) on this row — view actions live on the title row.

## Title row (nav pages only)

Rendered when `isNavPageView(view)` (`fields`, `people`, `refuge`, `quicklog`, `history`).

| Property | Value |
| --- | --- |
| Display | `flex min-h-12 items-center justify-between gap-3` |
| Padding | `pb-1` on row |
| Left | `NavPageTitle` in `pointer-events-none min-w-0 flex-1` wrapper |
| Right | `HeaderActionsSlot` in `pointer-events-auto shrink-0` |

Spec: [`nav-page-title.md`](../../component/nav-page-title.md) · [`header-actions-slot.md`](../../component/header-actions-slot.md)

## Scrim band

| `view` | `HeaderScrim` |
| --- | --- |
| Home / non-nav | `HEADER_SCRIM_HEIGHT` (4.75rem md+) |
| Nav page | `HEADER_SCRIM_EXTENDED_HEIGHT` (+ `DESKTOP_PAGE_TITLE_BAND` 3.5rem) |

## Collision rules (tablet `md`–`1023px`)

When brand + icon tabs + actions exceed row width:

1. **MUST** keep icon-only tabs when nav slot &lt; `30rem` (`labelCollapse="nav"`).
2. **MUST NOT** shrink tab hit area below 44×44px.
3. **MUST NOT** let tabs overlap brand or global actions — middle slot constrains width.

## Forbidden

| ID | MUST NOT |
| --- | --- |
| L-01 | `HeaderActionsSlot` on the tab row (belongs on title row) |
| L-02 | Absolute positioning for tab cluster (use flex middle slot) |
| L-03 | Horizontal scroll on header row |
| L-04 | Second scrim / title scrim below `HeaderScrim` |

## Acceptance Criteria

- [ ] Brand left edge aligns with Fields list gutter (`app-content` padding)
- [ ] Global actions right edge aligns with list right gutter
- [ ] 768px: five icon tabs visible without horizontal scroll
- [ ] Nav pages: title row visible; scrim `extended`
