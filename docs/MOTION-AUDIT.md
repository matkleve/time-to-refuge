# Motion & interaction audit

UX pass focused on **responsiveness** — does the UI acknowledge input and
change of place, or does it jump? Companion to the earlier contrast / controls
audit in this file’s sections 1–7. Spec updates land in
[`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) §5.

Screens / flows re-checked: Refuge carousel + record, field/row reveals,
Jump-here confirm, person ⋯ / hamburger menus, People / History / Quick Log
pages, desktop rail, Check zone popover.

---

## Verdict

The app already has three good local patterns (row reveal, carousel slide,
fade-in-up on a few mounts). What’s missing is **continuity between places**
and **press → result feedback** — so the product still feels stiff when you
change page, add a log line, arm the record button, or open a menu.

Priority below is what a ceremony phone needs first: acknowledge the tap,
then move the eye, then decorate.

---

## P0 — Must feel alive (shipped in this pass)

| Gap | Was | Decision |
| --- | --- | --- |
| **Page switches** (Refuge ↔ Quick Log ↔ History ↔ People) | Hard cut — new tree mounts with no entrance | Wrap each page in `PageEnter` (`animate-fade-in-up`). Same slot, acknowledged change. |
| **List mounts** (History rows, People cards, Quick Log stamps) | Appear fully formed | Mount with `animate-fade-in-up`; new Quick Log entries get a short accent flash so “I tapped” maps to “a row arrived”. |
| **Record / Quick Log press** | 150ms colour; 200ms flash ring, easy to miss | Arming uses `duration-200`; capture flash holds ~280ms with an explicit ring transition. |
| **Carousel easing** | Linear-feeling `ease-out` 300ms | Keep 300ms; use a sharper decelerating curve (`cubic-bezier(0.32, 0.72, 0, 1)`) so the card settles like a native sheet. |
| **Menus** | Fade-up only | Add a light `scale-in` from the trigger (0.96 → 1) so the panel feels attached to the button. |
| **`prefers-reduced-motion`** | Ignored | Global reduce: animations/transitions collapse to near-instant. Hierarchy stays; motion does not. |

## P1 — Polish (next if still stiff)

| Gap | Note |
| --- | --- |
| Counter `3 / 8` while swiping | Could crossfade with the card; low risk deferred |
| Armed field ring | Already transitions via shadow; verify after P0 |
| Desktop rail selection | Soft wash already; optional 150ms background tween if it still feels binary |
| Staggered list delays | Nice for long History; skip unless lists feel flat after P0 |

## P2 — Deliberately not doing

| Idea | Why not |
| --- | --- |
| Parallax / backdrop drift | Fights glassy calm; noise under ceremony pressure |
| Exit animations on pages | Needs exit-state machinery for little gain; entrance is enough |
| Bounce / spring everywhere | Three durations stay; springs fight the quiet-book tone |
| Animating the pack spacer with the tray | Already proven to desync (§5a) |

---

## Interaction principles (motion)

1. **Every navigation gets an entrance.** If the main slot’s children swap, they
   fade/slide in — never a hard paint.
2. **Press feedback is shorter than travel.** 150ms scale on the finger;
   200–300ms for things that move across the screen.
3. **One motion per cause.** Don’t animate spacer *and* tray width together.
4. **Reduced motion wins.** Same end state, near-zero duration.

---

## Checklist used

- [x] Page-level `AppView` changes
- [x] Refuge person carousel
- [x] Record button arm + capture flash
- [x] Quick Log stamp + new-entry feedback
- [x] Field / Jump-here / Quick Log row reveals (already §5a; timing aligned)
- [x] GlassMenu open
- [x] History / People list mount
- [x] `prefers-reduced-motion`
- [ ] Desktop rail selection tween (P1)
- [ ] Nav counter crossfade (P1)
