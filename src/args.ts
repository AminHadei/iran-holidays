const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export type CliOptions = {
  year: number;
  root: string;
  justHolidays: boolean;
};

export function normalizeYear(input: string): number {
  const english = input
    .trim()
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)));
  if (!/^\d+$/.test(english)) return Number.NaN;
  return Number(english);
}

export function parseCliArgs(args: string[]): CliOptions {
  let year: number | undefined;
  let root = "dist";
  let justHolidays = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index] ?? "";
    if (arg === "--just-holidays") {
      justHolidays = true;
      continue;
    }
    if (arg === "--root" || arg.startsWith("--root=")) {
      const value = arg === "--root" ? args[index + 1] : arg.slice("--root=".length);
      if (arg === "--root") index += 1;
      if (value === undefined || value === "" || value.startsWith("--")) {
        throw new Error("Missing directory after --root.");
      }
      root = value;
      continue;
    }
    if (arg.startsWith("--")) throw new Error(`Unknown option ${arg}.`);
    if (year !== undefined) throw new Error("Pass one Solar Hijri year.");
    const parsed = normalizeYear(arg);
    if (!Number.isInteger(parsed) || parsed < 1) throw new Error("Year must be a positive integer.");
    year = parsed;
  }

  if (year === undefined) throw new Error("Pass a Solar Hijri year.");
  return { year, root, justHolidays };
}
