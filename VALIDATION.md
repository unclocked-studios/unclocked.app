# Website review — October 2026

A review of unclocked.app against the current state of each product, completed in
milestones. Milestones 0–5 were published on October 6, 2026 (`b701019`); Milestone 6 follows.

## Milestones

| # | Scope | Outcome |
| --- | --- | --- |
| 0 | Baseline | Work rebased on the public `main` after PRs #1 and #2. |
| 1 | Names and policies | Remaining "Warehouse 3D" references renamed to 3D Heatmap. Privacy policies rewritten from product code and owner answers: 3D Heatmap (Marketplace purchaser information), twenty5 (no data collected; device and iCloud storage), LoopDeck (Chrome Sync, Display Manager, ExtensionPay sign-in). twenty5 terms updated for a free app with optional in-app purchases. |
| 2 | twenty5 roadmap | `/twenty5/upcoming/` kept for the in-app link, replaced with a noindexed "under construction" notice. |
| 3 | Product pages | Store links, plans, and current features for LoopDeck and twenty5. |
| 3b | Frame64 | New product, support, and privacy pages; added to navigation, footers, and the support hub. |
| 3c | 3D Heatmap marketing | October 4 screenshots, hosted seven-page sample report, paid plan renamed Professional. |
| 4 | SEO | Canonical URLs, descriptions, link previews, `sitemap.xml`, `robots.txt`, `404.html`, WebP images (5.4 MB to 0.9 MB). |
| 5 | Shared layout | Header and footer generated from `_partials/` by `scripts/build-layout.cjs`. |
| 6 | Docs and verification | Professional volume tiers, Jekyll exclusions, README and this record. |

## Facts checked October 6, 2026

| Product | Checked against | Result |
| --- | --- | --- |
| 3D Heatmap | Marketplace Overview and Plans + Pricing | Certified by Power BI. Free: 2,500 bins. Professional, first month free: 1–10 users $6/$60, 11–50 $5/$50, 51–250 $4/$40, 251–1,000 $3/$30 per user per month/year; custom offer above 1,000; up to 100,000 bins. A flat Warehouse Pro plan is still listed but is being retired. |
| LoopDeck 1.6.0 | Chrome Web Store, plan catalog | Free, 14-day trial, Personal Pro $9.99 once, Display Manager Small/Team/Business $4.99/$8.99/$17.99 per month or $49.99/$89.99/$179.99 per year. |
| Frame64 1.2.1 | Chrome Web Store, `plans.mjs` | Free demo (one image, 5 MB), 14-day trial, $0.99/month, $9.99/year, $15.99 lifetime ($7.99 founder offer during trial). |
| twenty5 1.2 | App Store | Free, iOS 18+, watchOS 11+, Apple Watch companion. |

Privacy policies are drafts written from code and owner answers and were left for the
owner's review before publishing.

## Verification

- `node --test tests/site.test.cjs`: 22 passing tests on the final branch.
- `node scripts/build-layout.cjs --check`: all pages match `_partials/`.
- Each milestone was checked in the browser at desktop width and at 320px with no horizontal
  overflow or broken images. New screenshots were compared with their sources.
- After publishing, the live sitemap returned `200` and `application/xml` with 16 valid URLs.
  `http://` and `www.` redirect to `https://unclocked.app`. Missing URLs serve `404.html`,
  and `/_partials/` is not published.

## Owner follow-ups (status October 6, 2026)

| Item | Status |
| --- | --- |
| Frame64 Chrome Web Store privacy and support URLs set to  and  | Done; listing update awaiting store review |
| Review the rewritten privacy policies (3D Heatmap, twenty5, LoopDeck, Frame64) | Done |
| Confirm the hosted sample report has no local file paths in its data sources | Done |
| October 4 marketing images on AppSource | Done; published with visual 1.1.0.5 |
| Remove the retired Warehouse Pro plan from Marketplace | Open; at the next Partner Center publish if still listed |
| Confirm Google Search Console and Bing show the sitemap as Success (16 pages) | Open |
| Decide on terms of service for LoopDeck and Frame64, which sell subscriptions | Open |
