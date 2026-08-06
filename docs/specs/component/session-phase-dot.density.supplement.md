# Session phase dot — density supplement

Parent: [`session-phase-dot.md`](session-phase-dot.md)

Normative geometry for fitting up to **8** field circles inside `WORKSPACE_RAIL` without horizontal clip.

## Problem

Rail width is fixed (`w-64` / `lg:w-72` / `xl:w-80` in `lib/chrome.ts`). Row inner padding is `px-3` (24px total). The person name and dot cluster share one flex row (`gap-2` between them).

At the old fixed **28px** circles with **6px** gaps, eight dots alone need **266px** — wider than the narrowest rail content box. Density **MUST** step down as field count rises.

## Tier lookup

Implemented in `lib/session-phase-dot-size.ts`:

```text
sessionPhaseDotDensity(fieldCount):
  fieldCount ≤ 4  → comfortable
  fieldCount ≤ 6  → cozy
  fieldCount ≥ 7  → compact
```

`fieldCount` is `fields.length` on the row (1…`MAX_FIELDS`). All dots in the row use the returned tier.

## Size tokens (MUST match code)

| Tier | When | Circle (Tailwind) | px | Check icon | px | Cluster gap | px | Check stroke |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `comfortable` | 1–4 fields | `size-7` | 28 | `size-3.5` | 14 | `gap-1.5` | 6 | 2.5 |
| `cozy` | 5–6 fields | `size-6` | 24 | `size-3` | 12 | `gap-1` | 4 | 2.5 |
| `compact` | 7–8 fields | `size-5` | 20 | `size-2.5` | 10 | `gap-1` | 4 | 2.25 |

Border: `border-2` on all tiers (included in circle box size above).

## Cluster width budget

Formula: `n × dotPx + (n − 1) × gapPx`

| Fields | Tier | Cluster width |
| --- | --- | --- |
| 3 | comfortable | 96px |
| 4 | comfortable | 130px |
| 6 | cozy | 164px |
| 8 | compact | **188px** |

### Rail content box (row `w-full` inside rail, after `px-3`)

| Breakpoint | Rail | Inner row width ≈ | Name budget at 8 fields ≈ |
| --- | --- | --- | --- |
| `md` | `w-64` (256px) | 232px | 36px (after `gap-2` + 188px cluster) |
| `lg` | `w-72` (288px) | 264px | 68px |
| `xl` | `w-80` (320px) | 296px | 100px |

Name **MUST** truncate (`truncate`) rather than forcing dots smaller than the tier. Long names ellipsize; dots stay legible and tappable.

## What does not scale

| Item | Rule |
| --- | --- |
| Row min height | `min-h-12` (48px) — unchanged |
| Row shell press | Whole-row bounce on `SessionPersonRow` glass shell |
| Dot press | Per-dot `press: "sm"` bounce |
| Armed styling | None on rail dots (see parent F-01) |
| Mobile | Dots not shown — `PersonCard` field rows own mobile Session UX |

## Showcase oracle

`/dev/components` → **Session rail (8 fields)** — row constrained to `w-64`, `DEMO_FIELDS_EIGHT`, one partially filled person. Visual check for compact tier fit.

## Future changes

If `MAX_FIELDS` or `WORKSPACE_RAIL` widths change, re-run the cluster-width table and adjust tier breakpoints in `session-phase-dot-size.ts` + this supplement together. **MUST NOT** change one without the other.
