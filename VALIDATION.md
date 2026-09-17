# Redesign verification — September 16, 2026

## Updated LoopDeck screenshots

- Reviewed the four supplied promotional images and their original interface captures. Used the sharper original captures without promotional backgrounds or duplicate marketing text; all four website PNGs are byte-for-byte copies of the source captures.
- Replaced the old hero image with Screen Profile, added Quick Cycle, and presented Shared Workspaces and Display Manager across the content width. Added descriptive captions, alt text, full-size links, intrinsic dimensions, and lazy loading below the hero.
- Retained the promotional material's paid-plan/active-trial requirement and Chrome Sync explanation for Display Manager. Display records are identified as example data. Existing support, policy, and footer markup remain unchanged.
- All four image URLs returned HTTP 200 with matching source bytes. Browser inspection confirmed all four images loaded at their original dimensions. The Display Manager image opened through keyboard Enter in a new tab at 2432 × 794; the temporary tab was closed.
- Reviewed the hero, Quick Cycle, and management layout in the local browser. The page fits 320px, 768px, and 1620px CSS widths without horizontal overflow. Viewport overrides were reset.
- All 13 automated checks and the whitespace diff check passed. Original promotional files, previous assets, and the verified rollback backup remain intact. No publication was performed.

## Screenshots cropped to the custom visual

- Created separate PNG crops under `assets/warehouse-3d/visual-only/`, leaving the original screenshots untouched. Excluded report slicers, KPI cards, tables, and the surrounding report frame while preserving the visual's search, menu, filters, legend, and layout.
- Crops use source-pixel rectangles without resizing: overview `(33,191,1251,781)`, category filters `(32,191,1251,781)`, location details `(33,192,1251,781)`, plan view `(33,191,1251,781)`, report interactions `(43,239,1565,977)`, expressed as `(x,y,width,height)`.
- Updated homepage/product images and all full-size screenshot links, intrinsic dimensions, alt text, and affected captions. Availability wording and the in-review preview label remain intact.
- Visually inspected all five cropped files. Every cropped URL returned HTTP 200 with matching PNG bytes. Browser review confirmed the gallery crops loaded correctly at desktop width (1422px) and both homepage and product page fit 320px without horizontal overflow. The mobile mapping action remains initially visible. Viewport overrides were reset.
- All 13 automated checks and the whitespace diff check passed. Restarted the stopped localhost preview with a hidden Node process. No publication was performed.

## Availability wording

- Updated availability from the owner's release status: the first version is published and available, while the latest update is in review with at least another two weeks expected before release. Dated the estimate and made its dependence on review clear.
- Marked the gallery screenshots as previews of the update under review and removed the outdated pre-publication support wording.
- Local link checks and the whitespace diff check passed.

## Updated Warehouse 3D screenshots

- Reviewed the five supplied report screenshots and five promotional images. Used the direct screenshots to keep product imagery prominent and avoid duplicating promotional text in the website layout.
- Replaced the homepage and product overview images. Updated the product gallery with category filtering, location tooltip, 2D plan view, and report interaction screenshots, with matching captions and alt text.
- Each new PNG is an exact byte-for-byte copy of the supplied source. The overview is 358,771 bytes, down from 828,588 bytes for the previous overview. Original dimensions are declared in HTML, and gallery images load lazily.
- All five PNGs returned HTTP 200 with matching original bytes. The gallery images loaded at their expected dimensions without cropping or distortion. Full-size opening worked with Enter and click; the opened image reported its original 1788 × 1005 resolution. Temporary image tabs were closed.
- Product gallery visually reviewed at desktop size (1620px CSS width). Homepage and product page fit 320px without horizontal overflow; the mobile gallery uses a single column and the homepage mapping action remains visible initially. Viewport overrides were reset.
- All 13 automated checks and the whitespace diff check passed. No old screenshot paths remain in HTML, and no browser console errors were reported.
- Previous image files and the verified rollback archive are retained. Nothing was published.

## User-provided Power BI sample

- Replaced the illustrative CSV with the supplied `warehouse_sample.csv`, preserving all 103,636 bytes. The original attachment remains untouched.
- Source and both hosted copies have SHA-256 `06339FDDF0624DCFF977777D7EC67CCF1C4284EDAF2181372C74FB6A436F0B33`.
- Verified 2,208 unique location names and finite numeric coordinates, dimensions, and heatmap values across 12 columns. The user's Power BI compatibility test is the basis for the site's tested-sample wording; Power BI itself was not rerun during this update.
- Updated all sample links, added product/support downloads and field assignments, and replaced the mapping page's synthetic preview with the first three actual sample rows. Kept the old download URL as a byte-identical compatibility copy.
- Both local download URLs returned HTTP 200, `text/csv`, and bytes identical to the attachment. The browser download-event observer timed out, so a browser save-completion event was not confirmed.
- All 13 automated checks and `git diff --check` passed. The four affected pages fit 320px and 1440px CSS widths without horizontal overflow. Both tables also fit their containers at 320px. Desktop setup content was visually reviewed; there were no browser console errors.
- No publication was performed.

## Homepage feedback revision

- Reduced header content height from 82px to 64px on desktop and from 72px to 60px on mobile; footer branding styles are unchanged.
- Navigation now reads Warehouse Mapping, Products, Contact, Appearance. Products is a native disclosure with links to the three existing product pages.
- Homepage introduces the independent workflow studio, features Warehouse 3D, and explains the mapping service. LoopDeck and twenty5 graphics and cards are no longer displayed on the homepage.
- Existing `#products` links still resolve to the featured Warehouse 3D panel. Frame64 has not been given a placeholder or dead navigation link.
- Every footer's SHA-256 matched the pre-feedback footer markup after the edits.
- All 13 automated checks still pass. Desktop keyboard opening, Tab order, Escape, outside-click dismissal, and each product destination were checked in the browser.
- Mobile checks at 320px and 390px confirmed the mapping action remains in the initial viewport. Both menu levels respond to Escape, with focus returned to the appropriate control.
- At 720 × 450, the expanded navigation scrolls within the viewport. All 14 pages were checked at 320px with no horizontal overflow; the homepage was reviewed in both themes.
- Local preview was restarted after the earlier server stopped. No changes were published.

## Backup

- Baseline: clean `main`, commit `6ba7df5bc9877630fb1b915659992405e3d66990`.
- Archive: `C:\Users\helio\Documents\Company Website\backups\unclocked.app-before-redesign-20260916-084848.zip`.
- All 188 archived files, including hidden Git history, matched their original SHA-256 checksums before implementation.
- Archive SHA-256: `F985B419D5922A63C5753E322F3C0DF3F6AEF346E832EF6FC89E060A540BED6B`.
- The adjacent manifest records every file hash; `RESTORE-20260916-084848.txt` explains restoration into a separate directory.

## Automated checks

`node --test tests/site.test.cjs`: **13 passing tests**.

Checks cover local links, fragment targets, images, scripts, unique IDs, page headings,
exact preservation of policy main content, sample CSV structure, DWG/DXF options,
no-script email markup, required fields, Unicode/multiline encoding, complete long
drafts, email handoff messaging, successful and denied clipboard access, unavailable
theme storage, and text contrast for both palettes and the primary action.

`node --check` passed for all three browser scripts. `git diff --check` passed.

## Browser review

| Check | Result |
| --- | --- |
| All 14 pages at 320px and 768px CSS widths | No horizontal overflow or missing loaded images |
| All 14 pages at 1440px, dark appearance | No horizontal overflow; selected appearance persists across navigation |
| Homepage at 390 × 844 | Mapping action visible without scrolling; no overflow |
| Homepage, mapping, product, and product-card layouts | Visually reviewed in local preview |
| Light / Dark / System controls | Light and dark render correctly; System returns to the current dark OS preference |
| Mobile menu | Opens, Escape closes it, links navigate correctly |
| Required request fields | Empty submission focuses the name field with a validation message |
| Long request with Unicode and multiple lines | Complete text retained, DWG selected correctly, copy instructions shown, no truncated mailto launched |
| Keyboard focus | Visible focus outline on keyboard navigation |
| Browser console | No application errors |
| 720 × 450 CSS viewport | Homepage, mapping, support, and privacy reflow without overflow; equivalent viewport size to a 1440 × 900 window at 200% |

The browser surface does not expose an actual zoom setting or a JavaScript-disabled
context. The 200% check used equivalent viewport dimensions; no-JavaScript fallback
was checked in source and automated tests. Reduced-motion support is implemented
through a CSS media query. Changing the OS theme or reduced-motion preference was
not performed. Email URLs were tested without sending email; actual email-app
launch behavior depends on the visitor's device, with the copy flow available.

## Delivery state

- Branch: `codex/website-redesign-20260916-084848`.
- Changes remain uncommitted for review.
- Local preview: `http://127.0.0.1:4173/` (`node scripts/serve.cjs`).
- The public site has not been published or changed, and the Power BI project was not edited.
