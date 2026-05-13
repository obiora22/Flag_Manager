import { FlagService } from "@api/src/services/flagService.js";
import { baseFlagSchema, updateFlagSchema } from "@packages/schema";
import z from "zod";
export async function flagRoutes(fastify, options) {
    fastify.get("/flags", {
        async handler(request, reply) {
            const result = await FlagService.getFlags(fastify.prisma, request.query.projectId);
            return reply.send(result);
        },
    });
    fastify.get("/flags/:id", {
        async handler(request, reply) {
            const result = await FlagService.getFlag(fastify.prisma, request.params.id);
            return reply.send(result);
        },
    });
    fastify.post("/flags", {
        preHandler(request, reply, done) {
            const { data, error } = baseFlagSchema.safeParse(request.body);
            if (error)
                return reply.code(400).send({
                    ok: false,
                    data: null,
                    error: {
                        message: "Invalid parameters",
                        details: z.flattenError(error),
                    },
                });
            request.baseFlag = data;
            done();
        },
        async handler(request, reply) {
            const result = await FlagService.createFlag(fastify.prisma, request.baseFlag);
            return reply.send(result);
        },
    });
    fastify.patch("/flags/:id", {
        preHandler(request, reply, done) {
            const { data, error } = updateFlagSchema.safeParse(request.body);
            if (error)
                return reply.send({
                    ok: false,
                    data: null,
                    error: {
                        message: "Invalid parameters",
                        details: z.flattenError(error),
                    },
                });
            request.updateFlag = data;
            done();
        },
        async handler(request, reply) {
            const result = await FlagService.updateFlag(fastify.prisma, request.updateFlag, request.params.id);
            return reply.send(result);
        },
    });
    fastify.delete("/flags/:id", {
        async handler(request, reply) {
            const result = await FlagService.deleteFlag(fastify.prisma, request.params.id);
            return reply.send(result);
        },
    });
}
//# sourceMappingURL=flag.routes.js.map