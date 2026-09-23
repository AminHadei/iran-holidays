import type { HijriDate } from "./calendar/hijri.ts";

/**
 * time.ir groups occasions on three calendars:
 * - Solar Hijri: national holidays on a fixed date every year
 * - Hijri lunar: religious holidays whose Solar Hijri date moves every year
 * - Gregorian: international occasions. None are official Iranian holidays, so they are omitted.
 *
 * Only occasions that time.ir marks as holidays are included.
 */

export type ShamsiHoliday = {
  month: number;
  day: number;
  title: string;
};

export const SHAMSI_HOLIDAYS: readonly ShamsiHoliday[] = [
  { month: 1, day: 1, title: "جشن نوروز/جشن سال نو" },
  { month: 1, day: 2, title: "عید نوروز" },
  { month: 1, day: 3, title: "عید نوروز" },
  { month: 1, day: 4, title: "عید نوروز" },
  { month: 1, day: 12, title: "روز جمهوری اسلامی" },
  { month: 1, day: 13, title: "جشن سیزده به در" },
  { month: 1, day: 13, title: "روز طبیعت" },
  { month: 3, day: 14, title: "رحلت حضرت امام خمینی" },
  { month: 3, day: 15, title: "قیام 15 خرداد" },
  { month: 11, day: 22, title: "پیروزی انقلاب اسلامی" },
  { month: 12, day: 29, title: "روز ملی شدن صنعت نفت ایران" },
  { month: 12, day: 30, title: "آخرین روز سال" },
];

export type HijriHoliday = {
  month: number;
  day: number;
  title: string;
  /** Imam Reza's martyrdom is the last day of Safar, which is day 29 when that month is short. */
  onLastDayIfShorter?: boolean;
};

export const HIJRI_HOLIDAYS: readonly HijriHoliday[] = [
  { month: 1, day: 9, title: "تاسوعای حسینی" },
  { month: 1, day: 10, title: "عاشورای حسینی" },
  { month: 2, day: 20, title: "اربعین حسینی" },
  { month: 2, day: 28, title: "رحلت رسول اکرم و شهادت امام حسن مجتبی علیه السلام" },
  { month: 2, day: 30, title: "شهادت امام رضا علیه السلام", onLastDayIfShorter: true },
  { month: 3, day: 8, title: "شهادت امام حسن عسکری علیه السلام و آغاز امامت حضرت ولیعصر (عج)" },
  { month: 3, day: 17, title: "میلاد رسول اکرم و ولادت امام جعفر صادق علیه السلام" },
  { month: 6, day: 3, title: "شهادت حضرت فاطمه زهرا سلام الله علیها" },
  { month: 7, day: 13, title: "ولادت امام علی علیه السلام و روز پدر" },
  { month: 7, day: 27, title: "مبعث رسول اکرم (ص)" },
  { month: 8, day: 15, title: "ولادت حضرت قائم عجل الله تعالی فرجه و جشن نیمه شعبان" },
  { month: 9, day: 21, title: "شهادت حضرت علی علیه السلام" },
  { month: 10, day: 1, title: "عید سعید فطر" },
  { month: 10, day: 2, title: "تعطیل به مناسبت عید سعید فطر" },
  { month: 10, day: 25, title: "شهادت امام جعفر صادق علیه السلام" },
  { month: 12, day: 10, title: "عید سعید قربان" },
  { month: 12, day: 18, title: "عید سعید غدیر خم" },
];

export const HIJRI_MONTH_NAMES = [
  "محرم",
  "صفر",
  "ربیع‌الاول",
  "ربیع‌الثانی",
  "جمادی‌الاول",
  "جمادی‌الثانی",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذی‌القعده",
  "ذی‌الحجه",
] as const;

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function toPersianDigits(value: number): string {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

export function shamsiHolidayTitles(month: number, day: number): string[] {
  return SHAMSI_HOLIDAYS.filter((holiday) => holiday.month === month && holiday.day === day).map(
    (holiday) => holiday.title,
  );
}

export function hijriHolidayTitles(date: HijriDate): string[] {
  return HIJRI_HOLIDAYS.filter((holiday) => {
    if (holiday.month !== date.month) return false;
    if (holiday.day === date.day) return true;
    return (
      holiday.onLastDayIfShorter === true &&
      date.monthLength < holiday.day &&
      date.day === date.monthLength
    );
  }).map((holiday) => holiday.title);
}

export function holidayDescription(shamsiTitles: string[], hijriTitles: string[], hijri: HijriDate): string | null {
  const parts: string[] = [];
  if (shamsiTitles.length > 0) parts.push(shamsiTitles.join(" و "));
  if (hijriTitles.length > 0) {
    const bracket = `[${toPersianDigits(hijri.day)} ${HIJRI_MONTH_NAMES[hijri.month - 1]}]`;
    parts.push(`${hijriTitles.join(" و ")} ${bracket}`);
  }
  return parts.length > 0 ? parts.join(" - ") : null;
}
