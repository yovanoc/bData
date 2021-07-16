import { DateTimeResolver } from "graphql-scalars";
import {
  asNexusMethod,
  fieldAuthorizePlugin,
  makeSchema,
  queryComplexityPlugin
} from "nexus";
import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema";
import { join } from "node:path";
import * as query from "../query/index";
import * as mutation from "../mutation/index";
import * as models from "../models/index";
import { nexusShield, allow } from "nexus-shield";
import { ForbiddenError } from "apollo-server-express";

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
    nexusSchemaPrisma({
      experimentalCRUD: true,
      prismaClient: ctx => ctx.prisma
    }),
    nexusShield({
      defaultError: new ForbiddenError("Not allowed"),
      defaultRule: allow
    }),
    fieldAuthorizePlugin(),
    queryComplexityPlugin()
  ],
  types: [asNexusMethod(DateTimeResolver, "date"), query, mutation, models]
});
