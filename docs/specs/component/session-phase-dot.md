# Session phase dot (rail field circle)

Parent: `docs/DESIGN-SYSTEM.md` §3b (Session progress rail) · `WORKSPACE_RAIL` in `lib/chrome.ts`

**Supplement:** [`session-phase-dot.density.supplement.md`](session-phase-dot.density.supplement.md)

## What It Is

Tappable status circle in the Session / People **progress rail** (`SessionPersonRow`). One dot per field (up to `MAX_FIELDS` = 8). Shows whether that field has been recorded for the person on the row.

Rail dots are **progress indicators**, not armed-row mirrors: they do not show PersonCard target outline. Tap arms that field on the focused person via `onSelectPhase`.

## What It Looks Like

| State | Fill | Border | Check |
| --- | --- | --- | --- |
| Empty | `bg-white/35` | `border-ink/25` (`border-2`) | Lucide `Check`, `opacity-0` |
| Recorded | `bg-saffron-400/55` | `border-transparent` | Same icon, `opacity-100`, `text-ink` |

Shape: `rounded-full`. Host: `inline-flex items-center justify-center shrink-0`.

**Density:** all dots in a row share one tier derived from `fields.length` (1–4 comfortable · 5–6 cozy · 7–8 compact). Person name truncates; dot cluster does **not** shrink below its tier size. Full geometry: supplement.

## Where It Lives

| File | Role |
| --- | --- |
| `components/organisms/SessionPhaseDot.tsx` | Circle button |
| `components/organisms/SessionPersonRow.tsx` | Row host — computes density, lays out cluster |
| `lib/session-phase-dot-size.ts` | Tier lookup + size tokens (**normative**) |
| `lib/interactive-glass.ts` | `interactiveSessionPhaseDotClass` |

Mounted inside `WORKSPACE_RAIL` via `DesktopWorkspace` (Session) and `DesktopPeopleWorkspace` (People). **Not** used on mobile `RefugeCarousel` / `PersonCard` field rows.

## Actions

| # | User action | System response | Triggers |
| --- | --- | --- | --- |
| 1 | Tap empty dot | `onSelectPhase(fieldId)` | Arms field on focused person |
| 2 | Tap recorded dot | Same | Re-arm for re-record |
| 3 | Pointer down on dot | Press bounce (`user-feedback`, `press: "sm"`) | `interactiveSessionPhaseDotClass` |
| 4 | Recorded ↔ empty | Keyframed `feedback-press-bounce` on dot | `SessionPhaseDot` `useEffect` on `filled` |

## Component Hierarchy

```text
SessionPersonRow [glass flush card shell — bounce on whole row]
├── button [person name — flex-1 min-w-0 truncate]
└── ul.flex.shrink-0 [gap from density tier] aria-label="Field progress"
    └── li × fields.length
        └── SessionPhaseDot
            └── Check (lucide, aria-hidden)
```

## State

| State | Type | Default | Effect |
| --- | --- | --- | --- |
| `filled` | `boolean` | — | Recorded vs empty visuals |
| `density` | `comfortable` \| `cozy` \| `compact` | `comfortable` | Circle, icon, cluster gap (from host row) |

Host row derives `density` from `sessionPhaseDotDensity(fields.length)` — **MUST NOT** mix tiers within one row.

## API (normative)

### `SessionPhaseDot`

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `filled` | `boolean` | yes | — |
| `density` | `SessionPhaseDotDensity` | no | `comfortable` |
| `title` | `string` | yes | Field label (`title` attr) |
| `ariaLabel` | `string` | yes | Full action phrase |
| `onSelect` | `() => void` | yes | Tap handler |

### `SessionPersonRow` (host contract)

| Rule | Value |
| --- | --- |
| Density source | `sessionPhaseDotDensity(fields.length)` |
| Cluster gap | `SESSION_PHASE_DOT_SIZE[density].gap` |
| Cluster layout | `flex shrink-0 items-center` on `ul` |
| Name layout | `min-w-0 flex-1 truncate` — yields space before shrinking dots |

## Forbidden (recurring bugs)

| ID | MUST NOT |
| --- | --- |
| F-01 | PersonCard armed-row ring / saffron outline on rail dots |
| F-02 | Per-dot density — tier is per **row**, keyed on total field count |
| F-03 | `overflow-x-auto` on dot cluster (compress via tier, not scroll) |
| F-04 | Fixed `size-7` when `fields.length` > 4 (clips rail at 8 fields) |
| F-05 | Import `userFeedbackClass` directly in `SessionPhaseDot` (use `interactiveSessionPhaseDotClass`) |

## Visual Behavior Contract

| Behavior | Owner | Selector / token | Test oracle |
| --- | --- | --- | --- |
| Idle material | `SessionPhaseDot` button | `interactiveSessionPhaseDotClass` | `/dev/components` Session rail |
| Press bounce | same host | `user-feedback` + `press: "sm"` | `npm run a11y:interactive` |
| Fill toggle bounce | same host | `is-press-bounce` on `filled` change | Record / clear field in Session |
| Density tier | `SessionPersonRow` | `lib/session-phase-dot-size.ts` | 8-field showcase row |

## File Map

| File | Purpose |
| --- | --- |
| `session-phase-dot-size.ts` | `sessionPhaseDotDensity`, `SESSION_PHASE_DOT_SIZE` |
| `interactive-glass.ts` | Dot border/fill classes + feedback pairing |
| `SessionPhaseDot.tsx` | Button host, check icon, fill animation |
| `SessionPersonRow.tsx` | Row shell, density pass-through |

## Acceptance Criteria

- [ ] Default 3 fields: 28px circles, 6px gaps — unchanged from pre-density look
- [ ] 8 fields: compact tier (20px circles, 4px gaps); cluster ≤ ~188px; fits `w-64` rail with truncated name
- [ ] Empty = ring only; recorded = saffron fill + visible check
- [ ] Tap: whole dot bounces (`npm run a11y:interactive`)
- [ ] Toggle recorded ↔ empty replays bounce without PersonCard armed styling
- [ ] `/dev/components` — “Session rail (8 fields)” row matches compact tier

## Interaction emphasis

- Canonical: `docs/DESIGN-SYSTEM.md` §4 · `lib/interactive-glass.ts`
- [ ] Material + `userFeedbackClass` on **one** element — the `SessionPhaseDot` button, not the check child
