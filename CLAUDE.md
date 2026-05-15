# Bancroft Newsletter (Astro)

The G1 weekly newsletter, deployed to Vercel and aliased to `bancroft1.org`.
**As of 2026-05-01 this is the production site** (cut over from the legacy
SPA at `sites/bancroft1.org/nl-f2049c43/`).

## Current state
Production. Tier 1.

## Tech stack
- Astro (static output) — `npm run build`
- Vercel hosting — project `bancroft-newsletter-astro`, aliased to `bancroft1.org`
- GitHub repo: `elcoche2025/bancroft-newsletter-astro` (source-of-truth backup)

## Critical gotchas
- **Deploy command:** `cd bancroft-newsletter-astro && npx vercel deploy --prod --yes`. Pushing to GitHub does NOT auto-deploy (the old `.github/workflows/deploy.yml` GH Pages action was removed during the cutover).
- **Data path:** `src/data/weeks/YYYY-MM-DD.json` + prepend date to `src/data/weeks/weeks-index.json`.
- **Don't touch the legacy SPA** at `../sites/bancroft1.org/`. It's frozen — its Vercel GitHub auto-deploy was disconnected 2026-05-09. Don't mirror newsletter content there, don't commit, don't push. The directory exists only as an emergency rollback artifact.
- **Strategy images:** `public/images/weekly/m{N}-t{X}-strategy-{en|es}.png`
- **Family Math PDFs:** `public/docs/EM2_G1_M{N}_T{X}_FamilyMath_*.pdf`
- **Site config:** `astro.config.mjs` has `site: 'https://bancroft1.org'` and no `base` (root deploy). Don't reintroduce a base path — that broke older weeks the first time around.
- **FERPA:** ROARS section contains student first names + last initials. Don't expose anywhere indexable.

## Rollback
The legacy SPA snapshot still exists in `sites/bancroft1.org/nl-f2049c43/` and as a Vercel deployment at `bancroft-newsletter-24nrjsxzz-mws-projects-080b130f.vercel.app` (publicly accessible — SSO protection removed 2026-05-09 so you can preview before aliasing). Emergency rollback:
`cd ../sites/bancroft1.org && npx vercel alias set bancroft-newsletter-24nrjsxzz-mws-projects-080b130f.vercel.app bancroft1.org`

## See also
- `../OPERATIONS.md` — full posting flow
- `../sites/bancroft1.org/CLAUDE.md` — archived legacy SPA notes
