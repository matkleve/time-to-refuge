# In-app landing (`LandingPage`)

Supplement to [landing-page-static.md](landing-page-static.md) — client home inside the SPA when `view === "home"`.

## What It Is

Interactive home inside `TimekeeperApp`: step cards navigate via `setView`, CTA opens Session (`refuge`). Same copy keys as static marketing but different layout and controls.

## Where It Lives

| File | Role |
| --- | --- |
| `components/organisms/LandingPage.tsx` | Client Component |
| `components/timekeeper/timekeeper-app-content.tsx` | Renders when `app.view === "home"` |

## vs static marketing

| Aspect | `LandingPageStatic` (`/`) | `LandingPage` (`/?app=1`, home) |
| --- | --- | --- |
| Render | Server | Client |
| Step cards | Static `<li>` panels | `Button variant="card"` + `onNavigate` |
| CTA | `Link href="/?app=1"` | `Button` → `setView("refuge")` |
| Shell | `PublicShell` | `AppShell` / `DesktopShell` |
| SEO | Indexed | Not separately indexed |

## Heading contract

| Surface | H1 |
| --- | --- |
| Desktop in-app home | `landing.headline` in content |
| Mobile in-app home | `HeaderTitle` → `<p>` “Timekeeper”; content H1 = `landing.headline` |

**MUST** keep single content H1 on mobile — see [app-gate.md](app-gate.md).

## Acceptance Criteria

- [ ] Step card `onNavigate` targets: `people`, `quicklog`, `refuge`
- [ ] CTA calls `onStart` → refuge view
- [ ] Uses `ListPageFrame fill="workspace"`
- [ ] Copy from `landing.json` — headline, intro, steps, cta, footnote (not `about`/`audience`/`features` — marketing-only sections)
