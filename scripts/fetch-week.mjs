#!/usr/bin/env node
/**
 * fetch-week.mjs — Fetch weekly newsletter data from Google Sheets and generate JSON
 *
 * Usage:
 *   node scripts/fetch-week.mjs 2026-03-23           # Generate week JSON
 *   node scripts/fetch-week.mjs 2026-03-23 --dry-run # Print JSON without writing
 *   node scripts/fetch-week.mjs 2026-03-23 --preview # Show raw column data
 *   node scripts/fetch-week.mjs --headers             # Print sheet column headers
 */

import { google } from 'googleapis';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

// ============================================================================
// COLUMN MAP — Adjust these if the Google Sheet columns change
// ============================================================================
// Each key is the JSON field name; the value is the column letter in the sheet.
// Use --headers flag to see actual column headers from the sheet.
const COLUMN_MAP = {
  date:           'A',   // Week date (YYYY-MM-DD or similar)
  welcomeEn:      'B',   // Welcome message (English)
  mathEn:         'C',   // Math content (English)
  slaEn:          'D',   // Spanish Language Arts content (English description)
  elaEn:          'E',   // English Language Arts content (English)
  // F-J: Specials rotation letters or ROARS by classroom
  specialsMon:    'F',   // Specials letter day - Monday
  specialsTue:    'G',   // Specials letter day - Tuesday
  specialsWed:    'H',   // Specials letter day - Wednesday
  specialsThu:    'I',   // Specials letter day - Thursday
  specialsFri:    'J',   // Specials letter day - Friday
  // K-P: ROARS students by classroom
  roarsCartagena: 'K',
  roarsColombia:  'L',
  roarsEspana:    'M',
  roarsDR:        'N',
  roarsManagua:   'O',
  roarsVenezuela: 'P',
  // Q-U: Spanish versions
  welcomeEs:      'Q',   // Welcome message (Spanish)
  mathEs:         'R',   // Math content (Spanish)
  slaEs:          'S',   // SLA content (Spanish)
  elaEs:          'T',   // ELA content (Spanish)
  literacyEs:     'U',   // Combined literacy (Spanish) — fallback if S/T are empty
  // V-Z: Additional data
  vocabEn:        'V',   // Vocabulary words (English), comma-separated
  vocabEs:        'W',   // Vocabulary words (Spanish), comma-separated
  booksRaw:       'X',   // Books/read-alouds (format: "Title by Author; Title by Author")
  mathModule:     'Y',   // Math module/topic/lesson info
  askYourChild:   'Z',   // Ask Your Child prompts
};

// Sheet configuration
const SHEET_ID = '1WlYzGKxrr0Gu8_Oen2jJrAK0oF8GCEW1In66Z3ov5ZU';
const SHEET_NAME = 'G1 Weekly Newsletter';
const SERVICE_ACCOUNT_PATH = join(PROJECT_ROOT, 'secrets', 'google-service-account.json');

// Classroom names in the order they appear in ROARS columns
const CLASSROOMS = ['Cartagena', 'Colombia', 'España', 'DR', 'Managua', 'Venezuela'];

// ============================================================================
// HELPERS
// ============================================================================

/** Convert column letter (A, B, ..., Z, AA, ...) to 0-based index */
function colToIndex(col) {
  let index = 0;
  for (let i = 0; i < col.length; i++) {
    index = index * 26 + (col.charCodeAt(i) - 64);
  }
  return index - 1;
}

/** Get cell value from a row by column letter */
function getCell(row, colLetter) {
  const idx = colToIndex(colLetter);
  return (row && row[idx]) ? row[idx].trim() : '';
}

/** Determine season from date string */
function getSeason(dateStr) {
  const month = parseInt(dateStr.split('-')[1], 10);
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 7) return 'summer';
  if (month >= 8 && month <= 11) return 'fall';
  return 'winter'; // Dec-Feb
}

/** Convert "Camila Torres" to "Camila T." */
function toFirstLastInitial(name) {
  if (!name) return '';
  const trimmed = name.trim();
  if (!trimmed) return '';

  // If already in "First L." format, return as-is
  if (/^[A-Za-zÀ-ÿ]+ [A-Za-zÀ-ÿ]+(-[A-Za-zÀ-ÿ]+)?\.$/.test(trimmed)) {
    return trimmed;
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0];

  const first = parts[0];
  const last = parts[parts.length - 1];

  // Handle hyphenated last names: "W-L" stays as "W-L."
  if (last.includes('-')) {
    const initials = last.split('-').map(p => p[0].toUpperCase()).join('-');
    return `${first} ${initials}.`;
  }

  return `${first} ${last[0].toUpperCase()}.`;
}

/** Parse comma-separated list, trimming each item */
function parseList(str) {
  if (!str) return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

/** Parse books string: "Title by Author; Title by Author" */
function parseBooks(str) {
  if (!str) return [];
  return str.split(';').map(entry => {
    const trimmed = entry.trim();
    if (!trimmed) return null;
    // Try "Title by Author" pattern
    const byMatch = trimmed.match(/^(.+?)\s+by\s+(.+)$/i);
    if (byMatch) {
      return {
        title: { en: byMatch[1].trim(), es: byMatch[1].trim() },
        author: byMatch[2].trim()
      };
    }
    // Fallback: just a title
    return {
      title: { en: trimmed, es: trimmed },
      author: ''
    };
  }).filter(Boolean);
}

/** Parse "Ask Your Child" prompts — expects "EN prompt | ES prompt" per line or semicolon-separated */
function parseAskYourChild(str) {
  if (!str) return [];
  // Split by newlines or semicolons
  const items = str.split(/[;\n]+/).map(s => s.trim()).filter(Boolean);
  return items.map(item => {
    const parts = item.split('|').map(s => s.trim());
    return {
      en: parts[0] || '',
      es: parts[1] || parts[0] || ''
    };
  });
}

/** Parse math details — expects "Module: ...\nTopic: ...\nLesson: ..." or "Module | Topic | Lesson" */
function parseMathDetails(str) {
  const empty = {
    module: { en: '', es: '' },
    topic: { en: '', es: '' },
    lesson: { en: '', es: '' }
  };
  if (!str) return empty;

  const result = { ...empty };

  // Try line-based format: "Module EN | Module ES\nTopic EN | Topic ES\nLesson EN | Lesson ES"
  const lines = str.split('\n').map(s => s.trim()).filter(Boolean);
  for (const line of lines) {
    const lower = line.toLowerCase();
    let field = null;
    let content = line;

    if (lower.startsWith('module:') || lower.startsWith('módulo:')) {
      field = 'module';
      content = line.replace(/^(module|módulo):\s*/i, '');
    } else if (lower.startsWith('topic:') || lower.startsWith('tema:')) {
      field = 'topic';
      content = line.replace(/^(topic|tema):\s*/i, '');
    } else if (lower.startsWith('lesson:') || lower.startsWith('lección:') || lower.startsWith('leccion:')) {
      field = 'lesson';
      content = line.replace(/^(lesson|lección|leccion):\s*/i, '');
    }

    if (field) {
      const parts = content.split('|').map(s => s.trim());
      result[field] = { en: parts[0] || '', es: parts[1] || parts[0] || '' };
    }
  }

  return result;
}

// ============================================================================
// AUTH
// ============================================================================

function getAuth() {
  if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error(`\n  ERROR: Service account key not found at:\n  ${SERVICE_ACCOUNT_PATH}\n`);
    console.error('  See scripts/SETUP.md for instructions on creating a service account.\n');
    process.exit(1);
  }

  const key = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
  return new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

// ============================================================================
// FETCH DATA
// ============================================================================

async function fetchSheetData(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `'${SHEET_NAME}'`,
  });
  return res.data.values || [];
}

// ============================================================================
// MAIN COMMANDS
// ============================================================================

async function showHeaders(auth) {
  const rows = await fetchSheetData(auth);
  if (rows.length === 0) {
    console.error('Sheet is empty!');
    process.exit(1);
  }
  const headerRow = rows[0];
  console.log('\nColumn headers from Google Sheet:\n');
  headerRow.forEach((header, i) => {
    const letter = String.fromCharCode(65 + i); // works for A-Z
    const colLetter = i < 26 ? letter : `A${String.fromCharCode(65 + i - 26)}`;
    const mappedTo = Object.entries(COLUMN_MAP).find(([, v]) => v === colLetter);
    const mapping = mappedTo ? ` --> ${mappedTo[0]}` : '  (unmapped)';
    console.log(`  ${colLetter}: "${header}"${mapping}`);
  });
  console.log('\nAdjust COLUMN_MAP in fetch-week.mjs if these don\'t match.\n');
}

async function fetchWeek(targetDate, { dryRun, preview }) {
  const auth = getAuth();

  const rows = await fetchSheetData(auth);
  if (rows.length < 2) {
    console.error('Sheet has no data rows (only header or empty).');
    process.exit(1);
  }

  const headerRow = rows[0];
  const dataRows = rows.slice(1);

  // Find the row matching the target date
  const dateColIdx = colToIndex(COLUMN_MAP.date);
  const matchRow = dataRows.find(row => {
    const cellDate = (row[dateColIdx] || '').trim();
    // Match exact date or try normalizing
    return cellDate === targetDate || normalizeDate(cellDate) === targetDate;
  });

  if (!matchRow) {
    console.error(`\n  Date "${targetDate}" not found in column ${COLUMN_MAP.date}.`);
    console.error('  Available dates in the sheet:');
    const dates = dataRows
      .map(r => (r[dateColIdx] || '').trim())
      .filter(Boolean)
      .slice(-10);
    dates.forEach(d => console.error(`    ${d}`));
    process.exit(1);
  }

  // Preview mode: show raw data for each mapped column
  if (preview) {
    console.log(`\nRaw data for week of ${targetDate}:\n`);
    for (const [field, col] of Object.entries(COLUMN_MAP)) {
      const val = getCell(matchRow, col);
      const display = val.length > 120 ? val.substring(0, 120) + '...' : val;
      console.log(`  ${col} (${field}): ${display || '(empty)'}`);
    }
    console.log('');
    return;
  }

  // Build the JSON
  const weekData = buildWeekJSON(matchRow, targetDate);

  if (dryRun) {
    console.log(JSON.stringify(weekData, null, 2));
    return;
  }

  // Write the JSON file
  const weeksDir = join(PROJECT_ROOT, 'src', 'data', 'weeks');
  const outPath = join(weeksDir, `${targetDate}.json`);
  writeFileSync(outPath, JSON.stringify(weekData, null, 2) + '\n');
  console.log(`  Wrote ${outPath}`);

  // Update weeks-index.json
  const indexPath = join(weeksDir, 'weeks-index.json');
  let index = [];
  if (existsSync(indexPath)) {
    index = JSON.parse(readFileSync(indexPath, 'utf8'));
  }
  if (!index.includes(targetDate)) {
    index.unshift(targetDate);
    index.sort((a, b) => b.localeCompare(a)); // newest first
    writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
    console.log(`  Updated ${indexPath} (${index.length} weeks total)`);
  } else {
    console.log(`  ${targetDate} already in weeks-index.json`);
  }

  console.log(`\n  Done! Preview at: http://localhost:4321/#${targetDate}\n`);
}

function buildWeekJSON(row, targetDate) {
  const get = (field) => getCell(row, COLUMN_MAP[field]);

  // Combine SLA + ELA into literacy
  const slaEn = get('slaEn');
  const elaEn = get('elaEn');
  const literacyEn = [slaEn, elaEn].filter(Boolean).join('\n\n');

  const slaEs = get('slaEs');
  const elaEs = get('elaEs');
  const literacyEsFallback = get('literacyEs');
  const literacyEs = [slaEs, elaEs].filter(Boolean).join('\n\n') || literacyEsFallback;

  // ROARS — convert to first name + last initial
  const roars = {};
  const roarsFields = [
    ['roarsCartagena', 'Cartagena'],
    ['roarsColombia', 'Colombia'],
    ['roarsEspana', 'España'],
    ['roarsDR', 'DR'],
    ['roarsManagua', 'Managua'],
    ['roarsVenezuela', 'Venezuela'],
  ];
  for (const [field, classroom] of roarsFields) {
    const name = get(field);
    if (name) {
      roars[classroom] = toFirstLastInitial(name);
    }
  }

  // Specials rotation letters
  const specials = {
    monday: get('specialsMon') || '',
    tuesday: get('specialsTue') || '',
    wednesday: get('specialsWed') || '',
    thursday: get('specialsThu') || '',
    friday: get('specialsFri') || '',
  };

  // Vocabulary
  const vocabEn = parseList(get('vocabEn'));
  const vocabEs = parseList(get('vocabEs'));
  const vocabulary = (vocabEn.length || vocabEs.length)
    ? { en: vocabEn, es: vocabEs }
    : { en: [], es: [] };

  // Books
  const books = parseBooks(get('booksRaw'));

  // Ask Your Child
  const askYourChild = parseAskYourChild(get('askYourChild'));

  // Math details
  const mathDetails = parseMathDetails(get('mathModule'));

  const json = {
    date: targetDate,
    season: getSeason(targetDate),
    welcome: {
      en: get('welcomeEn'),
      es: get('welcomeEs'),
    },
    math: {
      en: get('mathEn'),
      es: get('mathEs'),
    },
    literacy: {
      en: literacyEn,
      es: literacyEs,
    },
    specials,
    roars,
    reminders: [],  // Reminders are manually curated — add after generation
    askYourChild,
    vocabulary,
    books,
    mathDetails,
  };

  return json;
}

/** Try to normalize various date formats to YYYY-MM-DD */
function normalizeDate(str) {
  if (!str) return '';
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  // Try M/D/YYYY or MM/DD/YYYY
  const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, m, d, y] = slashMatch;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  // Try Date parsing as fallback
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return str;
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);
const flags = args.filter(a => a.startsWith('--'));
const positional = args.filter(a => !a.startsWith('--'));

const dryRun = flags.includes('--dry-run');
const preview = flags.includes('--preview');
const showHeadersFlag = flags.includes('--headers');

if (showHeadersFlag) {
  const auth = getAuth();
  await showHeaders(auth);
} else if (positional.length === 0) {
  console.log(`
  Usage:
    node scripts/fetch-week.mjs YYYY-MM-DD           Generate week JSON
    node scripts/fetch-week.mjs YYYY-MM-DD --dry-run  Print JSON without writing
    node scripts/fetch-week.mjs YYYY-MM-DD --preview   Show raw column data
    node scripts/fetch-week.mjs --headers              Show sheet column headers

  Examples:
    node scripts/fetch-week.mjs 2026-03-23
    npm run new-week -- 2026-03-23
    npm run new-week -- 2026-03-23 --dry-run
`);
} else {
  const targetDate = positional[0];
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
    console.error(`  Invalid date format: "${targetDate}". Use YYYY-MM-DD.`);
    process.exit(1);
  }
  await fetchWeek(targetDate, { dryRun, preview });
}
