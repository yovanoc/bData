import { objectType } from "nexus";
import NexusPrisma from "nexus-prisma";

const { Symbol } = NexusPrisma;

export default objectType({
  name: Symbol.$name,
  description: Symbol.$description,
  definition(t) {
    t.field(Symbol.id);
    t.field(Symbol.symbol);
    t.field(Symbol.prices);
    t.field(Symbol.candles);
  }
});
