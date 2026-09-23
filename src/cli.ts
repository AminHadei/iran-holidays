#!/usr/bin/env node
import path from "node:path";
import { parseCliArgs } from "./args.ts";
import { writeHolidays } from "./write.ts";

function usage(): never {
  console.error("Usage: iran-holidays <solar-hijri-year> [--just-holidays] [--root <dir>]");
  console.error("       pnpm run create <solar-hijri-year> [--just-holidays] [--root <dir>]");
  console.error("Example: iran-holidays 1407");
  console.error("Example: iran-holidays 1405 --just-holidays --root data");
  process.exit(1);
}

function displayPath(filePath: string): string {
  const relative = path.relative(process.cwd(), filePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return filePath;
  return relative;
}

let options;
try {
  options = parseCliArgs(process.argv.slice(2));
} catch {
  usage();
}

const written = await writeHolidays(options);
const summary = options.justHolidays
  ? `${written.holidayCount} holidays`
  : `${written.holidayCount} holidays out of ${written.totalCount} days`;
console.log(`Wrote ${displayPath(written.filePath)}. ${summary}.`);
