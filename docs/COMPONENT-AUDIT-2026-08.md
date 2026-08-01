# Component / UI DRY audit — August 2026

Pass after unified `PersonCard`, open-backdrop pages, and `PageTitle`.
Scope: `components/*`, `app/page.tsx`, `lib/surfaces.ts`, `lib/user-feedback.ts`.

---

## Verdict

Most ceremony UI is already shared (surfaces, `PageTitle`, `IconButton`, row
reveal, armed deletes, one person card). Remaining debt is **recipe-level**:
add-row trays, armed-danger chip classes, empty glass notes, list-page chrome,
and copy/confirm clusters. Prefer small helpers on existing atoms over a new
component zoo.

---

## Inventory — already shared (keep)

| Piece | Path |
| --- | --- |
| Materials | `lib/surfaces.ts` |
| Interaction wash | `lib/user-feedback.ts` |
| Surface | `components/atoms/Surface.tsx` |
| Page heading | `components/atoms/PageTitle.tsx` |
| Icon / glass chip | `components/atoms/IconButton.tsx` |
| Row reveal | `components/atoms/RowReveal.tsx` |
| Armed destroy | `lib/use-armed-action.ts` |
| Menus | `GlassMenu`, `ViewMenu` |
| Session chips | `RetreatNameField`, `TimezoneSelect` |
| Capture CTAs | `LiveClockButton`, `QuickLogButton` |
| Person stack | `PersonCard` → `PersonFields`; `PersonRailRow` |
| Shells | `AppShell`, `DesktopShell`, `PageEnter` |
| Dana meter | `DanaProgress` |

---

## Candidates (severity)

### P0
1. **`AddRowTray`** — `AddPersonRow` ≈ Fields “Add field” tray  
2. **`IconButton` `armed`** — identical danger ring class in PersonFields / Quick Log / Fields  
3. **`GlassEmptyNote`** — Refuge empty, desktop empty, History empty, Quick Log hint  

### P1
4. **`ListPageFrame`** — History / Fields / Dana outer chrome  
5. **`CancelConfirmTray`** — Add trays + Jump-here  
6. **`useCopyFeedback`** — PersonFields / Quick Log / Dana  
7. **`ActionButton` / `actionButtonClass`** — empty CTA + Dana CTA  

### P2
8. Shared `useLiveClock` / `ClockFace` (keep product wrappers separate)  
9. Prefer `Surface` for static glass panels (Dana bank, History rows)  

---

## Do not unify

- `PersonCard` vs `PersonRailRow`  
- `LiveClockButton` vs `QuickLogButton` as products  
- `glassRowClass` (on card) vs `glassClass("card")` (stamps on photo)  
- Desktop rail “People” caption vs `PageTitle`  
- Dana `CopyRow` layout vs field copy chips (share hook only)  

---

## Fix order

1. `IconButton` `armed` — **done**  
2. `CancelConfirmTray` — **done**  
3. `AddRowTray` — **done** (People + Fields)  
4. `GlassEmptyNote` — **done**  
5. `ListPageFrame` — **done** (History / Fields / Dana)  
6. `useCopyFeedback` — open  
7. `actionButtonClass` — open  
8. Clock face extract — later  

---

## Shipped in this pass

| Atom | Used by |
| --- | --- |
| `IconButton.armed` | PersonFields, Quick Log, Fields |
| `CancelConfirmTray` | AddRowTray, Jump-here |
| `AddRowTray` | AddPersonRow, FieldsPage |
| `GlassEmptyNote` | Refuge empty, desktop empty, History, Quick Log |
| `ListPageFrame` | History, Fields, Dana |
