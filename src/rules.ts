import type { HijriDate } from './calendar/hijri.ts';

/**
 * time.ir groups occasions on three calendars:
 * - Solar Hijri: national holidays on a fixed date every year
 * - Hijri lunar: religious holidays whose Solar Hijri date moves every year
 * - Gregorian: international occasions. None are official Iranian holidays, so they are omitted.
 *
 * Only occasions that time.ir marks as holidays are included, and only on or after
 * the event they commemorate. Nowruz has no start date. Hijri years before 1 use
 * astronomical numbering, where year 0 is 1 BH, so 53 BH is year -52.
 */

type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

export type ShamsiHoliday = {
  month: number;
  day: number;
  title: string;
  /** First Solar Hijri date on which this holiday exists. */
  since?: CalendarDate;
};

export const SHAMSI_HOLIDAYS: readonly ShamsiHoliday[] = [
  { month: 1, day: 1, title: 'جشن نوروز/جشن سال نو' },
  { month: 1, day: 2, title: 'عید نوروز' },
  { month: 1, day: 3, title: 'عید نوروز' },
  { month: 1, day: 4, title: 'عید نوروز' },
  { month: 1, day: 12, title: 'روز جمهوری اسلامی', since: { year: 1358, month: 1, day: 12 } },
  { month: 1, day: 13, title: 'جشن سیزده به در' },
  { month: 1, day: 13, title: 'روز طبیعت' },
  { month: 3, day: 14, title: 'رحلت حضرت امام خمینی', since: { year: 1368, month: 3, day: 14 } },
  { month: 3, day: 15, title: 'قیام 15 خرداد', since: { year: 1342, month: 3, day: 15 } },
  { month: 11, day: 22, title: 'پیروزی انقلاب اسلامی', since: { year: 1357, month: 11, day: 22 } },
  {
    month: 12,
    day: 29,
    title: 'روز ملی شدن صنعت نفت ایران',
    since: { year: 1329, month: 12, day: 29 },
  },
  { month: 12, day: 30, title: 'آخرین روز سال' },
];

export type HijriHoliday = {
  month: number;
  day: number;
  title: string;
  /** Imam Reza's martyrdom is the last day of Safar, which is day 29 when that month is short. */
  onLastDayIfShorter?: boolean;
  /** First Hijri date on which this holiday exists. */
  since?: CalendarDate;
};

export const HIJRI_HOLIDAYS: readonly HijriHoliday[] = [
  { month: 1, day: 9, title: 'تاسوعای حسینی', since: { year: 61, month: 1, day: 9 } },
  { month: 1, day: 10, title: 'عاشورای حسینی', since: { year: 61, month: 1, day: 10 } },
  { month: 2, day: 20, title: 'اربعین حسینی', since: { year: 61, month: 2, day: 20 } },
  { month: 2, day: 28, title: 'رحلت رسول اکرم', since: { year: 11, month: 2, day: 28 } },
  {
    month: 2,
    day: 28,
    title: 'شهادت امام حسن مجتبی علیه السلام',
    since: { year: 50, month: 2, day: 28 },
  },
  {
    month: 2,
    day: 30,
    title: 'شهادت امام رضا علیه السلام',
    onLastDayIfShorter: true,
    since: { year: 203, month: 2, day: 29 },
  },
  {
    month: 3,
    day: 8,
    title: 'شهادت امام حسن عسکری علیه السلام و آغاز امامت حضرت ولیعصر (عج)',
    since: { year: 260, month: 3, day: 8 },
  },
  { month: 3, day: 17, title: 'میلاد رسول اکرم', since: { year: -52, month: 3, day: 17 } },
  {
    month: 3,
    day: 17,
    title: 'ولادت امام جعفر صادق علیه السلام',
    since: { year: 83, month: 3, day: 17 },
  },
  {
    month: 6,
    day: 3,
    title: 'شهادت حضرت فاطمه زهرا سلام الله علیها',
    since: { year: 11, month: 6, day: 3 },
  },
  {
    month: 7,
    day: 13,
    title: 'ولادت امام علی علیه السلام و روز پدر',
    since: { year: -22, month: 7, day: 13 },
  },
  { month: 7, day: 27, title: 'مبعث رسول اکرم (ص)', since: { year: -12, month: 7, day: 27 } },
  {
    month: 8,
    day: 15,
    title: 'ولادت حضرت قائم عجل الله تعالی فرجه و جشن نیمه شعبان',
    since: { year: 255, month: 8, day: 15 },
  },
  { month: 9, day: 21, title: 'شهادت حضرت علی علیه السلام', since: { year: 40, month: 9, day: 21 } },
  { month: 10, day: 1, title: 'عید سعید فطر', since: { year: 2, month: 10, day: 1 } },
  {
    month: 10,
    day: 2,
    title: 'تعطیل به مناسبت عید سعید فطر',
    since: { year: 2, month: 10, day: 2 },
  },
  {
    month: 10,
    day: 25,
    title: 'شهادت امام جعفر صادق علیه السلام',
    since: { year: 148, month: 10, day: 25 },
  },
  { month: 12, day: 10, title: 'عید سعید قربان', since: { year: 2, month: 12, day: 10 } },
  { month: 12, day: 18, title: 'عید سعید غدیر خم', since: { year: 10, month: 12, day: 18 } },
];

export const HIJRI_MONTH_NAMES = [
  'محرم',
  'صفر',
  'ربیع‌الاول',
  'ربیع‌الثانی',
  'جمادی‌الاول',
  'جمادی‌الثانی',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذی‌القعده',
  'ذی‌الحجه',
] as const;

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

function toPersianDigits(value: number): string {
  return String(value).replaceAll(/\d/gu, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

function isOnOrAfter(date: CalendarDate, since: CalendarDate | undefined): boolean {
  if (!since) return true;
  if (date.year !== since.year) return date.year > since.year;
  if (date.month !== since.month) return date.month > since.month;
  return date.day >= since.day;
}

export function shamsiHolidayTitles(year: number, month: number, day: number): string[] {
  return SHAMSI_HOLIDAYS.filter(
    (holiday) =>
      holiday.month === month &&
      holiday.day === day &&
      isOnOrAfter({ year, month, day }, holiday.since),
  ).map((holiday) => holiday.title);
}

export function hijriHolidayTitles(date: HijriDate): string[] {
  return HIJRI_HOLIDAYS.filter((holiday) => {
    if (holiday.month !== date.month || !isOnOrAfter(date, holiday.since)) return false;
    if (holiday.day === date.day) return true;
    return (
      holiday.onLastDayIfShorter === true &&
      date.monthLength < holiday.day &&
      date.day === date.monthLength
    );
  }).map((holiday) => holiday.title);
}

export function holidayDescription(
  shamsiTitles: string[],
  hijriTitles: string[],
  hijri: HijriDate,
): string | null {
  const parts: string[] = [];
  if (shamsiTitles.length > 0) parts.push(shamsiTitles.join(' و '));
  if (hijriTitles.length > 0) {
    const bracket = `[${toPersianDigits(hijri.day)} ${HIJRI_MONTH_NAMES[hijri.month - 1]}]`;
    parts.push(`${hijriTitles.join(' و ')} ${bracket}`);
  }
  return parts.length > 0 ? parts.join(' - ') : null;
}
