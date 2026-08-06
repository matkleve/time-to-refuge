# View menu — Dana primary action

Supplement to [desktop-header.md](desktop-header.md) · Parent menu: `ViewMenu` / `GlassMenu`

## What It Is

Hamburger menu primary CTA (“Support DRCE”) — full-width `primary` button at bottom of menu sections. **Navigates to `/dana`** via `href`, not `setView("dana")`.

## Contract

| Field | Value |
| --- | --- |
| `GlassMenuPrimaryAction.href` | `/dana` |
| `onSelect` | **MUST NOT** be set when `href` is set |
| Label | `dana.menuCta` from `content/dana.json` |
| Icon | `HeartHandshake` |
| `selected` | **N/A** — not an `AppView` |

## Implementation

| File | Role |
| --- | --- |
| `components/atoms/view-menu-sections.ts` | `buildViewMenuPrimaryAction()` |
| `components/atoms/glass-menu/MenuPrimaryAction.tsx` | Renders `Link` when `href` present |
| `components/atoms/glass-menu/types.ts` | Discriminated union: `href` xor `onSelect` |

## Visual contrast

| Surface | Variant | Notes |
| --- | --- | --- |
| Hamburger Dana CTA | `primary` `fullWidth` | Filled flag-blue |
| Desktop header Dana | `Link` + glass flush chip | Not `quiet` — see desktop-header AC |

## Acceptance Criteria

- [ ] Tap Dana in menu → navigates to `/dana` (full page load / client routing)
- [ ] Menu closes on navigation (Link default — no `onPrimarySelect` for href actions)
- [ ] **MUST NOT** reference `view === "dana"` in `AppView` comparisons
