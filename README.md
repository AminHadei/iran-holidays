# Official Iranian Holidays

Builds a JSON file of official Iranian holidays for any Solar Hijri year and writes it to `dist`. The rules follow [time.ir](https://www.time.ir/), and the output shape is close to [IranHollidaysJSON](https://github.com/iyazdanicharati/IranHollidaysJSON).

## Generate

```bash
pnpm install
pnpm run create 1407
```

Output: `dist/1407.json`

`pnpm create` is reserved by pnpm for scaffolding new projects, so this repo uses `pnpm run create`.

## The three time.ir calendars

- **Solar Hijri:** fixed holidays such as Nowruz, 12 and 13 Farvardin, 14 and 15 Khordad, 22 Bahman, and 29 Esfand. 30 Esfand is a holiday only in a leap year.
- **Hijri lunar:** religious holidays such as Tasua, Ashura, Arbaeen, Eid al-Fitr (two days), Eid al-Adha, and Eid al-Ghadir. Their Solar Hijri date moves every year. Imam Reza's martyrdom falls on the last day of Safar, whether that month has 29 or 30 days.
- **Gregorian:** international occasions such as Christmas and world days. time.ir does not mark them as official holidays, so they are left out. An ordinary Friday is also left unmarked unless it carries a holiday occasion.

Hijri month lengths come from the official Iranian calendar through 18 Farvardin 1406. Later years, including 1407, estimate the evening crescent at Tehran. That estimate is usually right, and it can shift by one day until the calendar center announces the sighting.
