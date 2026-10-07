# Unclocked Studios website

Static HTML, CSS, and small browser scripts. No production dependencies; the only
build step is the optional layout script below, and its output is committed.

## Local preview

With Node.js installed, run `node scripts/serve.cjs` and open http://127.0.0.1:4173/.
The preview binds to localhost only. Set `PORT` to use another port.

## Checks

Run `node --test tests/site.test.cjs` for local links, assets, required request fields,
draft encoding and long-request behavior, clipboard fallback, and theme storage fallback.
Check the homepage, mapping page, product pages, and support/policy pages visually
in both themes and at mobile widths before publishing.

## Shared header and footer

The site header and footer live in `_partials/header.html` and `_partials/footer.html`.
After editing either file, run `node scripts/build-layout.cjs` to stamp them into every
page; each page keeps its own indentation and line endings. New pages need a
`<header class="site-header">` and `<footer class="site-footer">` block (copy any
page), and the script fills them in.

`node scripts/build-layout.cjs --check` lists pages that are out of date and exits 1.
The test suite runs the same check, so a hand-edited header or footer fails the tests.
GitHub Pages does not publish folders beginning with `_`, so the partials are not served.

## Marketplace content

The marketing name is **Unclocked 3D Heatmap**, matching the public listing. The
existing `/warehouse-heatmap/` URLs and historical privacy-policy body are retained.
The product page links directly to Marketplace and its published sample PBIX.
Marketplace calls to action carry `ocid` and UTM parameters identifying their placement.
There is no new analytics script or user tracking added to the website.

The product page's USD prices reflect the US listing checked on October 2, 2026.
Review its plan details and the versioned PBIX link when a Marketplace release changes.
Support guidance links to Microsoft's visual licensing documentation. No visual
package, subscription setting, screenshot, or sample CSV was changed in this update.

## Website behavior

- Appearance defaults to the system. The selected appearance is the only value this
  site writes to local storage (`unclocked-appearance`).
- Request details remain in page memory. The mapping builder prepares a `mailto:`
  draft or allows copying the complete request. It does not send email or upload files.
- Email links over 1,800 characters use the full-copy flow instead of truncating text.
- Existing product, policy, support URLs and homepage anchors are retained.
- All pages contain their navigation and contact links in HTML, so they work without JavaScript.
- Shared navigation/footer markup is generated from `_partials/` (see above); do not edit it in pages directly.

## Warehouse 3D sample

`assets/warehouse-3d/warehouse_sample.csv` is the original, user-tested Power BI
sample, preserved byte for byte. It contains 2,208 locations and 12 columns.
The homepage, mapping, product, and support pages link to this download. The support
page's `#sample-data` section explains the field assignments.

`assets/warehouse-3d/sample-coordinates.csv` retains the previous download URL with
identical contents. Keep both copies in sync if replacing the sample in future.

## Warehouse 3D screenshots

The five updated screenshots supplied on September 16, 2026 are preserved as
unmodified copies from `Pictures/Screenshots`:

| Source | Original asset in `assets/warehouse-3d/` |
| --- | --- |
| `01. First.png` | `warehouse-overview.png` |
| `02. Second.png` | `category-filters.png` |
| `03. Third.png` | `location-details.png` |
| `04. Fourth.png` | `plan-view.png` |
| `05. Fifth.png` | `report-interactions.png` |

The homepage and product page use cropped copies in `assets/warehouse-3d/visual-only/`
with the same filenames. These crops retain only the custom visual, including its
menu and legend, and exclude surrounding report slicers, the KPI card, and table.
The first four crops are 1251 × 781 pixels; the fifth is 1565 × 977 pixels. They were
cropped without resizing or redrawing the interface.

The product gallery loads images lazily and links to the full-size cropped copies.
Uncropped originals and previous image assets remain available at their old URLs
but are no longer used by the website pages.

## LoopDeck screenshots

The LoopDeck product page uses the original high-resolution interface captures
behind the promotional artwork supplied on September 16, 2026. These files were
copied unchanged from `Tab Cycler/promotional-v2`:

| Source | Website asset in `assets/loopdeck/` |
| --- | --- |
| `raw-popup.png` | `screen-profile.png` |
| `raw-quick-cycle.png` | `quick-cycle.png` |
| `raw-workspace.png` | `shared-workspaces.png` |
| `raw-displays.png` | `display-manager.png` |

Using the original captures keeps controls sharper than cropping the downscaled
promotional artwork. Popup screenshots sit beside their explanations; management
screens span the content width. All four link to their full-size PNGs, with lazy
loading below the hero. Display examples use demo data, and the page states the
paid-plan or active-trial requirement for Display Manager. The previous promotional
asset remains at its existing URL.

## Backup and release

The pre-redesign ZIP, SHA-256 manifest, and restoration instructions are saved outside
this repository under `C:\Users\helio\Documents\Company Website\backups` with timestamp
`20260916-084848`. Baseline: `main` at `6ba7df5bc9877630fb1b915659992405e3d66990`.
Every one of the archive's 188 files (including `.git`) was verified before editing.
Extract into a separate empty directory first; never overwrite newer work blindly.

This redesign does not change the Power BI visual's URL and does not publish the website.
