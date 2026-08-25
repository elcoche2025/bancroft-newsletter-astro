# Google Sheets Fetch Setup

This script fetches weekly newsletter data from the Google Sheet and generates JSON files.

## 1. Create a Google Cloud Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Enable the **Google Sheets API**:
   - Go to APIs & Services > Library
   - Search for "Google Sheets API"
   - Click Enable
4. Create a Service Account:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "Service Account"
   - Give it a name (e.g., "newsletter-reader")
   - No special roles needed (it only reads a shared sheet)
   - Click Done

## 2. Download the JSON Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key" > JSON
4. Save the downloaded file as: `secrets/google-service-account.json`

## 3. Share the Google Sheet

1. Open the service account details and copy the **email address** (looks like `name@project.iam.gserviceaccount.com`)
2. Open the [Google Sheet](https://docs.google.com/spreadsheets/d/1WlYzGKxrr0Gu8_Oen2jJrAK0oF8GCEW1In66Z3ov5ZU/)
3. Click Share and add the service account email as a **Viewer**

## 4. Verify Setup

```bash
# Check that the column headers match your expectations
node scripts/fetch-week.mjs --headers

# Preview what data the script finds for a specific week
node scripts/fetch-week.mjs 2026-08-31 --preview

# Generate a week (dry run first)
node scripts/fetch-week.mjs 2026-08-31 --dry-run

# Generate for real
node scripts/fetch-week.mjs 2026-08-31
# or
npm run new-week -- 2026-08-31
```

Generating the JSON is only half of posting an issue — you still have to prepend
the date to `src/data/weeks/weeks-index.json` and deploy. See `../README.md`.

## Column Mapping

The script maps Google Sheet columns to JSON fields. If the sheet layout changes, edit the `COLUMN_MAP` object at the top of `scripts/fetch-week.mjs`.

Run `--headers` to see the current sheet headers and how they map.

## Notes

- **Reminders are not in the Google Sheet** — add them by hand to the generated
  JSON. Since 2026-08-24 they no longer render as their own section: they merge
  with the calendar's no-school dates into the dashboard's single "Coming Up"
  list. Two consequences when you write one:
  - **Don't restate a date the calendar already knows.** A reminder on a covered
    date suppresses the calendar row, so writing "Memorial Day — no school"
    replaces a row that was already correct and bilingual. Write reminders for
    things the calendar cannot know: events, deadlines, what to bring.
  - **A reminder dated before the issue never renders.** It is a *coming up*
    list. Retrospective notes belong in `welcome`.
- **ROARS names** are automatically converted to "First L." format.
- **The sheet does not cover every field.** `reminders`, `askYourChild`,
  `vocabulary`, `mathDetails` and `roarsClass` are hand-added. All of them are
  optional — a week's JSON only requires `date`, `season`, `welcome` and
  `specials`, and any section left out simply doesn't render.
- The `secrets/` directory is gitignored.
