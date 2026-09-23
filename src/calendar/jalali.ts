export type Ymd = {
  year: number;
  month: number;
  day: number;
};

/** Noon Julian day number, aligned with the official Iranian calendar tables. */
export function gregorianToJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

export function jdnToGregorian(jdn: number): Ymd {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

/** Convert a Solar Hijri date to Gregorian with the calendar center's arithmetic. */
export function jalaliToGregorian(jy: number, jm: number, jd: number): Ymd {
  const year = jy + 1595;
  let days =
    -355668 +
    365 * year +
    Math.floor(year / 33) * 8 +
    Math.floor(((year % 33) + 3) / 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    days -= 1;
    gy += 100 * Math.floor(days / 36524);
    days %= 36524;
    if (days >= 365) days += 1;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  let gd = days + 1;
  const monthLengths = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm = 0;
  for (; gm < 13 && gd > monthLengths[gm]; gm += 1) {
    gd -= monthLengths[gm];
  }
  return { year: gy, month: gm, day: gd };
}

export function gregorianToJalali(gy: number, gm: number, gd: number): Ymd {
  const dayOfYear = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    dayOfYear[gm - 1];

  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  if (days < 186) {
    return { year: jy, month: 1 + Math.floor(days / 31), day: 1 + (days % 31) };
  }
  return {
    year: jy,
    month: 7 + Math.floor((days - 186) / 30),
    day: 1 + ((days - 186) % 30),
  };
}

export function jalaliToJdn(year: number, month: number, day: number): number {
  const gregorian = jalaliToGregorian(year, month, day);
  return gregorianToJdn(gregorian.year, gregorian.month, gregorian.day);
}

export function isJalaliLeapYear(year: number): boolean {
  return jalaliToJdn(year + 1, 1, 1) - jalaliToJdn(year, 1, 1) === 366;
}

export function jalaliMonthLength(year: number, month: number): number {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isJalaliLeapYear(year) ? 30 : 29;
}

export function eachJalaliDay(year: number): Ymd[] {
  const days: Ymd[] = [];
  for (let month = 1; month <= 12; month += 1) {
    const length = jalaliMonthLength(year, month);
    for (let day = 1; day <= length; day += 1) {
      days.push({ year, month, day });
    }
  }
  return days;
}

export function formatJalali(date: Ymd): string {
  const month = String(date.month).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');
  return `${date.year}/${month}/${day}`;
}
