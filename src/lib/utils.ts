import config from '../data/config.json';
import calendar20252026 from '../data/calendars/2025-2026.json';
import calendar20262027 from '../data/calendars/2026-2027.json';

// One calendar per school year, keyed the way schoolYearOf() spells it. Archived
// issues keep computing their dashboard against the year they were written in,
// so rolling the site over to a new year doesn't rewrite last year's numbers.
const CALENDARS: Record<string, any> = {
  '2025-2026': calendar20252026,
  '2026-2027': calendar20262027,
};
const NEWEST_SCHOOL_YEAR = '2026-2027';

export function calendarFor(dateStr: string): any {
  return CALENDARS[schoolYearOf(dateStr)] ?? CALENDARS[NEWEST_SCHOOL_YEAR];
}

/** No-school dates only. `END` marks the last day of school, which IS a school day. */
export function noSchoolDates(cal: any): Set<string> {
  return new Set(
    (cal.dates || []).filter((d: any) => d.type !== 'END').map((d: any) => d.date)
  );
}

export type Lang = 'en' | 'es';

export interface BilingualText {
  en: string;
  es: string;
}

export function t(obj: BilingualText | undefined, lang: Lang): string {
  if (!obj) return '';
  return obj[lang] || obj.en || '';
}

export function label(key: string, lang: Lang): string {
  const labels = config.labels[lang] as Record<string, any>;
  return labels?.[key] ?? key;
}

export function textToHTML(text: string): string {
  // Preserve allowed tags, escape the rest
  const allowedTags = ['a', 'b', 'i', 'br', 'em', 'strong'];
  const tagPattern = allowedTags.map(tag => `<${tag}[^>]*>|</${tag}>`).join('|');
  const tagRegex = new RegExp(`(${tagPattern}|<br\\s*/?>)`, 'gi');

  const parts = text.split(tagRegex);
  return parts.map((part, i) => {
    if (tagRegex.test(part)) {
      tagRegex.lastIndex = 0;
      return part;
    }
    return part
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }).join('');
}

export function formatDate(dateStr: string, lang: Lang): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string, lang: Lang): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function getDayName(dayIndex: number, lang: Lang): string {
  return config.labels[lang].days[dayIndex];
}

export function getSubjectIcon(subject: string): string {
  return (config.subjectIcons as Record<string, string>)[subject] || '';
}

export function getSubjectTranslation(subject: string): string {
  return (config.subjectTranslations as Record<string, string>)[subject] || subject;
}

/** "Day E" / "Día E" for a rotation letter; non-letter values (e.g. "No School") get the
 *  no-school label instead of "Day No School". Used by every theme's specials board. */
export function specialsDayLabel(value: string, lang: Lang): string {
  const v = (value || '').trim();
  if (/^[A-F]$/i.test(v)) return (lang === 'es' ? 'Día ' : 'Day ') + v.toUpperCase();
  return lang === 'es' ? 'No hay clases' : 'No School';
}

export function getSpecialForDay(classroom: string, letterDay: string): string {
  const rotations = config.rotations as Record<string, Record<string, string>>;
  return rotations[classroom]?.[letterDay] || '';
}

/**
 * The SEL / Strong Start theme for the month an issue falls in.
 * Transcribed from the school's "SEL / Strong Start Monthly Themes" poster:
 * August and September share a theme, and July has none (returns '').
 * Derived from the issue's own date, so archived issues keep their own month's theme.
 */
export function selThemeFor(dateStr: string, lang: Lang): string {
  const month = Number(dateStr.slice(5, 7));
  const themes = config.selThemes as Record<string, { en: string; es: string }> | undefined;
  const entry = themes?.[String(month)];
  return entry ? entry[lang] : '';
}

// School year progress calculations
export function getSchoolYearProgress(currentDate: string) {
  const calendar = calendarFor(currentDate);
  const allNoSchoolDates = noSchoolDates(calendar);
  const breakDates = new Set<string>();
  for (const br of calendar.breaks) {
    let d = new Date((br as any).start + 'T12:00:00');
    const end = new Date((br as any).end + 'T12:00:00');
    while (d <= end) {
      breakDates.add(d.toISOString().split('T')[0]);
      d.setDate(d.getDate() + 1);
    }
  }

  const first = new Date(calendar.firstDay + 'T12:00:00');
  const last = new Date(calendar.lastDay + 'T12:00:00');
  const current = new Date(currentDate + 'T12:00:00');

  let totalSchoolDays = 0;
  let elapsedSchoolDays = 0;
  let d = new Date(first);
  while (d <= last) {
    const iso = d.toISOString().split('T')[0];
    const dow = d.getDay();
    if (dow >= 1 && dow <= 5 && !allNoSchoolDates.has(iso) && !breakDates.has(iso)) {
      totalSchoolDays++;
      if (d <= current) elapsedSchoolDays++;
    }
    d.setDate(d.getDate() + 1);
  }

  const remaining = totalSchoolDays - elapsedSchoolDays;

  // Week numbering — matches original site formula
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weekNumber = Math.max(1, Math.ceil((current.getTime() - first.getTime() + msPerWeek) / msPerWeek));
  const totalWeeks = Math.ceil((last.getTime() - first.getTime() + msPerWeek) / msPerWeek);
  const percent = Math.round((elapsedSchoolDays / totalSchoolDays) * 100);

  return { totalSchoolDays, elapsedSchoolDays, remaining, weekNumber, totalWeeks, percent };
}

export interface ComingUpItem {
  startDate: string;
  endDate: string;
  /** Language-resolved body. Calendar labels are plain text; reminders may carry <b>/<a>. */
  html: string;
  /** Calendar type (HOL/PD/PTC/NS/END) or 'EVENT' for a teacher-written reminder. */
  type: string;
  isEvent: boolean;
}

/**
 * One chronological list of what's coming: the calendar's no-school dates plus the
 * week's own reminders, merged.
 *
 * They used to be two separate blocks, and a quarter of all reminders ever written
 * restated a date the calendar already knew — Memorial Day was hand-typed into six
 * consecutive issues. So when a reminder falls on a date the calendar also covers,
 * the reminder wins and the calendar row is dropped: the teacher's wording is the
 * richer of the two, and it can carry a link.
 */
export function getComingUp(
  currentDate: string,
  lang: Lang,
  weekData: any,
  calendarCount = 5
): ComingUpItem[] {
  const reminders = ((weekData?.reminders || []) as any[])
    .filter(r => r.date >= currentDate)
    .map(r => ({
      startDate: r.date,
      endDate: r.date,
      html: (lang === 'es' ? r.es : r.en) || r.en,
      type: 'EVENT',
      isEvent: true,
    }));

  // Collapse first, then suppress — a range must be dropped whole, not have its
  // first day removed (a reminder on the Monday of Spring Recess would otherwise
  // leave a stray "Tue-Fri" row behind it).
  const reminderDates = new Set(reminders.map(r => r.startDate));
  const calendarItems = getUpcomingDates(currentDate, lang, Infinity)
    .filter(item => !reminderDates.has(item.startDate))
    .slice(0, calendarCount)
    .map(item => ({
      startDate: item.startDate,
      endDate: item.endDate,
      html: item.label,
      type: item.type,
      isEvent: false,
    }));

  return [...reminders, ...calendarItems].sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getUpcomingDates(currentDate: string, lang: Lang, count = 5) {
  const calendar = calendarFor(currentDate);
  const allDates = (calendar.dates as any[])
    .filter(d => d.date > currentDate)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Collapse consecutive same-name dates into ranges
  const collapsed: { startDate: string; endDate: string; label: string; type: string }[] = [];
  for (const entry of allDates) {
    const lbl = entry[lang] || entry.en;
    const last = collapsed[collapsed.length - 1];
    if (last && last.label === lbl) {
      // Check if consecutive day
      const prev = new Date(last.endDate + 'T12:00:00');
      const curr = new Date(entry.date + 'T12:00:00');
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 3) { // Allow weekend gaps
        last.endDate = entry.date;
        continue;
      }
    }
    collapsed.push({ startDate: entry.date, endDate: entry.date, label: lbl, type: entry.type });
  }

  return collapsed.slice(0, count);
}

export function formatDateRange(start: string, end: string, lang: Lang): string {
  if (start === end) return formatDateShort(start, lang);
  const s = new Date(start + 'T12:00:00');
  const e = new Date(end + 'T12:00:00');
  const locale = lang === 'es' ? 'es-US' : 'en-US';
  if (s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString(locale, { month: 'short' })} ${s.getDate()}\u2013${e.getDate()}`;
  }
  return `${formatDateShort(start, lang)}\u2013${formatDateShort(end, lang)}`;
}

// ===== School-year grouping =====
// A school year runs August → June, so any issue dated August or later belongs
// to the year that starts in that calendar year; anything Jan–Jul belongs to the
// year that started the previous August. Used to keep the sidebar showing only
// the current year and to file everything older under /archive/.

const SCHOOL_YEAR_START_MONTH = 7; // 0-indexed: 7 = August

export function schoolYearOf(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const startYear = d.getMonth() >= SCHOOL_YEAR_START_MONTH ? d.getFullYear() : d.getFullYear() - 1;
  return `${startYear}-${startYear + 1}`;
}

/** "2025-2026" → "2025–26" (en dash, two-digit second year). */
export function formatSchoolYear(schoolYear: string): string {
  const [start, end] = schoolYear.split('-');
  return `${start}–${end.slice(2)}`;
}

/** Weeks grouped by school year, newest year first, newest week first inside each. */
export function groupWeeksBySchoolYear(weeks: string[]): { schoolYear: string; weeks: string[] }[] {
  const groups = new Map<string, string[]>();
  for (const w of weeks) {
    const sy = schoolYearOf(w);
    if (!groups.has(sy)) groups.set(sy, []);
    groups.get(sy)!.push(w);
  }
  return [...groups.entries()]
    .map(([schoolYear, ws]) => ({ schoolYear, weeks: [...ws].sort().reverse() }))
    .sort((a, b) => b.schoolYear.localeCompare(a.schoolYear));
}

/** Issue number within its own school year — 1 = that year's first issue. */
export function issueNumberInSchoolYear(date: string, allWeeks: string[]): number {
  const sy = schoolYearOf(date);
  const yearWeeks = allWeeks.filter(w => schoolYearOf(w) === sy).sort();
  return yearWeeks.indexOf(date) + 1;
}

/**
 * True when a bilingual block has real content in either language.
 * Early-in-the-year issues legitimately ship without Math/Literacy write-ups;
 * every theme uses this to drop the section rather than render an empty card.
 */
export function hasBilingualText(field?: { en?: string; es?: string } | null): boolean {
  return !!(field && ((field.en && field.en.trim()) || (field.es && field.es.trim())));
}

/** True when a week has anything to show in ROARS — named students or a whole-class banner. */
export function weekHasRoars(weekData: any): boolean {
  return !!weekData?.roarsClass || Object.values(weekData?.roars || {}).some(Boolean);
}

/**
 * Plain text for peeks and pull quotes. Tags become a space rather than nothing,
 * so a paragraph break written as `<br><br>` doesn't glue two sentences together.
 */
export function stripTags(html: string): string {
  return (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    // A tag that sat right before punctuation ("<b>May</b>,") must not leave a gap.
    .replace(/\s+([,.;:!?%)\]])/g, '$1')
    .replace(/([(\[])\s+/g, '$1')
    .trim();
}
