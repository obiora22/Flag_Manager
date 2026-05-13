import { UserServices } from "@api/src/services/userServices.js";
import { User } from "@packages/db/prisma/server";
import { handleError, handleResult } from "@packages/db/utils";
import { BaseUser, baseUserSchema, UpdateUser, UpdateUserSchema } from "@packages/schema";
import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
  RequestGenericInterface,
} from "fastify";
import { z } from "zod";

interface RequestParams<T, Q = any> {
  Params: T;
  QueryString: {
    token: Q;
  };
}

export async function userRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/users", {
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const result = await UserServices.getUsers(fastify.prisma);
      return reply.send(result);
    },
  });

  fastify.get("/users/id/:id", {
    handler: async (
      request: FastifyRequest<RequestParams<{ id: string }>>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;
      const result = await UserServices.getUser(id, fastify.prisma);

      return reply.send(result);
    },
  });

  fastify.get("/users/email", {
    handler: async (
      request: FastifyRequest<{ Querystring: { email: string } }>,
      reply: FastifyReply,
    ) => {
      const { email } = request.query;
      const decodedEmail = decodeURIComponent(email);
      const result = await UserServices.getUserCredentials(decodedEmail, fastify.prisma);
      return reply.send(result);
    },
  });

  fastify.post("/users", {
    preHandler: (request: FastifyRequest, reply: FastifyReply, done) => {
      const body = request.body;
      const { data, error } = baseUserSchema.safeParse(body);
      if (error) return reply.status(400).send(handleError(z.flattenError(error)));
      request.baseUser = data;
      done();
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.baseUser;
      const result = await UserServices.createUser(body, fastify.prisma);
      return reply.send(result);
    },
  });

  fastify.patch("/users/:id", {
    preHandler: (
      request: FastifyRequest<{ Params: { id: string }; Body: BaseUser }>,
      reply: FastifyReply,
      done,
    ) => {
      const body = request.body;
      const { data, error } = UpdateUserSchema.safeParse(body);
      if (error) return reply.status(400).send(handleError(z.flattenError(error)));
      request.updateUser = data;
      done();
    },
    handler: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const body = request.updateUser;
      const result = await UserServices.updateUser(body, request.params.id, fastify.prisma);
      return reply.send(result);
    },
  });

  fastify.delete("/users/:id", {
    handler: async (request: FastifyRequest<RequestParams<User>>, reply: FastifyReply) => {
      const result = await UserServices.deleteUser(request.params.id, fastify.prisma);
      return reply.send(result);
    },
  });
}
