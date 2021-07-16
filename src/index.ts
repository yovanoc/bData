import { startServer, stopServer } from "./api";

const port = 4000;

startServer(port, () => {
  console.log(`🚀 GraphQL service ready ! (${port})`);
});

// Shut down in the case of interrupt and termination signals
// We expect to handle this more cleanly in the future. See (#5074)[https://github.com/apollographql/apollo-server/issues/5074] for reference.
["SIGINT", "SIGTERM"].forEach(signal => {
  process.on(signal, message => {
    console.log("start shutdown", signal, message);
    stopServer().finally(() => {
      console.log("finished shutdown");
      process.exit(0);
    });
  });
});
