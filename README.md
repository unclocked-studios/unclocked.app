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

## Shared header and footer

The site header and footer live in `_partials/header.html` and `_partials/footer.html`.
After editing either file, run `npm run build` to stamp them into every page; each page
keeps its own indentation. New pages need a `<header class="site-header">` and
`<footer class="site-footer">` block (copy any page), and the build fills them in.

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
