# Interactive states audit — August 2026

Full-app screen of **how interaction is shown** today: shared primitives vs
custom one-offs, state coverage per control, and improvement approaches.

Companion to [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) §4 (interaction states /
ForJu `userFeedbackMode`) and the ship-gate checklist there. Not a re-litigation
of materials (`lib/surfaces.ts`) or motion timings ([`MOTION-AUDIT.md`](./MOTION-AUDIT.md)).

---

## Verdict

One shared feedback API exists (`userFeedbackClass` + `.user-feedback` wash +
`PressBounceRegister`), and most tappable chrome uses it. Drift is elsewhere:

1. **Selected / current / target** is three+ recipes (held wash, inset ring,
   material swap, outset ring).
2. **Armed destroy** is filled danger on `IconButton`, but light wash + red
   text in `GlassMenu` (PersonCard ⋯).
3. **Second hover recipes** (brightness, `hover:bg-white/40`, scale-only)
   sit next to the feedback wash — against §4 “don’t invent a second hover.”
4. Several editors kill the global focus ring with `focus:outline-none`.

Fix path: pick one of the three approaches in § Approaches, then close the
P0/P1 gaps in § Priority fixes — don’t add more one-off hover classes.

---

## Legend

| Mark | Meaning |
| --- | --- |
| **Y** | Visibly distinct and wired |
| **P** | Partial / alternate recipe / only in some modes |
| **N** | Missing or not applicable for this control |
| **—** | Layout-only / non-interactive |

States checked: idle · hover · pressed (bounce) · selected/open/target ·
armed-destroy · disabled · focus-visible · error/invalid · loading.

Shared feedback API = `userFeedbackClass({ press, on })` unless noted.

---

## 1. Shared primitives

| Control | Path | Feedback API | Idle | Hover | Press | Selected / open / target | Armed destroy | Disabled | Focus-vis | Error | Loading |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **IconButton** | `atoms/IconButton.tsx` | Shared (`press`, `feedbackOn`, `armed`) | Y | Y | Y | P — `feedbackOn` held wash only | Y — `bg-danger-600` filled chip | Y | Y | N | N |
| **GlassMenu trigger** | `atoms/GlassMenu.tsx` → IconButton | Shared + `feedbackOn={open}` | Y | Y | Y | Y — open held wash + blue glyph | N | N | Y | N | N |
| **GlassMenu row** | `GlassMenu.tsx` `MenuRows` | Shared **+** `hover:bg-white/40` | Y | P — dual hover | Y | Y — `selected` wash + `bg-white/55` | P — danger text + selected wash; **not** filled chip | Y | P — ring + local focus wash | N | N |
| **GlassMenu primary** | `GlassMenu.tsx` (Dana) | Shared + brightness + `--on-accent` | Y | P | Y | P — outset `ring-flagblue` when selected | N | N | Y | N | N |
| **GlassMenu icon footer** | Undo / Redo | IconButton | Y | Y | Y | N | N | Y | Y | N | N |
| **LiveClockButton** | `atoms/LiveClockButton.tsx` | Shared `press:lg` + brightness | Y — `primaryIdle` | P — only when armed | Y when armed | Y — armed → `primary` fill | N | Y — `disabled={!armed}` (idle **is** disabled) | Y when armed | N | P — saffron flash |
| **QuickLogButton** | `atoms/QuickLogButton.tsx` | Shared `press:lg` + brightness | Y — `accent` | P | Y | N | N | N | Y | N | P — blue flash |
| **DesktopNav page link** | `atoms/DesktopNav.tsx` | Shared `on: selected` | Y | Y | Y | Y — glass chip + held wash + `aria-current` | N | N | Y | N | N |
| **DesktopNav chrome** | same | IconButton | Y | Y | Y | Y — Dana `feedbackOn` | N | Y | Y | N | N |
| **BrandLockup** | `atoms/BrandLockup.tsx` | **None** — scale only | Y | P — `scale-[1.06]` | P — `scale-[0.97]`, no bounce | N | N | N | Y | N | N |
| **RetreatNameField** | `atoms/RetreatNameField.tsx` | Shared on idle button | Y | Y idle | Y idle | P — editing swaps shell | N | N | P — edit input `outline-none` | N | N |
| **TimezoneSelect** | `atoms/TimezoneSelect.tsx` | Shared on `<select>` | Y | Y | Y | P — native open only | N | N | P — chip variant `outline-none` | N | N |
| **AddRowTray** | `atoms/AddRowTray.tsx` | Shared on idle stamp | Y | Y | Y | P — open = input shell | N | P — Confirm disabled when empty | P — open input `outline-none` | N | N |
| **CancelConfirmTray** | `atoms/CancelConfirmTray.tsx` | IconButton ×2 | Y | Y | Y | N | N | Y Confirm | Y | N | N |
| **LocationCheck** | `atoms/LocationCheck.tsx` | Shared **+** badge `hover:bg-*` | Y | P — dual hover | Y | P — open without `feedbackOn` | N | N | Y | P — probe tones ≠ form invalid | Y — spinner |
| **GlassEmptyNote CTA** | `atoms/GlassEmptyNote.tsx` | Shared + often brightness | Y | P | Y | N | N | N | Y | N | N |
| **Surface** | `atoms/Surface.tsx` | — materials only | — | — | — | — | — | — | — | — | — |
| **RowActionTray / RowReveal** | `atoms/RowReveal.tsx` | — layout / motion only | — | — | — | open = width anim | — | — | — | — | — |
| **PageTitle** | `atoms/PageTitle.tsx` | — not interactive | — | — | — | — | — | — | — | — | — |

---

## 2. Custom / composed implementations

| Control | Path | Feedback API | Idle | Hover | Press | Selected / open / target | Armed destroy | Disabled | Focus-vis | Error | Loading |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Field stamp (empty)** | `organisms/PersonFields.tsx` | Shared `on: active` + inset ring | Y | Y | Y | Y — target / Jump-here: wash + inset ring + ink | N | N | Y | N | N |
| **Field stamp (filled)** | same | Shared; open via `aria-expanded` | Y | Y | Y | P — open held wash; target rare | Y — label+time red + Reset chip | N | Y | N | N |
| **Field time editor** | same | none on `<input>` | Y | N | N | Y editing | N | N | Y | Y — `aria-invalid` + danger border | N |
| **Field row actions** | → IconButton | IconButton | Y | Y | Y | P — copied saffron | Y Reset armed | N | Y | N | P — copy Check |
| **Fields name chip** | `organisms/FieldsPage.tsx` | Shared; bump animation | Y | Y | Y | P — edit shell; reorder bump | Y — name red when delete armed | P Up/Down | P — edit `outline-none` | N | N |
| **Fields Reset defaults** | same | IconButton `armed` | Y | Y | Y | N | Y chip (no row subject) | Y at default | Y | N | N |
| **PersonRailRow** | `organisms/PersonRailRow.tsx` | Shared `on: isCurrent` + card material | Y | Y | Y | Y — current fill + wash + `aria-current` | N | N | Y | N | N |
| **PersonCard name / ⋯** | `organisms/PersonCard.tsx` | GlassMenu arming | Y | Y | Y | Y menu `selected` | P — name red **Y**; menu row ≠ filled chip | Y empty actions | Y | N | N |
| **Quick Log row** | `organisms/QuickLogView.tsx` | Shared; `aria-expanded` | Y | Y | Y | Y open wash | Y time red + Trash chip; Clear-all | N | Y | N | N |
| **Dana copy / CTA** | `organisms/DanaPage.tsx` | Shared (+ brightness on CTAs) | Y | P | Y | N | N | N | Y | N | P — copied flash |
| **Session quiet nav** | `organisms/RefugeView.tsx` | IconButton `quiet` | Y | Y | Y | N | N | Y ends | Y | N | N |
| **AddPersonRow** | → `AddRowTray` | same as AddRowTray | Y | Y | Y | P | N | P | P | N | N |

---

## 3. How “the same” states are shown today

| Semantic | Recipes in use | Where |
| --- | --- | --- |
| **Hover** | Feedback wash · wash + brightness · wash + `bg-white/40` · scale-only · badge `hover:bg-*` | IconButton / CTAs / GlassMenu rows / BrandLockup / LocationCheck |
| **Pressed** | Bounce + active wash (shared) · scale-down only (Brand) | Most vs BrandLockup |
| **Selected / current** | `.is-feedback-on` · glass chip material · `card`→`cardCurrent` · inset blue ring · outset blue ring | Nav, rail, stamps, menu Dana |
| **Open (menu / tray)** | `feedbackOn` / `aria-expanded` held wash · plain input shell | GlassMenu vs Retreat/Add edit |
| **Record target** | Inset ring + held wash + ink + caption | PersonFields empty / Jump-here |
| **Armed destroy** | Filled `bg-danger-600` chip + subject `text-danger-600` · menu selected wash + `text-danger-700` | IconButton path vs PersonCard ⋯ |
| **Disabled** | Shared opacity 35% · LiveClock idle = disabled · `hideWhenDisabled` → opacity 0 | IconButton / LiveClock |
| **Focus** | Global `:focus-visible` ring · killed by `outline-none` on several editors | Retreat, Add, Fields rename, Timezone chip |
| **Error** | Form invalid on time edit only | PersonFields |
| **Loading** | LocationCheck spinner only; capture flashes ≠ loading | LocationCheck |

---

## 4. Approaches (pick one)

### A — Strict ForJu (`userFeedbackMode` everywhere)

Every tappable control uses **only** `userFeedbackClass` for hover/press/open.
No local `hover:bg-*`, brightness, or scale-as-feedback (Brand may keep scale
as *motion accent* only if documented as non-state).

- Selected = `.is-feedback-on` (± one shared inset-ring token for “target”).
- Armed destroy = IconButton filled danger + subject red — including menu rows.
- **Pros:** one mental model, matches design system §4.  
- **Cons:** GlassMenu / large CTAs lose current “extra” presence; needs visual QA.

### B — State token helper

Keep materials in `lib/surfaces.ts`. Add e.g.
`interactionStateClass("idle" | "selected" | "target" | "armedDestroy" | …)`
that returns the exact class set. Call sites pass **semantic** state; stop
hand-rolling combinations.

- **Pros:** encodes the three intentional recipes; easy to lint.  
- **Cons:** new API surface; migration pass across organisms.

### C — Three named recipes (document + lint)

Explicitly allow only:

| Recipe | Cue | Use |
| --- | --- | --- |
| **Chrome** | Wash + bounce | IconButton, nav, menus, chips |
| **Record target** | Wash + inset ring + ink + matching caption | Empty field / Jump-here |
| **Destroy arm** | Filled danger + subject `text-danger-600` | All two-tap destroy |

Named exceptions: large `actionClass` CTAs may keep brightness; BrandLockup
scale-only. Ban everything else. Fix `outline-none` editors with inset ring /
border focus instead of killing the global ring.

- **Pros:** matches how the app already feels; smallest code churn.  
- **Cons:** still three recipes — must stay disciplined.

**Recommendation:** **C now**, migrate toward **B** if a second product surface
appears. Do not invent a fourth hover.

---

## 5. Priority fixes

### P0 — ship-gate / invariant

| # | Gap | Fix |
| --- | --- | --- |
| 1 | PersonCard ⋯ armed ≠ filled danger chip | Menu danger arming uses same filled treatment as `IconButton.armed` (or a shared `armedDestroyClass`) |
| 2 | Editors kill focus ring | Drop `focus:outline-none` or replace with inset/border focus that survives glass |
| 3 | Dual hover on GlassMenu rows | Remove `hover:bg-white/40`; rely on feedback wash (+ keep selected fill if needed) |

### P1 — consistency

| # | Gap | Fix |
| --- | --- | --- |
| 4 | LiveClock idle = `disabled` | Prefer enabled-but-idle visual (`primaryIdle` without opacity death) if “tap does nothing” still needs a cue — or document disabled-as-idle as intentional |
| 5 | LocationCheck / CTA brightness + wash | Either fold brightness into a named CTA exception (§ Approaches C) or drop it |
| 6 | LocationCheck open without `feedbackOn` | Hold wash while panel open |
| 7 | BrandLockup outside feedback system | Document as scale-only exception, or add quiet wash |

### P2 — polish

| # | Gap | Fix |
| --- | --- | --- |
| 8 | Copy feedback one-offs | Shared `useCopyFeedback` (still open in component audit) |
| 9 | Outset ring on menu Dana selected | Prefer inset or chip material (overflow-safe) |
| 10 | No form-invalid pattern beyond time edit | Only add when a second field needs it |

---

## 6. Walk checklist (manual)

Before calling interaction work “done,” on phone + `md` desktop:

1. **UC-1:** empty target shows wash + inset ring; caption matches phase.  
2. **Jump-here:** same active cue as target while soft-confirm open.  
3. **Armed destroy:** subject text red **and** control filled danger — field reset, Quick Log delete, Fields delete, PersonCard delete/reset-all.  
4. **Hover (pointer):** one wash recipe on chips, stamps, nav, menu rows.  
5. **Focus-visible:** Tab through header, stamps, editors — ring always visible.  
6. **Disabled:** Undo empty stack, Fields at default, nav ends — opacity, no press.

---

## Related

- [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) §4 + Confirming / armed-subject gate  
- [`COMPONENT-AUDIT-2026-08.md`](./COMPONENT-AUDIT-2026-08.md) — DRY / atom inventory  
- [`UX-AUDIT-2026-08.md`](./UX-AUDIT-2026-08.md) — product UX  
- `lib/user-feedback.ts`, `app/globals.css` (`.user-feedback`), `PressBounceRegister`
