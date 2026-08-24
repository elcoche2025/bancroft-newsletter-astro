# Changelog

All notable changes to the Bancroft Newsletter Astro build. Newest first.

## 2026-08-24

### Added
- **`/schedule`** — the SY 2026-27 First Grade Master Schedule, served at `bancroft1.org/schedule`.
  A standalone self-contained HTML file dropped into `public/schedule/index.html`; Astro copies
  `public/` verbatim, so it is not a component and the build does not touch it. **Deliberately
  unlisted:** nothing on the site links to it, the page itself contains zero `<a>` tags, and it
  carries `<meta name="robots" content="noindex, nofollow">`. Public URL, no password.
  Source of truth is `Bancroft ES/2026-2027/Schedules/SY26-27_1st_Grade_Schedule.html` — the
  committed copy is byte-identical apart from the added robots meta line.

## 2026-08-19

### Added
- **SY 2026-27 calendar** (`src/data/calendars/2026-2027.json`), transcribed from the DCPS SY 26-29 PDF. First day **2026-08-24**, last day **2027-06-17**, 36 no-school dates, 3 break ranges, terms 46/44/44/46. Verified against the PDF's own "Student Days in Month" column: all 11 months match, 180 total, all 4 terms match.
- **Per-school-year calendars.** `src/data/calendar.json` → `src/data/calendars/2025-2026.json`, joined by `2026-2027.json` and a `CALENDARS` registry + `calendarFor(date)` in `src/lib/utils.ts`. Every consumer (utils, NewsletterContent, TodayFirst, Pocket) now resolves the calendar from the issue's own date, so **rolling the site into a new school year no longer rewrites the dashboards on archived issues.**
- **`/archive` page** (`src/pages/archive.astro`) — every issue filed by school year, newest year first, with per-year issue numbers, bilingual EN/ES, and a "Back to this week" link. Uses the site's own CSS tokens so it follows dark mode; the theme picker is hidden there (nothing to theme).
- **School-year helpers** in `src/lib/utils.ts` — `schoolYearOf`, `formatSchoolYear`, `groupWeeksBySchoolYear`, `issueNumberInSchoolYear`. A school year runs August → June, so an issue dated Aug or later belongs to the year starting that August.
- **Specials block time (1:30–2:15)** surfaced in all four themes: a pill beside the heading in Classic and Pocket, appended to the kicker in Newsstand and to the peek line in Today First. Label lives at `config.labels.{en,es}.specialsTime`.

### Changed
- **Left sidebar now scopes to one school year.** It lists only the issues from the school year of the page you're reading, labelled with that year, and ends with a pinned "Archive" link out to `/archive`. The mobile "Past Newsletters" accordion does the same. Nothing is unlinked — older years just moved one click away.
  - The sidebar is now a flex column: heading and Archive link stay pinned, only the week list scrolls. Without this the Archive link sat below ~38 items and was effectively undiscoverable.
- **Issue numbers restart each school year.** Was `weeksIndex.length - indexOf(date)` (continuous forever, so the first 2026-27 issue would have read "Issue 39"); now it's the position within its own school year. Verified byte-identical on all 38 existing issues — the change only affects issues dated August 2026 onward.
- **The last day of school now counts as a school day.** `type: "END"` entries were being swept into the no-school set, so the school-day total ran one short (2025-26 computed 177 where DCPS says 180). `noSchoolDates()` in `utils.ts` and the three client-side `updateLiveDashboard` copies now skip `END`. Archived 2025-26 pages shift by +1 day remaining as a result — e.g. the week of June 15 correctly reads 3 days left (Jun 16/17/18) instead of 2.
- **`Newsletter.astro` layout** — `date` prop is now optional (it was declared but never used) and a new `showThemeSelector` prop (default `true`) lets standalone pages omit the theme picker.

## 2026-04-12

### Added
- **Week of April 20, 2026** — Autism Acceptance Month edition. Welcome message features a brief intro and link to the family resource page at `tools.bancroft1.org/autism-families`. Spring Break is over; Term 4 is underway.
- **Week of April 6, 2026** — Back-synced from the live site.
- **Week of March 30, 2026** — Back-synced from the live site.

### Changed
- **Dashboard "school days remaining" is now live** — Previously, the count was computed at build time using each newsletter's week date, which meant the Astro build and the live `bancroft1.org` site could disagree (e.g., 40 vs 41 on 2026-04-12). Added a client-side recompute in `NewsletterContent.astro`: an inline `<script define:vars={{ calendarData }}>` block mirrors the `countWeekdays` logic from the original `script.js`, uses `new Date()` for "today", and patches `#dashboard-days-remaining` plus `#dashboard-progress-fill` on page load. Archived weeks will no longer drift as time passes — every load shows the correct count for the moment the visitor arrives.

## 2026-03-23 and earlier

See git history (`ca7a86e` and older) for week-by-week additions, vocab column work, ROARS restyling, and related feature commits.
