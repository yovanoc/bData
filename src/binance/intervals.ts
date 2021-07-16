import { CandleChartInterval } from "binance-api-node";
import type { CandleInterval } from "@prisma/client";

const ONE_MINUTE = 60;
const THREE_MINUTES = 3 * ONE_MINUTE;
const FIVE_MINUTES = 5 * ONE_MINUTE;
const FIFTEEN_MINUTES = 3 * FIVE_MINUTES;
const THIRTY_MINUTES = 2 * FIFTEEN_MINUTES;
const ONE_HOUR = 2 * THIRTY_MINUTES;
const TWO_HOURS = 2 * ONE_HOUR;
const FOUR_HOURS = 2 * TWO_HOURS;
const SIX_HOURS = FOUR_HOURS + TWO_HOURS;
const EIGHT_HOURS = 2 * FOUR_HOURS;
const TWELVE_HOURS = 2 * SIX_HOURS;
const ONE_DAY = 2 * TWELVE_HOURS;
const THREE_DAYS = 3 * ONE_DAY;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_MONTH = 4 * ONE_WEEK;

// {
//   ONE_MINUTE: 60,
//   THREE_MINUTES: 180,
//   FIVE_MINUTES: 300,
//   FIFTEEN_MINUTES: 900,
//   THIRTY_MINUTES: 1800,
//   ONE_HOUR: 3600,
//   TWO_HOURS: 7200,
//   FOUR_HOURS: 14400,
//   SIX_HOURS: 21600,
//   EIGHT_HOURS: 28800,
//   TWELVE_HOURS: 43200,
//   ONE_DAY: 86400,
//   THREE_DAYS: 259200,
//   ONE_WEEK: 604800,
//   ONE_MONTH: 2419200
// }

export function candleIntervalToNumber(interval: CandleChartInterval): number {
  switch (interval) {
    case CandleChartInterval.ONE_MINUTE:
      return ONE_MINUTE;
    case CandleChartInterval.THREE_MINUTES:
      return THREE_MINUTES;
    case CandleChartInterval.FIVE_MINUTES:
      return FIVE_MINUTES;
    case CandleChartInterval.FIFTEEN_MINUTES:
      return FIFTEEN_MINUTES;
    case CandleChartInterval.THIRTY_MINUTES:
      return THIRTY_MINUTES;
    case CandleChartInterval.ONE_HOUR:
      return ONE_HOUR;
    case CandleChartInterval.TWO_HOURS:
      return TWO_HOURS;
    case CandleChartInterval.FOUR_HOURS:
      return FOUR_HOURS;
    case CandleChartInterval.SIX_HOURS:
      return SIX_HOURS;
    case CandleChartInterval.EIGHT_HOURS:
      return EIGHT_HOURS;
    case CandleChartInterval.TWELVE_HOURS:
      return TWELVE_HOURS;
    case CandleChartInterval.ONE_DAY:
      return ONE_DAY;
    case CandleChartInterval.THREE_DAYS:
      return THREE_DAYS;
    case CandleChartInterval.ONE_WEEK:
      return ONE_WEEK;
    case CandleChartInterval.ONE_MONTH:
      return ONE_MONTH;
    default:
      return ONE_MINUTE;
  }
}

export function numberToCandleInterval(interval: number): CandleChartInterval {
  switch (interval) {
    case ONE_MINUTE:
      return CandleChartInterval.ONE_MINUTE;
    case THREE_MINUTES:
      return CandleChartInterval.THREE_MINUTES;
    case FIVE_MINUTES:
      return CandleChartInterval.FIVE_MINUTES;
    case FIFTEEN_MINUTES:
      return CandleChartInterval.FIFTEEN_MINUTES;
    case THIRTY_MINUTES:
      return CandleChartInterval.THIRTY_MINUTES;
    case ONE_HOUR:
      return CandleChartInterval.ONE_HOUR;
    case TWO_HOURS:
      return CandleChartInterval.TWO_HOURS;
    case FOUR_HOURS:
      return CandleChartInterval.FOUR_HOURS;
    case SIX_HOURS:
      return CandleChartInterval.SIX_HOURS;
    case EIGHT_HOURS:
      return CandleChartInterval.EIGHT_HOURS;
    case TWELVE_HOURS:
      return CandleChartInterval.TWELVE_HOURS;
    case ONE_DAY:
      return CandleChartInterval.ONE_DAY;
    case THREE_DAYS:
      return CandleChartInterval.THREE_DAYS;
    case ONE_WEEK:
      return CandleChartInterval.ONE_WEEK;
    case ONE_MONTH:
      return CandleChartInterval.ONE_MONTH;
    default:
      return CandleChartInterval.ONE_MINUTE;
  }
}

export function prismaIntervalToCandleInterval(
  interval: CandleInterval
): CandleChartInterval {
  switch (interval) {
    case "ONE_MINUTE":
      return CandleChartInterval.ONE_MINUTE;
    case "THREE_MINUTES":
      return CandleChartInterval.THREE_MINUTES;
    case "FIVE_MINUTES":
      return CandleChartInterval.FIVE_MINUTES;
    case "FIFTEEN_MINUTES":
      return CandleChartInterval.FIFTEEN_MINUTES;
    case "THIRTY_MINUTES":
      return CandleChartInterval.THIRTY_MINUTES;
    case "ONE_HOUR":
      return CandleChartInterval.ONE_HOUR;
    case "TWO_HOURS":
      return CandleChartInterval.TWO_HOURS;
    case "FOUR_HOURS":
      return CandleChartInterval.FOUR_HOURS;
    case "SIX_HOURS":
      return CandleChartInterval.SIX_HOURS;
    case "EIGHT_HOURS":
      return CandleChartInterval.EIGHT_HOURS;
    case "TWELVE_HOURS":
      return CandleChartInterval.TWELVE_HOURS;
    case "ONE_DAY":
      return CandleChartInterval.ONE_DAY;
    case "THREE_DAYS":
      return CandleChartInterval.THREE_DAYS;
    case "ONE_WEEK":
      return CandleChartInterval.ONE_WEEK;
    case "ONE_MONTH":
      return CandleChartInterval.ONE_MONTH;
    default:
      return CandleChartInterval.ONE_MINUTE;
  }
}

export function candleIntervalToPrismaInterval(
  interval: CandleChartInterval
): CandleInterval {
  switch (interval) {
    case CandleChartInterval.ONE_MINUTE:
      return "ONE_MINUTE";
    case CandleChartInterval.THREE_MINUTES:
      return "THREE_MINUTES";
    case CandleChartInterval.FIVE_MINUTES:
      return "FIVE_MINUTES";
    case CandleChartInterval.FIFTEEN_MINUTES:
      return "FIFTEEN_MINUTES";
    case CandleChartInterval.THIRTY_MINUTES:
      return "THIRTY_MINUTES";
    case CandleChartInterval.ONE_HOUR:
      return "ONE_HOUR";
    case CandleChartInterval.TWO_HOURS:
      return "TWO_HOURS";
    case CandleChartInterval.FOUR_HOURS:
      return "FOUR_HOURS";
    case CandleChartInterval.SIX_HOURS:
      return "SIX_HOURS";
    case CandleChartInterval.EIGHT_HOURS:
      return "EIGHT_HOURS";
    case CandleChartInterval.TWELVE_HOURS:
      return "TWELVE_HOURS";
    case CandleChartInterval.ONE_DAY:
      return "ONE_DAY";
    case CandleChartInterval.THREE_DAYS:
      return "THREE_DAYS";
    case CandleChartInterval.ONE_WEEK:
      return "ONE_WEEK";
    case CandleChartInterval.ONE_MONTH:
      return "ONE_MONTH";
    default:
      return "ONE_MINUTE";
  }
}

export function prismaIntervalToNumber(interval: CandleInterval): number {
  return candleIntervalToNumber(prismaIntervalToCandleInterval(interval));
}

export function numberToPrismaInterval(interval: number): CandleInterval {
  return candleIntervalToPrismaInterval(numberToCandleInterval(interval));
}
