import config from '../data/config.json';
import calendar from '../data/calendar.json';

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

export function getSpecialForDay(classroom: string, letterDay: string): string {
  const rotations = config.rotations as Record<string, Record<string, string>>;
  return rotations[classroom]?.[letterDay] || '';
}

// School year progress calculations
export function getSchoolYearProgress(currentDate: string) {
  const allNoSchoolDates = new Set(calendar.dates.map(d => d.date));
  const breakDates = new Set<string>();
  for (const br of calendar.breaks) {
    let d = new Date(br.start + 'T12:00:00');
    const end = new Date(br.end + 'T12:00:00');
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

export function getUpcomingDates(currentDate: string, lang: Lang, count = 5) {
  const allDates = calendar.dates
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
