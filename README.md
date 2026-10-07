# Unclocked Studios website

Static HTML, CSS, and small browser scripts, published by GitHub Pages from `main`
at https://unclocked.app. No production dependencies; the only build step is the
layout script below, and its output is committed.

## Commands

Requires Node.js 22 or later. There are no dependencies to install.

| Command | What it does |
| --- | --- |
| `npm run serve` | Local preview at http://127.0.0.1:4173/ (localhost only; set `PORT` to change). |
| `npm run build` | Stamps the shared header and footer from `_partials/` into every page. |
| `npm run check` | Lists pages whose header or footer is out of date; exits 1 if any. |
| `npm test` | Runs every test in `tests/`. |

GitHub Actions runs `npm run check` and `npm test` on every push and pull request
(`.github/workflows/test.yml`). A failure shows a red mark on the commit; GitHub Pages
still publishes `main`, so run the tests locally before pushing.

## Tests

Each file in `tests/` covers one topic, with shared helpers in `tests/helpers.cjs`:

| File | Covers |
| --- | --- |
| `structure.test.cjs` | Links, fragments, and assets resolve; one `<h1>`, unique IDs, and a skip link per page; shared layout is current and links every product, support page, and policy. |
| `seo.test.cjs` | Unique titles, descriptions, and canonicals matching `sitemap.xml`; `robots.txt`; share-image dimensions. |
| `publishing.test.cjs` | Store-registered URLs keep working; the Jekyll exclude list and must-publish files. |
| `content.test.cjs` | Retired names, policy dates, store links, listed prices, and sample data. Update expected prices here when a listing changes. |
| `mapping.test.cjs` | The warehouse mapping request builder. |
| `theme.test.cjs` | Appearance storage fallbacks and color contrast. |

Also check the homepage, product pages, and support and policy pages visually in both
themes and at a 320px width.

## Shared head, header, and footer

Markup repeated on every page lives in `_partials/`:

| Partial | Contents | Marker in each page |
| --- | --- | --- |
| `head.html` | Charset, viewport, color scheme, icons, `theme.js`, `style.css`, `site.js` | `<!-- Shared head -->` … `<!-- /Shared head -->` at the top of `<head>` |
| `header.html` | Skip link target area, brand, navigation, Products menu, Appearance | `<header class="site-header">` |
| `footer.html` | Product, support, and policy links | `<footer class="site-footer">` |

After editing a partial, run `npm run build` to stamp it into every page; each page keeps
its own indentation. Page-specific `<head>` tags (title, description, canonical, sharing
tags, extra scripts) go below the shared head block. New pages need the three markers
(copy any page), and the build fills them in.

## Scripts in `js/`

| File | Loaded by | Purpose |
| --- | --- | --- |
| `theme.js` | Every page (shared head, not deferred) | Applies the saved appearance before the page paints. |
| `site.js` | Every page (deferred) | Appearance menu, Products menu, and the mobile Menu button. |
| `mapping.js` | Mapping page only | Builds the mapping request email; its pure functions are also tested in Node. |

Pages work without JavaScript: links are plain HTML, and controls that need scripts stay hidden.

## Styles

Edit the modules in `css/src/`, then run `npm run build`. The build joins them in filename
order into `css/style.css`, the single stylesheet pages load. Do not edit `style.css`
directly; the tests fail if it does not match the modules.

| Module | Contents |
| --- | --- |
| `00-tokens.css` | Colors, radius, shadow, and width. Each color is written once as `light-dark(light, dark)`. |
| `01-base.css` | Element defaults, typography, `.eyebrow`, `.fine-print` |
| `02-header.css` | Skip link, header, navigation, Products menu, Appearance, mobile menu |
| `03-layout.css` | Content width, sections, hero, grids, text-page column and header |
| `04-buttons.css` | Buttons and link styles |
| `05-cards.css` | Content, support, FAQ, and notice cards; workflow steps; call-outs |
| `06-media.css` | Screenshots, popup screenshots, side-by-side demos, galleries, captions |
| `07-tables.css` | CSV preview, reference tables, pricing tier table |
| `08-pricing.css` | Plan grids and plan cards |
| `09-forms.css` | Mapping request form, draft preview, notices |
| `10-footer.css` | Footer |
| `20-` to `23-page-*.css` | Rules for one page: home, 3D Heatmap, mapping, policy text |
| `99-motion.css` | Reduced-motion preference |

Each module keeps its own `@media` rules at the end. Breakpoints are 1100px, 900px (navigation
collapses; also used in `js/site.js`), and 680px (single column). Later modules override
earlier ones, so page modules come last.

A test fails if a class in `css/src/` is not used by any page, partial, or script, so
delete styles together with the markup that used them.

## Editor settings

`.editorconfig` sets UTF-8, LF line endings, and two-space indentation, and
`.gitattributes` stores text files with LF on every platform, so Windows checkouts do not
produce line-ending warnings or whole-file diffs.

## Publishing

GitHub Pages builds `main` with Jekyll. Pages have no front matter, so they are copied
unchanged. Folders beginning with `_` or `.` are never published, and `_config.yml` excludes
`README.md`, `VALIDATION.md`, `package.json`, `tests/`, and `scripts/` from the public site.

These root files must stay published:

- `CNAME`: the custom domain.
- `BingSiteAuth.xml`: Bing Webmaster Tools verification. Removing it can un-verify the site.
- `sitemap.xml` and `robots.txt`: submitted to Google Search Console and Bing. Add new
  indexable pages to the sitemap; the tests fail if it and the pages disagree.
- `404.html`: served by GitHub Pages for missing URLs.

## Store-registered URLs

These addresses are entered in store listings. Never move, rename, or noindex them;
`tests/publishing.test.cjs` fails if one goes missing. Update both lists if a listing changes.

| Store | Field | URL |
| --- | --- | --- |
| App Store (twenty5) | Marketing | `/twenty5/` (redirects to `/products/twenty5/`) |
| App Store (twenty5) | Support | `/twenty5/support/` |
| App Store (twenty5) | Privacy | `/twenty5/privacy/` |
| Chrome Web Store (LoopDeck) | Homepage | `/` |
| Chrome Web Store (LoopDeck) | Support | `/loopdeck/` |
| Chrome Web Store (LoopDeck) | Privacy | `/loopdeck/privacy/` |
| Chrome Web Store (Frame64) | Support | `/frame64/` |
| Chrome Web Store (Frame64) | Privacy | `/frame64/privacy/` |
| Microsoft Marketplace (3D Heatmap) | Support | `/warehouse-heatmap/support/` |
| Microsoft Marketplace (3D Heatmap) | Privacy | `/warehouse-heatmap/privacy/` |

## Adding a page

Copy the closest existing page. Give it a unique `<title>`, a `<meta name="description">`,
and `<link rel="canonical" href="https://unclocked.app/your/path/">`, then add the URL to
`sitemap.xml`, then run `npm run build` and `npm test`. Pages that should not appear in search,
such as `/twenty5/upcoming/`, use `<meta name="robots" content="noindex">`, no canonical,
and stay out of the sitemap.

## Adding a product

1. Product page at `/products/<name>/`, following the standard order: hero (store button),
   features, screenshots, plans and pricing, FAQ (`.faq-list`), Resources.
2. Support page at `/<name>/` and privacy policy at `/<name>/privacy/` (these are the URLs
   you enter in the store listing; add them to the store-registered table below and to
   `tests/publishing.test.cjs`).
3. A card on `/products/` (`.product-card`) and a tile in the homepage row (`.product-tile`).
4. Links in `_partials/header.html` (Products menu) and `_partials/footer.html` (Explore,
   Get in touch, Policies), then `npm run build`.
5. An entry on the Support Hub (`/support/`), the 404 page, and `sitemap.xml`.
6. Expected store links and prices in `tests/content.test.cjs`, then `npm test`.

## Products and where facts come from

Prices and plan details are shown with the date they were checked. Recheck them when a
store listing or plan changes.

| Product | Website pages | Source of truth |
| --- | --- | --- |
| Unclocked 3D Heatmap (Power BI) | `/warehouse-heatmap/` and its `support/`, `privacy/`, `mapping/` | Microsoft Marketplace listing (Overview and Plans + Pricing tabs) |
| LoopDeck (Chrome) | `/products/loopdeck/`, `/loopdeck/`, `/loopdeck/privacy/` | Chrome Web Store listing; `Tab Cycler/docs/plans-and-trial.md` for prices |
| Frame64 (Chrome) | `/products/frame64/`, `/frame64/`, `/frame64/privacy/` | Chrome Web Store listing; `src/shared/plans.mjs` and `demo-limits.mjs` in the Frame64 project |
| twenty5 (iOS) | `/products/twenty5/`, `/twenty5/support/`, `/twenty5/privacy/`, `/twenty5/tos/` | App Store listing |

`/support/` is the support hub for all products. `/twenty5/` is twenty5's App Store Marketing
URL and instantly redirects to `/products/twenty5/`. `/twenty5/upcoming/` stays live because
the twenty5 app links to it; it is a noindexed "under construction" page.

### 3D Heatmap plans

Free renders up to 2,500 bins. Professional is licensed per user through Microsoft
Marketplace, raises the limit to the report's Max displayed bins (up to 100,000), and has
four volume tiers. The flat-rate Warehouse Pro plan on the listing is being retired and is
not shown on the website. Marketplace calls to action carry `ocid` and UTM parameters
identifying their placement; the site has no analytics script.

## Assets

### 3D Heatmap

- `assets/warehouse-3d/2026-10/`: crops of the October 4, 2026 Power BI captures from the
  visual's `marketing/captures-2026-10-04/` folder, using the AppSource layout's crop
  rectangles at 50% scale (the captures are at 2× scale). Interface, data, and colors are
  not retouched. Pages display the `.webp` copies; the `.png` files are the full-size links.
  `overview-full.png` is the whole visual, including its legend, menu, and Professional
  label. `share-overview.png` is the AppSource overview image, used for link previews.
- `assets/warehouse-3d/unclocked-sample-data.pbix`: the seven-page, 5,000-location sample
  report with visual 1.1.0.5 embedded. Replace it when a new sample is published.
- `assets/warehouse-3d/warehouse_sample.csv`: the 2,208-location CSV sample, preserved
  byte for byte. `sample-coordinates.csv` is an identical copy at an older URL; keep both
  in sync. The support page's `#sample-data` section explains the field assignments.
- `assets/warehouse-3d/visual-only/` and the PNGs directly in `assets/warehouse-3d/` are the
  September 2026 screenshots. They are no longer used by pages but stay at their URLs.

### LoopDeck

- `screen-profile.png`, `quick-cycle.png`, `shared-workspaces.png`, and `display-manager.png`
  are unmodified raw captures from `Tab Cycler/promotional-v2/` (`raw-popup`, `raw-quick-cycle`,
  `raw-workspace`, `raw-displays`). Display examples use demo data.
- `share.png` is the `01-dashboard-cycling.png` listing image, used for link previews.

### Frame64

From `Frame64/versions/frame64-1.2.0/promotional-v2/`: `popup.png` (`raw-popup.png`),
`compare.png`, `export-studio.png`, and `code.png` (listing images 02 to 04), and `share.png`
(listing image 01). Pages display `.webp` copies. Screenshots show Frame64 Pro with an
Unsplash sample photo; the source folder's README records the photo credit and license.

### twenty5

`twenty5-mockup.png` (displayed as `.webp`) is the current App Store marketing image. The
app's original source files are not available, so new imagery should come from the App
Store listing or the upcoming version.

### Converting images

Large screenshots are served as WebP at quality 88, for example with ImageMagick:
`magick input.png -quality 88 -define webp:method=6 output.webp`. Keep the PNG for
full-size links and Open Graph images.

## Website behavior

- Appearance defaults to the system. The selected appearance is the only value this
  site writes to local storage (`unclocked-appearance`).
- Request details remain in page memory. The mapping builder prepares a `mailto:`
  draft or allows copying the complete request. It does not send email or upload files.
- Email links over 1,800 characters use the full-copy flow instead of truncating text.
- All pages contain their navigation and contact links in HTML, so they work without JavaScript.

## History

See `VALIDATION.md` for the October 2026 review. The September 2026 redesign kept a
verified pre-redesign backup outside this repository (baseline `6ba7df5`).
