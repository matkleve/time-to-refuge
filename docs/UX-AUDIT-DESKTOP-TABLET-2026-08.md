# UX audit — desktop & tablet (August 2026)

Pass focused **only** on tablet (`768–1023`) and desktop (`≥1024`). Phone
shell (`AppShell` / `max-w-md`) is out of scope except where it explains a
shared component. Companion to [`UX-AUDIT-2026-08.md`](./UX-AUDIT-2026-08.md)
(phone-primary) and [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) §3b.

**Code facts at audit time**
- Shell switch: `useMediaQuery("(min-width: 768px)")` → `DesktopShell` +
  `DesktopNav` (not Tailwind `lg`).
- Content clamp: `.app-content` = `max-width: clamp(22rem, 94vw, 68rem)` —
  nav and main share one column.
- Session: compact `PersonRailRow` rail (`w-56` → `lg:w-72`) + focused
  `PersonCard` + `LiveClockButton` (`max-w-xl`). No carousel.
- Page titles: hidden on Session/People when desktop; still rendered inside
  Fields / History / Quick Log / Dana.

---

## 1. Verdict

Desktop Session is now a credible UC-1 surface: compact rail switcher, one
focused card, live record clock, undo/redo always reachable. The shared
clamp and open-backdrop chrome keep the glass/light identity intact. **The
weak spot is the classic centered top nav under tablet width**, plus utility
pages that still sit as phone-width columns inside a wide frame — so tablet
feels like a stretched phone with a crowded toolbar, and large desktop
wastes the clamp outside Session.

---

## 2. What’s working

- **Desktop Session model matches §3b / UC-4:** click rail to switch; no
  carousel; full edit stays on the focused card / People page.
- **Compact `PersonRailRow`:** name + completion only — prior P0 rail
  overload is resolved; UC-1 isn’t competing with Reset/Delete in the list.
- **Always-visible Undo / Redo** on the desktop toolbar (UC-3 mistap path)
  beats burying them in the mobile hamburger footer.
- **Brand lockup** (`text-2xl` wordmark) + progressive header scrim: brand
  reads as chrome, titles stay sharp below the blur.
- **Retreat chip** under Session/People without a duplicate page title on
  desktop — correct hierarchy for ceremony setup.
- **Open-backdrop utility pages** (History / Fields / Dana / Quick Log /
  People) — no second full-viewport glass “app inside the app.”
- **Pointer affordances** (hover wash, press bounce, `:focus-visible`) suit
  mouse/trackpad without inventing a second control language.
- **Shared targeting** via `usePhaseTarget` — armed phase can’t diverge
  between mobile and desktop trees.

---

## 3. Issues

### High — Tablet primary nav: too many peers in one row
- **Device:** tablet (also frays at the low end of desktop ~1024).
- **Problem:** Brand (absolute left, `max-w-[40%]`) · five page icons
  (centered) · Undo / Redo / Export · Dana CTA (absolute right). Labels
  hide below `lg`; Dana is icon-only until `lg`. Nav admits
  `overflow-x-auto` — a confession the row doesn’t fit.
- **Why it hurts:** Classic centered navbar assumes ~desktop width. At
  ~768–900px the three absolute zones collide: brand truncates, icons crowd
  the wordmark / utilities, touch targets sit edge-to-edge. Touch tablets
  get no hover `title` for icon-only pages — Users vs Contact (Session vs
  People) is easy to mis-hit under ceremony pressure.
- **Recommendation:** Treat **tablet as its own chrome band**, not
  “desktop with labels off.” Options that stay on-brief: (a) drop Export
  (and optionally Dana) behind a compact Actions/⋯ cluster so the five
  destinations keep breathing room; (b) left-align page links after the
  brand (abandon true center) so left/right absolutes stop fighting the
  middle; (c) keep icon+short label from `md` up if you can free space via
  (a). Do **not** add a second hamburger that reintroduces the phone menu
  as the primary desktop path.

### High — Utility pages remain phone columns inside the clamp
- **Device:** both (worst on desktop ≥1280).
- **Problem:** History, Fields, Dana, Quick Log body lists/CTAs clamp to
  `max-w-md` (~28rem). People uses `max-w-xl`. Session uses rail +
  `max-w-xl`. The shell offers up to **68rem**.
- **Why it hurts:** On a wide display the eye lands on a narrow strip
  floating in empty backdrop — reads as “mobile UI parked in a window,”
  not a designed desktop layout. Dana’s full-bleed photo fights that
  narrow copy column awkwardly under the shared clamp.
- **Recommendation:** One **desktop content width token** for utility
  pages (e.g. align to Session’s `max-w-xl`, or a modest two-column only
  where scannable: History list + detail). Don’t stretch rows edge-to-edge
  to 68rem — keep ceremony typography readable; just stop pretending every
  page is still `max-w-md`.

### Medium — Page title policy is inconsistent
- **Device:** both.
- **Problem:** Session/People correctly omit `PageTitle` when `isDesktop`
  (nav names the page). Fields, History, Quick Log, Dana still render
  centered `text-2xl` titles under the same nav that already shows the
  page (with labels at `lg+`).
- **Why it hurts:** Double labeling burns vertical space above the record
  / list surface; on tablet that space is scarce under the fixed
  `pt-[4.5rem]` toolbar + optional retreat chip.
- **Recommendation:** Same rule everywhere: **desktop nav = page name**;
  keep in-page title only when it carries a trailing control that needs a
  labeled row (Quick Log Clear, Fields Reset) — then prefer a compact
  actions row without repeating the word “Quick Log” / “Fields” at
  `text-2xl`, or show the title only below `lg` if labels are icon-only.

### Medium — Icon-only page strip is weak for touch selection
- **Device:** tablet.
- **Problem:** Below `lg`, five destinations are icon + `aria-label` /
  `title` only. Selected state is ink vs muted on the same pill — no
  text, no stronger selected surface beyond `userFeedbackClass({ on })`.
- **Why it hurts:** During UC-1 the timekeeper may glance up to confirm
  they’re still on Session. Icon-only + subtle selected state is a phone
  overflow pattern, not a glanceable desktop section mark.
- **Recommendation:** Stronger selected treatment (e.g. glass chip fill /
  ink weight already implied by `on`) **plus** short labels as soon as
  width allows — or reserve icon-only for a collapsed Actions group, not
  for the five primary destinations.

### Medium — Session layout squeezes at tablet start of range
- **Device:** tablet (~768–900).
- **Problem:** Rail fixed `w-56` (14rem) + gaps + focused column
  `max-w-xl`, inside `app-content` ≈ 94vw with horizontal padding. Retreat
  chip and toolbar already consume vertical chrome; horizontal leftover
  for the card/clock is tight.
- **Why it hurts:** UC-1 needs the record button and field stamps
  comfortable. A cramped card next to a 14rem rail on a 768px iPad
  portrait-ish window raises mistap risk on field trays and Check zone.
- **Recommendation:** Below `lg`, consider a slightly narrower rail
  (`w-48` / name-only denser padding) or collapsing the rail to a
  compact select/list overlay only when width &lt; ~900px — without
  bringing back full `PersonCard`s in the rail. Prefer keeping the
  persistent list if at all possible; shrink before you hide.

### Medium — Docs / breakpoint drift (§3b vs code)
- **Device:** both (authoring risk).
- **Problem:** `DESIGN-SYSTEM.md` §3b still describes DesktopShell at
  **`lg` (1024+)**. Code and `AppShell` comments correctly switch at
  **768 (`md`)**.
- **Why it hurts:** Future work “for desktop only” may ship assuming
  tablets still see `AppShell` + carousel — they don’t. Tablet inherits
  every DesktopNav / DesktopWorkspace decision.
- **Recommendation:** Update §3b to match `min-width: 768px`, and name
  tablet explicitly as the stressed band for nav density.

### Low — Nested horizontal padding on utility pages
- **Device:** both.
- **Problem:** `app-content` (`px-4` / `sm:px-5`) + `ListPageFrame` /
  page-local `px-*` stack.
- **Why it hurts:** Content inset drifts page-to-page; Session feels
  differently padded than History/Fields.
- **Recommendation:** One shell padding owner; pages add only internal
  gaps.

### Low — Quick Log “tap anywhere” on a wide pointer surface
- **Device:** desktop (tablet secondary).
- **Problem:** Full-slot `onClick={handleLog}` was designed for phone
  thumb convenience. On a large clamp, empty backdrop beside the
  `max-w-md` column is still a capture target.
- **Why it hurts:** Accidental logs while aiming at Clear / timezone /
  scroll — low ceremony pressure on Quick Log, but noisy History and
  undo stack.
- **Recommendation:** On `(pointer: fine)` or `isDesktop`, disable
  page-wide capture; keep the hero `QuickLogButton` as the only stamp
  control. Preserve tap-anywhere on coarse pointers if desired.

### Low — Dana primary CTA competes with Session chrome
- **Device:** both.
- **Problem:** Filled flag-blue Dana control sits permanently in the
  top-right of the recording chrome.
- **Why it hurts:** Same accent family as the record button; on tablet
  (icon-only) it’s an unexplained heart-handshake beside Export.
- **Recommendation:** Keep Dana reachable, demote visual weight in the
  Session context — quiet glass chip in an Actions cluster, or full
  primary treatment only when `view === "dana"`. Don’t remove the
  destination; reduce permanent competition with UC-1.

---

## 4. Priority fix order

1. **Relieve tablet nav density** — free horizontal space (cluster
   Export/Dana; reconsider true-center absolute layout); restore glanceable
   Session selection.
2. **Widen utility page content** to Session/`max-w-xl` (or equivalent)
   so desktop isn’t a phone column in a 68rem frame.
3. **Unify desktop page-title policy** with Session/People (nav owns the
   name; trailing actions don’t need a second hero title).
4. **Tune Session rail width below `lg`** so card + clock stay comfortable
   at ~768–900.
5. **Align DESIGN-SYSTEM §3b** with the 768 shell switch; call out tablet.
6. **Desktop Quick Log:** pointer-fine → button-only capture.
7. **Padding ownership** + Dana visual demotion in the toolbar.

---

## 5. Out of scope

Phone carousel / hamburger IA, dark mode, cloud sync, roster reorder,
History filters, field-delete data-loss copy, and any new ceremony features
beyond layout/chrome for tablet and desktop.
