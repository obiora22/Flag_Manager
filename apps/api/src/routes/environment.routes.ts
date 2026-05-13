import { EnvironmentServices } from "@api/src/services/environmentServices.js";
import { handleResult } from "@packages/db/utils";
import {
  BaseEnvironment,
  baseEnvironmentSchema,
  UpdateEnvironment,
  updateEnvironmentSchema,
} from "@packages/schema";
import fastify, {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import z from "zod";

interface RequestProps {
  Params: { id: string };
}

export async function environmentRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/environments", {
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const result = await EnvironmentServices.findAll(fastify.prisma);
      return reply.send(handleResult(result));
    },
  });
  fastify.get("/environment/:id", {
    async handler(request: FastifyRequest<RequestProps>, reply: FastifyReply) {
      const result = await EnvironmentServices.findUnique(fastify.prisma, request.params.id);
      return reply.send(handleResult(result));
    },
  });
  fastify.post("/environment", {
    async preHandler(
      request: FastifyRequest<RequestProps & { Body: BaseEnvironment }>,
      reply: FastifyReply,
      done,
    ) {
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
    async handler(request: FastifyRequest<RequestProps>, reply: FastifyReply) {
      const result = await EnvironmentServices.create(fastify.prisma, request.baseEnvironment);
      return reply.send(handleResult(result));
    },
  });
  fastify.patch("/environment/:id", {
    async preHandler(
      request: FastifyRequest<RequestProps & { body: UpdateEnvironment }>,
      reply: FastifyReply,
      done,
    ) {
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
    async handler(request: FastifyRequest<RequestProps>, reply: FastifyReply) {
      const result = await EnvironmentServices.create(fastify.prisma, request.baseEnvironment);
      return reply.send(handleResult(result));
    },
  });

  fastify.delete("/environments/:id", {
    async handler(request: FastifyRequest<RequestProps>, reply: FastifyReply) {
      const result = await EnvironmentServices.delete(fastify.prisma, request.params.id);
      return reply.send(handleResult(result));
    },
  });
}
