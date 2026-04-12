# Changelog

All notable changes to the Bancroft Newsletter Astro build. Newest first.

## 2026-04-12

### Added
- **Week of April 20, 2026** — Autism Acceptance Month edition. Welcome message features a brief intro and link to the family resource page at `tools.bancroft1.org/autism-families`. Spring Break is over; Term 4 is underway.
- **Week of April 6, 2026** — Back-synced from the live site.
- **Week of March 30, 2026** — Back-synced from the live site.

### Changed
- **Dashboard "school days remaining" is now live** — Previously, the count was computed at build time using each newsletter's week date, which meant the Astro build and the live `bancroft1.org` site could disagree (e.g., 40 vs 41 on 2026-04-12). Added a client-side recompute in `NewsletterContent.astro`: an inline `<script define:vars={{ calendarData }}>` block mirrors the `countWeekdays` logic from the original `script.js`, uses `new Date()` for "today", and patches `#dashboard-days-remaining` plus `#dashboard-progress-fill` on page load. Archived weeks will no longer drift as time passes — every load shows the correct count for the moment the visitor arrives.

## 2026-03-23 and earlier

See git history (`ca7a86e` and older) for week-by-week additions, vocab column work, ROARS restyling, and related feature commits.
