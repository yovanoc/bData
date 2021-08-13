import { config } from "dotenv-flow";

config({
  silent: true
});

import { prisma } from "./prisma.js";
import { ApolloServer } from "apollo-server-express";
import type { Request } from "express";
import express from "express";
import { resolveSession } from "./context.js";
import type { IRateLimiterOptions } from "rate-limiter-flexible";
import { RateLimiterMemory, RateLimiterQueue } from "rate-limiter-flexible";
import { createServer } from "http";
import { getServerStopFunc } from "../utils/serverStop.js";
import Cors from "cors";
import { schema } from "./schema.js";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const corsOpts: Cors.CorsOptions = {
  origin: async (origin, callback) => {
    if (!origin) {
      callback(new Error(`Not allowed by CORS (Origin: ${origin})`));
    } else {
      callback(null, true);
    }
  },
  credentials: true
};

const corsDelegate: Cors.CorsOptionsDelegate = (req, callback) => {
  let opts: Cors.CorsOptions = corsOpts;
  if (
    ["bdata.io", "localhost:4000", "https://studio.apollographql.com"].includes(
      req.headers.host ?? ""
    ) &&
    req.method === "GET"
  ) {
    // Deactivate cors for the graphql playground
    opts = {
      origin: false
    };
  }

  callback(null, opts);
};

const limiterOptions: IRateLimiterOptions = {
  points: 20000,
  duration: 600
};

const limiterFlexible = new RateLimiterMemory(limiterOptions);

const limiter = new RateLimiterQueue(limiterFlexible, {
  maxQueueSize: 100
});

const apollo = new ApolloServer({
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: async ({ req, res }) =>
    Object.assign(await resolveSession(req, res), { prisma }),
  schema
});

const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");

app.use(express.json());

app.use(Cors(corsDelegate));

export const getRealIp = <T>(req: Request<T>): string | null => req.ip ?? null;

app.use(async (req, res, next) => {
  const ip = getRealIp(req) ?? "NO_IP";
  try {
    await limiter.removeTokens(1, ip);
    const lim = await limiterFlexible.get(ip);
    if (!lim) {
      throw new Error(`No limits for ${ip}`);
    }
    const headers = {
      "Retry-After": Math.ceil(lim.msBeforeNext / 1000),
      "X-RateLimit-Limit": limiterOptions.points,
      "X-RateLimit-Remaining": lim.remainingPoints,
      "X-RateLimit-Reset": new Date(Date.now() + lim.msBeforeNext).toISOString()
    };
    const date = new Date();
    console.log(`${date.toLocaleString()}\t${ip}\t${req.method}\t${req.path}`);
    if (req.path === "/graphql") {
      const res = req.body;
      console.log({
        query: res.query
          ? res.query.toString().substr(0, 120).replaceAll("\n", "")
          : null,
        variables: res.variables
      });
    } else if (req.body) {
      console.log(`\t\t${JSON.stringify(req.body).substr(0, 120)}`);
    } else {
      //
    }
    res.set(headers);
    next();
  } catch (err) {
    const date = new Date();
    console.log(`${date}\t${ip}\tError\t${err}`);
    if (err instanceof Error) {
      console.error(err);
      res.status(400).end(err);
    } else {
      res.status(429).send("Too Many Requests");
    }
  }
});

app.get("/env", (req, res) => {
  if (req.query.code !== "chrislebg") {
    return res.json({ error: "access denied" });
  }
  res.json({
    env: process.env.NODE_ENV,
    port: process.env.API_PORT,
    db: process.env.DATABASE_URL
  });
});

const server = createServer(app);
const stop = getServerStopFunc(server);

const subscriptionServer = SubscriptionServer.create(
  {
    // This is the `schema` we just created.
    schema,
    // These are imported from `graphql`.
    execute,
    subscribe
  },
  {
    // This is the `httpServer` we created in a previous step.
    server,
    // This `server` is the instance returned from `new ApolloServer`.
    path: apollo.graphqlPath
  }
);

export const startServer = async (
  port: number,
  cb: () => void
): Promise<void> => {
  await apollo.start();
  apollo.applyMiddleware({
    app,
    // By default, apollo-server hosts its GraphQL endpoint at the
    // server root. However, *other* Apollo Server packages host it at
    // /graphql. Optionally provide this to match apollo-server.
    path: apollo.graphqlPath
  });
  server.listen(port, cb);
};

export const stopServer = async (): Promise<void> => {
  console.log("Stopping server");

  try {
    await stop();
    subscriptionServer.close();
    await apollo.stop();
    console.log("Server stopped gracefully");
  } catch (error) {
    console.log("Something went wrong while stopping server", error);
  }
};
