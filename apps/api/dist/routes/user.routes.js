import { handleError } from "@packages/db/utils";
import { baseUserSchema, UpdateUserSchema } from "@packages/schema";
import { z } from "zod";
import { UserServices } from "../services/userServices.js";
export async function userRoutes(fastify, options) {
    fastify.get("/users", {
        handler: async (request, reply) => {
            const result = await UserServices.getUsers(fastify.prisma);
            return reply.send(result);
        },
    });
    fastify.get("/users/id/:id", {
        handler: async (request, reply) => {
            const { id } = request.params;
            const result = await UserServices.getUser(id, fastify.prisma);
            return reply.send(result);
        },
    });
    fastify.get("/users/email", {
        handler: async (request, reply) => {
            const { email } = request.query;
            const decodedEmail = decodeURIComponent(email);
            const result = await UserServices.getUserCredentials(decodedEmail, fastify.prisma);
            return reply.send(result);
        },
    });
    fastify.post("/users", {
        preHandler: (request, reply, done) => {
            const body = request.body;
            const { data, error } = baseUserSchema.safeParse(body);
            if (error)
                return reply.status(400).send(handleError(z.flattenError(error)));
            request.baseUser = data;
            done();
        },
        handler: async (request, reply) => {
            const body = request.baseUser;
            const result = await UserServices.createUser(body, fastify.prisma);
            return reply.send(result);
        },
    });
    fastify.patch("/users/:id", {
        preHandler: (request, reply, done) => {
            const body = request.body;
            const { data, error } = UpdateUserSchema.safeParse(body);
            if (error)
                return reply.status(400).send(handleError(z.flattenError(error)));
            request.updateUser = data;
            done();
        },
        handler: async (request, reply) => {
            const body = request.updateUser;
            const result = await UserServices.updateUser(body, request.params.id, fastify.prisma);
            return reply.send(result);
        },
    });
    fastify.delete("/users/:id", {
        handler: async (request, reply) => {
            const result = await UserServices.deleteUser(request.params.id, fastify.prisma);
            return reply.send(result);
        },
    });
}
//# sourceMappingURL=user.routes.js.map