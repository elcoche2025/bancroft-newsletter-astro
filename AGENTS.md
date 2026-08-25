# Bancroft Newsletter (Astro) — agent orientation

The weekly bilingual first-grade newsletter for Bancroft Elementary School,
Washington DC. Astro static output, deployed to Vercel, aliased to
`bancroft1.org`. Production since 2026-05-01. Currently serving **SY 2026-27**,
whose first issue is `2026-08-24`.

> **`CLAUDE.md` in this directory is the authoritative, maintained doc.**
> Read it first — it carries the full gotcha list, the current state, and the
> conventions. This file is the condensed orientation and defers to it wherever
> they differ. Do not let the two drift: this file was a verbatim copy of
> `CLAUDE.md` until 2026-08-25, by which point it was three months stale and
> wrong about the calendar, the archive, the themes and the section model.

## Never break these

- **Deploy is a separate act from pushing.** `npx vercel deploy --prod --yes`
  publishes; `git push` only backs up. Neither triggers the other.
- **`main` is shared with other agent sessions.** A deploy ships everything
  committed on `main`, not just your work. Run
  `git fetch && git log --oneline origin/main..main` before deploying, and diff
  production against your build for pages you did not touch.
- **FERPA.** The ROARS section carries student first names and last initials.
  Never put it anywhere indexable, and never copy the `Rotation Order` sheet of
  `SY26-27 Master Schedule.xlsx` into the repo — it holds a SpEd roster.
- **Don't touch the legacy SPA** at `../sites/bancroft1.org/`. Frozen since
  2026-05-09, kept only as a rollback artifact. No commits, no pushes, no
  mirroring content into it.
- **`/schedule` and `/schedule/family` are unlisted on purpose** (`noindex`,
  linked from nowhere). `/schedule/family` is out for teacher review and must
  not be linked from the newsletter until Mekoce says so.
- **Don't reintroduce a `base` path** in `astro.config.mjs`. It broke every
  archived week the first time.

## The model, in one screen

- **One issue = one JSON** at `src/data/weeks/YYYY-MM-DD.json`, plus its date
  prepended to `weeks-index.json`. Only `date`, `season`, `welcome` and
  `specials` are required; every other section is optional and simply doesn't
  render when absent.
- **Classic is the only live theme.** Issues from SY 2026-27 on render it alone.
  Today First / Newsstand / Pocket still render on 2025-26 and earlier issues,
  along with the theme picker. They are archive furniture — don't build against
  them, and don't assume a Classic change reaches them.
- **A school year runs August → June**, derived from the issue date. The
  sidebar, `/archive` and issue numbering all roll over automatically when the
  first August-dated issue lands. There is no flag to flip.
- **Calendars are per school year**, `src/data/calendars/<year>.json`. Archived
  issues keep computing against the year they were written in.
- **"Coming Up" is the only dates list.** The calendar's closures and the week's
  own `reminders` merge into one chronological list in the dashboard. There is
  no Reminders section any more.

## Files

| File | Purpose |
| :-- | :-- |
| `CLAUDE.md` | Authoritative state + gotchas. Start here. |
| `README.md` | Orientation, repo layout, commands. |
| `CHANGELOG.md` | What changed and why, newest first. |
| `DESIGN.md` | Design system: palette, type, layout, don'ts. |
| `scripts/SETUP.md` | Google Sheets setup for `npm run new-week`. |
| `../OPERATIONS.md` | Portfolio-level posting flow. |
| `../sites/bancroft1.org/CLAUDE.md` | Archived legacy SPA notes. |
