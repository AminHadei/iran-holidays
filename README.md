# Official Iranian Holidays

Builds a JSON file of official Iranian holidays for any Solar Hijri year and writes it to `dist`. The rules follow [time.ir](https://www.time.ir/), and the output shape is close to [IranHollidaysJSON](https://github.com/iyazdanicharati/IranHollidaysJSON).

## Generate

```bash
pnpm install
pnpm run create 1407
pnpm run create 1405 --just-holidays
pnpm run create 1405 --root data --just-holidays
```

`dist/1407.json` lists every day and marks holidays with `isHoliday`. `dist/1405-just-holidays.json` lists only holidays and omits `isHoliday`. `--root` chooses the output directory and defaults to `dist`.

`pnpm create` is reserved by pnpm for scaffolding new projects, so this repo uses `pnpm run create`.

## Checks

```bash
pnpm lint
pnpm format
pnpm typecheck
pnpm test
```

`pnpm lint` runs Oxlint. `pnpm format` checks Oxfmt, a Prettier-compatible formatter. `pnpm format:fix` and `pnpm lint:fix` write the fixes. GitHub Actions runs these checks on pull requests and on pushes to `main`.

## Use in another project

```bash
pnpm add iran-holidays
```

```ts
import { generateYear, writeHolidays } from 'iran-holidays';

await writeHolidays({ year: 1407 });
await writeHolidays({ year: 1405, root: 'data', justHolidays: true });

const year = generateYear(1404);
```

`writeHolidays` writes `{year}.json`, or `{year}-just-holidays.json` when `justHolidays` is set. `root` defaults to `dist`, resolved from the current working directory.

The package also installs a `iran-holidays` command:

```bash
iran-holidays 1407 --root data
iran-holidays 1405 --just-holidays --root data
```

## The three time.ir calendars

- **Solar Hijri:** fixed holidays such as Nowruz, 12 and 13 Farvardin, 14 and 15 Khordad, 22 Bahman, and 29 Esfand. 30 Esfand is a holiday only in a leap year. A fixed holiday begins on the date of its event: 22 Bahman starts in 1357, Islamic Republic Day in 1358, the 15 Khordad uprising in 1342, Imam Khomeini's death in 1368, and oil nationalization in 1329. Nowruz and 13 Farvardin have no start date.
- **Hijri lunar:** religious holidays such as Tasua, Ashura, Arbaeen, Eid al-Fitr (two days), Eid al-Adha, and Eid al-Ghadir. Their Solar Hijri date moves every year. Each one starts on the Hijri date of the event, so mid-Sha'ban begins on 15 Sha'ban 255 AH and does not appear in solar year 10. Imam Reza's martyrdom falls on the last day of Safar, whether that month has 29 or 30 days.
- **Gregorian:** international occasions such as Christmas and world days. time.ir does not mark them as official holidays, so they are left out. An ordinary Friday is also left unmarked unless it carries a holiday occasion.

Hijri month lengths come from the official Iranian calendar through 18 Farvardin 1406. Later years, including 1407, estimate the evening crescent at Tehran. That estimate is usually right, and it can shift by one day until the calendar center announces the sighting.
