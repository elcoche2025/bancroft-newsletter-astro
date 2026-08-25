# Bancroft 1st Grade Weekly Newsletter

The weekly bilingual (EN/ES) newsletter for Bancroft Elementary School's first
grade, Washington DC. Astro, static output, deployed to Vercel and aliased to
**[bancroft1.org](https://bancroft1.org)**. Production since 2026-05-01.

## Posting a newsletter

1. Add `src/data/weeks/YYYY-MM-DD.json` (the Monday of that week).
2. Prepend that date to `src/data/weeks/weeks-index.json`.
3. `npx vercel deploy --prod --yes`

Pushing to GitHub does **not** deploy — the two steps are independent.

A week's JSON needs only `date`, `season`, `welcome` and `specials`. Everything
else — `math`, `literacy`, `roars`, `reminders`, `askYourChild`, `vocabulary`,
`books` — is optional, and any section left out simply doesn't render.

`npm run new-week -- YYYY-MM-DD` scaffolds a week from the Google Sheet; see
`scripts/SETUP.md` for the one-time service-account setup.

## Layout of the repo

```text
src/
├── data/
│   ├── weeks/YYYY-MM-DD.json   one issue each, + weeks-index.json
│   ├── calendars/<year>.json   one DCPS calendar per school year
│   └── config.json             classrooms, specials rotation, labels, SEL themes
├── lib/utils.ts                school-year, calendar and Coming Up helpers
├── layouts/Newsletter.astro    shell: language toggle, dark mode, global CSS
├── components/
│   ├── NewsletterContent.astro Classic — the live theme
│   └── themes/                 Today First, Newsstand, Pocket (archive only)
└── pages/                      index, [week], archive
public/schedule/                unlisted static schedule pages
```

## Things that will bite you

Read **`CLAUDE.md`** before changing anything — it is the maintained gotcha list.
The short version:

- **Classic is the only theme for SY 2026-27 and later.** The other three render
  on archived issues only. Don't build new features against them.
- **Calendars are per school year.** Archived issues compute their dashboard
  against the year they were written in; adding a year is a JSON file plus one
  line in `CALENDARS`.
- **A school year runs August → June** and is derived from the issue date, so the
  sidebar, the archive and issue numbering all roll over on their own.
- **FERPA:** the ROARS section carries student first names and last initials.
  Never expose it anywhere indexable.
- **`main` is shared** with other sessions, and a deploy ships everything
  committed on it — check `git log origin/main..main` first.

## Commands

| Command | Action |
| :-- | :-- |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Serve the built site |
| `npm run new-week -- YYYY-MM-DD` | Scaffold a week from the Google Sheet |

## Docs

| File | What it's for |
| :-- | :-- |
| `CLAUDE.md` | **Authoritative.** Current state, gotchas, conventions. |
| `AGENTS.md` | Condensed orientation for non-Claude agents; defers to CLAUDE.md. |
| `CHANGELOG.md` | What changed, when, and why. Newest first. |
| `DESIGN.md` | The design system — palette, type, layout, the don'ts. |
| `scripts/SETUP.md` | Google Sheets service-account setup for `new-week`. |
