# Changelog

All notable changes to the Bancroft Newsletter Astro build. Newest first.

## 2026-08-24

### Changed
- **Classic is now the only theme for SY 2026-27 and later.** The other three still render
  on archived issues, so nothing is lost and the picker still works there — but a current
  issue ships Classic alone. Real payload cut, not a hidden picker: **70 KB vs 309 KB**,
  because Today First / Newsstand / Pocket are no longer in the DOM. Guarded against the
  obvious failure — a visitor with `nl-theme: "C"` stored would otherwise land on a page
  whose variant C markup doesn't exist and see nothing; the bootstrap forces `classic` when
  `<html data-multi-theme="0">` and leaves the stored value alone for the archive.
- **"Coming Up" and "Important Reminders" are one list.** They were two blocks saying the
  same kind of thing in two places, and the numbers bear it out: **15 of the 60 reminders
  ever written restated a date the calendar already knew** — Memorial Day was hand-typed
  into six consecutive issues. `getComingUp()` merges them chronologically; when a reminder
  lands on a covered date the reminder wins and the calendar row drops, because the teacher's
  wording is richer and can carry a link. Suppression runs after range collapsing, so a
  reminder on the Monday of Spring Recess removes the whole Apr 13–17 row instead of leaving
  a "Tue–Fri" remnant. Past-dated reminders no longer show at all. **The three archive-only
  themes never displayed calendar dates in the first place** — hand-typing them was the only
  way they ever appeared there, which is the clearest evidence the split was wrong.

### Added
- **The monthly SEL / Strong Start theme now renders**, as a row in the "School Year at a
  Glance" dashboard between the progress bar and Coming Up. It is a per-month constant, so it
  belongs with the other at-a-glance facts rather than as its own section; a month with no
  theme (July) renders nothing. The archive-only themes each carry a variant of the row.
- **August/September reminders on the 2026-08-24 issue**, from the school's bilingual
  August/September Reminders flyer: **Family Fiesta** (Fri Aug 28, 6:00–7:30 pm, enter through
  the soccer field), **Back to School Night at Newton** (Thu Sep 10, 6:00–8:00 pm, school gym,
  Kindergarten–5th grade) and **Back to School Night at Sharpe** (Thu Sep 17, 6:00–7:00 pm,
  room TBD). The Family Fiesta also gets a line in the welcome, since it falls inside the week
  this issue covers. The flyer's PK3/PK4 first day (Aug 27) is deliberately omitted; the Sharpe
  evening is kept but labelled PK3/PK4, which only the Spanish side of the flyer states, for
  first-grade families with younger siblings. Labor Day is already a calendar date and shows in
  "Coming Up", so it is not duplicated as a reminder.
- **SEL / Strong Start monthly themes** (`config.selThemes`), bilingual EN/ES, transcribed from
  the school's "SEL / Strong Start Monthly Themes" poster. Keyed by calendar month — August and
  September share "Everyone Has a Place at Bancroft"; July has no theme. `selThemeFor(date, lang)`
  in `src/lib/utils.ts` resolves an issue's theme from the issue's *own* date, so archived issues
  keep the theme that was current when they were written. Heading string lives at
  `config.labels.{en,es}.selThemeHeading`. **Data and helper only — not yet rendered in any theme**;
  where it appears in the newsletter is still an open design decision.
- **`/schedule/family` — family-facing per-class schedule (unlisted).** Six schedules, one per
  homeroom (Cartagena, Colombia, España, Venezuela, Managua, DR), showing each class's real day
  from the *student* perspective rather than the subject-room perspective. Built by combining the
  shared spine (breakfast, lunch, recess, specials, pack up) with the block segments from whichever
  subject that class is in during Blocks 1/2/3, per the `Rotation Order` sheet of
  `SY26-27 Master Schedule.xlsx`. Plain-language block names, an emoji for every block, bilingual
  EN/ES, and each class's specials for the week read from `config.rotations` + the week JSON's
  letter days. `noindex, nofollow` and **not linked from anywhere** — it is out for teacher review.
  Regenerate with `drafts/build_family.py`, which asserts every class day is contiguous 8:35–3:15
  and totals exactly 230 core instructional minutes.
- **Phone layout for `/schedule`.** At ≤720px the three-column grid is replaced by a tabbed
  single-column view — one tab per section (1st Math / 1st SLA / 1st ELA) — so the schedule
  needs **no horizontal scrolling at all**, verified down to a 320px viewport. Each row shows
  start time, block name, full time range, duration and the category description, colour-coded
  with the same tokens as the grid. Includes a sticky tab bar, a live "Right now" card with a
  *Jump to now* button, academic-block separators, and a per-section instructional-minutes card.
  Transitions are kept for accuracy but rendered as quiet dashed dividers.
  The phone view is **built at runtime from the grid markup**, so the two layouts cannot drift
  apart — editing the grid updates both. Without JS the original grid is left in place, so the
  page degrades gracefully rather than going blank.
  Also fixes a pre-existing overflow: the masthead clock had `white-space:nowrap` and was itself
  forcing ~554px of sideways scroll on phones.
- **`/schedule`** — the SY 2026-27 First Grade Master Schedule, served at `bancroft1.org/schedule`.
  A standalone self-contained HTML file dropped into `public/schedule/index.html`; Astro copies
  `public/` verbatim, so it is not a component and the build does not touch it. **Deliberately
  unlisted:** nothing on the site links to it, the page itself contains zero `<a>` tags, and it
  carries `<meta name="robots" content="noindex, nofollow">`. Public URL, no password.
  Source of truth is `Bancroft ES/2026-2027/Schedules/SY26-27_1st_Grade_Schedule.html` — the
  committed copy is byte-identical apart from the added robots meta line.
- **Week of 2026-08-24 — the first issue of SY 2026-27.** A start-of-year welcome plus the
  specials board and nothing else: Days A–E, Monday through Friday, school every day.
  No Math, Literacy, ROARS, reminders, vocabulary, or books — those start next week.
- **Math, Literacy and ROARS are now optional sections**, joining the five that already were.
  `hasBilingualText()` and `weekHasRoars()` in `src/lib/utils.ts` decide; all four themes drop
  the section, its tab/peek entry, and its jump link rather than rendering an empty card.
  A week's JSON now needs only `date`, `season`, `welcome` and `specials`.
- **`stripTags()`** in `src/lib/utils.ts` — plain text for peeks and pull quotes. Replaces tags
  with a space (so a `<br><br>` paragraph break doesn't glue two sentences together) and then
  closes the gap back up before punctuation. Used by the Newsstand pull quote and the Pocket
  welcome peek; output is byte-identical to the old inline strip on all 38 prior issues.

### Changed
- **The jump-to bar only links to sections that rendered.** It previously printed all nine links
  on every issue, so Reminders/Ask/Vocab/Books were dead anchors on any week lacking them —
  22 issues had four dead links each. Driven by a `sectionPresent` map in `NewsletterContent.astro`.
- **Newsstand section numbers come off `contentItems`** (`nsNo(id)`) instead of hand-written
  `sortedReminders.length > 0 ? '05' : '04'` ternaries and one IIFE that decremented then
  re-incremented. Numbering stays consecutive however many sections an issue omits.
  Verified byte-identical on all 38 prior issues.

### Fixed
- **Two calendar labels, cross-checked against DCPS's own family-facing flip calendar**
  (`SY26-27_DCPS_CALENDAR_ENGLISH.pdf` / `_SPANISH.pdf`, linked from the SY 2026-27 publication
  page — a different document from the SY 26-29 grid the calendar was transcribed from):
  - `2026-11-03` "No School" → **Election Day** / *Día de las Elecciones*. The grid marks it
    `***` with no reason; the flip calendar names it on both the Key Dates page and the
    November page, for students and teachers alike.
  - `2027-01-26` "End of Term / Records Day" → **Records & Professional Development Day** /
    *Día de Registros y Desarrollo Profesional*. Term 2 ends Jan 25; Jan 26 is `R/PD`.

### Verified
- **SY 2026-27 calendar, per-date.** Three independent checks, all passing with no data change:
  1. Every named holiday recomputed from its own rule (first Monday of September, third Monday
     of January, last Monday of May, Juneteenth falling on a Saturday → observed Friday) —
     11 of 11 match, and no no-school date lands on a weekend.
  2. `pdfplumber` cell-by-cell extraction of the SY 26-29 grid — day numbers on one baseline,
     annotations on the other, each assigned to a cell by x-position — **exact match**:
     34 no-school dates in range, none missing, none extra.
  3. DCPS's **newer single-year PDF** (`SY 26-27 Calendar_English_061126.pdf`, dated 06/11/26,
     i.e. 13 months after the 042825 multi-year grid we transcribed) is identical in every
     student-day-relevant cell. Its only additions are an `LS` "Last Day for Seniors" marker
     and reformatted religious observances.
- **All four term end dates confirmed** from the flip calendar's per-month TEACHERS rows
  (Oct 29, Jan 25, Apr 8, Jun 17) — previously they were our own derivation from the `ET`
  markers, since the PDF's term table prints only the day counts.
- A third-party calendar site listing a **March 12, 2027 parent-teacher conference** is wrong:
  March 2027 shows 18 student days against 23 weekdays and exactly five `***` (Spring Break
  22–26), and the flip calendar's March page lists Spring Break only.

## 2026-08-19

### Added
- **SY 2026-27 calendar** (`src/data/calendars/2026-2027.json`), transcribed from the DCPS SY 26-29 PDF. First day **2026-08-24**, last day **2027-06-17**, 36 no-school dates, 3 break ranges, terms 46/44/44/46. The PDF's "Student Days in Month" column reconciles per *month* (all 11 months match, 180 total, all 4 terms match) — that catches a wrong count, not a date transposed inside a month. Per-*date* verification came later: see 2026-08-24.
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
