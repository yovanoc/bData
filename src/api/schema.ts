import { fieldAuthorizePlugin, makeSchema, queryComplexityPlugin } from "nexus";
import { join } from "node:path";
import * as query from "../query/index.js";
import * as mutation from "../mutation/index.js";
import * as models from "../models/index.js";
import { nexusShield, allow } from "nexus-shield";
import { ForbiddenError } from "apollo-server-express";
import NexusPrisma from "nexus-prisma";
import { enumType } from "nexus";
import NexusPrismaScalars from "nexus-prisma/scalars.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const { CandleInterval } = NexusPrisma;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const schema = makeSchema({
  shouldExitAfterGenerateArtifacts: Boolean(
    process.env.NEXUS_SHOULD_EXIT_AFTER_REFLECTION
  ),
  sourceTypes: {
    modules: [{ module: ".prisma/client", alias: "PrismaClient" }]
  },
  contextType: {
    module: join(__dirname, "context.ts"),
    export: "Context"
  },
  outputs: {
    typegen: join(
      __dirname,
      "../../node_modules/@types/nexus-typegen/index.d.ts"
    ),
    schema: join(__dirname, "../../api.graphql")
  },
  plugins: [
    nexusShield({
      defaultError: new ForbiddenError("Not allowed"),
      defaultRule: allow
    }),
    fieldAuthorizePlugin(),
    queryComplexityPlugin()
  ],
  types: [NexusPrismaScalars, enumType(CandleInterval), query, mutation, models]
});
