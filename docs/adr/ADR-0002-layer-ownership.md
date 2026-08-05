# ADR-0002: Layer ownership

**Status:** Accepted  
**Date:** 2026-08-05

## Layers (top → bottom)

```
organisms/     Product views — PersonCard, QuickLogView, …
atoms/         Timekeeper recipes — GlassMenu skin, IconButton, Surface consumers
components/ui/ Styled primitives on the engine — Menu, Popover, Select, Input
(engine)       react-aria-components — never imported outside ui/
lib/           Domain, tokens, surfaces — no JSX floating UI
```

## Import rules

| From | May import |
| --- | --- |
| `organisms/` | `atoms/`, `components/ui/`, `lib/` |
| `atoms/` | `components/ui/`, `lib/` — **not** `react-aria-components` |
| `components/ui/` | `react-aria-components`, `lib/`, `atoms/Surface` (glass skin only) |
| `lib/` | other `lib/` — no React components |

## Visual vs behavioral split

- **Look:** `lib/surfaces.ts`, `lib/user-feedback.ts`, `lib/focus-cues.ts`, `Surface`
- **Behavior:** `components/ui/*` (focus chain, overlay, collection keyboard)

`GlassMenu` is a **recipe**: it applies glass row styling to `ui/Menu` items. It
must not implement its own dismiss or position logic.

## ESLint enforcement

- `no-restricted-imports`: `react-aria-components` outside `components/ui/**`
- `no-restricted-syntax`: native `<select>`, forbidden input types, hand-rolled
  `role="menu"` / `role="listbox"` outside `components/ui/**`

## Exceptions (documented)

- `useDismissible` in `lib/` — row action reveal (inline disclosure, not floating).
  Not an overlay engine; do not use for menus or popovers.
