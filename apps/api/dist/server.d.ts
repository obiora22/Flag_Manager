import { PrismaClient } from "@packages/db/prisma/server";
import Fastify from "fastify";
declare module "fastify" {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}
export declare const server: Fastify.FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, Fastify.FastifyBaseLogger, Fastify.FastifyTypeProviderDefault>;
//# sourceMappingURL=server.d.ts.map