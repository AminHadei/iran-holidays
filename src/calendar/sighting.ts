import {
  Body,
  Elongation,
  Equator,
  Horizon,
  Observer,
  SearchRiseSet,
} from "astronomy-engine";
import type { Ymd } from "./jalali.ts";

/** Tehran. Sunset here is the crescent criterion once the official table runs out. */
const TEHRAN = new Observer(35.6892, 51.389, 1200);

/**
 * The evening crescent counts as visible at Tehran sunset when the Moon is
 * more than 2 degrees above the horizon and at least 9.5 degrees from the Sun.
 * The threshold was fitted to official months 1423–1448, and the chained error stays within one day.
 */
export function crescentVisible(date: Ymd): boolean {
  const start = new Date(Date.UTC(date.year, date.month - 1, date.day, 8, 0, 0));
  const sunset = SearchRiseSet(Body.Sun, TEHRAN, -1, start, 2);
  if (!sunset) return false;

  const moon = Equator(Body.Moon, sunset, TEHRAN, true, true);
  const horizon = Horizon(sunset, TEHRAN, moon.ra, moon.dec);
  const elongation = Elongation(Body.Moon, sunset).elongation;
  return horizon.altitude > 2 && elongation >= 9.5;
}
