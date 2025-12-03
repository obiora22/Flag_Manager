import {
  FastifyRequest,
  FastifyReply,
  FastifyPluginOptions,
  FastifyInstance,
} from "fastify";
import { User } from "@db/prisma/generated/client";
import { server as fastify } from "@api/src/server";
import {
  BaseUser,
  baseUserSchema,
  UpdateUser,
  updateUserSchema,
} from "@repo/packages/schema/user.schema";
import { UserServices } from "@db/services/userServices";
import { z } from "zod";

interface RequestParams {
  Params: { id: string };
}

export async function userRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/users", {
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { ok, data, error } = await UserServices.getUsers(fastify.prisma);
      fastify.prisma;
      return reply.send({ ok, data, error });
    },
  });

  fastify.get("/users/:id", {
    handler: async (
      request: FastifyRequest<RequestParams>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const { ok, data, error } = await UserServices.getUser(
        id,
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
      const { data, error } = baseUserSchema.safeParse(body);
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
      const { ok, data, error } = await UserServices.createUser(
        body,
        fastify.prisma
      );
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
      const { data, error } = updateUserSchema.safeParse(body);
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
      const { ok, data, error } = await UserServices.updateUser(
        body,
        fastify.prisma
      );
      return reply.send({
        ok: false,
        data: null,
        error: error,
      });
    },
  });
  fastify.delete("/users/:id", {
    handler: async (
      request: FastifyRequest<RequestParams>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const { ok, data, error } = await UserServices.deleteUser(id);
      return reply.send({
        ok,
        data,
        error,
      });
    },
  });
}
