import { hijriFromJdn } from "./calendar/hijri.ts";
import { eachJalaliDay, formatJalali, jalaliToJdn } from "./calendar/jalali.ts";
import { hijriHolidayTitles, holidayDescription, shamsiHolidayTitles } from "./rules.ts";

export type HolidayDay = {
  date: string;
  shamsiDate: string;
  isHoliday: boolean;
  holidayDescription: string | null;
};

export type HolidayYear = {
  data: HolidayDay[];
  totalCount: number;
};

export function generateYear(year: number): HolidayYear {
  const data = eachJalaliDay(year).map((shamsi) => {
    const hijri = hijriFromJdn(jalaliToJdn(shamsi.year, shamsi.month, shamsi.day));
    const description = holidayDescription(
      shamsiHolidayTitles(shamsi.year, shamsi.month, shamsi.day),
      hijriHolidayTitles(hijri),
      hijri,
    );
    const formatted = formatJalali(shamsi);
    return {
      date: formatted,
      shamsiDate: formatted,
      isHoliday: description !== null,
      holidayDescription: description,
    };
  });

  return { data, totalCount: data.length };
}
