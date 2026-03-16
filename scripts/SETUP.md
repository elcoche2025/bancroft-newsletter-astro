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
node scripts/fetch-week.mjs 2026-03-23 --preview

# Generate a week (dry run first)
node scripts/fetch-week.mjs 2026-03-23 --dry-run

# Generate for real
node scripts/fetch-week.mjs 2026-03-23
# or
npm run new-week -- 2026-03-23
```

## Column Mapping

The script maps Google Sheet columns to JSON fields. If the sheet layout changes, edit the `COLUMN_MAP` object at the top of `scripts/fetch-week.mjs`.

Run `--headers` to see the current sheet headers and how they map.

## Notes

- **Reminders** are not in the Google Sheet -- add them manually to the generated JSON
- **ROARS names** are automatically converted to "First L." format
- The `secrets/` directory is gitignored
