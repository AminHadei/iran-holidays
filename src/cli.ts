import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateYear } from "./generate.ts";

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
  console.error("Usage: pnpm run create <solar-hijri-year>");
  console.error("Example: pnpm run create 1407");
  process.exit(1);
}

const year = normalizeYear(process.argv[2] ?? "");
if (!Number.isInteger(year) || year < 1) usage();

const calendar = generateYear(year);
const holidayCount = calendar.data.filter((day) => day.isHoliday).length;
const directory = path.resolve("dist");
const filePath = path.join(directory, `${year}.json`);

await mkdir(directory, { recursive: true });
await writeFile(filePath, `${JSON.stringify(calendar, null, 2)}\n`, "utf8");

console.log(`Wrote dist/${year}.json. ${holidayCount} holidays out of ${calendar.totalCount} days.`);
