import { PrismaClient } from "@packages/db/prisma/server";
import { narrowError } from "@packages/db/utils";
import { FastifyInstance, FastifyReply } from "fastify";

type Result =
  | {
      healthy: true;
      latency: number | null;
      dbQueryResult: string | null;
      error: null;
    }
  | {
      healthy: false;
      latency: number | null;
      dbQueryResult: string | null;
      error: string;
    };

export async function healthCheck(prismaInstance: PrismaClient): Promise<Result> {
  const queryStart = Date.now();

  try {
    const result = await prismaInstance.$queryRaw<[{ current_databse: string }]>`
    SELECT current_database()
  `;
    const latency = Date.now() - queryStart;

    return {
      healthy: true,
      latency,
      dbQueryResult: result[0]?.current_databse,
      error: null,
    };
  } catch (err) {
    return {
      healthy: false,
      latency: null,
      dbQueryResult: null,
      error: narrowError(err).message,
    };
  }
}

export async function healthCheckRoute(fastify: FastifyInstance) {
  fastify.get("/health", {
    async handler(_, reply: FastifyReply) {
      const health = await healthCheck(fastify.prisma);
      if (health.error) {
        return reply.send(health);
      }
      return reply.send(health);
    },
  });
}
