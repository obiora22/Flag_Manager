import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { userRoutes } from "./routes/user.routes";
import { projectRoutes } from "@api/src/routes/project.routes";
import prismaPlugin from "@db/prisma.plugin";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";
import { flagRoutes } from "./routes/flag.routes";
import { environmentRoutes } from "./routes/environment.routes";

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

  app.register(projectRoutes, { prefix: "/api/v1" });

  app.register(flagRoutes, { prefix: "/api/v1" });

  app.register(environmentRoutes, { prefix: "/api/v1" });

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
