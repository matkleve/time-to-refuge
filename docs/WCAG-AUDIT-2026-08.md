# WCAG audit — Timekeeper UI (August 2026)

Pass against **WCAG 2.2 Level AA** for the shipped glass / open-backdrop UI.
Companion to `npm run a11y:contrast`, `a11y:type`, `a11y:overflow`, `a11y:layout`.

**Scope:** desktop chrome + AppViews (Home, Session, People, Quick Log, Fields,
History, Dana). Phone shell shares tokens.

---

## 1. Verdict

Contrast tokens mostly pass the automated suite. The **desktop nav idle
labels** were the live failure users hit: `text-sm` + `text-muted` on the
header scrim / photo read as grey wash. Fixed to `text-base` + ink-weight
colour. Remaining risk is **manual**: focus order, hit targets under 24px
on dense chrome, and icon-only tabs below `lg`.

---

## 2. Contrast (1.4.3 / 1.4.11)

| Surface | Pair | Criterion | Status |
| --- | --- | --- | --- |
| Body / cards | ink, muted on white & card | 4.5:1 text | Pass (`a11y:contrast`) |
| Glass panel / card / row | ink, muted, saffron-700, flagblue | 4.5 / 3.0 | Pass |
| Action glass | white on flagblue; ink on saffron | 4.5 / 3.0 | Pass |
| **Nav idle (before)** | muted `text-sm` on scrim/photo | 4.5:1 | **Fail (UX)** — fixed |
| **Nav idle (after)** | ink, `text-base` | 4.5:1 | Pass (pair added) |
| Nav selected | ink on white glass chip | 4.5:1 | Pass |
| Focus ring | flagblue-600 on white/card | 3.0:1 non-text | Pass |
| Quiet undo/redo icons | muted on photo | 3.0:1 UI | Watch — quiet glyphs |

Run: `npm run a11y:contrast`.

---

## 3. Text size & resize (1.4.4 / 1.4.10)

| Control | Before | After / note |
| --- | --- | --- |
| Desktop nav label | `text-sm` (14px) | **`text-base` (16px)** |
| Desktop nav icon | `size-4` (16px) | **`size-5` (20px)** |
| Page title | `text-base` | OK (step below person names) |
| Person name | `text-2xl` | OK large text |
| Type scale | only xs–4xl tokens | Guarded by `a11y:type` |

200% zoom: shells are `dvh` + flex; expect internal scroll, not document
scroll (`html/body overflow:hidden`).

---

## 4. Non-text contrast & focus (1.4.11 / 2.4.7)

| Item | Status |
| --- | --- |
| Global `:focus-visible` 2px flagblue + 2px offset | Pass |
| Selected nav = white glass chip + semibold ink | Pass |
| `overflow-x-auto` banned on chrome | Pass (`a11y:overflow`) |
| Inset rings inside overflow-y scrollports | Pass (field targets) |

---

## 5. Target size (2.5.8)

| Control | Size | Status |
| --- | --- | --- |
| Nav tab (md+) | ≥44px (`size-11` / `h-11`) | Pass |
| IconButton `md` | 44px | Pass |
| IconButton `sm` (undo/redo) | 36px | **Below 24×24? No — 36≥24** AA OK; AAA 44 would need `md` |
| Field row chips | `md` 44px | Pass |

---

## 6. Structure & name (2.4.6 / 1.3.1)

| Item | Status |
| --- | --- |
| In-page `PageTitle` visible on desktop | Pass (restored) |
| `aria-current="page"` on selected nav | Pass |
| Brand lockup → Home | Pass |
| Icon-only nav below `lg` | Has `aria-label` + `title` — OK; labels preferred when width allows |

---

## 7. Motion (2.3.3)

| Item | Status |
| --- | --- |
| Page enter = opacity fade only | Pass (no translateY scrollbar jump) |
| `prefers-reduced-motion` kills animations | Pass |

---

## 8. Open risks (not auto-failing)

1. **Quiet toolbar icons** on bright photo patches — prefer glass chip when
   contrast looks weak in real backdrop photos.
2. **Icon-only nav &lt; `lg`** — rely on labels as soon as width allows (already).
3. **`a11y:type`** still flags some LocationCheck `text-xs` captions that are
   not uppercase+tracked — separate cleanup.

---

## 9. Commands

```bash
npm run a11y:contrast
npm run a11y:type
npm run a11y:overflow
npm run a11y:layout
npm run a11y   # all of the above
```
