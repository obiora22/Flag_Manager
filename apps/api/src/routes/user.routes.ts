import {
  FastifyRequest,
  FastifyReply,
  FastifyPluginOptions,
  FastifyInstance,
  RequestGenericInterface,
} from "fastify";
import { User } from "@db/prisma/generated/client.js";
import { UpdateUserSchema, BaseUserSchema, BaseUser, UpdateUser } from "@schema/user.schema.js";
import { UserServices } from "@api/src/services/userServices.ts";
import { z } from "zod";

interface RequestParams<T, Q = any> {
  Params: T;
  QueryString: {
    token: Q;
  };
}

interface MyRequest<T> extends RequestGenericInterface {
  Querystring: T;
}

export async function userRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/users", {
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { ok, data, error } = await UserServices.getUsers(fastify.prisma);
      fastify.prisma;
      return reply.send({ ok, data, error });
    },
  });

  fastify.get("/users/id/:id", {
    handler: async (
      request: FastifyRequest<RequestParams<{ id: string }>>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const { ok, data, error } = await UserServices.getUser(id, fastify.prisma);

      return reply.send({
        ok,
        data,
        error,
      });
    },
  });

  fastify.get("/users/email", {
    handler: async (request: FastifyRequest<MyRequest<{ email: string }>>, reply: FastifyReply) => {
      const { email } = request.query;
      const decodedEmail = decodeURIComponent(email);
      const { ok, data, error } = await UserServices.getUserCredentials(
        decodedEmail,
        fastify.prisma
      );

      return reply.send({
        ok,
        data,
        error,
      });
    },
  });

  fastify.post("/users", {
    preHandler: (request: FastifyRequest, reply: FastifyReply, done) => {
      console.log({ body: request.body });
      const body = request.body as BaseUser;
      const { data, error } = BaseUserSchema.safeParse(body);
      if (error)
        return reply.send({
          ok: false,
          data: null,
          error: {
            message: "Invalid parameters",
            details: z.flattenError(error),
          },
        });
      request.baseUser = body;
      done();
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.baseUser;
      const { ok, data, error } = await UserServices.createUser(body, fastify.prisma);
      return reply.send({
        ok,
        data,
        error,
      });
    },
  });

  fastify.put("/users/:id", {
    preHandler: (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as UpdateUser;
      const { data, error } = UpdateUserSchema.safeParse(body);
      if (error)
        return reply.send({
          ok: false,
          data: null,
          error: {
            message: "Invalid paramters",
            details: z.flattenError(error),
          },
        });
      request.updateUser = body;
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.updateUser;
      const { ok, data, error } = await UserServices.updateUser(body, fastify.prisma);
      return reply.send({
        ok: false,
        data: null,
        error: error,
      });
    },
  });
  fastify.delete("/users/:id", {
    handler: async (request: FastifyRequest<RequestParams<User>>, reply: FastifyReply) => {
      const { id } = request.params;
      const { ok, data, error } = await UserServices.deleteUser(id, fastify.prisma);
      return reply.send({
        ok,
        data,
        error,
      });
    },
  });
}
