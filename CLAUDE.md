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
- **Today-column highlight (specials boards):** Every theme's full specials board tags each day cell (header + body) with `data-day-col={0..4}` (Mon–Fri). One global script in `src/layouts/Newsletter.astro` (`highlightTodayColumn()`) adds `.is-today-col` to the current real weekday's column on load; global CSS there bands it (warm yellow default; violet for Pocket via `--nl-today-col`/`--nl-today-line`; forced dark header text so Newsstand's dark header stays readable). Weekends highlight nothing. To extend to a new theme, just add `data-day-col` to its board cells.
- **`/schedule` is an unlisted static page, not a route.** `public/schedule/index.html` is a hand-authored, self-contained HTML file (only external dep: Google Fonts) copied verbatim by Astro. Nothing links to it and it is `noindex, nofollow` — that is intentional, don't "fix" it by adding it to nav or a sitemap. To update it, re-copy from `Bancroft ES/2026-2027/Schedules/SY26-27_1st_Grade_Schedule.html` and re-add the robots meta after the viewport meta.
- **Strategy images:** `public/images/weekly/m{N}-t{X}-strategy-{en|es}.png`
- **Family Math PDFs:** `public/docs/EM2_G1_M{N}_T{X}_FamilyMath_*.pdf`
- **Site config:** `astro.config.mjs` has `site: 'https://bancroft1.org'` and no `base` (root deploy). Don't reintroduce a base path — that broke older weeks the first time around.
- **FERPA:** ROARS section contains student first names + last initials. Don't expose anywhere indexable.
- **Archive / school years:** the left sidebar (Classic theme only — the other three don't render a week list) shows *only* the school year of the page being viewed, then a pinned "Archive" link to `/archive`, which groups every issue by school year. A school year runs August → June; the split is derived in `src/lib/utils.ts` (`schoolYearOf`), so **adding the first issue dated August-or-later automatically flips the sidebar to the new year and files the old one under `/archive` — there is no config flag to remember.** Issue numbers likewise restart each August (`issueNumberInSchoolYear`).
- **Specials time (1:30–2:15):** lives at `config.labels.{en,es}.specialsTime` for Classic, but is hardcoded in the three modern themes (Newsstand kicker, Today First peek, Pocket `.pk-card-time`) — change all four if the block moves. Pocket's peek line is rewritten by `initSpecials()` at runtime, which is why its time sits on the title row instead.
- **Specials rotation is unchanged for 2026-27** — the A–F matrix in `config.rotations` was verified against the school's 2026-27 guide on 2026-08-19 and matches exactly. The school now writes PE as "PE 1"/"PE 2" and Library as "Library Media"; we deliberately keep displaying "PE" and "Library" to families. If that's ever reversed, `subjectIcons`, `subjectTranslations`, and the `nsShortEn/Es` + `subjectShortEn/Es` maps in Newsstand and Pocket all need the new keys.
- **Calendars are per school year:** `src/data/calendars/<schoolYear>.json` (e.g. `2026-2027.json`), registered in the `CALENDARS` map at the top of `src/lib/utils.ts`. `calendarFor(date)` picks the right one from the issue's date, so archived issues keep computing their dashboard against the year they were written in. **Adding a new year = drop in the JSON, add one line to `CALENDARS`, and bump `NEWEST_SCHOOL_YEAR`.** SY 2027-28 and 2028-29 are on pages 2 and 3 of the same DCPS PDF already linked in `calendarPdfUrl`.
- **`END` is a school day.** The last day of school is listed in `dates` with `type: "END"` so it shows up in "Coming Up", but it must NOT count as a no-school day. `noSchoolDates()` in `utils.ts` filters it out, and the three client-side `updateLiveDashboard` copies (NewsletterContent, TodayFirst, Pocket) do the same — keep all four in sync. SY 2026-27 verified at exactly 180 student days and 46/44/44/46 term days against the PDF's own printed columns.
- **Whole-class ROAR:** optional `roarsClass: {en, es}` field (HTML allowed) in a week's JSON renders a celebratory whole-class banner in all four themes instead of per-student cards (first used 2026-06-15, last week of school). Leave `roars: {}` when using it.

## Rollback
The legacy SPA snapshot still exists in `sites/bancroft1.org/nl-f2049c43/` and as a Vercel deployment at `bancroft-newsletter-24nrjsxzz-mws-projects-080b130f.vercel.app` (publicly accessible — SSO protection removed 2026-05-09 so you can preview before aliasing). Emergency rollback:
`cd ../sites/bancroft1.org && npx vercel alias set bancroft-newsletter-24nrjsxzz-mws-projects-080b130f.vercel.app bancroft1.org`

## See also
- `../OPERATIONS.md` — full posting flow
- `../sites/bancroft1.org/CLAUDE.md` — archived legacy SPA notes
