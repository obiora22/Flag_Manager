import { BaseFlag, baseFlagSchema, updateFlagSchema } from "@packages/schema";
import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from "fastify";
import z from "zod";
import { FlagService } from "../services/flagService.js";

export async function flagRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/flags", {
    async handler(
      request: FastifyRequest<{ Querystring: { projectId: string } }>,
      reply: FastifyReply,
    ) {
      const result = await FlagService.getFlags(fastify.prisma, request.query.projectId);
      return reply.send(result);
    },
  });
  fastify.get<{ Params: { id: string } }>("/flags/:id", {
    async handler(request, reply) {
      const result = await FlagService.getFlag(fastify.prisma, request.params.id);
      return reply.send(result);
    },
  });
  fastify.post("/flags", {
    preHandler(request: FastifyRequest, reply: FastifyReply, done) {
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
    async handler(request: FastifyRequest, reply: FastifyReply) {
      const result = await FlagService.createFlag(fastify.prisma, request.baseFlag);
      return reply.send(result);
    },
  });
  fastify.patch<{ Params: { id: string } }>("/flags/:id", {
    preHandler(request: FastifyRequest, reply: FastifyReply, done) {
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
    async handler(request, reply: FastifyReply) {
      const result = await FlagService.updateFlag(
        fastify.prisma,
        request.updateFlag,
        request.params.id,
      );

      return reply.send(result);
    },
  });
  fastify.delete<{ Params: { id: string } }>("/flags/:id", {
    async handler(request, reply: FastifyReply) {
      const result = await FlagService.deleteFlag(fastify.prisma, request.params.id);
      return reply.send(result);
    },
  });
}
