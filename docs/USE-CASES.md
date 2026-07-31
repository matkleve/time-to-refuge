# Use cases

What this app actually has to be true for, written down once so "does it
support X" has an answer instead of a guess. Companion to
[`UX-AUDIT.md`](./UX-AUDIT.md) (what was wrong with the screens) and
[`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) (the rules that came out of it) —
this one is about the *ceremony*, not the interface.

Each use case has a status:

- **Supported** — the app does this today, no caveats worth a reader's time.
- **Partial** — works, but with a real edge or a condition attached.
- **Gap** — doesn't do this, and someone will eventually expect it to.

The gap summary at the bottom is the actionable part; the use cases above it
are what the gaps are gaps *in*.

## Actors

- **Timekeeper** — operates the app. The only actor who ever touches it.
- **Preceptor / teacher** — conducts the ceremony, asks the threefold
  question, snaps on the third repetition. Never touches the app.
- **Aspirant** — the person taking refuge. Never touches the app during the
  ceremony (may, afterward, receive their own exported record).

One assumption sits under everything below, stated here because it's load-
bearing and wasn't independently confirmed: **the ceremony is run one
aspirant at a time** — Buddha ×3 + snap, Dharma ×3 + snap, Sangha ×3 + snap,
*then* the next aspirant starts from Buddha. Every piece of this app's
interaction model (one person "in focus," a record button that auto-targets
that person's next empty phase, swiping or clicking to move to the next
person only once done) assumes that ordering. If the real format instead
runs all aspirants through Buddha together before anyone starts Dharma — a
round-robin across people rather than a sequential pass through each one —
the per-person auto-targeting stops matching the actual rhythm of the room,
and that's a design-level mismatch, not a bug to patch. See **UC-1** and the
gap summary.

---

## UC-1 — Record a refuge moment

**Actor:** Timekeeper. **Trigger:** the preceptor's fingers snap on the third
repetition, for one aspirant, for one of Buddha / Dharma / Sangha.

This is the only use case that happens *during* the ceremony itself, under
real time pressure, with no possibility of a redo. Everything else in the
app exists in service of this one moment going right.

**Preconditions:** the aspirant has an entry in the People list; the
timekeeper has that person's card in focus (mobile) or selected in the rail
(desktop); the phase about to be recorded is still empty.

**Main flow:**
1. The record button already shows which phase it will capture (`nextEmptyPhase`
   — always the person's first still-empty one) and stays armed the entire
   time the preceptor is asking, snap or no snap.
2. On the snap, the timekeeper taps the button once. `Date.now()` is
   captured synchronously in the click handler — no debounce, no confirm
   step between tap and capture.
3. The field fills, the button re-targets to the next empty phase, a haptic
   pulse (`navigator.vibrate`) confirms the tap registered without needing
   to look down.

**Success:** the timestamp is stored to the millisecond and is not the
moment the timekeeper *noticed* the snap — it's the moment they *tapped*,
which is the closest this app gets to the real moment, and is why
**UC-6** (verifying the clock) exists as a separate, earlier use case rather
than something folded into this one.

**Alternate flows:**
- **Wrong phase armed** — tapping a different empty field than the
  auto-suggested next one asks first ("Record Sangha before Buddha?") rather
  than either silently allowing it or blocking it outright. Confirming still
  arms it — this stays a soft speed bump, not enforcement, since there may be
  real reasons to go out of order that the app has no business second-guessing.
  Tapping the phase that actually *is* next is unaffected — no question, no
  delay, capture stays exactly as instant as it needs to be. See
  `DESIGN-SYSTEM.md` §6a.
- **Mistap** — see **UC-3**.
- **Wrong person in focus** — the tap still lands on whoever's card is
  showing. There's no "confirm this is the right person" step; getting the
  wrong card in focus and tapping is indistinguishable, in the moment, from
  a correct tap. Swiping to the wrong neighbor during a fast multi-person
  sequence is the realistic version of this.

**Status: Supported**, for the one-aspirant-at-a-time model. Not
independently verified against a round-robin ceremony format — see the
actors note above.

## UC-2 — Set up before the ceremony starts

**Actor:** Timekeeper, alone, before the preceptor begins. No time pressure
— the one use case in this list where that's true.

**Main flow:**
1. Add every aspirant by name (People list / rail — **UC-5**).
2. Name the retreat itself (tap "Add retreat name" in the header) — one name
   for the whole session, carried into every export and shown on the
   focused card, not something set per person.
3. Check the device's own clock against its GPS location
   (`LocationCheck` — **UC-6**).
4. Double check names for spelling, since they go straight into any
   exported record — and get the add order right the first time; see the
   reordering gap in **UC-4**.

**Status: Supported.** Nothing enforces that this happens *before* the
ceremony rather than mid-ceremony — the app has no concept of "ceremony
started," so there's no way to nudge a timekeeper who skipped this toward
doing it, nor to lock further add/rename edits once things are underway.

## UC-3 — Correct a mistake

**Actor:** Timekeeper. **Trigger:** a mistap, a snap that was missed and
caught late, or a preceptor who restarted a phase.

**Two distinct repair paths exist, for two distinct problems:**

- **Wrong value, right idea it happened** — edit the field directly (pencil
  icon), typing in the correct time. This writes the corrected time as a
  fresh "recorded" log entry; it deliberately does *not* re-capture `now()`,
  because the point of editing is that `now()` is exactly wrong.
- **Shouldn't have happened at all** — reset the field (two-tap armed
  action on the revealed reset control), clearing it back to empty so it can be captured again
  when the real moment comes.
- **Undo / Redo** — a stack, most-recent-first, covering captures and resets from
  the current session. Undo steps back one action; Redo walks forward again
  until a new capture/reset/edit clears the redo side. Icon-only controls at
  the bottom of the hamburger menu. No way to jump to an arbitrary earlier
  state except by walking one step at a time.

**Status: Partial.** The undo stack lives in React state only — it is
**not** persisted to `localStorage` the way people, the log, and Quick Log
entries all are (`app/page.tsx`; compare `lib/storage.ts`, which has no
undo key at all). A reload — the phone locking and Safari discarding the
backgrounded tab, an accidental refresh, a crash — loses the undo history
even though the underlying recorded times survive it fine. Mid-ceremony,
undo is exactly the safety net a mistap needs; it's also exactly the thing
silently gone the moment something interrupts the session.

## UC-4 — Move between aspirants

**Actor:** Timekeeper. **Trigger:** one aspirant's three phases are done, or
the preceptor has moved to the next person some other way.

**Main flow (mobile):** swipe the card left or right, or use the
prev/next arrows above it. The counter (`3 / 8`) tracks position in the
list, which is insertion order — the order aspirants were added, not
anything that can be independently reordered.

**Main flow (desktop):** click the aspirant's row in the persistent list;
no swipe, no counter, no "current position" concept beyond which row is
highlighted.

**Status: Supported**, with one real gap: **there is no way to reorder the
list.** If the order aspirants are actually called up changes at the last
minute — someone arrives late and needs to be called earlier, the
preceptor changes the sequence — the app's ordering is stuck at insertion
order. Deleting and re-adding is the only workaround, and it discards
anything already recorded for that person.

## UC-5 — Manage the roster

**Actor:** Timekeeper. Add, rename, or remove aspirants; add is available
before and during the ceremony, rename and remove any time.

**Main flow:** open People from the hamburger Pages menu (mobile sheet) or
use the persistent desktop rail.

**Status: Supported**, with two edge cases neither prevented nor flagged:
- **No duplicate-name check.** Two "David"s are legal. Both export as
  `refuge-david.csv` / `refuge-david.png` — filename collision left to the
  browser's own download-manager renaming, not this app's.
- **Delete is two-tap armed, same as everywhere else** — but deleting a
  person with recorded times doesn't warn *specifically* that real refuge
  timestamps, not just an empty row, are about to go. The confirmation is
  generic regardless of whether the person has one recorded phase or three.

## UC-6 — Verify the clock is trustworthy

**Actor:** Timekeeper, during **UC-2**, before there's time pressure.

Covered in full in `DESIGN-SYSTEM.md` §6b — GPS location cross-checked
against the device's own reported time zone, a generously-toleranced
estimate rather than a hard proof, deliberately not dependent on a trusted
time server (offline-friendly, at the cost of not catching a right-time-
zone-wrong-minute error).

**Status: Supported** for the specific failure mode it targets (a clock
stuck on a different time zone). **Gap:** nothing in the rest of the app
*requires* or even reminds the timekeeper to run this check before the
ceremony starts — it's fully opt-in, tucked in a small badge, easy to never
open. See gap summary.

## UC-7 — Record without attributing a name yet (Quick Log)

**Actor:** Timekeeper. **Trigger:** a ceremony format where recording the
moment matters more, in the instant, than knowing whose moment it was —
tap first, sort out who's who from a list afterward.

**Main flow:** open Quick Log from the hamburger Pages menu; tapping
anywhere on the screen (not just the button) logs `now()`. Entries list
newest-first with an index number; each can be individually deleted
(two-tap) or all cleared at once. A timezone selector re-renders every
logged time in another zone for
review, without changing what's stored.

**Status: Partial.** Deliberately disconnected from the People list —
there is **no way to take a Quick Log entry and attribute it to a specific
aspirant's Buddha/Dharma/Sangha field after the fact.** If Quick Log is
used *as* the ceremony record (rather than as scratch capture reconciled
by hand afterward), that reconciliation step doesn't exist in the app at
all — it happens outside it, by a human matching timestamps to a mental
list, or doesn't happen. Also: no undo for individual Quick Log deletes,
unlike the Refuge flow's undo stack — only the two-tap confirm stands
between a tap and losing that entry for good.

## UC-8 — Review what happened (History)

**Actor:** Timekeeper (during, to double check) or whoever debriefs
afterward. **Trigger:** "did that actually get recorded."

**Main flow:** open History from the hamburger Pages menu. Every recorded,
reset, and undone action across every person, newest first, in one list — a
full audit trail of the *session*, not just the current state of each
person's fields.

**Status: Supported.** History is read-only and session-scoped — there's
no filter by person or by phase, so for a large roster it's a long flat
list to scroll, and it only exists as long as `localStorage` does (see gap
summary on backup).

## UC-9 — Produce a record after the ceremony

**Actor:** Timekeeper, or whoever the record goes to. **Trigger:** the
ceremony is over.

**Main flow:** per-person or all-at-once CSV (machine-readable, ISO 8601
timestamps — unambiguous regardless of the reader's own time zone); a
per-person PNG card (rendered client-side onto a canvas) shareable through
the OS share sheet where available, downloaded otherwise. Both carry the
retreat name if one was set in **UC-2** — a `Retreat` column in the CSV, a
second header line on the PNG — so a record doesn't need its filename or an
accompanying message to say which retreat it's from.

**Status: Supported** for what it does. **Gap:** there is no single
formatted "certificate" output — the PNG is the app's own card design
(saffron/flagblue chrome, the recording UI's own visual language), not a
document meant to be handed to an aspirant as a keepsake or presented as an
official record. If that's a real need, it isn't met today. The CSV (ISO
8601) and the shared PNG (a printed IANA zone name in the footer,
`lib/card-image.ts`) are both zone-unambiguous — but that's only true of
what leaves the app. The **on-screen** times (the fields themselves,
History, Quick Log) show none of that context, just `HH:MM:SS.mmm` — fine
in the moment, when the zone is self-evidently "wherever this phone is
right now," but a plain screenshot of the live UI (as opposed to an actual
export) carries no zone with it.

## UC-10 — Survive an interruption

**Actor:** Timekeeper. **Trigger:** the phone locks, the browser tab gets
backgrounded and killed, the app is reloaded, the device loses power.

**Status: Gap, and the most consequential one in this document.** There is
**no PWA manifest and no service worker** (confirmed: nothing under
`public/` but `backdrop.jpg`, no `manifest.json`, no offline caching
anywhere in the build). Practically:

- The app **will not load without a network connection** on a cold start,
  the exact condition the retreat-center-with-bad-wifi scenario in
  `DESIGN-SYSTEM.md` §6b was written around for `LocationCheck` specifically
  — but the app underneath that feature has no offline story of its own at
  all. If the page hasn't already been loaded once and cached by the
  browser's ordinary HTTP cache, no connectivity means no app, full stop.
- Once loaded, `localStorage` is durable across a reload — people, the
  Refuge log, and Quick Log entries all survive it (`lib/storage.ts`). The
  undo stack does not (**UC-3**).
- There is **no export/backup step separate from the manual CSV/PNG export**
  in **UC-9** — no automatic snapshot, no "recover my last session" if
  `localStorage` itself is cleared (private browsing, a full Safari
  storage-pressure eviction, the browser's own settings).
- Everything is **single-device**. There's no sync, no merge, no shared
  session — if the primary timekeeper's phone dies mid-ceremony and a
  second phone has to take over, the new device starts from zero. Whatever
  was recorded on the first phone is not recoverable *into the app* on the
  second one; only whatever the first device already exported (**UC-9**)
  survives the handoff, and only if that export happened before the device
  died.

---

## Gap summary

Ordered by how much it would actually hurt if it happened during a real
ceremony, not by how easy each is to fix.

| # | Gap | Where |
| --- | --- | --- |
| 1 | No offline support at all (no manifest, no service worker) — a cold load with no network doesn't work, in exactly the setting this app is built for | UC-10 |
| 2 | Single-device, no sync/handoff — a dead phone mid-ceremony loses everything not already exported | UC-10 |
| 3 | Undo stack isn't persisted — survives a mistap, doesn't survive a reload | UC-3 |
| 4 | Nothing enforces or even prompts the clock/location check before a ceremony starts — fully opt-in, easy to skip | UC-2, UC-6 |
| 5 | ~~No phase-order enforcement~~ — **addressed**: an out-of-order tap now asks first ("Record Sangha before Buddha?") rather than proceeding silently. Deliberately still not *enforced* — confirming still allows it | UC-1 |
| 6 | Unconfirmed architectural assumption: one-aspirant-at-a-time vs. round-robin-across-aspirants ceremony format | UC-1, actors note |
| 7 | Quick Log entries can't be attributed to a person after the fact — no reconciliation path back into the Refuge roster | UC-7 |
| 8 | No aspirant reordering — insertion order is permanent short of delete-and-re-add, which discards recorded times | UC-4 |
| 9 | On-screen times (live UI only — exports are fine) carry no time zone label; a plain screenshot loses that context | UC-9 |
| 10 | No duplicate-name handling — collides silently in exported filenames | UC-5 |
| 11 | No formatted "certificate" output distinct from the app's own UI card | UC-9 |
| 12 | Quick Log has no undo, only two-tap confirm, unlike the Refuge flow | UC-7 |

None of the rest are implemented by writing this document — this is still
mostly the audit, not the fix, with #5 as the one exception so far. Worth
treating #1–#3 as the ones that turn a bad moment into a lost one; the rest
are real, but recoverable by a human working around them.
