import { FastifyInstance, FastifyReply } from "fastify";
import { healthCheck } from "@db/lib/healthCheck.ts";

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
