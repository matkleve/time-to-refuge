# Future work backlog

Captured 2026-08-06 after a repo-wide cleanup pass. Items here are **deferred** — not blocking CI.

## Specs & governance

- [ ] **SiteFooter** — add element spec if footer chrome is permanent (`docs/specs/component/` or page-level).
- [ ] **PageToolbarBand** + `toolbar-scrim` CSS — add spec (pinned toolbar band; related to `header-scrim.md`).
- [ ] Verify **HeaderScrim** diff against [`header-scrim.md`](../specs/component/header-scrim.md) after recent WIP.

## Code organization (moderate refactors)

- [ ] **Extract shared desktop workspace shell** — `DesktopWorkspace` and `DesktopPeopleWorkspace` share rail + card layout; dedupe.
- [ ] **Consolidate shell layers** — `AppShell` → `DesktopShell` → `Timekeeper*Shell`; document or flatten.
- [ ] **PersonFieldRow** — 11 files + 5 hooks; review whether decomposition is still worth the navigation cost.
- [ ] **Button internals** — 6 `button-*` modules; fine for now, revisit if `Button.tsx` changes often.
- [ ] **location-check** — split across `components/atoms/location-check/` (20 files) and `lib/location-check/` (3); document the split convention.
- [ ] **Inline `app/dana/DanaApp.tsx`** — 7-line wrapper; optional inline into `app/dana/page.tsx`.
- [ ] **Component taxonomy** — 6 root-level `components/*.tsx` files outside atoms/organisms/timekeeper; align README + folder structure.

## File size / ESLint

- [ ] **Split `lib/popover-placement.ts`** — 253 lines, 102-line `placePanelNearTrigger`; currently eslint-exempt like `card-image.ts`.
- [ ] **Split `QuickLogView.tsx`** — 200+ lines; mobile/desktop bodies could move to separate files.
- [ ] **Split `app/dev/fonts/FontPicker.tsx`** — dev-only, 213 lines.

## Legacy / migration

- [ ] **`Phase` → `FieldId` rename** — `Phase` is deprecated alias; used widely. Large mechanical rename when ready.
- [ ] **`filled-sheet` material** — legacy in design system; audit remaining `Surface` usages and remove if unused.
- [ ] **Storage migration** — `lib/storage.ts` still migrates top-level `buddha/dharma/sangha` keys; keep until confident no users have old data.

## Assets

- [ ] **`public/logo.png` vs `public/logo.svg`** — both precached in SW; pick one or document why both.
- [ ] **OG image workflow** — static `public/og-image.png` is canonical per `seo-metadata.system.md`; regenerate script or doc when branding changes.

## Testing & CI

- [ ] **Automated tests** — no unit or E2E tests today; consider Vitest for `lib/` + Playwright for critical flows (capture, undo, Quick Log).
- [ ] **Align `eslint-config-next` with `next` major** — currently Next 15 + eslint-config-next 16.

## Dependency upgrades (breaking — plan separately)

- [ ] Next.js 16
- [ ] lucide-react 1.x (icon API changes)
- [ ] TypeScript 7
- [ ] ESLint 10

## a11y patterns

- [ ] **Quick Log `stopTap` propagation** — several `eslint-disable` blocks for tap-anywhere UX; consider a shared `StopTapPropagation` wrapper with documented a11y rationale.

## Done in 2026-08-06 cleanup pass

- Fixed `SiteFooter` typography (`text-sm` per `a11y:type`).
- Removed empty `docs/SPECS/` directory.
- Removed unused `SOLID` export from `lib/surfaces.ts`.
- Renamed `FieldsPagePin.tsx` → `FieldsPageIntro.tsx`.
- Removed redundant `app/opengraph-image.tsx` (canonical OG: `public/og-image.png`).
- Updated `README.md` layout + full `a11y:*` script table.
- Added `npm run build` to CI.
- eslint-exempted `lib/popover-placement.ts` (split deferred above).
