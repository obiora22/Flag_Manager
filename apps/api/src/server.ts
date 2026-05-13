import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { PrismaClient } from "@packages/db/prisma/server";
import Fastify from "fastify";
import authPlugin from "./plugins/auth.js";
import prismaPlugin from "./plugins/prisma.js";
import { accountRegistrationRoutes } from "./routes/account.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { environmentRoutes } from "./routes/environment.routes.js";
import { flagRoutes } from "./routes/flag.routes.js";
import { healthCheckRoute } from "./routes/healthCheck.routes.js";
import { projectRoutes } from "./routes/project.routes.js";
import { userRoutes } from "./routes/user.routes.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

function buildServer() {
  const app = Fastify({
    logger: true,
  });

  app.register(prismaPlugin);

  app.register(authPlugin);

  /* Middlewares */
  app.register(cors, {
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    origin: ["*"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 60 * 60 * 24,
  });

  app.register(helmet);

  app.register(dashboardRoutes, { prefix: "/api/v1" });

  app.register(userRoutes, { prefix: "/api/v1" });

  app.register(projectRoutes, { prefix: "/api/v1" });

  app.register(flagRoutes, { prefix: "/api/v1" });

  app.register(environmentRoutes, { prefix: "/api/v1" });

  app.register(healthCheckRoute, { prefix: "/api/v1" });

  app.register(accountRegistrationRoutes, { prefix: "/api/v1" });

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
