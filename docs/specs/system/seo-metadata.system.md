# SEO & metadata

## What It Is

Cross-cutting search and social metadata: titles, descriptions, canonical URLs, Open Graph, Twitter cards, JSON-LD, `robots.txt`, and `sitemap.xml`. Constants live in `lib/site.ts`; per-route overrides in `app/**/page.tsx`.

**Route architecture:** [public-routes.system.md](public-routes.system.md)

## Constants (`lib/site.ts`)

| Export | Use |
| --- | --- |
| `siteUrl` | Canonical origin — `NEXT_PUBLIC_SITE_URL` or `https://www.usetimekeeper.app` |
| `siteName` | `Timekeeper` |
| `siteTitle` | Default `<title>` |
| `siteDescription` | Meta description — **MUST** stay under ~1000px rendered width (~155 chars safe) |
| `siteKeywords` | `<meta name="keywords">` |

**SHOULD** trim description rather than truncate mid-word when SEO tools flag length.

## Root layout (`app/layout.tsx`)

| Field | Value |
| --- | --- |
| `metadataBase` | `siteUrl` |
| `title.template` | `%s · Timekeeper` |
| `alternates.canonical` | `/` (default; per-page overrides allowed) |
| `openGraph` | `website`, `en_US`, title, description, **`/og-image.png`** |
| `twitter.card` | `summary_large_image` + same image |
| `manifest` | `/manifest.webmanifest` |
| `html lang` | `en` |

## Per-route metadata

| Route | `title` | `canonical` |
| --- | --- | --- |
| `/` | `siteTitle` (default) | `/` |
| `/dana` | `Support DRCE` | `/dana` |

**SHOULD** set `openGraph.url` per route when adding new public pages.

## Structured data (`components/SeoJsonLd.tsx`)

Rendered in root layout `<body>` on every page:

| `@type` | Source |
| --- | --- |
| `WebApplication` | `lib/site.ts` + feature list |
| `HowTo` | `content/landing.json` steps |

**MUST** keep HowTo steps in sync with `landing.json` `steps` array.

## Crawl files

| File | Contract |
| --- | --- |
| `app/robots.ts` | Allow `/`; disallow `/dev/`, `/api/`; point to sitemap |
| `app/sitemap.ts` | **`/`** priority 1; **`/dana`** priority 0.6; monthly `changeFrequency` |

**MUST NOT** add SPA-only views (`/?app=1`, internal `AppView` names) to sitemap.

## Social image

| Asset | Spec |
| --- | --- |
| `public/og-image.png` | 1200×630; referenced in OG + Twitter metadata |
| Alt text | `Timekeeper — Refuge Ceremony Timer` |

## Content JSON contracts

| File | SEO role |
| --- | --- |
| `content/landing.json` | Marketing copy, HowTo steps, footer links |
| `content/dana.json` | Dana page title, intro, external DRCE link |

## Acceptance Criteria

- [ ] `siteDescription` passes Seobility/meta pixel-length check after edits
- [ ] `/sitemap.xml` lists `/` and `/dana` only (until new public routes are specced)
- [ ] `/robots.txt` disallows `/dev/`
- [ ] OG image URL resolves to `public/og-image.png`
- [ ] JSON-LD validates as WebApplication + HowTo (manual or Rich Results test)
