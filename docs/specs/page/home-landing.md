# Home / Landing page (in-app)

## What It Is

`home` view inside ceremony SPA (`/?app=1`): hero copy, three step cards, primary CTA to start session. Shown when brand is tapped or user navigates Home from another view.

**SSR marketing home (SEO):** [`landing-page-static.md`](../ui/public/landing-page-static.md)  
**Supplement:** [`in-app-landing.supplement.md`](../ui/public/in-app-landing.supplement.md)

## What It Looks Like

Centered column in [`ListPageFrame`](../component/list-page-frame.md) `fill="workspace"`. Headline `text-2xl font-display`. Three glass step cards in row at `sm+`. **Open Session** = filled primary button (`h-12`, flag-blue glass).

Desktop header remains visible above — landing does not hide nav.

## Where It Lives

`components/organisms/LandingPage.tsx` · copy: `content/landing.json`

## Actions

| # | User action | System response |
| --- | --- | --- |
| 1 | Open Session | `onStart()` → session flow |
| 2 | Click step card | `onNavigate(step.view)` |
| 3 | Use header tabs | Normal nav (leaves home) |

## Component Hierarchy

```text
ListPageFrame (workspace)
└── centered column
    ├── header (headline + intro)
    ├── ol → Button[card] × 3 (steps)
    └── Button[primary lg] Open Session + footnote
```

## Open Session CTA (normative)

| Property | Value |
| --- | --- |
| `variant` | `primary` |
| `size` | `lg` |
| Height | `h-12` (48px) fixed |
| Fill | `actionPrimary` visible at rest |
| Icon | `ArrowRight` end |
| Width | `w-full max-w-sm` mobile; `sm:w-auto` desktop |

**MUST NOT** look like quiet header chrome.

## Step cards

| Property | Value |
| --- | --- |
| `variant` | `card` |
| Press | `md` |
| Layout | `flex flex-col` glass card; deco link hint bottom-right |

## Acceptance Criteria

- [ ] CTA ≥ 48px tall; blue fill without hover
- [ ] Three steps navigate to People / Quick Log / Session views
- [ ] Content centered; respects `app-content` width
- [ ] Header nav still usable while on home
