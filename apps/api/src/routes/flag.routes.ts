import {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  FastifyTypeProviderDefault,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
} from "fastify";
import { FlagService } from "@api/src/services/flagService.ts";
import { BaseFlag, updateFlagSchema, baseFlagSchema } from "@schema/flag.schema.js";
import z from "zod";

interface RequestProps extends RouteGenericInterface {
  Params: { id: string };
  Body: { body: BaseFlag };
  QueryString: { projectId: string };
}

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
  fastify.get("/flags/:id", {
    async handler(request: FastifyRequest<RequestProps>, reply: FastifyReply) {
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
  fastify.patch("/flags/:id", {
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
    async handler(request: FastifyRequest<RequestProps>, reply: FastifyReply) {
      const result = await FlagService.updateFlag(
        fastify.prisma,
        request.updateFlag,
        request.params.id,
      );

      return reply.send(result);
    },
  });
  fastify.delete("/flags/:id", {
    async handler(request: FastifyRequest<RequestProps>, reply: FastifyReply) {
      const result = await FlagService.deleteFlag(fastify.prisma, request.params.id);
      return reply.send(result);
    },
  });
}
