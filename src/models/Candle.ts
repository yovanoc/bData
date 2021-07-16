import { objectType } from "nexus";

export default objectType({
  name: "Candle",
  definition(t) {
    t.model.id();
    t.model.symbol();
    t.model.symbolId();
    t.model.baseAssetVolume();
    t.model.close();
    t.model.closeTime();
    t.model.high();
    t.model.interval();
    t.model.low();
    t.model.open();
    t.model.openTime();
    t.model.quoteAssetVolume();
    t.model.quoteVolume();
    t.model.trades();
    t.model.volume();
  }
});
