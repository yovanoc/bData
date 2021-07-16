import { objectType } from "nexus";

export default objectType({
  name: "Price",
  definition(t) {
    t.model.id();
    t.model.date();
    t.model.realDate();
    t.model.symbol();
    t.model.symbolId();
    t.model.price();
  }
});
