import { PrismaClient } from "@packages/db/prisma/server";
import { FastifyInstance } from "fastify";
type Result = {
    healthy: true;
    latency: number | null;
    dbQueryResult: string | null;
    error: null;
} | {
    healthy: false;
    latency: number | null;
    dbQueryResult: string | null;
    error: string;
};
export declare function healthCheck(prismaInstance: PrismaClient): Promise<Result>;
export declare function healthCheckRoute(fastify: FastifyInstance): Promise<void>;
export {};
//# sourceMappingURL=healthCheck.routes.d.ts.map