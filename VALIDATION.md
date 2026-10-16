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
| Frame64 Chrome Web Store privacy and support URLs set to `/frame64/privacy/` and `/frame64/` | Done; listing update awaiting store review |
| Review the rewritten privacy policies (3D Heatmap, twenty5, LoopDeck, Frame64) | Done |
| Confirm the hosted sample report has no local file paths in its data sources | Done |
| October 4 marketing images on AppSource | Done; published with visual 1.1.0.5 |
| Remove the retired Warehouse Pro plan from Marketplace | Open; at the next Partner Center publish if still listed |
| Confirm Google Search Console and Bing show the sitemap as Success (16 pages) | Open |
| Decide on terms of service for LoopDeck and Frame64, which sell subscriptions | Open |

## Accessibility and link-preview cleanup — October 15, 2026

- Mapping form: name and company fields allow browser autofill; the table caption and form
  legend use `.visually-hidden` instead of `hidden`, so screen readers still announce them.
- Feature cards on the four product pages use `<h3>` under their section `<h2>`.
- Link-preview (Open Graph and Twitter) tags added to the 11 indexable pages that had none,
  using each product's existing share image; a new `seo.test.cjs` test requires them.
- Verified: `npm run build`, `npm run check`, and 33 tests pass. All changed pages fit 320px
  without overflow or broken images, in light and dark themes; every local link and asset
  returned 200 from the preview server.
- Not changed: the September 2026 screenshots stay at their URLs, as documented in the README.

## 3D Heatmap flagship, guide, and FAQ — October 15, 2026

- Homepage now leads with Unclocked 3D Heatmap: hero, sample report panel, three highlights,
  and links to the guide, FAQ, and plans. The four-product row was removed; other products are
  reached through the Products menu and `/products/`.
- New `/warehouse-heatmap/guide/` (seven setup and usage steps) and `/warehouse-heatmap/faq/`
  (getting started, data, using the visual, plans, performance and privacy). Both describe
  version 1.1.0.5, written from commit `c11131e` of the visual's repository (its 1.1.0.5
  release notes, user guide, `capabilities.json`, and on-screen labels). 1.2 features
  (layout builder, playback, cutaway, congestion floor) are deliberately not described.
- The support page's general FAQ moved to the FAQ page; its licensing, sample data, and
  troubleshooting sections and their anchors are unchanged. Footer, support hub, 404 page,
  product page, and sitemap link the new pages.
- Verified: `npm run build`, `npm run check`, and 34 tests pass. Changed pages fit 320px
  without overflow or broken images in light and dark themes; the guide's wide example table
  scrolls inside its card on phones.
- Owner follow-up: LoopDeck's Chrome Web Store Homepage URL is `/`, which no longer shows
  LoopDeck. Consider changing that store field to `/products/loopdeck/`.

## Changelog and brand colors — October 15, 2026

- New `/warehouse-heatmap/changelog/`: 1.0.0.1 (June 29), 1.1.0.3 (September 16; includes the
  unpublished 1.1.0.1 and 1.1.0.2 work), 1.1.0.5 (October 4; 1.1.0.4 was withdrawn), and 1.2 at
  the top as "In review", with a notice that its features are not available yet. Dates are the
  completion dates in the visual's repository, as the owner requested; Marketplace dates may
  differ. Linked from the footer, product page, guide, FAQ, and sitemap; a test checks that the
  published version is marked current.
- Accent colors now come from the logo instead of the previous pink-red: buttons `#523ec3`
  (white text 7.4:1; hover `#44329f`), links `#523ec3` in light mode (6.9:1 on the page) and
  `#a087ff` in dark mode (6.3:1). Label dots use the logo teal (decorative only). The theme test
  checks every new text pair at 4.5:1 or better.
- Verified: build, check, and 35 tests pass. Homepage and changelog reviewed in light and dark
  themes; 13 pages fit 320px without overflow or broken images.

## Readability and twenty5 store button — October 15, 2026

- Every text size under 14px in `css/src/` stepped up one level (10→12, 11→12, 12→13,
  13→14px; 44 declarations). Labels, navigation, buttons, captions, forms, and the footer are
  larger; headings and body text are unchanged. The header stays on one row at 920px.
- twenty5 hero: the App Store badge is now the store button, beside Support, replacing the
  duplicate "View on the App Store" button.
- Verified: build, check, and 35 tests pass; 20 pages fit 320px without horizontal overflow.
- Removed the 14 unused September 2026 screenshots, including `loopdeck-dashboard-cycling.png`.
  No page, stylesheet, script, sitemap, or the visual's repository referenced them; their URLs
  now return 404 so search engines drop them. `sample-coordinates.csv` stays at its old URL.

## Article: How to build a warehouse heat map in Power BI — October 15, 2026

- New `/warehouse-heatmap/guides/warehouse-heat-map-power-bi/` (about 2,400 words), revised for a
  more polished, narrative tone: the question a table can't answer, why Power BI has no
  warehouse map, the scatter chart, Shape Map (no custom background image), and Deneb (a
  hand-written Vega-Lite specification) with a comparison table, how the mapping service and
  3D Heatmap close the gap, then location tables, coordinates from CAD, the data model, DAX
  measures, setup with a floor image, color scales, questions, and a pre-share checklist. Keywords: warehouse heat map, Power BI, bin location coordinates, inventory and pick
  heat maps, AutoCAD, DAX, slotting.
- `Article` JSON-LD, Open Graph `article` type, sitemap entry, and links from the product page
  and the guide. Version-neutral apart from the free 2,500-location limit.
- Verified: build, check, and 35 tests pass; the page fits 320px with code blocks scrolling
  inside their frame; reviewed at desktop width in light theme and 320px in dark theme.

## Articles page — October 15, 2026

- New `/articles/` index with a card per article (image, eyebrow, title, date and reading
  time, summary, and a Read the article link), `CollectionPage` and `ItemList` JSON-LD, and a
  sitemap entry. Cards reuse the product card styles and sit image-beside-text above 760px.
- Articles link added to the header between Products and Contact, and to the footer's Explore
  column. The heat map article's breadcrumb now reads Studio / Articles.
- New test: the header links `/articles/` and the page links every article under
  `/warehouse-heatmap/guides/`.
- Verified: build, check, and 36 tests pass; the page fits 320px in dark theme with no
  horizontal overflow; desktop reviewed in light theme; the header stays on one row at 920px.

## Version 1.2 site update (waiting branch) — October 15, 2026

Prepared on `site-review/heatmap-1.2` to merge when Microsoft approves visual 1.2. Not merged.

- Guide and FAQ rewritten for 1.2.0.0 from the visual's `docs/user-guide.md`, the 1.2 release
  notes, `capabilities.json`, and on-screen labels at `4b80d44`: layout builder, View tools
  sections, named saved views, area selection, cutaway, playback and compare, congestion floor,
  2D stack color, the Tooltip measures change, and the Free and Professional split.
- Changelog: 1.2.0.0 is the current version; the in-review notice and style are removed.
- Product page: hero copy and image, Free and Professional plan lists, six feature cards
  (Professional features tagged), a gallery of five 1.2 screenshots, and How it works.
  Homepage hero, highlights, and products card use the 1.2 overview.
- Images in `assets/warehouse-3d/1-2/` are crops of the user's lossless 1.2 captures, limited to
  the visual so the report's "1.2 PREVIEW" labels and setup instructions are excluded.
- Inline code now wraps on phones (a DAX example widened the FAQ at 320px).
- Verified: build, check, and 35 tests pass; changed pages fit 320px without overflow or broken
  images; product page, guide, and changelog reviewed at desktop width.
- Owner follow-ups when merging: replace `unclocked-sample-data.pbix` with a sample that embeds
  1.2 (the release notes call for a layout-builder page), confirm the approval date, and
  consider updating `share-overview.png`, which still shows the 1.1 interface.
