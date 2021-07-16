import { mutationField } from "nexus";

export default mutationField(t => {
  t.nonNull.boolean("test", {
    resolve: async (_, _args, _ctx) => {
      return true;
    }
  });
});
