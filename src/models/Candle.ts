import { objectType } from "nexus";
import NexusPrisma from "nexus-prisma";

const { Candle } = NexusPrisma;

export default objectType({
  name: Candle.$name,
  description: Candle.$description,
  definition(t) {
    t.field(Candle.id);
    t.field(Candle.symbol);
    t.field(Candle.symbolId);
    t.field(Candle.baseAssetVolume);
    t.field(Candle.close);
    t.field(Candle.closeTime);
    t.field(Candle.high);
    t.field(Candle.interval);
    t.field(Candle.low);
    t.field(Candle.open);
    t.field(Candle.openTime);
    t.field(Candle.quoteAssetVolume);
    t.field(Candle.quoteVolume);
    t.field(Candle.trades);
    t.field(Candle.volume);
  }
});
