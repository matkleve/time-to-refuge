# UX audit — August 2026

Pass over the ceremony timing app after Custom Fields, unified `PersonCard`,
People open-backdrop chrome, and Quick Log header cleanup. Extends
[`UX-AUDIT.md`](./UX-AUDIT.md) (contrast / controls / motion foundations) —
those fixes are treated as shipped and are not re-litigated.

Screens reviewed: Refuge (mobile + desktop), People, Quick Log, History,
Fields, Dana; chrome in `app/page.tsx` + `ViewMenu`.

**Primary context: phone.** Desktop is secondary but must not break the
timekeeper path (UC-1 / UC-4).

---

## 1. Verdict

Phone-first Refuge still reads as a ceremony record: live clock, glass card,
one-tap capture, and the new People / Quick Log chrome (open backdrop, page
title, retreat / timezone chips) feel calmer than the old full-sheet overlays.
Custom Fields and the unified list card keep the Three-Jewels model intact on
mobile. **Desktop was the regression risk:** the Refuge left rail had mounted
full-size `PersonCard`s, so quick-switch under time pressure competed with
edit / reset / delete. That rail is being restored to a compact switcher; see
§6.

---

## 2. What's working

- **UC-1 core path (phone):** Record targeting, Jump-here soft confirm, armed
  two-tap destroys, capture flash.
- **Unified `PersonCard`:** One component for Refuge focus and People list;
  Eye is list-only (`onOpenPerson`).
- **People chrome:** Open backdrop; **People** title + retreat chip in shell
  subheader (§6c).
- **Quick Log chrome:** Title + Clear; plain “N logged”; timezone chip; no
  glass header bar.
- **Fields page:** Rename / reorder / add / armed delete with glass-row vocab.
- **Foundations from the prior audit:** contrast tokens, `IconButton` floors,
  focus ring, page entrances, row trays, surfaces module.

---

## 3. Severity-ranked issues

### P0

**Desktop rail is not a switcher — navigation for completed people buried**
- **Problem:** §3b / UC-4: desktop nav is “click someone in the list.” Full
  cards put Eye inside a filled-row tray; empty fields jump via `onOpenAt`.
- **Where:** `DesktopWorkspace.tsx`, `PersonCard` / `PersonFields`.
- **Phone vs desktop:** Desktop only.
- **Fix:** Compact rail row — tap name/row selects person. Full card only in
  the main pane (and on the People page).

**Full-size cards in the desktop Refuge rail overload UC-1**
- **Problem:** Rail entries duplicated the focused card (fields, ⋯, Reset /
  Delete) beside the live record button.
- **Where:** `DesktopWorkspace.tsx` left rail.
- **Phone vs desktop:** Desktop Refuge only.
- **Fix:** Same as above — compact switcher only.

### P1

**Retreat caption repeats on every list card**
- **Problem:** §6c: caption is for the focused card; chip already shows the
  retreat name above.
- **Where:** `PersonCard.tsx`.
- **Fix:** Show caption only when not in a list context (`onOpenPerson` absent).

**Page chrome split: open-backdrop vs full glass sheet**
- **Problem:** People / Quick Log are open-backdrop; History / Fields / Dana
  still use a full-height inner `glass-panel` + `text-lg` title bar.
- **Where:** `HistoryPanel`, `FieldsPage`, `DanaPage` vs People / Quick Log.
- **Fix:** Match People/Quick Log chrome (title in page head / subheader,
  content on open backdrop).

**Deleting a custom field silently drops recorded times**
- **Problem:** Armed delete confirms UI, not data loss; `syncPersonTimes`
  drops orphan keys with no undo.
- **Where:** `FieldsPage` → `handleFieldsChange`.
- **Fix:** If any person has a stamp on that field, confirm copy must name
  the data loss.

### P2

**Arrow keys change person index on every AppView**
- **Where:** `app/page.tsx` keydown.
- **Fix:** Only when `view === "refuge"` (and focus not in an input).

**Dana bank block hand-rolls glass fill**
- **Where:** `DanaPage.tsx` (`bg-white/40`).
- **Fix:** Use `Surface` / `glassClass`.

**History unfilterable**
- **Where:** `HistoryPanel.tsx`.
- **Fix:** Person / field filter chips (read-only).

---

## 4. Page chrome consistency matrix

| Page | Current (at audit) | Target |
| --- | --- | --- |
| **Refuge** | Brand header; retreat chip; open backdrop; mobile carousel / desktop rail + card | Keep. Desktop rail = compact switcher. Retreat caption on focused card only. |
| **People** | Title + retreat chip; open backdrop; full cards | Keep. No retreat caption on list cards. |
| **Quick Log** | In-page title + Clear; count; timezone chip; open backdrop | Keep — template for utility pages. |
| **History** | Full glass sheet + inner `text-lg` title | Open backdrop + `text-2xl` title (People/Quick Log pattern). |
| **Fields** | Full glass sheet + title + blurb | Same open-backdrop + title; keep blurb under title. |
| **Dana** | Full glass sheet; desktop `max-w-xl` wrapper | Same title/backdrop pattern; system surfaces only. |

**Shared rules:** one brand toolbar; page title absent (Refuge) or
`font-display text-2xl`; session chips (retreat / timezone) as large left
glass chips under the title where relevant; body on open backdrop — never a
second full-viewport glass “app inside the app.”

---

## 5. Desktop-specific risks

- Rail height scales with roster × field count (custom fields amplify).
- Destructive actions in a switcher list invite mistaps beside the record button.
- Duplicated current person (rail + main) confuses source of truth.
- Eye-in-tray selection breaks §3b pointer model.
- Dana max-width special case without the same for History/Fields.

---

## 6. Recommended fix order

1. Compact desktop Refuge rail (select-on-click; no full `PersonCard` in rail).
2. Retreat caption only on focused recording card.
3. Unify History / Fields / Dana chrome to open-backdrop + shared title pattern.
4. Field-delete confirm when times exist.
5. Scope arrow-key person nav to Refuge.
6. Dana bank block → system surfaces; History filters later.
