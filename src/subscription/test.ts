import { subscriptionField } from "nexus";

export default subscriptionField(t => {
  t.nonNull.boolean("test", {
    subscribe() {
      return (async function* () {
        while (true) {
          await new Promise(res => setTimeout(res, 1000));
          yield Math.random() > 0.5;
        }
      })();
    },
    resolve(eventData) {
      return eventData;
    }
  });
});
