import { objectType } from "nexus";
import NexusPrisma from "nexus-prisma";

const { Price } = NexusPrisma;

export default objectType({
  name: Price.$name,
  description: Price.$description,
  definition(t) {
    t.field(Price.id);
    t.field(Price.date);
    t.field(Price.realDate);
    t.field(Price.symbol);
    t.field(Price.symbolId);
    t.field(Price.price);
  }
});
