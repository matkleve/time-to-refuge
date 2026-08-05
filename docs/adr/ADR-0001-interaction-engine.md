# ADR-0001: One interaction engine — React Aria Components

**Status:** Accepted  
**Date:** 2026-08-05

## Context

Timekeeper ships custom floating UI (`GlassMenu`, `TimezoneSelect`, `LocationCheck`)
with hand-rolled portal positioning, pointer dismiss, and keyboard handling spread
across multiple hooks (`useGlassMenu`, `useGlassMenuDismiss`, `popover-placement`).
Each fix in one place does not propagate — agents reinvent `absolute top-full` and
native `<select>` on the next feature.

The visual language (cloudy glass in `lib/surfaces.ts`) is correct and must not
change. The problem is **behavior without a shared engine**.

## Decision

**React Aria Components (RAC)** is the single interaction engine for:

- Popover / floating panels (position, portal, dismiss, escape)
- Menu (keyboard, typeahead, focus)
- Select / ListBox (timezone picker and future comboboxes)
- Dialog (future confirmations)
- TextField / Input (shared text-input behavior)
- TimeField (future — millisecond time edit on field rows)

## Rejected alternatives

| Option | Why not |
| --- | --- |
| Radix UI | No Calendar/DatePicker/Combobox/TimeField — gaps filled with point libraries |
| react-day-picker as add-on | Second focus model, second positioning engine — boundary violation |
| Native `<select>`, `<input type="date/time">` | Not styleable; inconsistent with glass chrome |
| Keep hand-rolled hooks | Proven to regress — fixes do not propagate |

## Consequences

- `react-aria-components` is added as a production dependency.
- RAC imports are **only** allowed in `components/ui/**`.
- App code (`atoms/`, `organisms/`) imports styled primitives from `components/ui/`.
- Glass skin stays in `lib/surfaces.ts` + `Surface` — RAC is unstyled underneath.
- `lib/popover-placement.ts` and menu dismiss hooks are removed once all consumers
  migrate to `components/ui/Popover`.

## Invariant

> **One problem domain = one engine.** A point library for a point problem is a
> boundary violation, not a shortcut.
