import { objectType } from "nexus";

export default objectType({
  name: "Symbol",
  definition(t) {
    t.model.id();
    t.model.symbol();
    t.model.prices();
    t.model.candles();
  }
});
