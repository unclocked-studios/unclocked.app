---
name: unclocked-site
description: Maintain the Unclocked Studios website (unclocked.app) in this repository. Use this whenever working in this repo on anything visible on the site or about its products — 3D Heatmap (Power BI), LoopDeck and Frame64 (Chrome extensions), twenty5 (iOS) — including rechecking prices or store listings, adding or updating a product, new screenshots or marketing images, privacy policies, support pages, pricing, SEO, or publishing changes, even if the request only says "update the site" or names a single product.
---

# Maintaining unclocked.app

This repository is a static site published by GitHub Pages from `main`. `README.md` is the
reference for structure, commands, modules, and conventions; read the relevant README
section before editing. This skill is the working procedure.

## Before changing anything

1. `git fetch`, then check that local `main` is not behind `origin/main`. Branch from `main`
   as `site-review/<short-topic>`.
2. Run `npm test` to confirm a clean starting point.

## Facts come from sources, never from the site itself

Product facts on the site (prices, plans, limits, versions, data practices) must match their
source of truth. The README's "Products and where facts come from" table lists them. In
short:

| Product | Check |
| --- | --- |
| 3D Heatmap | Microsoft Marketplace listing, Overview and Plans + Pricing tabs (open in a browser; plain fetches are blocked) |
| LoopDeck | Chrome Web Store listing; `docs/plans-and-trial.md` in the sibling `Tab Cycler` project folder |
| Frame64 | Chrome Web Store listing; `src/shared/plans.mjs` and `demo-limits.mjs` in the newest `Frame64/versions/` folder |
| twenty5 | App Store listing (the app's source code is no longer available) |

When a source and the site disagree, update the site and the expected values in
`tests/content.test.cjs` and the JSON-LD block on the product page together, and date the
check ("prices as of <date>"). If something cannot be verified, ask the owner instead of
guessing. Privacy policies and terms are legal text: base changes on the product's code
and the owner's answers, and ask the owner to review them before publishing.

## URLs registered in store listings

Ten URLs are entered in the App Store, Chrome Web Store, and Microsoft Marketplace (table in
the README; enforced by `tests/publishing.test.cjs`). Never move, rename, or noindex them.
`/twenty5/` is Apple's marketing URL and must keep redirecting to `/products/twenty5/`. Add
new pages instead of moving old ones.

## Common tasks

- **Recheck prices and listings:** read each source above, compare with the product page,
  `/products/` card, JSON-LD, and tests; update all of them; record the date.
- **Add a product:** follow the README's "Adding a product" checklist (product page in the
  standard section order, support and privacy pages, products card, homepage tile, menu and
  footer partials, support hub, 404 page, sitemap, tests).
- **New screenshots or marketing images:** marketing folders live in each product's project
  (for example `pbiviz/.../marketing`, `Tab Cycler/promotional-v2`,
  `Frame64/versions/<version>/promotional-v2`). Prefer unretouched captures cropped to the
  product UI. Display WebP copies (ImageMagick, `-quality 88 -define webp:method=6`), keep the
  PNG for full-size links and share images, set real `width`/`height`, and write alt text
  from what the image actually shows. Record the source in the README's Assets section.
- **Shared header, footer, or head:** edit `_partials/`, never the pages; then `npm run build`.
- **Styles:** edit `css/src/` modules, never `css/style.css`; then `npm run build`. Unused
  classes fail the tests.
- **Refactors that should not change the look:** prove it with the `static-site-review`
  skill's `visual-diff.js` (baseline copy under an `_`-prefixed path, which is never
  published), and delete the baseline copy before committing.

## Verify, merge, and publish

1. `npm run build`, `npm run check`, and `npm test` must all pass.
2. Preview with `npm run serve` and check changed pages in a browser at 320px and desktop
   width, in light and dark themes, with no horizontal overflow.
3. Commit on the branch, then merge into local `main` with `--no-ff`.
4. **Push only when the owner asks.** Run the push in the background: Git Credential
   Manager sometimes opens a GitHub sign-in window and the push waits until the owner
   completes it, so tell them to look for it if the push is slow.
5. After pushing, confirm the GitHub Actions "Test" run for the commit succeeded
   (`gh run list --commit <sha>`), the Pages build finished
   (`gh api repos/unclocked-studios/unclocked.app/pages/builds/latest`), and the changed pages
   are live. Report results plainly, including anything waiting on the owner.
6. Keep `VALIDATION.md` current with dated facts, decisions, and open owner follow-ups.
