import { handleResult } from "@packages/db/utils";
import { baseEnvironmentSchema, updateEnvironmentSchema, } from "@packages/schema";
import z from "zod";
import { EnvironmentServices } from "../services/environmentServices.js";
export async function environmentRoutes(fastify, options) {
    fastify.get("/environments", {
        async handler(request, reply) {
            const result = await EnvironmentServices.findAll(fastify.prisma);
            return reply.send(handleResult(result));
        },
    });
    fastify.get("/environment/:id", {
        async handler(request, reply) {
            const result = await EnvironmentServices.findUnique(fastify.prisma, request.params.id);
            return reply.send(handleResult(result));
        },
    });
    fastify.post("/environment", {
        async preHandler(request, reply, done) {
            const { data, error } = baseEnvironmentSchema.safeParse(request.body);
            if (error) {
                return reply.status(400).send(handleResult(z.flattenError(error)));
            }
            // if (error) {
            //   return reply.status(400).send({
            //     ok: false,
            //     data: null,
            //     error: {
            //       message: "Invalid paramters",
            //       details: z.flattenError(error),
            //     },
            //   });
            // }
            request.baseEnvironment = data;
            done();
        },
        async handler(request, reply) {
            const result = await EnvironmentServices.create(fastify.prisma, request.baseEnvironment);
            return reply.send(handleResult(result));
        },
    });
    fastify.patch("/environment/:id", {
        async preHandler(request, reply, done) {
            const { data, error } = updateEnvironmentSchema.safeParse(request.body);
            if (error) {
                return reply.status(400).send(handleResult(z.flattenError(error)));
            }
            // if (error) {
            //   return reply.status(400).send({
            //     ok: false,
            //     data: null,
            //     error: {
            //       message: "Invalid paramters",
            //       details: z.flattenError(error),
            //     },
            //   });
            // }
            request.updateEnvironment = data;
            done();
        },
        async handler(request, reply) {
            const result = await EnvironmentServices.create(fastify.prisma, request.baseEnvironment);
            return reply.send(handleResult(result));
        },
    });
    fastify.delete("/environments/:id", {
        async handler(request, reply) {
            const result = await EnvironmentServices.delete(fastify.prisma, request.params.id);
            return reply.send(handleResult(result));
        },
    });
}
//# sourceMappingURL=environment.routes.js.map