import { arg, nonNull, nullable, queryField, stringArg } from "nexus";
import { getSymbolPrice } from "../binance/redis.js";

export default queryField(t => {
  t.nullable.field("price", {
    type: "Price",
    args: {
      symbol: nonNull(stringArg()),
      date: nullable(arg({ type: "DateTime" }))
    },
    resolve: async (_, { symbol, date }, { prisma }) => {
      const id = await getSymbolPrice(symbol, date);
      if (!id) {
        return null;
      }
      return prisma.price.findUnique({
        where: {
          id
        }
      });
    }
  });
});
