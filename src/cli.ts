import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateYear, justHolidays } from "./generate.ts";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function normalizeYear(input: string): number {
  const english = input
    .trim()
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)));
  if (!/^\d+$/.test(english)) return Number.NaN;
  return Number(english);
}

function usage(): never {
  console.error("Usage: pnpm run create <solar-hijri-year> [--just-holidays]");
  console.error("Example: pnpm run create 1407");
  console.error("Example: pnpm run create 1405 --just-holidays");
  process.exit(1);
}

const args = process.argv.slice(2);
let year: number | undefined;
let holidaysOnly = false;

for (const arg of args) {
  if (arg === "--just-holidays") {
    holidaysOnly = true;
    continue;
  }
  if (year !== undefined) usage();
  const parsed = normalizeYear(arg);
  if (!Number.isInteger(parsed) || parsed < 1) usage();
  year = parsed;
}

if (year === undefined) usage();

const calendar = generateYear(year);
const output = holidaysOnly ? justHolidays(calendar) : calendar;
const fileName = holidaysOnly ? `${year}-just-holidays.json` : `${year}.json`;
const directory = path.resolve("dist");

await mkdir(directory, { recursive: true });
await writeFile(path.join(directory, fileName), `${JSON.stringify(output, null, 2)}\n`, "utf8");

const holidayCount = calendar.data.filter((day) => day.isHoliday).length;
const summary = holidaysOnly
  ? `${holidayCount} holidays`
  : `${holidayCount} holidays out of ${calendar.totalCount} days`;
console.log(`Wrote dist/${fileName}. ${summary}.`);
