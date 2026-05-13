import { narrowError } from "@packages/db/utils";
export async function healthCheck(prismaInstance) {
    const queryStart = Date.now();
    try {
        const result = await prismaInstance.$queryRaw `
    SELECT current_database()
  `;
        const latency = Date.now() - queryStart;
        return {
            healthy: true,
            latency,
            dbQueryResult: result[0]?.current_databse,
            error: null,
        };
    }
    catch (err) {
        return {
            healthy: false,
            latency: null,
            dbQueryResult: null,
            error: narrowError(err).message,
        };
    }
}
export async function healthCheckRoute(fastify) {
    fastify.get("/health", {
        async handler(_, reply) {
            const health = await healthCheck(fastify.prisma);
            if (health.error) {
                return reply.send(health);
            }
            return reply.send(health);
        },
    });
}
//# sourceMappingURL=healthCheck.routes.js.map