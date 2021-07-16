import type { CandlesOptions } from "binance-api-node";
import Binance, { CandleChartInterval } from "binance-api-node";
import * as Redis from "ioredis";
import { Semaphore } from "redis-semaphore";
import { getRoundedDate, ms } from "../utils/time";
import { prisma } from "../api";
import { candleIntervalToPrismaInterval } from "./intervals";

const redis = new Redis({
  host: "212.47.234.146",
  port: 6379,
  password: "GLSy5FRGDGJc4hHzdInuyXJYz1WpyGV0"
});

const client = Binance();

const roundDate = (date: Date): Date => getRoundedDate(date, 500);

// const WEIGHT_LIMIT_1M = 1200;

// let highestWeight = 0;

// // const waitForRateLimit = async (key: string): Promise<void> => {
//   const info = client.getInfo();
//   const weight = parseInt(info.spot.usedWeight1m || "0");
//   if (weight === 0) {
//     return;
//   }
//   if (highestWeight < weight) {
//     highestWeight = weight;
//     console.log(`New highestWeight: ${highestWeight}`);
//   }
//   const ratio = weight / WEIGHT_LIMIT_1M;

//   const waitTime = ~~(ratio ** 2 * 13000);
//   console.log({
//     date: new Date().toLocaleString(),
//     weight,
//     key,
//     ratio: ratio.toFixed(2),
//     waitTime
//   });
//   if (waitTime < 50) {
//     return;
//   }
//   await sleep(waitTime);
// };

const isBinanceSymbol = async (symbol: string): Promise<string | null> => {
  const key = `symbol-${symbol}`;
  const exists = await redis.get(key);
  if (exists) {
    return exists;
  }
  const pSymbol = await prisma.symbol.findFirst({
    where: {
      OR: [
        {
          id: symbol
        },
        {
          symbol
        }
      ]
    },
    select: {
      id: true
    }
  });

  if (!pSymbol) {
    const info = await client.futuresExchangeInfo();
    const bSymbol = info.symbols.find(s => s.symbol === symbol);
    if (!bSymbol) {
      return null;
    }
    const { id } = await prisma.symbol.create({
      data: {
        symbol
      },
      select: {
        id: true
      }
    });
    await redis.setex(key, ms.hours(2) / 1000, id);
    return id;
  }

  await redis.setex(key, ms.hours(2) / 1000, pSymbol.id);
  return pSymbol.id;
};

export const getCandles = async (
  opts: Required<CandlesOptions>
): Promise<string[]> => {
  const { interval, symbol, endTime, startTime, limit } = opts;
  const symbolId = await isBinanceSymbol(symbol);
  if (!symbolId) {
    return [];
  }

  const key = `candles-${symbol}-${interval}-${startTime}-${endTime}-${limit}`;
  const redisRes = await redis.get(key);
  if (redisRes) {
    return JSON.parse(redisRes);
  }
  const semaphore = new Semaphore(redis, key, 1);
  await semaphore.acquire();
  const candles = await client.futuresCandles(opts);
  const keys = new Array<string>();
  for (const c of candles) {
    const { id } = await prisma.candle.create({
      data: {
        baseAssetVolume: c.baseAssetVolume,
        close: c.close,
        high: c.high,
        low: c.low,
        open: c.open,
        quoteAssetVolume: c.quoteAssetVolume,
        openTime: new Date(c.openTime),
        closeTime: new Date(c.closeTime),
        volume: c.volume,
        interval: candleIntervalToPrismaInterval(interval),
        quoteVolume: c.quoteVolume,
        trades: c.trades,
        symbolId: symbolId
      },
      select: {
        id: true
      }
    });
    keys.push(id);
  }
  await redis.setex(key, ms.hours(1) / 1000, JSON.stringify(keys));
  await semaphore.release();
  // await waitForRateLimit(key);
  return keys;
};

const priceKey = (symbol: string, time: Date): string =>
  `price-${symbol}-${time.getTime()}`;

const instantPrice = async (
  symbol: string,
  date = new Date()
): Promise<string> => {
  const now = roundDate(date);
  const key = priceKey(symbol, now);
  const value = await redis.get(key);
  if (value) {
    return value;
  }
  const test = await prisma.price.findFirst({
    where: {
      symbol: {
        symbol
      },
      date: now
    },
    select: {
      id: true
    }
  });

  if (test) {
    await redis.setex(key, ms.hours(1) / 1000, test.id);
    return test.id;
  }

  const res = await client.futuresPrices();
  const newDate = roundDate(new Date());
  const { id } = await prisma.price.create({
    data: {
      symbol: {
        connect: {
          symbol
        }
      },
      price: res[symbol],
      date: newDate
    },
    select: {
      id: true
    }
  });
  await redis.setex(priceKey(symbol, newDate), ms.hours(1) / 1000, id);
  return id;
};

export const getSymbolPrice = async (
  symbol: string,
  date?: Date | null | undefined
): Promise<string | null> => {
  if (!(await isBinanceSymbol(symbol))) {
    return null;
  }

  if (!date) {
    return instantPrice(symbol);
  }

  const key = priceKey(symbol, date);
  const value = await redis.get(key);
  if (value) {
    return value;
  }

  const now = new Date();
  const roundedDate = getRoundedDate(date, ms.minutes(1));
  const above = roundedDate.getTime() > date.getTime();
  const side = above ? -1 : 1;
  const otherDate = new Date(roundedDate.getTime());
  otherDate.setMinutes(otherDate.getMinutes() + side);
  const tmp = new Date(
    above ? roundedDate.getTime() - 1 : otherDate.getTime() + 1
  );

  const dates = [otherDate, roundedDate, tmp];

  const test = await prisma.price.findFirst({
    where: {
      symbol: {
        symbol
      },
      OR: [
        {
          date: {
            in: dates
          }
        },
        {
          realDate: { in: dates }
        }
      ]
    },
    select: {
      id: true
    }
  });

  if (test) {
    await redis.setex(key, ms.hours(1) / 1000, test.id);
    return test.id;
  }

  const diff = Math.abs(date.getTime() - now.getTime());
  if (diff < 1000) {
    return instantPrice(symbol);
  }

  const semaphore = new Semaphore(redis, key, 1);
  await semaphore.acquire();

  // console.log({
  //   date,
  //   roundedDate,
  //   side,
  //   above,
  //   otherDate
  // });
  const candles = await getCandles({
    interval: CandleChartInterval.ONE_MINUTE,
    symbol,
    limit: 1,
    startTime: above ? otherDate.getTime() : roundedDate.getTime(),
    endTime: above ? roundedDate.getTime() : otherDate.getTime()
  });
  const kline = candles[0];
  if (!kline) {
    console.log(
      `There is no CANDLE!!!!! ${date.getTime()} ${date.toLocaleString()} ${roundedDate.getTime()} ${roundedDate.toLocaleString()} ${now} ${new Date(
        now
      ).toLocaleString()}`
    );
    console.log({
      type: "ERROR",
      date,
      roundedDate,
      side,
      above,
      otherDate,
      request: {
        interval: CandleChartInterval.ONE_MINUTE,
        symbol,
        limit: 1,
        startTime: above ? otherDate.getTime() : roundedDate.getTime(),
        endTime: above ? roundedDate.getTime() : otherDate.getTime()
      }
    });
    await semaphore.release();
    return null;
  }
  const candle = await prisma.candle.findUnique({
    where: {
      id: kline
    }
  });

  if (!candle) {
    return null;
  }
  const price = above ? candle.close : candle.open;
  const realDate = above ? candle.closeTime : candle.openTime;
  const { id } = await prisma.price.create({
    data: {
      symbol: {
        connect: {
          symbol
        }
      },
      price,
      date,
      realDate
    },
    select: {
      id: true
    }
  });
  await redis.setex(key, ms.hours(1) / 1000, id);
  await redis.setex(priceKey(symbol, realDate), ms.hours(1) / 1000, id);
  await semaphore.release();
  return id;
};
