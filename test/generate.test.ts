import assert from "node:assert/strict";
import test from "node:test";
import { hijriFromJdn } from "../src/calendar/hijri.ts";
import { gregorianToJalali, isJalaliLeapYear, jalaliToGregorian, jalaliToJdn } from "../src/calendar/jalali.ts";
import { generateYear } from "../src/generate.ts";

const HOLIDAYS_1404 = [
  "1404/01/01",
  "1404/01/02",
  "1404/01/03",
  "1404/01/04",
  "1404/01/11",
  "1404/01/12",
  "1404/01/13",
  "1404/02/04",
  "1404/03/14",
  "1404/03/15",
  "1404/03/16",
  "1404/03/24",
  "1404/04/14",
  "1404/04/15",
  "1404/05/23",
  "1404/05/31",
  "1404/06/02",
  "1404/06/10",
  "1404/06/19",
  "1404/09/03",
  "1404/10/13",
  "1404/10/27",
  "1404/11/15",
  "1404/11/22",
  "1404/12/20",
  "1404/12/29",
];

test("1 Farvardin 1404 is 21 March 2025", () => {
  assert.deepEqual(jalaliToGregorian(1404, 1, 1), { year: 2025, month: 3, day: 21 });
});

test("11 Farvardin 1404 is Eid al-Fitr, 1 Shawwal 1446", () => {
  const hijri = hijriFromJdn(jalaliToJdn(1404, 1, 11));
  assert.deepEqual(
    { year: hijri.year, month: hijri.month, day: hijri.day },
    { year: 1446, month: 10, day: 1 },
  );
});

test("1404 holidays match the official calendar and skip international occasions", () => {
  const year = generateYear(1404);
  const holidays = year.data.filter((day) => day.isHoliday).map((day) => day.date);
  assert.deepEqual(holidays, HOLIDAYS_1404);
  assert.equal(year.totalCount, 365);

  const republicDay = year.data.find((day) => day.date === "1404/01/12");
  assert.equal(
    republicDay?.holidayDescription,
    "روز جمهوری اسلامی - تعطیل به مناسبت عید سعید فطر [۲ شوال]",
  );

  const arbaeen = year.data.find((day) => day.date === "1404/05/23");
  assert.match(arbaeen?.holidayDescription ?? "", /اربعین حسینی/);

  for (const day of year.data) {
    if (!day.isHoliday) assert.equal(day.holidayDescription, null);
    assert.doesNotMatch(day.holidayDescription ?? "", /کریسمس|روز جهانی|سال نو میلادی/);
  }
});

test("New Year's Day and Christmas are not official holidays on their own", () => {
  const year = generateYear(1404);
  for (const gregorian of [
    { year: 2026, month: 1, day: 1 },
    { year: 2025, month: 12, day: 25 },
  ]) {
    const shamsi = gregorianToJalali(gregorian.year, gregorian.month, gregorian.day);
    const key = `${shamsi.year}/${String(shamsi.month).padStart(2, "0")}/${String(shamsi.day).padStart(2, "0")}`;
    const day = year.data.find((item) => item.date === key);
    assert.equal(day?.isHoliday, false, key);
  }
});

test("30 Esfand exists only in a leap year and is a holiday", () => {
  assert.equal(isJalaliLeapYear(1403), true);
  assert.equal(isJalaliLeapYear(1404), false);

  const leap = generateYear(1403);
  assert.equal(leap.totalCount, 366);
  const lastDay = leap.data.find((day) => day.date === "1403/12/30");
  assert.equal(lastDay?.isHoliday, true);
  assert.match(lastDay?.holidayDescription ?? "", /آخرین روز سال/);
  assert.equal(generateYear(1404).data.some((day) => day.date === "1404/12/30"), false);
});

test("years outside 1300-1500 still generate", () => {
  for (const year of [234, 1508]) {
    const calendar = generateYear(year);
    assert.ok(calendar.totalCount === 365 || calendar.totalCount === 366);
    assert.equal(calendar.data[0]?.isHoliday, true);
    assert.ok(calendar.data.some((day) => day.holidayDescription?.includes("[")));
  }
});

test("holidays start only after the event they commemorate", () => {
  const year10 = generateYear(10);
  assert.equal(year10.data.some((day) => day.holidayDescription?.includes("نیمه شعبان")), false);
  assert.equal(year10.data.some((day) => day.holidayDescription?.includes("قائم")), false);
  assert.equal(year10.data.find((day) => day.date === "10/01/01")?.isHoliday, true);

  const year1340 = generateYear(1340);
  assert.equal(year1340.data.find((day) => day.date === "1340/11/22")?.isHoliday, false);
  assert.equal(year1340.data.find((day) => day.date === "1340/03/15")?.isHoliday, false);
  assert.equal(year1340.data.find((day) => day.date === "1340/01/12")?.isHoliday, false);
  assert.equal(year1340.data.find((day) => day.date === "1340/01/01")?.isHoliday, true);
  assert.match(year1340.data.find((day) => day.date === "1340/12/29")?.holidayDescription ?? "", /صنعت نفت/);

  const revolution = generateYear(1357);
  assert.match(revolution.data.find((day) => day.date === "1357/11/22")?.holidayDescription ?? "", /انقلاب اسلامی/);
});

test("1407 includes Nowruz, 22 Bahman, and lunar holidays", () => {
  const year = generateYear(1407);
  assert.ok(year.totalCount === 365 || year.totalCount === 366);

  for (const date of ["1407/01/01", "1407/01/04", "1407/11/22", "1407/12/29"]) {
    assert.equal(year.data.find((day) => day.date === date)?.isHoliday, true, date);
  }

  const lunar = year.data.filter((day) => day.holidayDescription?.includes("["));
  assert.ok(lunar.length >= 16 && lunar.length <= 20);
  const holidayCount = year.data.filter((day) => day.isHoliday).length;
  assert.ok(holidayCount >= 24 && holidayCount <= 32);
});
