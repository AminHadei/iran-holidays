import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateYear, justHolidays, type HolidayYear, type JustHolidayYear } from "./generate.ts";

export type WriteHolidaysOptions = {
  year: number;
  /** Directory that receives the JSON file. Defaults to `dist`. */
  root?: string;
  justHolidays?: boolean;
};

export type WriteHolidaysResult = {
  filePath: string;
  fileName: string;
  holidayCount: number;
  totalCount: number;
  output: HolidayYear | JustHolidayYear;
};

export async function writeHolidays(options: WriteHolidaysOptions): Promise<WriteHolidaysResult> {
  if (!Number.isInteger(options.year) || options.year < 1) {
    throw new Error("Year must be a positive integer.");
  }

  const root = options.root && options.root.length > 0 ? options.root : "dist";
  const calendar = generateYear(options.year);
  const holidaysOnly = options.justHolidays === true;
  const output = holidaysOnly ? justHolidays(calendar) : calendar;
  const fileName = holidaysOnly ? `${options.year}-just-holidays.json` : `${options.year}.json`;
  const directory = path.resolve(root);
  const filePath = path.join(directory, fileName);
  await mkdir(directory, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  return {
    filePath,
    fileName,
    holidayCount: calendar.data.filter((day) => day.isHoliday).length,
    totalCount: calendar.totalCount,
    output,
  };
}
