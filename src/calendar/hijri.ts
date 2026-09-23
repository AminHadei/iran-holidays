import { jdnToGregorian } from './jalali.ts';
import { OFFICIAL_HIJRI_MONTHS, OFFICIAL_HIJRI_START_JDN } from './official-months.ts';
import { crescentVisible } from './sighting.ts';

export type HijriDate = {
  year: number;
  month: number;
  day: number;
  monthLength: number;
};

type HijriMonth = {
  year: number;
  month: number;
  startJdn: number;
  length: number;
};

let cache: HijriMonth[] | null = null;

function officialMonths(): HijriMonth[] {
  if (cache) return cache;

  const list: HijriMonth[] = [];
  let jdn = OFFICIAL_HIJRI_START_JDN;
  for (const [year, lengths] of OFFICIAL_HIJRI_MONTHS) {
    for (let index = 0; index < lengths.length; index += 1) {
      const length = lengths[index];
      list.push({ year, month: index + 1, startJdn: jdn, length });
      jdn += length;
    }
  }
  cache = list;
  return list;
}

/** Hijri month length: 29 days if the crescent is visible on the evening of day 28, otherwise 30. */
function predictLength(startJdn: number): number {
  return crescentVisible(jdnToGregorian(startJdn + 28)) ? 29 : 30;
}

function lastMonth(list: HijriMonth[]): HijriMonth {
  const month = list.at(-1);
  if (!month) throw new Error('Hijri month list is empty.');
  return month;
}

function extendForward(list: HijriMonth[], jdn: number): void {
  while (jdn >= lastMonth(list).startJdn + lastMonth(list).length) {
    const previous = lastMonth(list);
    const startJdn = previous.startJdn + previous.length;
    list.push({
      year: previous.month === 12 ? previous.year + 1 : previous.year,
      month: previous.month === 12 ? 1 : previous.month + 1,
      startJdn,
      length: predictLength(startJdn),
    });
  }
}

function extendBackward(list: HijriMonth[], jdn: number): void {
  while (jdn < list[0].startJdn) {
    const next = list[0];
    const length = predictLength(next.startJdn - 29) === 29 ? 29 : 30;
    list.unshift({
      year: next.month === 1 ? next.year - 1 : next.year,
      month: next.month === 1 ? 12 : next.month - 1,
      startJdn: next.startJdn - length,
      length,
    });
  }
}

export function hijriFromJdn(jdn: number): HijriDate {
  const list = officialMonths();
  extendForward(list, jdn);
  extendBackward(list, jdn);

  let low = 0;
  let high = list.length - 1;
  while (low <= high) {
    const mid = Math.trunc((low + high) / 2);
    const month = list[mid];
    if (jdn < month.startJdn) {
      high = mid - 1;
    } else if (jdn >= month.startJdn + month.length) {
      low = mid + 1;
    } else {
      return {
        year: month.year,
        month: month.month,
        day: jdn - month.startJdn + 1,
        monthLength: month.length,
      };
    }
  }

  throw new Error(`No Hijri date for Julian day ${jdn}.`);
}
