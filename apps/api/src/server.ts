import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { userRoutes } from "./routes/user.routes.ts";
import { projectRoutes } from "./routes/project.routes.ts";
import { flagRoutes } from "./routes/flag.routes.ts";
import { environmentRoutes } from "./routes/environment.routes.ts";

import prismaPlugin from "@db/prisma.plugin.ts";
import * as dotenv from "dotenv";

import { PrismaClient } from "@db/prisma/generated/client.ts";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

dotenv.config({ path: "../../packages/db/.env" });

function buildServer() {
  const app = Fastify({
    logger: true,
  });

  // Register prisma
  app.register(prismaPlugin);

  // middlewares
  app.register(cors, {
    origin: "*",
  });

  app.register(helmet);

  app.register(userRoutes, { prefix: "/api/v1" });

  // app.register(projectRoutes, { prefix: "/api/v1" });

  // app.register(flagRoutes, { prefix: "/api/v1" });

  // app.register(environmentRoutes, { prefix: "/api/v1" });

  app.get("/health", async () => {
    return { status: "ok" };
  });

  return app;
}

async function start() {
  const appServer = buildServer();
  const port = Number(process.env.PORT) || 3001;

  try {
    await appServer.listen({ port, host: "0.0.0.0" });
    appServer.log.info(`API running on http://localhost:${port}`);
  } catch (err) {
    appServer.log.error(err);
    process.exit(1);
  }

  return appServer;
}

export const server = await start();
